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

        if (userId == null)
            return Unauthorized();

        var result = await _service.CreateAsync(form, userId);
        if (result.Succeeded)
        {
            return Ok();
        }
        return BadRequest(ModelState);
    }

    [HttpGet("getall")]
    public async Task<IActionResult> GetAll()
    {

        var result = await _service.GetAllAsync();
        if (result.Succeeded)
        {
            return Ok(new ApiResponse(true, "Workshifts were fetched" , result.Result));
        }
        return StatusCode(500);

    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(string id)
    {
        var result = await _service.GetAsync(x => x.Id == id);
        if (result.Succeeded)
        {
            return Ok(new ApiResponse(true, "Workshift was fetched", result.Result));
        }
        return StatusCode(500);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Passledare")]
    public async Task<IActionResult> Update([FromRoute]string id, [FromBody] WorkshiftUpdateForm form)
    {
        if (ModelState.IsValid)
        {
            form.Id = id;
            var result = await _service.UpdateAsync(form);
            if (result.Succeeded)
            {
                return Ok(new ApiResponse(true, "Workshift was updated"));
            }
            return StatusCode(500);
        }
        return BadRequest(ModelState);
    }

    [HttpDelete("delete")]
    [Authorize(Roles = "Admin,Passledare")]
    public async Task<IActionResult> Delete([FromBody]string id)
    {
        var result = await _service.DeleteAsync(id);
        if (result.Succeeded)
        {
            return Ok();
        }
        return StatusCode(500);
    }

}
