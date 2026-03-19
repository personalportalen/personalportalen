using Application.Dtos;
using FluentValidation;

namespace Application.Validators;
public class WorkshiftRegistrationValidator : AbstractValidator<WorkshiftRegistrationForm>
{
    public WorkshiftRegistrationValidator()
    {
        RuleFor(x => x.Area)
            .NotEmpty();

        RuleFor(x => x.Level)
            .NotEmpty();

        RuleFor(x => x.Starttime)
            .NotEmpty();

        RuleFor(x => x.Endtime)
            .NotEmpty();
    }
}
