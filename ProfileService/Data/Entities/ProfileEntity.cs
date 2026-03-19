using System.ComponentModel.DataAnnotations;

namespace Data.Entities
{
    public class ProfileEntity
    {
        [Key]
        public string Id { get; set; } = null!;
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string EmailAddress { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public string? ImageUrl { get; set; }

        public int AddressId { get; set; }
        public AddressEntity Address { get; set; } = null!;


    }
}