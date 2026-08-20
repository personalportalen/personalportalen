using Application.Interfaces;
using Domain.Entities;
using Infrastructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Repositories;

public class ProfileRepository(DataContext dataContext) : BaseRepository<ProfileEntity>(dataContext), IProfileRepository
{
    public async Task<ProfileEntity?> GetByIdAsync(string profileID)
    {
        return await _context.Profiles
            .Include(x => x.Address)
            .FirstOrDefaultAsync(p => p.UserId == profileID) ?? null!;
    }

    public async Task<bool> ExistsByUserIdAsync(string userId)
    {
        return await _context.Profiles
            .AnyAsync(p => p.UserId == userId);
    }
}