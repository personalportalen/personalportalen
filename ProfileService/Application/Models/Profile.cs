namespace Application.Models;

public class Profile()
{
    public string FirstName { get; set; } = null!;
    public string LastName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Phone { get; set; }
    public string? ImageUrl { get; set; }
    public Address Address { get; set; } = null!;
    public string CompletionStatus { get; set; } = null!;

}