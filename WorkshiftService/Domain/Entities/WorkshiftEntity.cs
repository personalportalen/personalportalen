using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;
public class WorkshiftEntity(
   string id,
   string area,
   string level,
   DateTime starttime,
   DateTime endtime,
   string? employeeId,
   string addedByUserId,
   DateTime addedTime)
{
    [Key]
    public string Id { get; private set; } = id;
    public string Area { get; private set; } = area;
    public string Level { get; private set; } = level;
    public DateTime Starttime { get; private set; } = starttime;
    public DateTime Endtime { get; private set; } = endtime;
    public string? EmployeeId { get; private set; } = employeeId;
    public string AddedByUserId { get; private set; } = addedByUserId;
    public DateTime AddedTime { get; private set; } = addedTime;

    public void Book(string employeeId)
    {
        EmployeeId = employeeId;
    }

    public void Update(
    string area,
    string level,
    DateTime starttime,
    DateTime endtime,
    string? employeeId)
    {
        Area = area;
        Level = level;
        Starttime = starttime;
        Endtime = endtime;
        EmployeeId = employeeId;
    }
}
