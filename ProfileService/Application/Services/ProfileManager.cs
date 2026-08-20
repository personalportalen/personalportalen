using Application.Dtos;
using Application.Factories;
using Application.Interfaces;
using Application.Models;
using Domain.Entities;

namespace Application.Services;

public class ProfileManager(
    IProfileRepository profileRepository,
    IAddressRepository addressRepository) : IProfileService
{
    private readonly IProfileRepository _profileRepository = profileRepository;
    private readonly IAddressRepository _addressRepository = addressRepository;

    public async Task<ServiceResult<ProfileEntity>> CreateProfile(ProfileCreateForm form)
    {
        var profile = new ProfileEntity
        {
            UserId = form.UserId,
            EmailAddress = form.EmailAddress
        };

        await _profileRepository.AddAsync(profile);
        await _profileRepository.SaveAsync();

        return ServiceResult<ProfileEntity>.Success(profile);
    }

    public async Task<ServiceResult<Profile>> GetProfile(string userId)
    {
        var profile = await _profileRepository.GetByIdAsync(userId);

        if (profile is null)
            return ServiceResult<Profile>.Fail("No profile found", 404);

        return ServiceResult<Profile>.Success(
            ProfileFactory.CreateProfileModel(profile));
    }

    public async Task<ServiceResult<List<ProfileSummary>>> GetAllProfiles()
    {
        var profiles = await _profileRepository.GetAllAsync();

        var models = profiles
            .Select(ProfileFactory.CreateProfileSummary)
            .Where(profile => profile is not null)
            .ToList();

        return ServiceResult<List<ProfileSummary>>.Success(models!);
    }



    public async Task<ServiceResult<ProfileEntity>> UpdateProfile(
        string userId,
        ProfileUpdateForm form)
    {
        var profile = await _profileRepository.GetByIdAsync(userId);

        if (profile is null)
            return ServiceResult<ProfileEntity>.Fail("No profile found", 404);

        profile.FirstName = form.FirstName ?? profile.FirstName;
        profile.LastName = form.LastName ?? profile.LastName;
        profile.PhoneNumber = form.PhoneNumber ?? profile.PhoneNumber;

        if (form.Address is not null)
        {
            var address = new AddressEntity(
                5,
                form.Address.Street ?? string.Empty,
                form.Address.City ?? string.Empty,
                form.Address.State ?? string.Empty,
                form.Address.ZipCode ?? string.Empty,
                form.Address.Country ?? string.Empty
            );

            await _addressRepository.AddAsync(address);
            profile.AddressId = address.Id;
        }

        await _profileRepository.UpdateAsync(profile);
        await _profileRepository.SaveAsync();

        return ServiceResult<ProfileEntity>.Success(profile);
    }

    public async Task<ServiceResult<ProfileEntity>> CompleteProfile(
        string userId,
        CompleteProfileForm form)
    {
        var profile = await _profileRepository.GetByIdAsync(userId);

        if (profile is null)
            return ServiceResult<ProfileEntity>.Fail("No profile found", 404);

        if (profile.IsProfileCompleted)
            return ServiceResult<ProfileEntity>.Fail(
                "Profile is already completed", 409);

        profile.FirstName = form.FirstName;
        profile.LastName = form.LastName;
        profile.PhoneNumber = form.PhoneNumber;
        profile.ImageUrl = form.ImageUrl;
        profile.IsProfileCompleted = true;
        profile.ProfileCompletedAt = DateTime.UtcNow;
        profile.UpdatedAt = DateTime.UtcNow;

        profile.Address = new AddressEntity
        (
            5,
            form.Address.Street,
            form.Address.City,
            form.Address.State,
            form.Address.ZipCode,
            form.Address.Country
        );

        await _profileRepository.UpdateAsync(profile);
        await _profileRepository.SaveAsync();

        return ServiceResult<ProfileEntity>.Success(profile);
    }
}