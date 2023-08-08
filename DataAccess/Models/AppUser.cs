using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace DataAccess.Models
{
    public partial class AppUser
    {
        public AppUser()
        {
            AppConfigCreatedBy = new HashSet<AppConfig>();
            AppConfigModifiedBy = new HashSet<AppConfig>();
            AppFunctionCreatedBy = new HashSet<AppFunction>();
            AppFunctionModifiedBy = new HashSet<AppFunction>();
            AppGroupAccessCreatedBy = new HashSet<AppGroupAccess>();
            AppGroupAccessModifiedBy = new HashSet<AppGroupAccess>();
            AppGroupCreatedBy = new HashSet<AppGroup>();
            AppGroupModifiedBy = new HashSet<AppGroup>();
            AppModuleCreatedBy = new HashSet<AppModule>();
            AppModuleModifiedBy = new HashSet<AppModule>();
            AppUserAccessAppUser = new HashSet<AppUserAccess>();
            AppUserAccessCreatedBy = new HashSet<AppUserAccess>();
            AppUserAccessModifiedBy = new HashSet<AppUserAccess>();
            AuditLogCreate = new HashSet<AuditLogCreate>();
            AuditLogDelete = new HashSet<AuditLogDelete>();
            AuditLogUpdate = new HashSet<AuditLogUpdate>();
            ChallengeCreatedBy = new HashSet<Challenge>();
            ChallengeMemberCreatedBy = new HashSet<ChallengeMember>();
            ChallengeMemberModifiedBy = new HashSet<ChallengeMember>();
            ChallengeModifiedBy = new HashSet<Challenge>();            
            ChallengeTypeCreatedBy = new HashSet<ChallengeType>();
            ChallengeTypeModifiedBy = new HashSet<ChallengeType>();           
            EmailSettingCreatedBy = new HashSet<EmailSetting>();
            EmailSettingModifiedBy = new HashSet<EmailSetting>();
            GenderCreatedBy = new HashSet<Gender>();
            GenderModifiedBy = new HashSet<Gender>();
            InverseCreatedBy = new HashSet<AppUser>();
            InverseModifiedBy = new HashSet<AppUser>();
            Manager = new HashSet<Manager>();
            MbinterfaceCreatedBy = new HashSet<Mbinterface>();
            MbinterfaceModifiedBy = new HashSet<Mbinterface>();
            MemberCategoryCreatedBy = new HashSet<MemberCategory>();
            MemberCategoryModifiedBy = new HashSet<MemberCategory>();
            MemberStatusCreatedBy = new HashSet<MemberStatus>();
            MemberStatusModifiedBy = new HashSet<MemberStatus>();
            PaymentTransactionLog = new HashSet<PaymentTransactionLog>();
            Payments = new HashSet<Payments>();
            ScanCreatedBy = new HashSet<Scan>();
            ScanImageCreatedBy = new HashSet<ScanImage>();
            ScanImageModifiedBy = new HashSet<ScanImage>();
            ScanModifiedBy = new HashSet<Scan>();
            ScannerCreatedBy = new HashSet<Scanner>();
            ScannerModifiedBy = new HashSet<Scanner>();
            ScansImportCreatedBy = new HashSet<ScansImport>();
            ScansImportModifiedBy = new HashSet<ScansImport>();
            SentItem = new HashSet<SentItem>();
            SmsSettingCreatedBy = new HashSet<SmsSetting>();
            SmsSettingModifiedBy = new HashSet<SmsSetting>();
            StudioScannerCreatedBy = new HashSet<StudioScanner>();
            StudioScannerModifiedBy = new HashSet<StudioScanner>();
            StudioUserAppUser = new HashSet<StudioUser>();
            StudioUserCreatedBy = new HashSet<StudioUser>();
            StudioUserModifiedBy = new HashSet<StudioUser>();
            TrainingGymUser = new HashSet<TrainingGymUser>();
        }

        public int AppUserId { get; set; }
        [DisplayName("User's Group")]
        public int AppGroupId { get; set; }
        [DisplayName("User's Email Address")]
        //[RegularExpression("^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{10,}$", ErrorMessage = "E-mail is not valid")]
        public string UserEmail { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual AppGroup AppGroup { get; set; }
        public virtual AppUser CreatedBy { get; set; }
        public virtual AppUser ModifiedBy { get; set; }
        public virtual ICollection<AppConfig> AppConfigCreatedBy { get; set; }
        public virtual ICollection<AppConfig> AppConfigModifiedBy { get; set; }
        public virtual ICollection<AppFunction> AppFunctionCreatedBy { get; set; }
        public virtual ICollection<AppFunction> AppFunctionModifiedBy { get; set; }
        public virtual ICollection<AppGroupAccess> AppGroupAccessCreatedBy { get; set; }
        public virtual ICollection<AppGroupAccess> AppGroupAccessModifiedBy { get; set; }
        public virtual ICollection<AppGroup> AppGroupCreatedBy { get; set; }
        public virtual ICollection<AppGroup> AppGroupModifiedBy { get; set; }
        public virtual ICollection<AppModule> AppModuleCreatedBy { get; set; }
        public virtual ICollection<AppModule> AppModuleModifiedBy { get; set; }
        public virtual ICollection<AppUserAccess> AppUserAccessAppUser { get; set; }
        public virtual ICollection<AppUserAccess> AppUserAccessCreatedBy { get; set; }
        public virtual ICollection<AppUserAccess> AppUserAccessModifiedBy { get; set; }
        public virtual ICollection<AuditLogCreate> AuditLogCreate { get; set; }
        public virtual ICollection<AuditLogDelete> AuditLogDelete { get; set; }
        public virtual ICollection<AuditLogUpdate> AuditLogUpdate { get; set; }
        public virtual ICollection<Challenge> ChallengeCreatedBy { get; set; }       
        public virtual ICollection<ChallengeMember> ChallengeMemberCreatedBy { get; set; }
        public virtual ICollection<ChallengeMember> ChallengeMemberModifiedBy { get; set; }
        public virtual ICollection<Challenge> ChallengeModifiedBy { get; set; }      
        public virtual ICollection<ChallengeType> ChallengeTypeCreatedBy { get; set; }
        public virtual ICollection<ChallengeType> ChallengeTypeModifiedBy { get; set; }       
        public virtual ICollection<EmailSetting> EmailSettingCreatedBy { get; set; }
        public virtual ICollection<EmailSetting> EmailSettingModifiedBy { get; set; }
        public virtual ICollection<Gender> GenderCreatedBy { get; set; }
        public virtual ICollection<Gender> GenderModifiedBy { get; set; }
        public virtual ICollection<AppUser> InverseCreatedBy { get; set; }
        public virtual ICollection<AppUser> InverseModifiedBy { get; set; }
        public virtual ICollection<Manager> Manager { get; set; }
        public virtual ICollection<Mbinterface> MbinterfaceCreatedBy { get; set; }
        public virtual ICollection<Mbinterface> MbinterfaceModifiedBy { get; set; }
        public virtual ICollection<MemberCategory> MemberCategoryCreatedBy { get; set; }
        public virtual ICollection<MemberCategory> MemberCategoryModifiedBy { get; set; }
        public virtual ICollection<MemberStatus> MemberStatusCreatedBy { get; set; }
        public virtual ICollection<MemberStatus> MemberStatusModifiedBy { get; set; }
        public virtual ICollection<PaymentTransactionLog> PaymentTransactionLog { get; set; }
        public virtual ICollection<Payments> Payments { get; set; }
        public virtual ICollection<Scan> ScanCreatedBy { get; set; }
        public virtual ICollection<ScanImage> ScanImageCreatedBy { get; set; }
        public virtual ICollection<ScanImage> ScanImageModifiedBy { get; set; }
        public virtual ICollection<Scan> ScanModifiedBy { get; set; }
        public virtual ICollection<Scanner> ScannerCreatedBy { get; set; }
        public virtual ICollection<Scanner> ScannerModifiedBy { get; set; }
        public virtual ICollection<ScansImport> ScansImportCreatedBy { get; set; }
        public virtual ICollection<ScansImport> ScansImportModifiedBy { get; set; }
        public virtual ICollection<SentItem> SentItem { get; set; }
        public virtual ICollection<SmsSetting> SmsSettingCreatedBy { get; set; }
        public virtual ICollection<SmsSetting> SmsSettingModifiedBy { get; set; }
        public virtual ICollection<StudioScanner> StudioScannerCreatedBy { get; set; }
        public virtual ICollection<StudioScanner> StudioScannerModifiedBy { get; set; }
        public virtual ICollection<StudioUser> StudioUserAppUser { get; set; }
        public virtual ICollection<StudioUser> StudioUserCreatedBy { get; set; }
        public virtual ICollection<StudioUser> StudioUserModifiedBy { get; set; }
        public virtual ICollection<TrainingGymUser> TrainingGymUser { get; set; }
    }
}
