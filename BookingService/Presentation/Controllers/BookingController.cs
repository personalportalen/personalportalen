using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Models;

namespace Presentation.Controllers;

[Route("booking")]
[ApiController]
public class BookingController(IBookingService bookingService) : ControllerBase
{
    private readonly IBookingService _bookingService = bookingService;

    [Authorize]
    [HttpPost("create")]
    public async Task<IActionResult> Create([FromBody] BookingRegistrationForm form)
    {
        
            var userId = User.Identity!.Name;
            if (userId != null)
            {
                form.EmployeeId = userId;
                form.BookingMadeById = userId;
                form.LastUpdatedById = userId;

                var res = await _bookingService.CreateAsync(form);
                if (res.Succeeded)
                {
                    return Ok();
                }
                return StatusCode(500);
            }
            return BadRequest();

    }

    [Authorize(Roles = "Admin,Passledare")]
    [HttpGet("getall")]
    public async Task<IActionResult> GetAll()
    {
        var res = await _bookingService.GetAllAsync();
        if (res.Succeeded)
        {
            return Ok(new ApiResponse(true, "Bookings were successfully fetched", res.Result));
        }

        return StatusCode(500);
    }

    [Authorize]
    [HttpGet("getallbyuserid")]
    public async Task<IActionResult> GetAllByUserId()
    {
        var userId = User.Identity?.Name;

        if(userId != null)
        {
            var res = await _bookingService.GetAllAsync();
            if (res.Succeeded)
            {
                var bookings = res.Result!.Where(x => x.BookingMadeById == userId);
                return Ok(new ApiResponse(true, "Bookings by user id were succesfully fetched", bookings));
            }
            return StatusCode(500);
        }
        return BadRequest();
    }

    [Authorize]
    [HttpGet("getbyuserid/{id}")]
    //Kanske skriva om nedan så att man kan ta in vilket expression som helst och inte bara id
    public async Task<IActionResult> GetByUserId(string id)
    {
        if(id != null)
        {
            var res = await _bookingService.GetAsync(x => x.BookingMadeById == id);
            if (res.Succeeded)
            {
                var booking = res.Result;

                return Ok(booking);
            }
            return StatusCode(500);
        }
        return BadRequest();
    }

    [Authorize]
    [HttpPut]
    public async Task<IActionResult> Update([FromBody]BookingUpdateForm form)
    {
        var res = await _bookingService.UpdateAsync(form);
        if (res.Succeeded)
        {
            return Ok();
        }
        return StatusCode(500);
 
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        if(id != null)
        {
            var res = await _bookingService.DeleteAsync(id);
            if (res.Succeeded)
            {
                return Ok();
            }
            return StatusCode(500);
        }
        return BadRequest();
    }
}
