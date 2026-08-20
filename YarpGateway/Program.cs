using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Diagnostics;
using System.Text;
using Microsoft.Extensions.Diagnostics.HealthChecks;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    .AddReverseProxy()
    .LoadFromConfig(builder.Configuration.GetSection("ReverseProxy"))
    .ConfigureHttpClient((_, handler) =>
     {
         handler.AllowAutoRedirect = false;
     });
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = !builder.Environment.IsDevelopment();

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
                Console.WriteLine("JWT ERROR: " + context.Exception.Message);
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("TOKEN VALID");
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

builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(
            "https://localhost:5173",
            "https://localhost:3000",
            "http://134.112.16.170:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddHealthChecks()
    .AddCheck("gateway", () => HealthCheckResult.Healthy("Gateway is running"));

builder.Services.AddHttpClient();

var app = builder.Build();

if (!app.Environment.IsDevelopment())
{
    app.UseHsts();
}

app.UseHttpsRedirection();

app.MapGet("/__fingerprint", () => Results.Text("ok"));

app.MapHealthChecks("/health");

app.MapGet("/health/dependencies", async (IHttpClientFactory httpClientFactory) =>
{
    var client = httpClientFactory.CreateClient();
    client.Timeout = TimeSpan.FromSeconds(3);

    var services = builder.Configuration
    .GetSection("ServiceHealthUrls")
    .GetChildren()
    .ToDictionary(x => x.Key.ToLower(), x => x.Value!);

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

app.UseAuthentication();
app.UseAuthorization();

app.Use(async (context, next) =>
{
    var correlationId = context.Request.Headers["X-Correlation-ID"].FirstOrDefault()
                        ?? Guid.NewGuid().ToString();

    context.Response.Headers["X-Correlation-ID"] = correlationId;

    var sw = Stopwatch.StartNew();

    Console.WriteLine($"[{correlationId}] {context.Request.Method} {context.Request.Path}");

    await next();

    sw.Stop();

    Console.WriteLine($"[{correlationId}] {context.Response.StatusCode} ({sw.ElapsedMilliseconds} ms)");
});

app.MapReverseProxy();

app.Run();