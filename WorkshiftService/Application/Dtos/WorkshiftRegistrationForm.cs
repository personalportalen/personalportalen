using System.ComponentModel.DataAnnotations;

namespace Application.Dtos;

public class WorkshiftRegistrationForm
{
    [Required]
    public string Area { get; set; } = null!;
    [Required]
    public string Level { get; set; } = null!;
    public DateTime Starttime { get; set; }
    public DateTime Endtime { get; set; }
    public string? EmployeeId { get; set; }
}
