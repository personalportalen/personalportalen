using System.Text;
using System.Text.Json;
using System.Text.Json.Nodes;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHttpClient();

var app = builder.Build();
var logger = app.Logger;
var httpFactory = app.Services.GetRequiredService<IHttpClientFactory>();
var config = app.Configuration;

var seqUrl = config["Seq:Url"]?.TrimEnd('/');
if (string.IsNullOrWhiteSpace(seqUrl))
{
    throw new Exception("Seq URL not configured");
}

var seqIngest = $"{seqUrl}/ingest/clef";
var imagesFile = config["Images:File"] ?? "/data/static_images.json";

var lastReported = new Dictionary<string, int>();

_ = RunBackground();

app.MapGet("/", () => "Image watcher is running");

app.Run();

async Task RunBackground()
{
    await CheckImages();

    while (true)
    {
        await WaitUntilNextRun();

        try
        {
            await CheckImages();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during check");
        }
    }
}

async Task WaitUntilNextRun()
{
    var now = DateTime.Now;
    var next = now.Date.AddDays(now.Hour >= 3 ? 1 : 0).AddHours(3);

    var delay = next - now;

    logger.LogInformation("Next run will happen {Time}", next);

    await Task.Delay(delay);
}

async Task CheckImages()
{
    var client = httpFactory.CreateClient();
    client.Timeout = TimeSpan.FromSeconds(5);

    if (!File.Exists(imagesFile))
    {
        logger.LogWarning("Images file not found");
        return;
    }

    var jsonText = await File.ReadAllTextAsync(imagesFile);

    ImagesConfig? data;
    try
    {
        data = JsonSerializer.Deserialize<ImagesConfig>(jsonText, new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true
        });

        logger.LogInformation("Read {Count} images", data?.Images?.Count ?? 0);
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Invalid JSON format");
        return;
    }

    if (data?.Images == null || data.Images.Count == 0)
        return;

    foreach (var img in data.Images)
    {
        try
        {
            logger.LogInformation("Processing image {Image}:{Tag}", img.Name, img.Tag);

            var repo = $"library/{img.Name}";
            var url = $"https://registry.hub.docker.com/v2/repositories/{repo}/tags?page_size=100";

            var response = await client.GetAsync(url);

            if (!response.IsSuccessStatusCode)
            {
                logger.LogWarning("Failed fetching {Repo}", repo);
                continue;
            }

            var json = JsonNode.Parse(await response.Content.ReadAsStringAsync());
            var tags = json?["results"]?.AsArray();

            var majors = tags?
                .Select(t => t?["name"]?.ToString())
                .Where(name => int.TryParse(name?.Split('.')[0], out _))
                .Select(name => int.Parse(name!.Split('.')[0]))
                .Distinct()
                .ToList();

            if (majors == null || majors.Count == 0)
                continue;

            if (!int.TryParse(img.Tag.Split('.')[0], out var currentMajor))
            {
                logger.LogInformation("Skipping non-numeric tag {Tag}", img.Tag);
                continue;
            }

            var latestMajor = majors.Max();
            var newMajorAvailable = latestMajor > currentMajor;

            if (!newMajorAvailable)
            {
                logger.LogInformation("No update for {Image}", img.Name);
                continue;
            }

            if (lastReported.TryGetValue(img.Name, out var prev) && prev == latestMajor)
            {
                logger.LogInformation("Already reported {Image} version {Version}", img.Name, latestMajor);
                continue;
            }

            lastReported[img.Name] = latestMajor;

            var clef = new Dictionary<string, object>
            {
                ["@t"] = DateTimeOffset.UtcNow.ToString("O"),
                ["@mt"] = "Image update available for {Image}:{Tag}",
                ["Image"] = img.Name,
                ["Tag"] = img.Tag,
                ["CurrentMajor"] = currentMajor,
                ["LatestMajor"] = latestMajor
            };

            var payload = JsonSerializer.Serialize(clef) + "\n";

            HttpResponseMessage? seqResponse = null;

            for (int i = 0; i < 3; i++)
            {
                using var content = new StringContent(payload, Encoding.UTF8);
                content.Headers.ContentType =
                    new System.Net.Http.Headers.MediaTypeHeaderValue("application/vnd.serilog.clef");

                try
                {
                    seqResponse = await client.PostAsync(seqIngest, content);

                    logger.LogInformation("Seq response status: {Status}", seqResponse.StatusCode);

                    if (seqResponse.IsSuccessStatusCode)
                        break;

                    var body = await seqResponse.Content.ReadAsStringAsync();
                    logger.LogError("Seq error {Status}: {Body}", seqResponse.StatusCode, body);
                }
                catch (TaskCanceledException)
                {
                    logger.LogError("Request time out (Seq)");
                }
                catch (Exception ex)
                {
                    logger.LogError(ex, "Failed to reach Seq");
                }

                await Task.Delay(1000);
            }

            if (seqResponse == null || !seqResponse.IsSuccessStatusCode)
            {
                logger.LogError("Failed to send event to Seq for {Image}", img.Name);
                continue;
            }

            logger.LogInformation("Reported update for {Image}", img.Name);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error checking image {Image}", img.Name);
        }
    }
}

record ImagesConfig(List<ImageDef> Images);
record ImageDef(string Name, string Tag);