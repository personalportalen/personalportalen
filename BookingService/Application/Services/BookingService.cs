using Application.Dtos;
using Application.Interfaces;
using Application.Models;
using Domain.Entities;
using System.Linq.Expressions;

namespace Application.Services;
public class BookingService(IBookingRepository repository) : IBookingService
{
    private readonly IBookingRepository _repository = repository;

    public async Task<ServiceResult> CreateAsync(BookingRegistrationForm form)
    {
        if (form != null)
        {
            var entity = new BookingEntity
            {
                Id = Guid.NewGuid().ToString(),
                WorkshiftId = form.WorkshiftId,
                EmployeeId = form.EmployeeId,
                BookingMadeById = form.BookingMadeById,
                LastUpdatedById = form.LastUpdatedById,
                BookingCreated = DateTime.Now,
                LastUpdated = DateTime.Now,
            };

            var res = await _repository.AddAsync(entity);
            if (res.Succeeded)
            {
                return new ServiceResult
                {
                    Succeeded = true
                };
            }
            return new ServiceResult
            {
                Succeeded = false,
                Message = res.Error
            };
        }
        return new ServiceResult
        {
            Succeeded = false,
            Message = "Entity is null"
        };
    }

    public async Task<ServiceResult<IEnumerable<Booking>>> GetAllAsync()
    {

        var entities = await _repository.GetAllAsync();
        if (entities.Succeeded)
        {
            try
            {
                var bookings = entities?.Result?.Select(x => new Booking
                {
                    Id = x.Id,
                    WorkshiftId = x.WorkshiftId,
                    EmployeeId = x.EmployeeId,
                    BookingMadeById = x.BookingMadeById,
                    BookingCreated = x.BookingCreated,
                    LastUpdatedById = x.LastUpdatedById,
                    LastUpdated = x.LastUpdated
                });

                return new ServiceResult<IEnumerable<Booking>>
                {
                    Succeeded = true,
                    Result = bookings
                };

            }
            catch (Exception ex)
            {
                return new ServiceResult<IEnumerable<Booking>>
                {
                    Succeeded = false,
                    Message = ex.Message
                };
            }
        }
        return new ServiceResult<IEnumerable<Booking>>
        {
            Succeeded = false,
            Message = entities.Error
        };


    }

    public async Task<ServiceResult<Booking>> GetAsync(Expression<Func<BookingEntity, bool>> expression)
    {
        var res = await _repository.GetAsync(expression);
        if (res.Succeeded)
        {
            var entity = res.Result;
            var booking = new Booking
            {
                Id = entity.Id,
                WorkshiftId = entity.WorkshiftId,
                EmployeeId = entity.EmployeeId,
                BookingMadeById = entity.BookingMadeById,
                BookingCreated = entity.BookingCreated,
                LastUpdatedById = entity.LastUpdatedById,
                LastUpdated = entity.LastUpdated,

            };
            return new ServiceResult<Booking>
            {
                Succeeded = true,
                Result = booking
            };
        }
        return new ServiceResult<Booking>
        {
            Succeeded = false,
            Message = res.Error
        };
    }

    public async Task<ServiceResult> UpdateAsync(BookingUpdateForm form)
    {
        if (form != null)
        {
            var res = await _repository.GetAsync(x => x.Id == form.Id);
            if (res.Succeeded)
            {
                var orgEntity = res.Result;

                var newEntity = new BookingEntity
                {
                    Id = form.Id,
                    WorkshiftId = form.WorkshiftId,
                    EmployeeId = form.EmployeeId,
                    BookingMadeById = orgEntity!.BookingMadeById,
                    BookingCreated = orgEntity.BookingCreated,
                    LastUpdatedById = orgEntity.LastUpdatedById,
                    LastUpdated = orgEntity.LastUpdated
                };

                //Osäker på om denna kommer krocka med res över när det hämtar en entity...
                var updateRes = await _repository.UpdateAsync(newEntity);
                if (updateRes.Succeeded)
                {
                    return new ServiceResult
                    {
                        Succeeded = true
                    };
                }

                return new ServiceResult
                {
                    Succeeded = false,
                    Message = updateRes.Error
                };
            }

            return new ServiceResult
            {
                Succeeded = false,
                Message = res.Error
            };

        }
        return new ServiceResult
        {
            Succeeded = false,
            Message = "UpdateForm is null"
        };
    }

    public async Task<ServiceResult> DeleteAsync(string id)
    {
        if (id != null)
        {
            var entity = await _repository.GetAsync(x => x.Id == id);
            if (entity.Succeeded)
            {
                var res = await _repository.RemoveAsync(entity.Result);
                if (res.Succeeded)
                {
                    return new ServiceResult
                    {
                        Succeeded = true
                    };
                }

                return new ServiceResult
                {
                    Succeeded = false,
                    Message = res.Error
                };
            }

            return new ServiceResult
            {
                Succeeded = false,
                Message = entity.Error
            };
        }
        return new ServiceResult
        {
            Succeeded = false,
            Message = "Id is null"
        };
    }
}
