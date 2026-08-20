using Application.Interfaces;
using System.Net.Http.Json;

namespace Application.Services.Clients;

public class BookingClient(HttpClient httpClient) : IBookingClient
{
    private readonly HttpClient _httpClient = httpClient;

    public async Task<HashSet<string>> GetBookedWorkshiftIdsAsync()
    {
        var ids = await _httpClient.GetFromJsonAsync<List<string>>(
            "booking/booked");

        return ids?.ToHashSet() ?? [];
    }
}