using System.ComponentModel.DataAnnotations;


namespace Application.Dtos;

public class AddressDto
{
    [Required]
    public string Street { get; set; } = string.Empty;

    [Required]
    public string City { get; set; } = string.Empty;

    public string State { get; set; } = string.Empty;

    [Required]
    public string ZipCode { get; set; } = string.Empty;

    [Required]
    public string Country { get; set; } = string.Empty;
}