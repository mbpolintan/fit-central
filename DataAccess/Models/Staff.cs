using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class Staff
    {
        public int StaffId { get; set; }
        public int Id { get; set; }
        public int SiteId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string Address { get; set; }
        public string PostalCode { get; set; }
        public string City { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public string MobilePhone { get; set; }
        public string HomePhone { get; set; }
        public string WorkPhone { get; set; }
        public bool IsMale { get; set; }
        public bool AppointmentInstructor { get; set; }
        public bool AlwaysAllowDoubleBooking { get; set; }
        public bool IndependentContractor { get; set; }
        public bool ClassTeacher { get; set; }
        public int? SortOrder { get; set; }
        public string ImageUrl { get; set; }
    }
}
