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

using Yarp.ReverseProxy.Configuration;

using Microsoft.Extensions.Diagnostics.HealthChecks;


var builder = WebApplication.CreateBuilder(args);

Console.WriteLine("🚀 GATEWAY STARTED - STEP 7B (DEPENDENCY HEALTH)");
Console.WriteLine($"ENVIRONMENT: {builder.Environment.EnvironmentName}");

builder.Services
    .AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));

// 🔐 JWT AUTH
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;

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

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("authenticated", policy =>
    {
        policy.RequireAuthenticatedUser();
    });
});

// 🌐 CORS
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

// ❤️ BASIC HEALTH
builder.Services.AddHealthChecks()
    .AddCheck("gateway", () => HealthCheckResult.Healthy("Gateway is running"));

// 🌍 HTTP CLIENT FOR DEPENDENCY CHECKS
builder.Services.AddHttpClient();

var app = builder.Build();

app.MapGet("/__fingerprint", () => Results.Text("gateway-step7b-ok"));

app.MapHealthChecks("/health");

// 🔎 Dependency health endpoint
app.MapGet("/health/dependencies", async (IHttpClientFactory httpClientFactory) =>
{
    var client = httpClientFactory.CreateClient();
    client.Timeout = TimeSpan.FromSeconds(3);

    var services = new Dictionary<string, string>
    {
        ["auth"] = "http://localhost:5091/health",
        ["profile"] = "https://localhost:7294/health",
        ["booking"] = "https://localhost:7213/health",
        ["workshift"] = "https://localhost:7103/health"
    };

    var results = new Dictionary<string, string>
    {
        ["gateway"] = "Healthy"
    };

    foreach (var service in services)
    {
        try
        {
            var response = await client.GetAsync(service.Value);
            results[service.Key] = response.IsSuccessStatusCode ? "Healthy" : $"Unhealthy ({(int)response.StatusCode})";
        }
        catch (Exception ex)
        {
            results[service.Key] = $"Unhealthy ({ex.GetType().Name})";
        }
    }

    var overallHealthy = results.Values.All(v => v == "Healthy");

    return overallHealthy
        ? Results.Ok(results)
        : Results.Json(results, statusCode: 503);
});

app.UseCors("FrontendPolicy");

// 🔐 IMPORTANT ORDER
app.UseAuthentication();
app.UseAuthorization();

// 📊 Logging + Correlation
app.Use(async (context, next) =>
{
    var correlationId = context.Request.Headers["X-Correlation-ID"].FirstOrDefault()
                        ?? Guid.NewGuid().ToString();

    context.Response.Headers["X-Correlation-ID"] = correlationId;

    var sw = Stopwatch.StartNew();

    Console.WriteLine($"➡️ [{correlationId}] {context.Request.Method} {context.Request.Path}");

    await next();

    sw.Stop();

    Console.WriteLine($"⬅️ [{correlationId}] {context.Response.StatusCode} ({sw.ElapsedMilliseconds} ms)");
});

app.MapReverseProxy();

app.Run("https://localhost:7265");

//Console.WriteLine("🚀 GATEWAY BUILD STARTED - TEST BUILD 123");

//var builder = WebApplication.CreateBuilder(args);

//var routes = builder.Configuration
//    .GetSection("ReverseProxy:Routes")
//    .GetChildren();

//foreach (var route in routes)
//{
//    Console.WriteLine($"Route: {route.Key}");
//    Console.WriteLine($"Policy: {route["RateLimiterPolicy"]}");
//}

//var clusters = builder.Configuration.GetSection("ReverseProxy:Clusters").GetChildren();

//Log.Logger = new LoggerConfiguration()
//    .ReadFrom.Configuration(builder.Configuration)
//    .Enrich.FromLogContext()
//    .WriteTo.Console()
//    .CreateLogger();

//builder.Host.UseSerilog();

//builder.Services.AddRateLimiter(options =>
//{
//    options.AddPolicy("per-user", context =>
//        RateLimitPartition.GetFixedWindowLimiter(
//            context.User.Identity?.Name
//            ?? context.Connection.RemoteIpAddress?.ToString()
//            ?? "anonymous",
//            _ => new FixedWindowRateLimiterOptions
//            {
//                PermitLimit = 10,
//                Window = TimeSpan.FromMinutes(1),
//                QueueLimit = 2
//            }));
//    options.AddPolicy("fixed", context =>
//    RateLimitPartition.GetFixedWindowLimiter(
//        context.User.Identity?.Name
//        ?? context.Connection.RemoteIpAddress?.ToString()
//        ?? "anonymous",
//        _ => new FixedWindowRateLimiterOptions
//        {
//            PermitLimit = 10,
//            Window = TimeSpan.FromMinutes(1),
//            QueueLimit = 2
//        }));
//});



//builder.Services
//    .AddReverseProxy()
//    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"));
//    //.AddTransforms(builderContext =>
//    //{
//    //    builderContext.AddRequestTransform(async transformContext =>
//    //    {
//    //        var token = transformContext.HttpContext.Request.Cookies["accessToken"];

//    //        if (!string.IsNullOrEmpty(token))
//    //        {
//    //            transformContext.ProxyRequest.Headers.Authorization =
//    //                new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);
//    //        }
//    //    });
//    //});

//var healthChecks = builder.Services.AddHealthChecks();

//foreach (var cluster in clusters)
//{
//    var destinations = cluster.GetSection("Destinations").GetChildren();

//    foreach (var destination in destinations)
//    {
//        var address = destination["Address"];

