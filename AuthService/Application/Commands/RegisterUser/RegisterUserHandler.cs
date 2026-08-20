namespace Application.Commands.RegisterUser;

using Application.Contracts.Events;
using Application.Interfaces;
using Domain.Models;
using MediatR;
using Microsoft.AspNetCore.Identity;

public class RegisterUserHandler(
    UserManager<AppUser> userManager,
    IEventPublisher eventPublisher) : IRequestHandler<RegisterUserCommand, string>
{
    private readonly UserManager<AppUser> _userManager = userManager;
    private readonly IEventPublisher _eventPublisher = eventPublisher;

    public async Task<string> Handle(
        RegisterUserCommand request,
        CancellationToken cancellationToken)
    {
        var user = new AppUser
        {
            Id = Guid.NewGuid().ToString(),
            UserName = request.Email,
            Email = request.Email
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
            throw new Exception("User creation failed");

        await _eventPublisher.PublishUserCreated(new UserCreatedEvent
        {
            UserId = user.Id.ToString(),
            Email = user.Email!,
            CreatedAt = DateTime.UtcNow
        });

        return user.Id;
    }
}
