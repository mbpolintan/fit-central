using DataAccess.ViewModels;
using FluentValidation;

namespace DataAccess.Validator
{
    public class PaymentMethodViewValidator : AbstractValidator<PaymentMethodViewModel>
    {
        public PaymentMethodViewValidator()
        {                         
            RuleFor(c => c.Source).MaximumLength(100);
            RuleFor(c => c.MethodType).MaximumLength(100);
            RuleFor(c => c.ForOtherMemberDisplayName).MaximumLength(100);
        }

    }

}
