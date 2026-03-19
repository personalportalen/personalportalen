using Application.Dtos;
using FluentValidation;

namespace Application.Validators;
public class RefreshTokenValidator : AbstractValidator<RefreshTokenRequestDto>
{
    public RefreshTokenValidator()
    {
        RuleFor(x => x.RefreshToken)
            .NotEmpty();
    }
}
