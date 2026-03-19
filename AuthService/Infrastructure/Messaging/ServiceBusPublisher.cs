using Application.Contracts.Events;
using Application.Interfaces;
using Azure.Messaging.ServiceBus;
using Microsoft.Extensions.Configuration;
using System.Text.Json;

namespace Infrastructure.Messaging;
public class ServiceBusPublisher : IEventPublisher
{
    private readonly ServiceBusSender _sender;

    public ServiceBusPublisher(IConfiguration config)
    {
        var client = new ServiceBusClient(config["ServiceBus:ConnectionString"]);
        _sender = client.CreateSender(config["ServiceBus:TopicName"]);
    }

    public async Task PublishUserCreated(UserCreatedEvent evt)
    {
        var json = JsonSerializer.Serialize(evt);

        var message = new ServiceBusMessage(json)
        {
            Subject = "UserCreated"
        };

        await _sender.SendMessageAsync(message);
    }
}
