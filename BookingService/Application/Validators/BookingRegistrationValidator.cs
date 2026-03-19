using Application.Dtos;
using FluentValidation;

namespace Application.Validators;
public class BookingRegistrationValidator : AbstractValidator<BookingRegistrationForm>
{
    public BookingRegistrationValidator()
    {
        RuleFor(x => x.WorkshiftId)
            .NotEmpty();
    }
}
