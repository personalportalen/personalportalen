using System.ComponentModel.DataAnnotations;

namespace Application.Dtos;
public class WorkshiftUpdateForm
{
    //Är inte helt hundra på om Id ska finnas här för man ska ju inte kunna uppdatera id
    [Required]
    public string Id { get; set; } = null!;

    //Area borde kanske egentligen vara en egen entity men vet ej om den borde ligga i denna microservice så därför blir den en string så länge
    [Required]
    public string Area { get; set; } = null!;

    [Required]
    public string Level { get; set; } = null!;

    [Required]
    public DateTime Starttime { get; set; }

    [Required]
    public DateTime Endtime { get; set; }
    public string? EmployeeId { get; set; }
    public string AddedByUserId { get; set; } = null!;
    public DateTime AddedTime { get; set; }
}
