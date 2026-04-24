using Application.Interfaces;
using Application.Models;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistance.Context;
public class DbSeeder(DataContext dbContext) : IDbSeeder
{
    private readonly DataContext _dbContext = dbContext;

    public async Task SeedAsync()
    {
        if (await _dbContext.Workshifts.AnyAsync())
            return;

        var adminUserId = "admin-seeded-id";

        var today = DateTime.UtcNow.Date;

        var shifts = new List<WorkshiftEntity>
        {
                new() {
                    Id = Guid.NewGuid().ToString(),
                    Area = "Lager",
                    Level = "Lageransvarig",
                    Starttime = today.AddDays(1).AddHours(8),
                    Endtime = today.AddDays(1).AddHours(16),
                    EmployeeId = adminUserId,
                    AddedByUserId = adminUserId,
                    AddedTime = DateTime.UtcNow
                },
                new() {
                    Id = Guid.NewGuid().ToString(),
                    Area = "Kassa",
                    Level = "Butiksbiträde",
                    Starttime = today.AddDays(2).AddHours(9),
                    Endtime = today.AddDays(2).AddHours(17),
                    EmployeeId = null,
                    AddedByUserId = adminUserId,
                    AddedTime = DateTime.UtcNow
                },
                new() {
                    Id = Guid.NewGuid().ToString(),
                    Area = "Kassa",
                    Level = "Teamledare",
                    Starttime = today.AddDays(3).AddHours(10),
                    Endtime = today.AddDays(3).AddHours(18),
                    EmployeeId = adminUserId,
                    AddedByUserId = adminUserId,
                    AddedTime = DateTime.UtcNow
                }
            };

        await _dbContext.Workshifts.AddRangeAsync(shifts);
        await _dbContext.SaveChangesAsync();
    }
}