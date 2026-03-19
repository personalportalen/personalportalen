using Application.Dtos;
using Application.Models;
using Domain.Entities;
using System.Linq.Expressions;

namespace Application.Interfaces
{
    public interface IWorkshiftService
    {
        Task<ServiceResult> CreateAsync(WorkshiftRegistrationForm form, string userId);
        Task<ServiceResult> DeleteAsync(string id);
        Task<ServiceResult<IEnumerable<Workshift>>> GetAllAsync();
        Task<ServiceResult<Workshift>> GetAsync(Expression<Func<WorkshiftEntity, bool>> expression);
        Task<ServiceResult> UpdateAsync(WorkshiftUpdateForm form);
    }
}