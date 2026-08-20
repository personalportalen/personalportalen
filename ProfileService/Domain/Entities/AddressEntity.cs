using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Domain.Entities;

public class AddressEntity(
    int id,
    string street,
    string city,
    string state,
    string zipCode,
    string country)
{
    [Key]
    public int Id { get; set; } = id;
    public string Street { get; set; } = street;
    public string City { get; set; } = city;
    public string? State { get; set; } = state;
    public string ZipCode { get; set; } = zipCode;
    public string Country { get; set; } = country;

    [JsonIgnore]
    public ICollection<ProfileEntity>? Profiles { get; set; } = [];

    public void Update()
    {

    }
}