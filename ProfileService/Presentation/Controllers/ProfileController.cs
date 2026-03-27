using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
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
        var userId = User.Identity?.Name;
        if (string.IsNullOrWhiteSpace(userId))
            return Unauthorized(new ApiResponse(false, "Unauthorized", userId));

        var result = await _profileService.GetProfile(userId);
        if (result.Succeeded)
        {
            return Ok(new ApiResponse(true, "User was found", result));
        }

        return StatusCode(result.StatusCode, new ApiResponse(false, "No user found", result));
    }


    [HttpPost]
    public async Task<IActionResult> Create([FromBody] ProfileCreateForm form)
    {
        var result = await _profileService.CreateProfile(form);
        if (result.Succeeded)
        {
            return Ok(new ApiResponse(true, "Successfully created profile", result));
        }
        return StatusCode(result.StatusCode, new ApiResponse(false, "Could not create profile", result));
    }


    //[Authorize]
    [HttpPut("update")]
    public async Task<IActionResult> Update([FromBody] ProfileUpdateForm dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new ApiResponse(false, "Profile data is required"));

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new ApiResponse(false, "User id not found"));

        var result = await _profileService.UpdateProfile(userId, dto);

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, new ApiResponse(false, "Could not update profile", result));

        return Ok(new ApiResponse(true, "Profile was updated", result));
    }

    //[Authorize]
    [HttpPut("complete")]
    public async Task<IActionResult> Complete([FromBody] CompleteProfileForm dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(new ApiResponse(false, "Profile data is required"));

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userId))
            return Unauthorized(new ApiResponse(false, "User id not found"));

        var result = await _profileService.CompleteProfile(userId, dto);

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, new ApiResponse(false, "Could not complete profile", result));

        return Ok(new ApiResponse(true, "Profile was completed", result));
    }
}