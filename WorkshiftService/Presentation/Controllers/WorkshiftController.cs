using Application.Dtos;
using Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Models;
using System.Security.Claims;

namespace Presentation.Controllers;

[Route("workshift")]
[ApiController]
public class WorkshiftController(IWorkshiftService workshiftService) : ControllerBase
{
    private readonly IWorkshiftService _service = workshiftService;

    [HttpPost("create")]
    [Authorize(Roles = "Admin,Passledare")]
    public async Task<IActionResult> Create([FromBody] WorkshiftRegistrationForm form)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId is null)
            return Unauthorized();

        var result = await _service.CreateAsync(form, userId);

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, result.Message);

        return Ok(new ApiResponse(true, "Workshift was added"));
    }

    [HttpGet("getall")]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, result.Message);

        return Ok(new ApiResponse(true, "Workshifts were fetched", result.Data));
    }

    [HttpGet("getunbooked")]
    public async Task<IActionResult> GetUnbooked()
    {
        var result = await _service.GetUnbookedAsync();

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, result.Message);

        return Ok(new ApiResponse(true, "Workshifts were fetched", result.Data));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(string id)
    {
        var result = await _service.GetAsync(x => x.Id == id);

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, result.Message);

        return Ok(new ApiResponse(true, "Workshift was fetched", result.Data));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Passledare")]
    public async Task<IActionResult> Update(
        [FromRoute] string id,
        [FromBody] WorkshiftUpdateForm form)
    {
        var result = await _service.UpdateAsync(id, form);

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, result.Message);

        return Ok(new ApiResponse(true, "Workshift was updated"));
    }
    //
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Passledare")]
    public async Task<IActionResult> Delete(string id)
    {
        var result = await _service.DeleteAsync(id);

        if (!result.Succeeded)
            return StatusCode(result.StatusCode, result.Message);

        return Ok(new ApiResponse(true, "Workshift was deleted"));
    }
}


