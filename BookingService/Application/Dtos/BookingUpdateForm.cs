using System.ComponentModel.DataAnnotations;

namespace Application.Dtos;
public class BookingUpdateForm
{
    [Required]
    public string Id { get; set; } = null!;
    [Required]
    public string WorkshiftId { get; set; } = null!;
    [Required]
    public string EmployeeId { get; set; } = null!;
    [Required]
    public string LastUpdatedById { get; set; } = null!;
    [Required]
    public DateTime LastUpdated { get; set; }
}
