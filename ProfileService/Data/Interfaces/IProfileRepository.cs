using Data.Entities;

namespace Data.Interfaces;
public interface IProfileRepository : IBaseRepository<ProfileEntity>
{
    Task<ProfileEntity?> GetByIdAsync(string profileID);
}