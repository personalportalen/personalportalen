using Application.Dtos;
using Application.Models;

namespace Application.Interfaces
{
    public interface IAuthService
    {
        Task<ServiceResult<SignInResponseDto>> RefreshTokenAsync(string refreshToken);
        Task<ServiceResult<SignInResponseDto>> SignInAsync(SignInRequestDto request);
        Task<ServiceResult> SignOutAsync();
        Task<ServiceResult<SignUpResponseDto>> SignUpAsync(SignUpRequestDto request);
        Task<bool> UserExists(VerifyEmailRequestDto request);
    }
}