using DataAccess.ViewModels;
using FluentValidation;

namespace DataAccess.Validator
{
    public class MemberViewValidator : AbstractValidator<MemberViewModel>
    {
        public MemberViewValidator()
        {
            RuleFor(c => c.FirstName).NotNull().MaximumLength(100);
            RuleFor(c => c.LastName).NotNull().MaximumLength(100);
            RuleFor(c => c.Email).NotNull().MaximumLength(100);
            RuleFor(c => c.AddressLine1).MaximumLength(100);
            RuleFor(c => c.AddressLine2).MaximumLength(100);
            RuleFor(c => c.PostalCode).MaximumLength(100);
            RuleFor(c => c.ScannerMobile).NotNull().MaximumLength(30);
            RuleFor(c => c.MobilePhone).NotNull().MaximumLength(30);
            RuleFor(c => c.HomePhone).MaximumLength(30);
            RuleFor(c => c.WorkPhone).MaximumLength(30);
            RuleFor(c => c.Country).MaximumLength(50);
            RuleFor(c => c.State).MaximumLength(50);
            RuleFor(c => c.City).MaximumLength(50);
            RuleFor(c => c.ReferredBy).MaximumLength(30);
            RuleFor(c => c.EmergencyContactInfoEmail).MaximumLength(100);
            RuleFor(c => c.EmergencyContactInfoName).MaximumLength(100);
            RuleFor(c => c.EmergencyContactInfoPhone).MaximumLength(30);
            RuleFor(c => c.EmergencyContactInfoRelationship).MaximumLength(100);
        }
    }
}
