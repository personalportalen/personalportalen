using Application.Contracts.Events;
using Application.Interfaces;
using Domain.Models;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Context;

public class DbSeeder(
    UserManager<AppUser> userManager,
    RoleManager<IdentityRole> roleManager,
    IEventPublisher eventPublisher
) : IDbSeeder
{
    private readonly UserManager<AppUser> _userManager = userManager;
    private readonly RoleManager<IdentityRole> _roleManager = roleManager;
    private readonly IEventPublisher _eventPublisher = eventPublisher;

    public async Task SeedAsync()
    {
        await SeedRoles();
        await SeedAdmin();
    }

    private async Task SeedRoles()
    {
        var roles = new[] { "Admin", "Anställd" };

        foreach (var role in roles)
        {
            if (!await _roleManager.RoleExistsAsync(role))
                await _roleManager.CreateAsync(new IdentityRole(role));
        }
    }

    private async Task SeedAdmin()
    {
        var email = "admin@local.test";
        var password = "Admin123!";

        var existing = await _userManager.FindByEmailAsync(email);
        if (existing != null)
            return;

        var user = new AppUser
        {
            UserName = email,
            Email = email,
            EmailConfirmed = true
        };

        var result = await _userManager.CreateAsync(user, password);
        if (!result.Succeeded)
            throw new Exception("Failed to create admin");

        await _userManager.AddToRoleAsync(user, "Admin");

        await _eventPublisher.PublishUserCreated(new UserCreatedEvent
        {
            UserId = user.Id,
            Email = user.Email!,
            CreatedAt = DateTime.UtcNow
        });
    }
}
