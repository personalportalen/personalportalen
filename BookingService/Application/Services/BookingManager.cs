using Application.Dtos;
using Application.Interfaces;
using Application.Models;
using Domain.Entities;
using System.Linq.Expressions;

namespace Application.Services;
public class BookingManager(IBookingRepository repository) : IBookingService
{
    private readonly IBookingRepository _repository = repository;

    public async Task<ServiceResult> CreateAsync(BookingRegistrationForm form)
    {
        var entity = new BookingEntity(
            Guid.NewGuid().ToString(),
            form.WorkshiftId,
            form.EmployeeId!,
            form.BookingMadeById!,
            DateTime.UtcNow,
            form.LastUpdatedById!,
            DateTime.UtcNow
        );

        await _repository.AddAsync(entity);
        await _repository.SaveAsync();

        return ServiceResult.Success();
    }

    public async Task<ServiceResult<IEnumerable<Booking>>> GetAllAsync()
    {
        var entities = await _repository.GetAllAsync();
        var bookings = entities.Select(MapToModel);

        return ServiceResult<IEnumerable<Booking>>.Success(bookings);
    }

    public async Task<ServiceResult<IEnumerable<Booking>>> GetAllByUserIdAsync(string userId)
    {
        var entities = await _repository.GetAllAsync(x => x.BookingMadeById == userId);
        var bookings = entities.Select(MapToModel);

        return ServiceResult<IEnumerable<Booking>>.Success(bookings);
    }


    public async Task<ServiceResult<Booking>> GetAsync(Expression<Func<BookingEntity, bool>> expression)
    {
        var entity = await _repository.GetAsync(expression);

        if (entity is null)
            return ServiceResult<Booking>.Fail("Booking was not found", 404);

        return ServiceResult<Booking>.Success(MapToModel(entity));
    }

    public async Task<ServiceResult<IEnumerable<string>>> GetBookedWorkshiftIdsAsync()
    {
        var ids = await _repository.GetBookedWorkshiftIdsAsync();

        return ServiceResult<IEnumerable<string>>.Success(ids);
    }

    public async Task<ServiceResult> UpdateAsync(BookingUpdateForm form)
    {
        var entity = await _repository.GetAsync(x => x.Id == form.Id);

        if (entity is null)
            return ServiceResult.Fail("Booking was not found", 404);

        var orgEntity = entity;

        orgEntity.Update(
            form.Id,
            form.WorkshiftId,
            form.EmployeeId
        );

        await _repository.UpdateAsync(orgEntity);
        await _repository.SaveAsync();

        return ServiceResult.Success();
    }

    public async Task<ServiceResult> DeleteAsync(string id)
    {
        var entity = await _repository.GetAsync(x => x.Id == id);

        if (entity is null)
            return ServiceResult.Fail("Booking was not found", 404);

        await _repository.RemoveAsync(entity);
        await _repository.SaveAsync();

        return ServiceResult.Success();
    }

    private static Booking MapToModel(BookingEntity entity)
    {
        return new Booking
        {
            Id = entity.Id,
            WorkshiftId = entity.WorkshiftId,
            EmployeeId = entity.EmployeeId,
            BookingMadeById = entity.BookingMadeById,
            BookingCreated = entity.BookingCreated,
            LastUpdatedById = entity.LastUpdatedById,
            LastUpdated = entity.LastUpdated,
        };
    }
}