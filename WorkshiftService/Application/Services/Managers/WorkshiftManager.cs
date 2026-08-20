using Application.Dtos;
using Application.Interfaces;
using Application.Models;
using Domain.Entities;
using System.Linq.Expressions;

namespace Application.Services.Managers;
public class WorkshiftManager(IWorkshiftRepository workshiftRepository, IBookingClient bookingClient) : IWorkshiftService
{
    private readonly IWorkshiftRepository _repository = workshiftRepository;
    private readonly IBookingClient _bookingClient = bookingClient;

    public async Task<ServiceResult> CreateAsync(WorkshiftRegistrationForm form, string userId)
    {
        var entity = new WorkshiftEntity
        (
            Guid.NewGuid().ToString(),
            form.Area,
            form.Level,
            form.Starttime,
            form.Endtime,
            form.EmployeeId,
            userId,
            DateTime.UtcNow
        );

        await _repository.AddAsync(entity);
        await _repository.SaveAsync();

        return ServiceResult.Success();
    }

    public async Task<ServiceResult<IEnumerable<Workshift>>> GetAllAsync()
    {
        var entities = await _repository.GetAllAsync();
        var workshifts = entities.Select(MapToModel);

        return ServiceResult<IEnumerable<Workshift>>.Success(workshifts!);
    }

    public async Task<ServiceResult<IEnumerable<Workshift>>> GetUnbookedAsync()
    {
        var entities = await _repository.GetAllAsync();
        var bookedWorkshiftIds =
            await _bookingClient.GetBookedWorkshiftIdsAsync();

        var workshifts = entities
            .Where(x => !bookedWorkshiftIds.Contains(x.Id))
            .Select(MapToModel)
            .ToList();

        return ServiceResult<IEnumerable<Workshift>>.Success(workshifts);
    }

    public async Task<ServiceResult<Workshift>> GetAsync(Expression<Func<WorkshiftEntity, bool>> expression)
    {
        var entity = await _repository.GetAsync(expression);

        if (entity is null)
            return ServiceResult<Workshift>.Fail("Booking was not found", 404);

        return ServiceResult<Workshift>.Success(MapToModel(entity));
    }

    public async Task<ServiceResult> UpdateAsync(string id, WorkshiftUpdateForm form)
    {
        var existingEntity = await _repository.GetAsync(x => x.Id == id);

        if (existingEntity is null)
            return ServiceResult.Fail("Booking was not found", 404);

        existingEntity.Update(
            form.Area,
            form.Level,
            form.Starttime,
            form.Endtime,
            form.EmployeeId);

        await _repository.UpdateAsync(existingEntity);
        await _repository.SaveAsync();

        return ServiceResult.Success();
    }

    public async Task<ServiceResult> DeleteAsync(string id)
    {
        var entity = await _repository.GetAsync(x => x.Id == id);

        if (entity is null)
            return ServiceResult.Fail("Workshift not found.", 404);

        await _repository.RemoveAsync(entity);
        await _repository.SaveAsync();

        return ServiceResult.Success();
    }

    private static Workshift MapToModel(WorkshiftEntity entity)
    {
        return new Workshift
        {
            Id = entity.Id,
            Area = entity.Area,
            Level = entity.Level,
            Starttime = entity.Starttime,
            Endtime = entity.Endtime,
            EmployeeId = entity.EmployeeId,
            AddedByUserId = entity.AddedByUserId,
            AddedTime = entity.AddedTime
        };
    }
}