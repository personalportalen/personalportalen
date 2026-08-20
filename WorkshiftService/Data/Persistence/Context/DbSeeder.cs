using Application.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistence.Context;

public class DbSeeder(DataContext dbContext) : IDbSeeder
{
    private readonly DataContext _dbContext = dbContext;

    public async Task SeedAsync()
    {
        if (await _dbContext.Workshifts.AnyAsync())
            return;

        const string seededAdminUserId = "admin-seeded-id";

        var now = DateTime.UtcNow;
        var today = now.Date;

        var shifts = new List<WorkshiftEntity>
        {
            new(
                Guid.NewGuid().ToString(),
                "Lager",
                "Lageransvarig",
                today.AddDays(1).AddHours(8),
                today.AddDays(1).AddHours(16),
                seededAdminUserId,
                seededAdminUserId,
                now
            ),
            new(
                Guid.NewGuid().ToString(),
                "Kassa",
                "Butiksbiträde",
                today.AddDays(2).AddHours(9),
                today.AddDays(2).AddHours(17),
                null,
                seededAdminUserId,
                now
            ),
            new(
                Guid.NewGuid().ToString(),
                "Kassa",
                "Teamledare",
                today.AddDays(3).AddHours(10),
                today.AddDays(3).AddHours(18),
                seededAdminUserId,
                seededAdminUserId,
                now
            )
        };

        await _dbContext.Workshifts.AddRangeAsync(shifts);
        await _dbContext.SaveChangesAsync();
    }
}