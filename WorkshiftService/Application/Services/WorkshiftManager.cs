using Application.Dtos;
using Application.Interfaces;
using Application.Models;
using Domain.Entities;
using System.Linq.Expressions;

namespace Application.Services;
public class WorkshiftManager(IWorkshiftRepository workshiftRepository) : IWorkshiftService
{
    private readonly IWorkshiftRepository _repository = workshiftRepository;

    public async Task<ServiceResult> CreateAsync(WorkshiftRegistrationForm form, string userId)
    {
        try
        {
            var entity = new WorkshiftEntity
            {
                Id = Guid.NewGuid().ToString(),
                Area = form.Area,
                Level = form.Level,
                Starttime = form.Starttime,
                Endtime = form.Endtime,
                EmployeeId = form.EmployeeId,
                AddedByUserId = userId,
                AddedTime = DateTime.Now
            };

            var result = await _repository.AddAsync(entity);
            if (result.Succeeded)
            {
                return new ServiceResult
                {
                    Succeeded = true,
                };
            }

            return new ServiceResult
            {
                Succeeded = false,
                //Error = result.Error
            };

        }
        catch (Exception ex)
        {
            return new ServiceResult
            {
                Succeeded = false,
                //Error = ex.Message
            };
        }

    }

    public async Task<ServiceResult<IEnumerable<Workshift>>> GetAllAsync()
    {
        try
        {
            var entities = await _repository.GetAllAsync();
            if (entities.Succeeded)
            {
                var workshifts = entities?.Result?.Select(x => new Workshift
                {
                    Id = x.Id,
                    Area = x.Area,
                    Level = x.Level,
                    Starttime = x.Starttime,
                    Endtime = x.Endtime,
                    EmployeeId = x.EmployeeId,
                    AddedByUserId = x.AddedByUserId,
                    AddedTime = x.AddedTime
                });

                return new ServiceResult<IEnumerable<Workshift>>
                {
                    Succeeded = true,
                    Result = workshifts
                };
            }

            return new ServiceResult<IEnumerable<Workshift>>
            {
                Succeeded = false,
            };

        }
        catch (Exception ex)
        {
            return new ServiceResult<IEnumerable<Workshift>>
            {
                Succeeded = false,
                //Error = ex.Message
            };
        }
    }

    public async Task<ServiceResult<Workshift>> GetAsync(Expression<Func<WorkshiftEntity, bool>> expression)
    {
        try
        {
            var entity = await _repository.GetAsync(expression);
            if (entity.Succeeded)
            {
                var workshift = new Workshift
                {
                    Id = entity.Result.Id,
                    Area = entity.Result.Area,
                    Level = entity.Result.Level,
                    Starttime = entity.Result.Starttime,
                    Endtime = entity.Result.Endtime,
                    EmployeeId = entity.Result.EmployeeId,
                    AddedByUserId = entity.Result.AddedByUserId,
                    AddedTime = entity.Result.AddedTime
                };

                return new ServiceResult<Workshift>
                {
                    Succeeded = true,
                    Result = workshift
                };
            }

            return new ServiceResult<Workshift>
            {
                Succeeded = false,
                //Error = entity.Error
            };

        }
        catch (Exception ex)
        {
            return new ServiceResult<Workshift>
            {
                Succeeded = false,
                //Error = ex.Message
            };
        }
    }

    public async Task<ServiceResult> UpdateAsync(string id, WorkshiftUpdateForm form)
    {
        try
        {
            var existingEntity = await _repository.GetAsync(x => x.Id == id);

            if (existingEntity == null)
            {
                return new ServiceResult
                {
                    Succeeded = false
                };
            }

            existingEntity.Result.Area = form.Area;
            existingEntity.Result.Level = form.Level;
            existingEntity.Result.Starttime = form.Starttime;
            existingEntity.Result.Endtime = form.Endtime;
            existingEntity.Result.EmployeeId = form.EmployeeId;

            var result = await _repository.UpdateAsync(existingEntity.Result);

            return new ServiceResult
            {
                Succeeded = result.Succeeded
            };
        }
        catch (Exception ex)
        {
            return new ServiceResult
            {
                Succeeded = false,
                Message = ex.Message
            };
        }
    }

    public async Task<ServiceResult> DeleteAsync(string id)
    {
        try
        {
            var entity = await _repository.GetAsync(x => x.Id == id);
            if (entity.Succeeded)
            {
                var result = await _repository.RemoveAsync(entity.Result);
                if (result.Succeeded)
                {
                    return new ServiceResult
                    {
                        Succeeded = true,
                    };
                }
                return new ServiceResult
                {
                    Succeeded = false,
                    //Error = result.Error
                };

            }
            return new ServiceResult
            {
                //Succeeded = false,
                //Error = entity.Error
            };

        }
        catch (Exception ex)
        {
            return new ServiceResult
            {
                Succeeded = false,
                //Error = ex.Message
            };
        }
    }
}
