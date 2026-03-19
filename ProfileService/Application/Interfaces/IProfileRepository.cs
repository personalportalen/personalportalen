using Domain.Entities;

namespace Application.Interfaces;
public interface IProfileRepository : IBaseRepository<ProfileEntity>
{
    Task<ProfileEntity?> GetByIdAsync(string profileID);
    Task<bool> ExistsByUserIdAsync(string userId);
}