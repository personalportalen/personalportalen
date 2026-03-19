using System.ComponentModel.DataAnnotations;

namespace Domain.Entities;
public class WorkshiftEntity
{
    [Key]
    public string Id { get; set; } = null!;

    //Area borde kanske egentligen vara en egen entity men vet ej om den borde ligga i denna microservice så därför blir den en string så länge
    public string Area { get; set; } = null!;
    public string Level { get; set; } = null!;
    public DateTime Starttime { get; set; }
    public DateTime Endtime { get; set; }
    public string? EmployeeId { get; set; }
    public string AddedByUserId { get; set; } = null!;
    public DateTime AddedTime { get; set; }

    //Borde lägga till senast uppdaterad och senast uppdaterad av
}
