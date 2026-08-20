namespace Application.Interfaces;

public interface IBookingClient
{
    Task<HashSet<string>> GetBookedWorkshiftIdsAsync();
}