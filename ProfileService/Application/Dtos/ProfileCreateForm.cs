using System.ComponentModel.DataAnnotations;

namespace Application.Dtos;
public class ProfileCreateForm
{
    [Required]
    public string UserId { get; set; } = null!;

    [Required]
    [EmailAddress]
    public string EmailAddress { get; set; } = null!;
}