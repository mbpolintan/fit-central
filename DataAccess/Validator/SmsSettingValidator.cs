using DataAccess.Models;
using FluentValidation;

namespace DataAccess.Validator
{
    public class SmsSettingValidator : AbstractValidator<SmsSetting>
    {
        public SmsSettingValidator()
        {
            RuleFor(c => c.AccountSid).MaximumLength(100);
            RuleFor(c => c.AuthToken).MaximumLength(100);
            RuleFor(c => c.Number).MaximumLength(20);           
        }
    }
}
