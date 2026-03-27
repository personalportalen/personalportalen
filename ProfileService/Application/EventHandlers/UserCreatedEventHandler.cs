using Application.Contracts.Events;
using Application.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Application.EventHandlers;

public class UserCreatedEventHandler
{
    private readonly IProfileRepository _profileRepository;

    public UserCreatedEventHandler(IProfileRepository profileRepository)
    {
        _profileRepository = profileRepository;
    }

    public async Task Handle(UserCreatedEvent evt)
    {
        try
        {
            var exists = await _profileRepository.ExistsByUserIdAsync(evt.UserId);

            if (exists)
                return;

            var profile = new ProfileEntity
            {
                Id = Guid.NewGuid(),
                UserId = evt.UserId,
                EmailAddress = evt.Email,
                FirstName = "",
                LastName = "",
                PhoneNumber = "",
                ImageUrl = "",
                AddressId = null,
                IsProfileCompleted = false

            };

            await _profileRepository.AddAsync(profile);
            await _profileRepository.SaveAsync();
        }
        catch (DbUpdateException)
        {
            // 🔥 Viktigt: detta är OK (duplicate event)
            Console.WriteLine("Duplicate profile prevented by DB constraint");
        }
    }
}
