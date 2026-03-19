using Application.Dtos;
using FluentValidation;

namespace Application.Validators;
public class VerifyEmailRequestValidator : AbstractValidator<VerifyEmailRequestDto>
{
    public VerifyEmailRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();
    }
}
