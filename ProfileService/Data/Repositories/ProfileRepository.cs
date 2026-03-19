using Data.Context;
using Data.Entities;
using Data.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Data.Repositories;

public class ProfileRepository(DataContext dataContext) : BaseRepository<ProfileEntity>(dataContext), IProfileRepository
{
    public async Task<ProfileEntity?> GetByIdAsync(string profileID)
    {
        return await _dataContext.Profiles
            .Include(x => x.Address)
            .FirstOrDefaultAsync(p => p.Id == profileID) ?? null!;
    }
}