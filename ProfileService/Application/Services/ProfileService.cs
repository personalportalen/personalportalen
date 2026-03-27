using Application.Dtos;
using Application.Factories;
using Application.Interfaces;
using Application.Models;
using Domain.Entities;


namespace Application.Services;

public class ProfileService(IProfileRepository profileRepository, IAddressRepository addressRepository) : IProfileService
{
    private readonly IProfileRepository _profileRepository = profileRepository;
    private readonly IAddressRepository _addressRepository = addressRepository;

    // Get
    public async Task<ServiceResult<Profile>> GetProfile(string userId)
    {
        var profile = await _profileRepository.GetByIdAsync(userId);
        if (profile == null)
            return ServiceResult<Profile>.Fail("No profile found", 404);

        var model = ProfileFactory.CreateProfileModel(profile);
        if (model == null)
            return ServiceResult<Profile>.Fail("Profile could not be created", 500);

        return ServiceResult<Profile>.Success(model);
    }

    // Create
    public async Task<ServiceResult<ProfileEntity>> CreateProfile(ProfileCreateForm form)
    {

        ProfileEntity profileEntity = new()
        {
            UserId = form.UserId,
            EmailAddress = form.EmailAddress,
            FirstName = "",
            LastName = "",
            PhoneNumber = "",
            AddressId = 5,
        };

        var resultProfile = await _profileRepository.AddAsync(profileEntity);
        if (resultProfile == null)
        {
            return ServiceResult<ProfileEntity>.Fail("No profile found", 404);
        }
        await _profileRepository.SaveAsync();

        return ServiceResult<ProfileEntity>.Success(resultProfile);
    }

    // Update
    // Behöver eventuellt skapa en ny metod för när användaren gör
    // färdigt sin profil efter att kontot skapats
    public async Task<ServiceResult<ProfileEntity>> UpdateProfile(string userId, ProfileUpdateForm form)
    {
        var profile = await _profileRepository.GetByIdAsync(userId);
        if (profile == null)
            return ServiceResult<ProfileEntity>.Fail("No profile found", 404);
        profile.FirstName = form.FirstName ?? profile.FirstName;
        profile.LastName = form.LastName ?? profile.LastName;
        profile.PhoneNumber = form.PhoneNumber ?? profile.PhoneNumber;

        if (form.Address != null)
        {
            AddressEntity newAddress = new()
            {
                Street = form.Address.Street ?? "",
                City = form.Address.City ?? "",
                State = form.Address.State ?? "",
                ZipCode = form.Address.ZipCode ?? "",
                Country = form.Address.Country ?? ""
            };
            var addedAddress = await _addressRepository.AddAsync(newAddress);
            if (addedAddress == null)
                return ServiceResult<ProfileEntity>.Fail("Address is null", 404);
            profile.AddressId = addedAddress.Id;
        }

        await _profileRepository.UpdateAsync(profile);
        await _profileRepository.SaveAsync();
        return ServiceResult<ProfileEntity>.Success(profile);
    }

    public async Task<ServiceResult<ProfileEntity>> CompleteProfile(string userId, CompleteProfileForm form)
    {
        var profile = await _profileRepository.GetByIdAsync(userId);
        if (profile == null)
            return ServiceResult<ProfileEntity>.Fail("No profile found.", 404);

        if (profile.IsProfileCompleted)
            return ServiceResult<ProfileEntity>.Fail("Profile is already completed.", 400);

        profile.FirstName = form.FirstName;
        profile.LastName = form.LastName;
        profile.PhoneNumber = form.PhoneNumber;
        profile.ImageUrl = form.ImageUrl;
        profile.IsProfileCompleted = true;
        profile.ProfileCompletedAt = DateTime.UtcNow;
        profile.UpdatedAt = DateTime.UtcNow;

        profile.Address = new AddressEntity
        {
            Street = form.Address.Street,
            City = form.Address.City,
            State = form.Address.State,
            ZipCode = form.Address.ZipCode,
            Country = form.Address.Country
        };

        await _profileRepository.UpdateAsync(profile);
        await _profileRepository.SaveAsync();

        return ServiceResult<ProfileEntity>.Success(profile);
    }
}