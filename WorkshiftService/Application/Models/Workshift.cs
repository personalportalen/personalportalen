namespace Application.Models;

public class Workshift
{
    public string Id { get; set; } = null!;
    public string Area { get; set; } = null!;
    public string Level { get; set; } = null!;
    public DateTime Starttime { get; set; }
    public DateTime Endtime { get; set; }
    public string? EmployeeId { get; set; }
    public string AddedByUserId { get; set; } = null!;
    public DateTime AddedTime { get; set; }
}
