namespace Application.Models;

public class Address()
{
    public string Street { get; set; } = null!;
    public string City { get; set; } = null!;
    public string? State { get; set; }
    public string ZipCode { get; set; } = null!;
    public string? Country { get; set; }
}