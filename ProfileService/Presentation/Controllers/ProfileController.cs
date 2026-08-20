using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Models;
using System.Security.Claims;

namespace Presentation.Controllers;

[Route("profile")]
[ApiController]
public class ProfileController(IProfileService profileService) : ControllerBase
{
    private readonly IProfileService _profileService = profileService;

    [Authorize]
    [HttpGet("getprofile")]
    public async Task<IActionResult> Get()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId is null)
            return Unauthorized();

        var result = await _profileService.GetProfile(userId);

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, result.Message);

        return Ok(new ApiResponse(
            true,
            "Profile was found",
            result.Data));
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("getall")]
    public async Task<IActionResult> GetAll()
    {
        var result = await _profileService.GetAllProfiles();

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, result.Message);

        return Ok(new ApiResponse(
            true,
            "Profiles were found",
            result.Data));
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ProfileCreateForm form)
    {
        var result = await _profileService.CreateProfile(form);

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, result.Message);

        return Ok(new ApiResponse(
            true,
            "Profile was created",
            result.Data));
    }

    [Authorize]
    [HttpPut("update")]
    public async Task<IActionResult> Update([FromBody] ProfileUpdateForm form)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId is null)
            return Unauthorized();

        var result = await _profileService.UpdateProfile(userId, form);

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, result.Message);

        return Ok(new ApiResponse(
            true,
            "Profile was updated",
            result.Data));
    }

    [Authorize]
    [HttpPut("complete")]
    public async Task<IActionResult> Complete([FromBody] CompleteProfileForm form)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId is null)
            return Unauthorized();

        var result = await _profileService.CompleteProfile(userId, form);

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, result.Message);

        return Ok(new ApiResponse(
            true,
            "Profile was completed",
            result.Data));
    }
}