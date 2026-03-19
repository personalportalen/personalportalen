using Application.Dtos;
using FluentValidation;

namespace Application.Validators;
public class ProfileUpdateValidator : AbstractValidator<ProfileUpdateForm>
{
    public ProfileUpdateValidator()
    {
        RuleFor(x => x.FirstName)
            .NotEmpty().WithMessage("Ange förnamn")
            .MaximumLength(100);

        RuleFor(x => x.LastName)
            .NotEmpty().WithMessage("Ange efternamn")
            .MaximumLength(100);

        RuleFor(x => x.PhoneNumber)
            .NotEmpty().WithMessage("Ange telefonnummer")
            .Matches(@"^\+?[0-9\s\-]+$")
            .WithMessage("Ange nummer i rätt format");

        RuleFor(x => x.imageUrl)
            .Must(url => string.IsNullOrEmpty(url) || Uri.IsWellFormedUriString(url, UriKind.Absolute))
            .WithMessage("Invalid image URL");

        RuleFor(x => x.Address)
            .SetValidator(new AddressValidator());
    }
}
