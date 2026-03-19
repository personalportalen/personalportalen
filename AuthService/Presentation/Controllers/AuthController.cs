using Application.Dtos;
using Application.Interfaces;
using Application.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Models;
using System.Security.Claims;

namespace Presentation.Controllers;

[Route("auth")]
[ApiController]
public class AuthController(IAuthService authService) : ControllerBase
{
    private readonly IAuthService _authService = authService;

    [HttpPost("signup")]
    public async Task<IActionResult> SignUp([FromBody] SignUpRequestDto dto)
    {
        var result = await _authService.SignUpAsync(dto);

        return result.Succeeded
           ? Ok(new ApiResponse(true, "User signed up succesfully", result))
           : StatusCode(result.StatusCode, new ApiResponse(false, result.Message));
    }

    [HttpPost("signin")]
    public async Task<IActionResult> SignIn([FromBody] SignInRequestDto dto)
    {

        var result = await _authService.SignInAsync(dto);

        Response.Cookies.Append("accessToken", result.Data.Token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddMinutes(15)
        });

        Response.Cookies.Append("refreshToken", result.Data.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(7)
        });

        return result.Succeeded
            ? Ok(new ApiResponse(true, "User signed in successfully"))
            : StatusCode(result.StatusCode, new ApiResponse(false, result.Message, result.Data));
    }


    [HttpPost("signout")]
    public async Task<IActionResult> Logout()
    {
        var cookieOptions = new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Path = "/"
        };

        Response.Cookies.Delete("accessToken", cookieOptions);
        Response.Cookies.Delete("refreshToken", cookieOptions);

        var result = await _authService.SignOutAsync();

        return result.Succeeded
            ? Ok(new ApiResponse(true, "User was signed out succesfully"))
            : StatusCode(result.StatusCode, new ApiResponse(false, "User was not signed out due to an error", result));
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(refreshToken))
            return Unauthorized(new ApiResponse(false, "Refresh token is missing"));

        var result = await _authService.RefreshTokenAsync(refreshToken);

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, new ApiResponse(false, result.Message));

        Response.Cookies.Append("accessToken", result.Data.Token, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddMinutes(60)
        });

        Response.Cookies.Append("refreshToken", result.Data.RefreshToken, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTime.UtcNow.AddDays(7)
        });

        return Ok(new ApiResponse(true, "Token refreshed"));
    }

    [HttpPost("verifyemail")]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailRequestDto request)
    {
        var result = await _authService.UserExists(request)
            ? ServiceResult.Success("Email exists")
            : ServiceResult.Fail("Email does not exist", 404);

        return result.Succeeded
            ? Ok(new ApiResponse(true, "Email was verified successfully", result))
            : StatusCode(result.StatusCode, new ApiResponse(false, "Email was not verified due to an error", result));
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        var roles = User.FindAll(ClaimTypes.Role).Select(r => r.Value);

        return Ok(new ApiResponse(true, "User fetched", new { email, roles }));
    }
}