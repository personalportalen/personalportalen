using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Prometheus;
using Serilog;
using Serilog.Context;
using System.Diagnostics;
using System.Text;
using System.Threading.RateLimiting;
using Yarp.ReverseProxy.Transforms;

var builder = WebApplication.CreateBuilder(args);

var routes = builder.Configuration
    .GetSection("ReverseProxy:Routes")
    .GetChildren();

foreach (var route in routes)
{
    Console.WriteLine($"Route: {route.Key}");
    Console.WriteLine($"Policy: {route["RateLimiterPolicy"]}");
}

var clusters = builder.Configuration.GetSection("ReverseProxy:Clusters").GetChildren();

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();

builder.Host.UseSerilog();

builder.Services.AddRateLimiter(options =>
{
    options.AddPolicy("per-user", context =>
        RateLimitPartition.GetFixedWindowLimiter(
            context.User.Identity?.Name
            ?? context.Connection.RemoteIpAddress?.ToString()
            ?? "anonymous",
            _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 10,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 2
            }));
    options.AddPolicy("fixed", context =>
    RateLimitPartition.GetFixedWindowLimiter(
        context.User.Identity?.Name
        ?? context.Connection.RemoteIpAddress?.ToString()
        ?? "anonymous",
        _ => new FixedWindowRateLimiterOptions
        {
            PermitLimit = 10,
            Window = TimeSpan.FromMinutes(1),
            QueueLimit = 2
        }));
});



builder.Services
    .AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .AddTransforms(builderContext =>
    {
        builderContext.AddRequestTransform(async transformContext =>
        {
            var token = transformContext.HttpContext.Request.Cookies["accessToken"];

            if (!string.IsNullOrEmpty(token))
            {
                transformContext.ProxyRequest.Headers.Authorization =
                    new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
            }
        });
    });

var healthChecks = builder.Services.AddHealthChecks();

foreach (var cluster in clusters)
{
    var destinations = cluster.GetSection("Destinations").GetChildren();

    foreach (var destination in destinations)
    {
        var address = destination["Address"];

        if (!string.IsNullOrEmpty(address))
        {
            healthChecks.AddUrlGroup(
                new Uri($"{address.TrimEnd('/')}/health"),
                name: cluster.Key
            );
        }
    }
}

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
    .AddJwtBearer("Bearer", options =>
    {
        options.RequireHttpsMetadata = false;

        options.Configuration = new OpenIdConnectConfiguration();
        options.ConfigurationManager = null;

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = "DreamTeam",

            ValidateAudience = true,
            ValidAudience = "DreamTeamUsers",

            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(
        Encoding.UTF8.GetBytes("RasmusSecretKey1234567890!@#$%^&*()")
        ),

            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                var token = context.Request.Cookies["accessToken"];
                Console.WriteLine("COOKIE TOKEN: " + token);

                if (!string.IsNullOrEmpty(token))
                {
                    context.Token = token;
                }

                return Task.CompletedTask;
            },
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine("❌ JWT ERROR: " + context.Exception.Message);
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("✅ TOKEN VALID");
                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

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

app.UseCors("FrontendPolicy");

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




app.UseRateLimiter();

app.MapHealthChecks("/health", new HealthCheckOptions
{
    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
});

app.UseAuthentication();
app.UseAuthorization();
app.MapMetrics();

app.MapReverseProxy();

app.Run();