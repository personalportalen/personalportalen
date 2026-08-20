using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Models;
using System.Security.Claims;

namespace Presentation.Controllers;

[Route("booking")]
[ApiController]
public class BookingController(IBookingService bookingService) : ControllerBase
{
    private readonly IBookingService _bookingService = bookingService;

    [Authorize]
    [HttpPost("booking")]
    public async Task<IActionResult> Create([FromBody] BookingRegistrationForm form)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId is null)
            return Unauthorized();

        form.EmployeeId = userId;
        form.BookingMadeById = userId;
        form.LastUpdatedById = userId;

        var result = await _bookingService.CreateAsync(form);

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, result.Message);

        return Ok(new ApiResponse(true, "Booking was created"));
    }

    [Authorize(Roles = "Admin,Passledare")]
    [HttpGet("getall")]
    public async Task<IActionResult> GetAll()
    {
        var result = await _bookingService.GetAllAsync();

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, result.Message);

        return Ok(new ApiResponse(
            true,
            "Bookings were successfully fetched",
            result.Data));
    }

    [Authorize]
    [HttpGet("getallbyuserid")]
    public async Task<IActionResult> GetAllByUserId()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId is null)
            return Unauthorized();

        var result = await _bookingService.GetAllByUserIdAsync(userId);
        if (!result.Succeeded)
            return StatusCode(result.StatusCode, result.Message);

        return Ok(new ApiResponse(true, "Bookings by user id were succesfully fetched", result.Data));
    }

    [Authorize]
    [HttpGet("my")]
    public async Task<IActionResult> GetMyBookings()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId is null)
            return Unauthorized();

        var result = await _bookingService.GetAllByUserIdAsync(userId);

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, result.Message);

        return Ok(new ApiResponse(
            true,
            "Bookings were successfully fetched",
            result.Data));
    }

    //[Authorize]
    [HttpGet("booked")]
    public async Task<IActionResult> GetBooked()
    {
        var result = await _bookingService.GetBookedWorkshiftIdsAsync();

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, result.Message);

        return Ok(result.Data);
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> Update([FromBody] BookingUpdateForm form)
    {
        var result = await _bookingService.UpdateAsync(form);

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, result.Message);

        return Ok(new ApiResponse(true, "Booking was updated"));
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _bookingService.DeleteAsync(id);

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, result.Message);

        return Ok(new ApiResponse(true, "Booking was deleted"));
    }
}