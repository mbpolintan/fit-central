using DataAccess.Models;
using FluentValidation;

namespace DataAccess.Validator
{
    public class EmailSettingValidator : AbstractValidator<EmailSetting>
    {
        public EmailSettingValidator()
        {
            RuleFor(c => c.MailServer).MaximumLength(50);
            RuleFor(c => c.SenderName).MaximumLength(100);
            RuleFor(c => c.Sender).MaximumLength(100);
            RuleFor(c => c.Password).MaximumLength(100);
        }
    }
}
