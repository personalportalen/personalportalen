using Application.Dtos;
using Application.Models;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IProfileService
    {
        Task<ServiceResult<ProfileEntity>> CreateProfile(ProfileCreateForm form);
        Task<ServiceResult<Profile>> GetProfile(string userId);
        Task<ServiceResult<ProfileEntity>> UpdateProfile(string userId, ProfileUpdateForm form);
        Task<ServiceResult<ProfileEntity>> CompleteProfile(string userId, CompleteProfileForm form);

    }
}