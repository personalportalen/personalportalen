using Application.Contracts.Events;
using Application.EventHandlers;
using Azure.Messaging.ServiceBus;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text.Json;

namespace Infrastructure.Messaging;

public class UserCreatedEventConsumer : IHostedService
{
    private readonly ServiceBusProcessor _processor;
    private readonly IServiceScopeFactory _scopeFactory;

    public UserCreatedEventConsumer(
        ServiceBusClient client,
        IServiceScopeFactory scopeFactory,
        IConfiguration configuration)
    {
        _scopeFactory = scopeFactory;

        var subscriptionName = configuration["ServiceBus:SubscriptionName"];

        _processor = client.CreateProcessor(
            "user-events",
            subscriptionName,
            new ServiceBusProcessorOptions
            {
                AutoCompleteMessages = false,
                MaxConcurrentCalls = 1
            });
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _processor.ProcessMessageAsync += ProcessMessage;
        _processor.ProcessErrorAsync += ProcessError;

        await _processor.StartProcessingAsync(cancellationToken);
    }

    private async Task ProcessMessage(ProcessMessageEventArgs args)
    {
        var body = args.Message.Body.ToString();

        var userCreatedEvent =
            JsonSerializer.Deserialize<UserCreatedEvent>(body) ?? throw new Exception("Invalid message payload");
        using var scope = _scopeFactory.CreateScope();

        var handler =
            scope.ServiceProvider
                .GetRequiredService<UserCreatedEventHandler>();

        await handler.Handle(userCreatedEvent);

        await args.CompleteMessageAsync(args.Message);
    }

    private Task ProcessError(ProcessErrorEventArgs args)
    {
        Console.WriteLine($"ServiceBus error: {args.Exception}");
        return Task.CompletedTask;
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        await _processor.StopProcessingAsync(cancellationToken);
        await _processor.DisposeAsync();
    }
}