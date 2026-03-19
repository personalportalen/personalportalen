using Domain.Entities;
using Application.Interfaces;
using Infrastructure.Persistance.Context;

namespace Infrastructure.Persistance.Repositories;
public class BookingRepository(DataContext context) : BaseRepository<BookingEntity>(context), IBookingRepository
{
}
