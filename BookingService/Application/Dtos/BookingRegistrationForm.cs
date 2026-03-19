using System.ComponentModel.DataAnnotations;

namespace Application.Dtos;
public class BookingRegistrationForm
{
    [Required]
    public string WorkshiftId { get; set; } = null!;
    public string? EmployeeId { get; set; }
    public string? BookingMadeById { get; set; }
    public string? LastUpdatedById { get; set; }


}
