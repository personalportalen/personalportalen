using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;
public class BookingEntity(
    string id, 
    string workshiftId, 
    string employeeId, 
    string bookingMadeById,
    DateTime bookingCreated,
    string lastUpdatedById,
    DateTime lastUpdated)
{
    [Key]
    public string Id { get; set; } = id;
    public string WorkshiftId { get; set; } = workshiftId;
    public string EmployeeId { get; set; } = employeeId;
    public string BookingMadeById { get; set; } = bookingMadeById;
    public DateTime BookingCreated { get; set; } = bookingCreated;
    public string LastUpdatedById { get; set; } = lastUpdatedById;
    public DateTime LastUpdated { get; set; } = lastUpdated;

    public void Update(
    string id,
    string workshiftId,
    string employeeId)
    {
        Id = id;
        WorkshiftId = workshiftId;
        EmployeeId = employeeId;
    }
}
