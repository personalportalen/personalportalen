using Application.Dtos;
using FluentValidation;

namespace Application.Validators;

public class ProfileCreateValidator : AbstractValidator<ProfileCreateForm>
{
    public ProfileCreateValidator()
    {
        RuleFor(x => x.UserId)
            .NotEmpty();

        RuleFor(x => x.EmailAddress)
            .NotEmpty()
            .EmailAddress();

    }
}