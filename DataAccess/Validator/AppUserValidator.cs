using DataAccess.ViewModels;
using FluentValidation;

namespace DataAccess.Validator
{
    public class AppUserValidator : AbstractValidator<UserViewModel>
    {
        public AppUserValidator()
        {
            RuleFor(c => c.UserEmail)
                .MaximumLength(50);            
        }
    }
}
