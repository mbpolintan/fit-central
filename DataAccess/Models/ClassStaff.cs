using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ClassStaff
    {
        public int ScclassStaffId { get; set; }
        public int ScclassId { get; set; }
        public string Address { get; set; }
        public bool? AppointmentInstructor { get; set; }
        public bool? AlwaysAllowDoubleBooking { get; set; }
        public string Bio { get; set; }
        public string City { get; set; }
        public string Country { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string HomePhone { get; set; }
        public int? Id { get; set; }
        public bool? IndependentContractor { get; set; }
        public bool? IsMale { get; set; }
        public string LastName { get; set; }
        public string MobilePhone { get; set; }
        public string Name { get; set; }
        public string PostalCode { get; set; }
        public bool? ClassTeacher { get; set; }
        public int? SortOrder { get; set; }
        public string State { get; set; }
        public string WorkPhone { get; set; }
        public string ImageUrl { get; set; }
        public bool? ClassAssistantOne { get; set; }
        public int? ClassAssistantOneId { get; set; }
        public string ClassAssistantOneName { get; set; }
        public bool? ClassAssistantTwo { get; set; }
        public int? ClassAssistantTwoId { get; set; }
        public string ClassAssistantTwoName { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual Class Scclass { get; set; }
    }
}
