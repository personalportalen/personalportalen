using Application.Dtos;
using FluentValidation;

namespace Application.Validators;
public class SignUpRequestValidator : AbstractValidator<SignUpRequestDto>
{
    public SignUpRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Password)
            .NotEmpty()
            .MinimumLength(8);
        RuleFor(x => x.ConfirmPassword)
            .Equal(x => x.Password)
            .WithMessage("Passwords must match");

    }
}