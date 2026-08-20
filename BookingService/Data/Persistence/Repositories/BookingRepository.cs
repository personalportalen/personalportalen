using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Persistence.Context;
using Infrastructure.Persistence.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistance.Repositories;
public class BookingRepository(DataContext context) : BaseRepository<BookingEntity>(context), IBookingRepository
{
    public async Task<IEnumerable<string>> GetBookedWorkshiftIdsAsync()
    {
        return await _context.Bookings
            .Select(x => x.WorkshiftId)
            .ToListAsync();
    }
}
