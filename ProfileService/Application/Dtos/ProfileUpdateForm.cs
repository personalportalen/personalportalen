using System.ComponentModel.DataAnnotations;

namespace Application.Dtos;
public class ProfileUpdateForm
{
    [Required]
    public string FirstName { get; set; } = null!;

    [Required]
    public string LastName { get; set; } = null!;

    [Required]
    public string PhoneNumber { get; set; } = null!;
    public string? ImageUrl { get; set; }
    public AddressDto Address { get; set; } = new();
}