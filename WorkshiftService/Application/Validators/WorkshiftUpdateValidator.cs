using Application.Dtos;
using FluentValidation;

namespace Application.Validators;
public class WorkshiftUpdateValidator : AbstractValidator<WorkshiftUpdateForm>
{
    public WorkshiftUpdateValidator()
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
