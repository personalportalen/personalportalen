using Application.Interfaces;
using System.Net.Http.Json;

namespace Application.Services.Clients;

public class BookingClient(HttpClient httpClient) : IBookingClient
{
    private readonly HttpClient _httpClient = httpClient;

    //public async Task<HashSet<string>> GetBookedWorkshiftIdsAsync()
    //{
    //    var ids = await _httpClient.GetFromJsonAsync<List<string>>(
    //        "api/booking/booked");

    //    return ids?.ToHashSet() ?? [];
    //}

    public async Task<HashSet<string>> GetBookedWorkshiftIdsAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync("booking/booked");

            Console.WriteLine($"Status: {response.StatusCode}");
            Console.WriteLine($"URL: {response.RequestMessage?.RequestUri}");

            var content = await response.Content.ReadAsStringAsync();

            Console.WriteLine($"Response: {content}");

            var ids = System.Text.Json.JsonSerializer.Deserialize<List<string>>(content);

            return ids?.ToHashSet() ?? [];
        }
        catch (Exception ex)
        {
            Console.WriteLine($"BookingClient error: {ex}");
            throw;
        }
    }
}
