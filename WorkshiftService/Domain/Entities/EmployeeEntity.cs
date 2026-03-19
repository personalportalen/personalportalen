namespace Domain.Entities;

//Osäker på om detta verkligen ska vara en entity här eller om man bara borde hämta in ett UserId från en annan microservice...
public class EmployeeEntity
{
    public string Id { get; set; } = null!;
    public string Firstname { get; set; } = null!;
    public string Lastname { get; set; } = null!;
    public string Level { get; set; } = null!;
    public IEnumerable<AreaEntity> Areas { get; set; } = null!;
}
