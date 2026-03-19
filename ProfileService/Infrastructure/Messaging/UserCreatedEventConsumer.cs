
using Application.Contracts.Events;
using Azure.Messaging.ServiceBus;
using Microsoft.Extensions.DependencyInjection;
using System.Text.Json;
using Application.EventHandlers;
using Microsoft.Extensions.Hosting;

namespace Infrastructure.Messaging;
public class UserCreatedEventConsumer : IHostedService
{
    private readonly ServiceBusProcessor _processor;
    private readonly IServiceScopeFactory _scopeFactory;

    public UserCreatedEventConsumer(
        ServiceBusClient client,
        IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;

        _processor = client.CreateProcessor(
            "user-events",
            "profile-service",
            new ServiceBusProcessorOptions());
    }

    public async Task StartAsync(CancellationToken cancellationToken)
    {
        _processor.ProcessMessageAsync += ProcessMessage;
        _processor.ProcessErrorAsync += ProcessError;

        await _processor.StartProcessingAsync(cancellationToken);
    }

    private async Task ProcessMessage(ProcessMessageEventArgs args)
    {
        try
        {
            var body = args.Message.Body.ToString();

            var userCreatedEvent =
                JsonSerializer.Deserialize<UserCreatedEvent>(body);

            using var scope = _scopeFactory.CreateScope();

            var handler =
                scope.ServiceProvider
                    .GetRequiredService<UserCreatedEventHandler>();

       
            await handler.Handle(userCreatedEvent);

            await args.CompleteMessageAsync(args.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error: {ex.Message}");
        }
    }

    private Task ProcessError(ProcessErrorEventArgs args)
    {
        Console.WriteLine(args.Exception);
        return Task.CompletedTask;
    }

    public async Task StopAsync(CancellationToken cancellationToken)
    {
        await _processor.StopProcessingAsync(cancellationToken);
    }
}
