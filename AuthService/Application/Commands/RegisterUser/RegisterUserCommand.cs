using MediatR;

namespace Application.Commands.RegisterUser;

public record RegisterUserCommand(
    string Email,
    string Password
) : IRequest<string>;
