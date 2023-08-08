using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace DataAccess.Models
{
    public partial class Studio
    {
        public Studio()
        {
            ChallengeBooking = new HashSet<ChallengeBooking>();
            ChallengeStudio = new HashSet<ChallengeStudio>();
            Class = new HashSet<Class>();
            ClassDescription = new HashSet<ClassDescription>();
            ClassLocation = new HashSet<ClassLocation>();
            ClassResource = new HashSet<ClassResource>();
            ClassSchedule = new HashSet<ClassSchedule>();
            EmailSetting = new HashSet<EmailSetting>();
            GlobalStudio = new HashSet<GlobalStudio>();
            Inbox = new HashSet<Inbox>();
            Mbinterface = new HashSet<Mbinterface>();
            MemberCategory = new HashSet<MemberCategory>();
            PaymentTransaction = new HashSet<PaymentTransaction>();
            PaymentTransactionLog = new HashSet<PaymentTransactionLog>();
            SentItem = new HashSet<SentItem>();
            SmsSetting = new HashSet<SmsSetting>();
            StudioScanner = new HashSet<StudioScanner>();
            StudioUser = new HashSet<StudioUser>();
            ValidateVisit = new HashSet<ValidateVisit>();
            VisitAchievement = new HashSet<VisitAchievement>();
        }

        public int StudioId { get; set; }
        [DisplayName("Studio Name")]    
        public string StudioName { get; set; }
        [DisplayName("Contact Number")]
        [RegularExpression(@"([0-9]+)", ErrorMessage = "Not a valid mobile number")]
        public string ContactNumber { get; set; }
        [DisplayName("Email Address")]
        [RegularExpression("^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,6}$", ErrorMessage = "E-mail is not valid")]
        public string Email { get; set; }
        [DisplayName("Postal Code")]
        public string Postcode { get; set; }
        [DisplayName("Activation Code")]
        public string ActivationCode { get; set; }
        [DisplayName("Activation Link")]
        public string ActivationLink { get; set; }
        [DisplayName("Site Id")]
        public int? SiteId { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }
        public int? ChallengeScanProductId { get; set; }
        public int? IndividualScanProductId { get; set; }
        public string TimeZoneId { get; set; }

        public virtual ICollection<ChallengeBooking> ChallengeBooking { get; set; }
        public virtual ICollection<ChallengeStudio> ChallengeStudio { get; set; }
        public virtual ICollection<Class> Class { get; set; }
        public virtual ICollection<ClassDescription> ClassDescription { get; set; }
        public virtual ICollection<ClassLocation> ClassLocation { get; set; }
        public virtual ICollection<ClassResource> ClassResource { get; set; }
        public virtual ICollection<ClassSchedule> ClassSchedule { get; set; }
        public virtual ICollection<EmailSetting> EmailSetting { get; set; }
        public virtual ICollection<GlobalStudio> GlobalStudio { get; set; }
        public virtual ICollection<Inbox> Inbox { get; set; }
        public virtual ICollection<Mbinterface> Mbinterface { get; set; }
        public virtual ICollection<MemberCategory> MemberCategory { get; set; }
        public virtual ICollection<PaymentTransaction> PaymentTransaction { get; set; }
        public virtual ICollection<PaymentTransactionLog> PaymentTransactionLog { get; set; }
        public virtual ICollection<SentItem> SentItem { get; set; }
        public virtual ICollection<SmsSetting> SmsSetting { get; set; }
        public virtual ICollection<StudioScanner> StudioScanner { get; set; }
        public virtual ICollection<StudioUser> StudioUser { get; set; }
        public virtual ICollection<ValidateVisit> ValidateVisit { get; set; }
        public virtual ICollection<VisitAchievement> VisitAchievement { get; set; }
    }
}
