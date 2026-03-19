using Application.Dtos;
using Application.Models;
using Domain.Entities;
using System.Linq.Expressions;

namespace Application.Interfaces
{
    public interface IBookingService
    {
        Task<ServiceResult> CreateAsync(BookingRegistrationForm form);
        Task<ServiceResult> DeleteAsync(string id);
        Task<ServiceResult<IEnumerable<Booking>>> GetAllAsync();
        Task<ServiceResult<Booking>> GetAsync(Expression<Func<BookingEntity, bool>> expression);
        Task<ServiceResult> UpdateAsync(BookingUpdateForm form);
    }
}