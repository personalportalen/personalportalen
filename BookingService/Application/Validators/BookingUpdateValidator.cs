using Application.Dtos;
using FluentValidation;

namespace Application.Validators;
public class BookingUpdateValidator : AbstractValidator<BookingUpdateForm>
{
    public BookingUpdateValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty();

        RuleFor(x => x.WorkshiftId)
            .NotEmpty();

        RuleFor(x => x.EmployeeId)
            .NotEmpty();

        RuleFor(x => x.LastUpdatedById)
            .NotEmpty();

        RuleFor(x => x.LastUpdated)
            .NotEmpty();
    }
}
