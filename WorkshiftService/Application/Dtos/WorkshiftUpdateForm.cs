using System.ComponentModel.DataAnnotations;

namespace Application.Dtos;

public class WorkshiftUpdateForm
{
    [Required]
    public string Area { get; set; } = string.Empty;
    [Required]
    public string Level { get; set; } = string.Empty;
    public DateTime Starttime { get; set; }
    public DateTime Endtime { get; set; }
    public string? EmployeeId { get; set; }
}
