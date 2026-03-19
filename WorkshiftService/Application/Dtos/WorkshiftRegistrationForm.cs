using Domain.Entities;
using System.ComponentModel.DataAnnotations;

namespace Application.Dtos;
public class WorkshiftRegistrationForm
{
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

   
}
