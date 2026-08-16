using Domain.Entities;

namespace Application.Interfaces;
public interface IBookingRepository : IBaseRepository<BookingEntity>
{
    Task<IEnumerable<string>> GetBookedWorkshiftIdsAsync();
}