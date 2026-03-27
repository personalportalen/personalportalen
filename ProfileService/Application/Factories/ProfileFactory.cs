using Application.Models;
using Domain.Entities;

namespace Application.Factories;
public static class ProfileFactory
{
    public static Profile CreateProfileModel(ProfileEntity profile)
    {
        if (profile == null)
            return null!;

        var model = new Profile
        {
            FirstName = profile.FirstName,
            LastName = profile.LastName,
            Email = profile.EmailAddress,
            Phone = profile.PhoneNumber ?? "",
            ImageUrl = profile.ImageUrl ?? "",
            IsProfileCompleted = profile.IsProfileCompleted,
            Address = profile.Address == null ? null! : new Address
            {
                Street = profile.Address.Street,
                City = profile.Address.City,
                State = profile.Address.State,
                ZipCode = profile.Address.ZipCode,
                Country = profile.Address.Country
            },
        };

        return model;
    }
}