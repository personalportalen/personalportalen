using System.Diagnostics;
using Microsoft.AspNetCore.Diagnostics;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Prometheus;
using Serilog;
using Serilog.Context;

var builder = WebApplication.CreateBuilder(args);

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services
    .AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddOpenTelemetry()
    .WithTracing(tracing =>
    {
        tracing
            .SetResourceBuilder(ResourceBuilder.CreateDefault().AddService("Gateway"))
            .AddAspNetCoreInstrumentation()
            .AddHttpClientInstrumentation()
            .AddConsoleExporter();
    });

var app = builder.Build();

var requestCounter = Metrics.CreateCounter(
    "gateway_requests_total",
    "Total number of requests through gateway");

var errorCounter = Metrics.CreateCounter(
    "gateway_downstream_errors_total",
    "Total downstream errors");

var requestDuration = Metrics.CreateHistogram(
    "gateway_request_duration_seconds",
    "Request duration in seconds");

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
        var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;

        logger.LogError(exception, "Unhandled exception in gateway");

        context.Response.StatusCode = 500;
        await context.Response.WriteAsync("Gateway error");
    });
});

app.Use(async (context, next) =>
{
    var correlationId = context.Request.Headers["X-Correlation-ID"].FirstOrDefault()
                        ?? Guid.NewGuid().ToString();

    context.Response.Headers["X-Correlation-ID"] = correlationId;

    using (LogContext.PushProperty("CorrelationId", correlationId))
    {
        Activity.Current?.SetTag("correlation_id", correlationId);
        await next();
    }
});

app.UseHttpMetrics();

app.UseSerilogRequestLogging();

app.Use(async (context, next) =>
{
    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();

    requestCounter.Inc();

    using (requestDuration.NewTimer())
    {
        await next();
    }

    if (context.Response.StatusCode == 401 || context.Response.StatusCode == 403)
    {
        logger.LogWarning("Unauthorized request {Method} {Path}",
            context.Request.Method,
            context.Request.Path);
    }

    if (context.Response.StatusCode >= 500)
    {
        errorCounter.Inc();

        logger.LogError("Downstream error {StatusCode} on {Path}",
            context.Response.StatusCode,
            context.Request.Path);
    }
});

app.UseCors("FrontendPolicy");

app.MapMetrics();

app.MapReverseProxy();

app.Run();