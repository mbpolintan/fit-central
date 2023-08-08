using DataAccess.Models;
using FluentValidation;

namespace DataAccess.Validator
{
    public class GlobalParentStudioValidator : AbstractValidator<GlobalTrainingGym>
    {
        public GlobalParentStudioValidator()
        {
            RuleFor(c => c.GymName)
                .MaximumLength(50);
        }
    }
}
