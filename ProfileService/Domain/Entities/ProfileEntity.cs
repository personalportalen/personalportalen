using System.ComponentModel.DataAnnotations;

namespace Domain.Entities
{
    public class ProfileEntity
    {
        [Key]
        public Guid Id { get; set; }
        public string UserId { get; set; } = null!;
        public string CompletionStatus { get; set; } = "Incomplete";
        public string FirstName { get; set; } = "";
        public string LastName { get; set; } = "";
        public string EmailAddress { get; set; } = null!;
        public string? PhoneNumber { get; set; }
        public string? ImageUrl { get; set; }

        public int? AddressId { get; set; }
        public AddressEntity? Address { get; set; }


    }
}