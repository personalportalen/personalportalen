using Application.Contracts.Events;
using Application.Dtos;
using Application.Interfaces;
using Application.Models;
using Domain.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Application.Services;
public class AuthManager(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, IJwtTokenHelper jwtTokenHelper, IEventPublisher eventPublisher) : IAuthService
{
    private readonly UserManager<AppUser> _userManager = userManager;
    private readonly SignInManager<AppUser> _signInManager = signInManager;
    private readonly RoleManager<IdentityRole> _roleManager = roleManager;
    private readonly IConfiguration _configuration = configuration;
    private readonly IJwtTokenHelper _jwtTokenHelper = jwtTokenHelper;
    private readonly IEventPublisher _eventPublisher = eventPublisher;

    public async Task<ServiceResult<SignUpResponseDto>> SignUpAsync(SignUpRequestDto request)
    {
        
            var existingAccount = await _userManager.FindByEmailAsync(request.Email);
            if (existingAccount != null)
                return ServiceResult<SignUpResponseDto>.Fail("Email is already in use", 409);

            var newUser = new AppUser
            {
                UserName = request.Email,
                Email = request.Email,
                EmailConfirmed = true
            };

            var result = await _userManager.CreateAsync(newUser, request.Password);

            if (!result.Succeeded)
                return result.FromIdentityResult<SignUpResponseDto>("User creation failed");

            await _userManager.AddToRoleAsync(newUser, "Anställd");

            await _eventPublisher.PublishUserCreated(new UserCreatedEvent
            {
                UserId = newUser.Id,
                Email = newUser.Email!,
                CreatedAt = DateTime.UtcNow
            });

            return ServiceResult<SignUpResponseDto>.Success(new SignUpResponseDto 
                { 
                    UserId = newUser.Id 
                });
    }

    public async Task<ServiceResult<SignInResponseDto>> SignInAsync(SignInRequestDto request)
    {
   
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return  ServiceResult<SignInResponseDto>.Fail("User not found", 404);

        var result = await _signInManager.PasswordSignInAsync(user, request.Password, isPersistent: false, lockoutOnFailure: false);
        if (!result.Succeeded)
            return ServiceResult<SignInResponseDto>.Fail("Invalid credentials", 401);

        var token = await _jwtTokenHelper.GenerateToken(user, _configuration, _userManager);
        var refreshToken = _jwtTokenHelper.GenerateRefreshToken(user, _configuration);

        return ServiceResult<SignInResponseDto>.Success(new SignInResponseDto 
        { 
            Token = token, RefreshToken = refreshToken 
        });        
    }

    public async Task<ServiceResult> SignOutAsync()
    {
            await _signInManager.SignOutAsync();
            return ServiceResult.Success();
    }

    public async Task<ServiceResult<SignInResponseDto>> RefreshTokenAsync(string refreshToken)
    {
        var handler = new JwtSecurityTokenHandler();
        var jwtSettings = _configuration.GetSection("JwtSettings");
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["RefreshSecretKey"]!));

        ClaimsPrincipal principal;

        try
        {
            principal = handler.ValidateToken(refreshToken, new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = false,
                ValidateIssuerSigningKey = true,
                ValidIssuer = jwtSettings["Issuer"],
                ValidAudience = jwtSettings["Audience"],
                IssuerSigningKey = key
            }, out var validatedToken);

            if (validatedToken is not JwtSecurityToken jwtToken ||
                jwtToken.Claims.FirstOrDefault(c => c.Type == "type")?.Value != "refresh")
            {
                return ServiceResult<SignInResponseDto>.Fail("Invalid refresh token", 401);
            }
        }
        catch
        {
            return ServiceResult<SignInResponseDto>.Fail("Invalid refresh token", 401);
        }

        var userId = 
            principal.FindFirstValue(ClaimTypes.NameIdentifier)
            ?? principal.FindFirstValue(JwtRegisteredClaimNames.Sub);
        var user = await _userManager.FindByIdAsync(userId!);

        if (user == null)
            return ServiceResult<SignInResponseDto>.Fail("User not found", 404);

        var newToken = await _jwtTokenHelper.GenerateToken(user, _configuration, _userManager);
        var newRefreshToken = _jwtTokenHelper.GenerateRefreshToken(user, _configuration);

        return ServiceResult<SignInResponseDto>.Success(new SignInResponseDto
        {
            Token = newToken,
            RefreshToken = newRefreshToken
        });
    }


    // Check if user with email already exists
    public async Task<bool> UserExists(VerifyEmailRequestDto request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        return user != null;
    }



}