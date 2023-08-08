using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.ViewModels
{
    public partial class MemberViewModel
    {

        public int MemberId { get; set; }
        [DisplayName("Studio")]
        public int StudioId { get; set; }
        [DisplayName("Body & Mind ID")]
        public string Mbid { get; set; }
        [DisplayName("Body & Mind Unique ID")]
        public int? MbuniqueId { get; set; }
        [DisplayName("Category")]
        public int? MemberCategoryId { get; set; }
        [DisplayName("Status")]
        public int MemberStatusId { get; set; }
        [DisplayName("Full Name")]
        public string DisplayName { get; set; }
        [DisplayName("Last Name")]
        public string LastName { get; set; }
        [DisplayName("First Name")]
        public string FirstName { get; set; }
        [DisplayName("Middle Name")]
        public string MiddleName { get; set; }
        [DisplayName("Mobile Number")]
        [RegularExpression(@"([0-9]+)", ErrorMessage = "Not a valid mobile number")]
        public string MobilePhone { get; set; }
        [DisplayName("Scanner Mobile Number")]
        [RegularExpression(@"([0-9]+)", ErrorMessage = "Not a valid mobile number")]
        public string ScannerMobile { get; set; }
        [DisplayName("Email Address")]
        [RegularExpression("^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$", ErrorMessage = "E-mail is not valid")]
        public string Email { get; set; }
        public decimal? Height { get; set; }
        [DisplayName("Gender")]
        public int GenderId { get; set; }
        [DisplayName("Date of Birth")]
        public DateTime? Dob { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        [Timestamp]
        public byte[] TimeStamp { get; set; }
        [UIHint("CustomMemberEditor")]
        public byte[] Image { get; set; }
        public string HomePhone { get; set; }
        public string WorkPhone { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string City { get; set; }
        public string PostalCode { get; set; }
        public string State { get; set; }
        public string Country { get; set; }
        public bool? Active { get; set; }
        public string Action { get; set; }
        public string PhotoUrl { get; set; }
        public DateTime? MbcreationDate { get; set; }
        public DateTime? MblastModifiedDateTime { get; set; }
        public bool? SendAccountEmails { get; set; }
        public bool? SendAccountTexts { get; set; }
        public bool? SendPromotionalEmails { get; set; }
        public bool? SendPromotionalTexts { get; set; }
        public bool? SendScheduleEmails { get; set; }
        public bool? SendScheduleTexts { get; set; }
        public string EmergencyContactInfoName { get; set; }
        public string EmergencyContactInfoEmail { get; set; }
        public string EmergencyContactInfoPhone { get; set; }
        public string EmergencyContactInfoRelationship { get; set; }       
        public string CreditCardLastFour { get; set; }
        public string DirectDebitLastFour { get; set; }
        public DateTime? CreditCardExpDate { get; set; }
        public int? PaidById { get; set; }
        public string PaidByPaymentType { get; set; }


        public string  ImageURL { get; set; }  
        public string Status { get; set; }
        public string Gender { get; set; }
        public string Message { get; set; }

    }
}
