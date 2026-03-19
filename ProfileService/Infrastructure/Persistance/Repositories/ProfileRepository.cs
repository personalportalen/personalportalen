using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Persistance.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistance.Repositories;

public class ProfileRepository(DataContext dataContext) : BaseRepository<ProfileEntity>(dataContext), IProfileRepository
{
    public async Task<ProfileEntity?> GetByIdAsync(string profileID)
    {
        return await _dataContext.Profiles
            .Include(x => x.Address)
            .FirstOrDefaultAsync(p => p.UserId == profileID) ?? null!;
    }

    public async Task<bool> ExistsByUserIdAsync(string userId)
    {
        return await _dataContext.Profiles
            .AnyAsync(p => p.UserId == userId);
    }
}