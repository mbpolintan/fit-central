using DataAccess.Models;
using DataAccess.ViewModels;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess.Validator
{
    public class StudioValidator : AbstractValidator<Studio>
    {
        public StudioValidator()
        {
            RuleFor(c => c.StudioName).MaximumLength(30);  
            RuleFor(c => c.Email).MaximumLength(40);
            RuleFor(c => c.Postcode).MaximumLength(10);
            RuleFor(c => c.ActivationCode).MaximumLength(150);
            RuleFor(c => c.ActivationLink).MaximumLength(255);
            RuleFor(c => c.TimeZoneId).MaximumLength(255);
        }
    }
}
