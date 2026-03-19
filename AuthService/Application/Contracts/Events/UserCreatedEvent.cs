namespace Application.Contracts.Events;
public class UserCreatedEvent
{
    public string UserId { get; set; } = default!;
    public string Email { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}
