using Domain.Entities;
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

    public string? imageUrl { get; set; }

    public AddressEntity Address { get; set; } = new()
    {
        Id = 0,
        Street = string.Empty,
        City = string.Empty,
        State = string.Empty,
        ZipCode = string.Empty,
        Country = string.Empty,
    };
}