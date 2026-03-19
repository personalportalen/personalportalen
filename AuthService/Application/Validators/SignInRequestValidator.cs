using Application.Dtos;
using FluentValidation;

namespace Application.Validators;
public class SignInRequestValidator : AbstractValidator<SignInRequestDto>
{
    public SignInRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty()
            .EmailAddress();

        RuleFor(x => x.Password)
            .NotEmpty();
    }
}
