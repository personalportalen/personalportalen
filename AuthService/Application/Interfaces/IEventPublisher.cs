using Application.Contracts.Events;

namespace Application.Interfaces;
public interface IEventPublisher
{
    Task PublishUserCreated(UserCreatedEvent evt);
}