//        if (!string.IsNullOrEmpty(address))
//        {
//            healthChecks.AddUrlGroup(
//                new Uri($"{address.TrimEnd('/')}/health"),
//                name: cluster.Key
//            );
//        }
//    }
//}

//builder.Services.AddAuthentication(options =>
//{
//    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//})
//    .AddJwtBearer("Bearer", options =>
//    {
//        options.RequireHttpsMetadata = false;

//        options.Configuration = new OpenIdConnectConfiguration();
//        options.ConfigurationManager = null;

//        options.TokenValidationParameters = new TokenValidationParameters
//        {
//            ValidateIssuer = true,
//            ValidIssuer = "DreamTeam",

//            ValidateAudience = true,
//            ValidAudience = "DreamTeamUsers",

//            ValidateIssuerSigningKey = true,
//            IssuerSigningKey = new SymmetricSecurityKey(
//        Encoding.UTF8.GetBytes("RasmusSecretKey1234567890!@#$%^&*()")
//        ),

//            ValidateLifetime = true,
//            ClockSkew = TimeSpan.Zero
//        };

//        options.Events = new JwtBearerEvents
//        {
//            OnMessageReceived = context =>
//            {
//                var token = context.Request.Cookies["accessToken"];
//                Console.WriteLine("COOKIE TOKEN: " + token);

//                if (!string.IsNullOrEmpty(token))
//                {
//                    context.Token = token;
//                }

//                return Task.CompletedTask;
//            },
//            OnAuthenticationFailed = context =>
//            {
//                Console.WriteLine("❌ JWT ERROR: " + context.Exception.Message);
//                return Task.CompletedTask;
//            },
//            OnTokenValidated = context =>
//            {
//                Console.WriteLine("✅ TOKEN VALID");
//                return Task.CompletedTask;
//            }
//        };
//    });

//builder.Services.AddAuthorization();

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("FrontendPolicy", policy =>
//    {
//        policy.WithOrigins("http://localhost:5173")
//              .AllowAnyHeader()
//              .AllowAnyMethod()
//              .AllowCredentials();
//    });
//});

//builder.Services.AddOpenTelemetry()
//    .WithTracing(tracing =>
//    {
//        tracing
//            .SetResourceBuilder(ResourceBuilder.CreateDefault().AddService("Gateway"))
//            .AddAspNetCoreInstrumentation()
//            .AddHttpClientInstrumentation()
//            .AddConsoleExporter();
//    });



//var app = builder.Build();

//app.MapGet("/__fingerprint", () => Results.Text("gateway-fingerprint-123"));

//app.MapGet("/ping-auth", async () =>
//{
//    var client = new HttpClient();

//    try
//    {
//        var response = await client.PostAsync(
//            "http://127.0.0.1:5091/auth/signup",
//            new StringContent(
//                "{\"email\":\"ping@domain.com\",\"password\":\"BytMig123!\",\"confirmPassword\":\"BytMig123!\"}",
//                Encoding.UTF8,
//                "application/json"
//            )
//        );

//        var text = await response.Content.ReadAsStringAsync();

//        return Results.Text($"STATUS: {response.StatusCode}\n{text}");
//    }
//    catch (Exception ex)
//    {
//        return Results.Text($"ERROR: {ex.Message}");
//    }
//});

//var requestCounter = Metrics.CreateCounter(
//    "gateway_requests_total",
//    "Total number of requests through gateway");

//var errorCounter = Metrics.CreateCounter(
//    "gateway_downstream_errors_total",
//    "Total downstream errors");

//var requestDuration = Metrics.CreateHistogram(
//    "gateway_request_duration_seconds",
//    "Request duration in seconds");

//app.UseExceptionHandler(errorApp =>
//{
//    errorApp.Run(async context =>
//    {
//        var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();
//        var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;

//        logger.LogError(exception, "Unhandled exception in gateway");

//        context.Response.StatusCode = 500;
//        await context.Response.WriteAsync("Gateway error");
//    });
//});

//app.UseCors("FrontendPolicy");

//app.Use(async (context, next) =>
//{
//    var correlationId = context.Request.Headers["X-Correlation-ID"].FirstOrDefault()
//                        ?? Guid.NewGuid().ToString();

//    context.Response.Headers["X-Correlation-ID"] = correlationId;

//    using (LogContext.PushProperty("CorrelationId", correlationId))
//    {
//        Activity.Current?.SetTag("correlation_id", correlationId);
//        await next();
//    }
//});

//app.UseHttpMetrics();

//app.UseSerilogRequestLogging();

////app.Use(async (context, next) =>
////{
////    var logger = context.RequestServices.GetRequiredService<ILogger<Program>>();

////    requestCounter.Inc();

////    using (requestDuration.NewTimer())
////    {
////        await next();
////    }

////    if (context.Response.StatusCode == 401 || context.Response.StatusCode == 403)
////    {
////        logger.LogWarning("Unauthorized request {Method} {Path}",
////            context.Request.Method,
////            context.Request.Path);
////    }

////    if (context.Response.StatusCode >= 500)
////    {
////        errorCounter.Inc();

////        logger.LogError("Downstream error {StatusCode} on {Path}",
////            context.Response.StatusCode,
////            context.Request.Path);
////    }
////});




////app.UseRateLimiter();

//app.MapHealthChecks("/health", new HealthCheckOptions
//{
//    ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse
//});

////app.UseAuthentication();
////app.UseAuthorization();
//app.MapMetrics();

//app.MapReverseProxy();

//app.Run();