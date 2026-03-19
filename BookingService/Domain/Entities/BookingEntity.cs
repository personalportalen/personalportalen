using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;
public class BookingEntity
{
    [Key]
    public string Id { get; set; } = null!;
    public string WorkshiftId { get; set; } = null!;
    public string EmployeeId { get; set; } = null!;
    public string BookingMadeById { get; set; } = null!;
    public DateTime BookingCreated { get; set; }
    public string LastUpdatedById { get; set; } = null!;
    public DateTime LastUpdated { get; set; }
}
