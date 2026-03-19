using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Domain.Entities;

public class AddressEntity
{
    [Key]
    public int Id { get; set; }
    public string Street { get; set; } = null!;
    public string City { get; set; } = null!;
    public string? State { get; set; }
    public string ZipCode { get; set; } = null!;
    public string Country { get; set; } = null!;

    [JsonIgnore]
    public ICollection<ProfileEntity>? Profiles { get; set; } = [];
}