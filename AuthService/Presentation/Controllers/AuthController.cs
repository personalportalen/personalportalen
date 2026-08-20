using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Helpers;
using Presentation.Models;
using System.Security.Claims;

namespace Presentation.Controllers;

[Route("auth")]
[ApiController]
public class AuthController(
    IAuthService authService,
    CookieService cookieService) : ControllerBase
{
    private readonly IAuthService _authService = authService;
    private readonly CookieService _cookieService = cookieService;

    [HttpPost("signup")]
    public async Task<IActionResult> SignUp([FromBody] SignUpRequestDto dto)
    {
        var result = await _authService.SignUpAsync(dto);

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, new ApiResponse(false, result.Message));

        return Ok(new ApiResponse(true, "User signed up successfully"));
    }

    [HttpPost("signin")]
    public async Task<IActionResult> SignIn([FromBody] SignInRequestDto dto)
    {
        var result = await _authService.SignInAsync(dto);

        if (!result.Succeeded || result.Data is null)
            return StatusCode(result.StatusCode, new ApiResponse(false, result.Message));

        Response.Cookies.Append(
            "accessToken",
            result.Data.Token,
            _cookieService.CreateAccessTokenCookie());

        Response.Cookies.Append(
            "refreshToken",
            result.Data.RefreshToken,
            _cookieService.CreateRefreshTokenCookie());

        return Ok(new ApiResponse(true, "User signed in successfully"));
    }

    [HttpPost("signout")]
    public async Task<IActionResult> Logout()
    {
        var result = await _authService.SignOutAsync();

        Response.Cookies.Delete(
            "accessToken",
            _cookieService.CreateAccessTokenCookie());

        Response.Cookies.Delete(
            "refreshToken",
            _cookieService.CreateRefreshTokenCookie());

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, new ApiResponse(false, result.Message));

        return Ok(new ApiResponse(true, "User was signed out successfully"));
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken()
    {
        var refreshToken = Request.Cookies["refreshToken"];

        if (string.IsNullOrEmpty(refreshToken))
            return Unauthorized(new ApiResponse(false, "Refresh token is missing"));

        var result = await _authService.RefreshTokenAsync(refreshToken);

        if (!result.Succeeded || result.Data is null)
            return StatusCode(result.StatusCode, new ApiResponse(false, result.Message));

        Response.Cookies.Append(
            "accessToken",
            result.Data.Token,
            _cookieService.CreateAccessTokenCookie());

        Response.Cookies.Append(
            "refreshToken",
            result.Data.RefreshToken,
            _cookieService.CreateRefreshTokenCookie());

        return Ok(new ApiResponse(true, "Token refreshed"));
    }

    [HttpPost("verifyemail")]
    public async Task<IActionResult> VerifyEmail(
        [FromBody] VerifyEmailRequestDto request)
    {
        var exists = await _authService.UserExists(request);

        if (!exists)
            return NotFound(new ApiResponse(false, "Email does not exist"));

        return Ok(new ApiResponse(true, "Email was verified successfully"));
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult Me()
    {
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        var roles = User.FindAll(ClaimTypes.Role).Select(r => r.Value);

        return Ok(new ApiResponse(
            true,
            "User fetched",
            new { email, roles }));
    }
}