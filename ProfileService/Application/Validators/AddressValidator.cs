using Domain.Entities;
using FluentValidation;

namespace Application.Validators;
public class AddressValidator : AbstractValidator<AddressEntity> 
{
    public AddressValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

        RuleFor(x => x.Street)
            .NotEmpty();

        RuleFor(x => x.City)
            .NotEmpty();

        RuleFor(x => x.State)
            .NotEmpty();

        RuleFor(x => x.ZipCode)
            .NotEmpty();

        RuleFor(x => x.Country)
            .NotEmpty();
    }
}
