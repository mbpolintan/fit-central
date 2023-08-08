using Microsoft.EntityFrameworkCore;
using DataAccess.Models;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.Linq;
using System.Threading.Tasks;
using System.Threading;
using System.Data.Common;
using System.Reflection;
using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using System.Data;
using Microsoft.Data.SqlClient;
using DataAccess.ViewModels;

namespace DataAccess.Contexts
{
    public partial class StudioCentralContext : IdentityDbContext
    {
        public StudioCentralContext()
        {
        }

        public StudioCentralContext(DbContextOptions<StudioCentralContext> options)
            : base(options)
        {
        }

        #region Properties
        public virtual DbSet<AppConfig> AppConfig { get; set; }
        public virtual DbSet<AppFunction> AppFunction { get; set; }
        public virtual DbSet<AppGroup> AppGroup { get; set; }
        public virtual DbSet<AppGroupAccess> AppGroupAccess { get; set; }
        public virtual DbSet<AppModule> AppModule { get; set; }
        public virtual DbSet<AppUser> AppUser { get; set; }
        public virtual DbSet<AppUserAccess> AppUserAccess { get; set; }
        public virtual DbSet<AuditLog> AuditLog { get; set; }
        public virtual DbSet<Challenge> Challenge { get; set; }
        public virtual DbSet<ChallengeAppointment> ChallengeAppointment { get; set; }
        public virtual DbSet<ChallengeBooking> ChallengeBooking { get; set; }
        public virtual DbSet<ChallengeMember> ChallengeMember { get; set; }
        public virtual DbSet<ChallengeStudio> ChallengeStudio { get; set; }
        public virtual DbSet<ChallengeType> ChallengeType { get; set; }
        public virtual DbSet<Class> Class { get; set; }
        public virtual DbSet<ClassDescription> ClassDescription { get; set; }
        public virtual DbSet<ClassDescriptionLevel> ClassDescriptionLevel { get; set; }
        public virtual DbSet<ClassDescriptionProgram> ClassDescriptionProgram { get; set; }
        public virtual DbSet<ClassDescriptionProgramContentFormat> ClassDescriptionProgramContentFormat { get; set; }
        public virtual DbSet<ClassDescriptionSessionType> ClassDescriptionSessionType { get; set; }
        public virtual DbSet<ClassLocation> ClassLocation { get; set; }
        public virtual DbSet<ClassLocationAmenities> ClassLocationAmenities { get; set; }
        public virtual DbSet<ClassLocationImageUrl> ClassLocationImageUrl { get; set; }
        public virtual DbSet<ClassResource> ClassResource { get; set; }
        public virtual DbSet<ClassSchedule> ClassSchedule { get; set; }
        public virtual DbSet<ClassStaff> ClassStaff { get; set; }
        public virtual DbSet<CleanedScans> CleanedScans { get; set; }
        public virtual DbSet<ClientWebhook> ClientWebhook { get; set; }
        public virtual DbSet<DateFilter> DateFilter { get; set; }
        public virtual DbSet<EmailSetting> EmailSetting { get; set; }
        public virtual DbSet<Gender> Gender { get; set; }
        public virtual DbSet<GlobalStudio> GlobalStudio { get; set; }
        public virtual DbSet<GlobalTrainingGym> GlobalTrainingGym { get; set; }
        public virtual DbSet<Inbox> Inbox { get; set; }
        public virtual DbSet<Manager> Manager { get; set; }
        public virtual DbSet<Mbapilog> Mbapilog { get; set; }
        public virtual DbSet<MbautopayEvents> MbautopayEvents { get; set; }
        public virtual DbSet<MbclassSchedule> MbclassSchedule { get; set; }
        public virtual DbSet<MbclassScheduleResource> MbclassScheduleResource { get; set; }
        public virtual DbSet<MbclientActiveMembership> MbclientActiveMembership { get; set; }
        public virtual DbSet<MbclientCreaditCard> MbclientCreaditCard { get; set; }
        public virtual DbSet<MbclientInfo> MbclientInfo { get; set; }
        public virtual DbSet<MbclientVisits> MbclientVisits { get; set; }
        public virtual DbSet<Mbcontract> Mbcontract { get; set; }
        public virtual DbSet<MbdirectDebitInfo> MbdirectDebitInfo { get; set; }
        public virtual DbSet<Mbinterface> Mbinterface { get; set; }
        public virtual DbSet<MbmembershipProgram> MbmembershipProgram { get; set; }
        public virtual DbSet<MbwebApi> MbwebApi { get; set; }
        public virtual DbSet<Member> Member { get; set; }
        public virtual DbSet<MemberAchievementReward> MemberAchievementReward { get; set; }
        public virtual DbSet<MemberCategory> MemberCategory { get; set; }
        public virtual DbSet<MemberScanBooking> MemberScanBooking { get; set; }
        public virtual DbSet<MemberStatus> MemberStatus { get; set; }
        public virtual DbSet<MessageType> MessageType { get; set; }
        public virtual DbSet<PaymentMethod> PaymentMethod { get; set; }
        public virtual DbSet<PaymentMethodType> PaymentMethodType { get; set; }
        public virtual DbSet<PaymentSource> PaymentSource { get; set; }
        public virtual DbSet<PaymentTransaction> PaymentTransaction { get; set; }
        public virtual DbSet<PaymentTransactionLog> PaymentTransactionLog { get; set; }
        public virtual DbSet<PaymentType> PaymentType { get; set; }
        public virtual DbSet<Payments> Payments { get; set; }
        public virtual DbSet<PointsSystem> PointsSystem { get; set; }
        public virtual DbSet<Product> Product { get; set; }
        public virtual DbSet<ProductColor> ProductColor { get; set; }
        public virtual DbSet<ProductSize> ProductSize { get; set; }
        public virtual DbSet<PurchasedItems> PurchasedItems { get; set; }
        public virtual DbSet<Purchases> Purchases { get; set; }
        public virtual DbSet<PushClientClassBooking> PushClientClassBooking { get; set; }
        public virtual DbSet<PushClientContract> PushClientContract { get; set; }
        public virtual DbSet<PushClientDetail> PushClientDetail { get; set; }
        public virtual DbSet<PushClientMembership> PushClientMembership { get; set; }
        public virtual DbSet<PushClientSale> PushClientSale { get; set; }
        public virtual DbSet<PushClientSaleItem> PushClientSaleItem { get; set; }
        public virtual DbSet<PushClientSalePayment> PushClientSalePayment { get; set; }
        public virtual DbSet<PushSiteClass> PushSiteClass { get; set; }
        public virtual DbSet<PushSiteClassDescription> PushSiteClassDescription { get; set; }
        public virtual DbSet<PushSiteClassResource> PushSiteClassResource { get; set; }
        public virtual DbSet<PushSiteClassSchedule> PushSiteClassSchedule { get; set; }
        public virtual DbSet<PushSiteClassScheduleDow> PushSiteClassScheduleDow { get; set; }
        public virtual DbSet<PushSiteLocation> PushSiteLocation { get; set; }
        public virtual DbSet<PushSiteStaff> PushSiteStaff { get; set; }
        public virtual DbSet<Recipient> Recipient { get; set; }
        public virtual DbSet<ReferralType> ReferralType { get; set; }
        public virtual DbSet<Scan> Scan { get; set; }
        public virtual DbSet<ScanImage> ScanImage { get; set; }
        public virtual DbSet<Scanner> Scanner { get; set; }
        public virtual DbSet<ScansImport> ScansImport { get; set; }
        public virtual DbSet<ScoringSystem> ScoringSystem { get; set; }
        public virtual DbSet<SentItem> SentItem { get; set; }       
        public virtual DbSet<ShirtSize> ShirtSize { get; set; }
        public virtual DbSet<ShoppingCart> ShoppingCart { get; set; }
        public virtual DbSet<SmsSetting> SmsSetting { get; set; }
        public virtual DbSet<Staff> Staff { get; set; }
        public virtual DbSet<Studio> Studio { get; set; }
        public virtual DbSet<StudioScanner> StudioScanner { get; set; }
        public virtual DbSet<StudioUser> StudioUser { get; set; }
        public virtual DbSet<SyncLog> SyncLog { get; set; }
        public virtual DbSet<TrainingGymUser> TrainingGymUser { get; set; }
         public virtual DbSet<ValidateVisit> ValidateVisit { get; set; }
        public virtual DbSet<VisitAchievement> VisitAchievement { get; set; }
        public virtual DbSet<VwChallegeScans> VwChallegeScans { get; set; }
        public virtual DbSet<VwChallegeScansBillable> VwChallegeScansBillable { get; set; }
        public virtual DbSet<VwChallengeAppointment> VwChallengeAppointment { get; set; }
        public virtual DbSet<VwChallengeMembers> VwChallengeMembers { get; set; }
        public virtual DbSet<VwChallengeMembersEndScans> VwChallengeMembersEndScans { get; set; }
        public virtual DbSet<VwChallengeMembersMidScans> VwChallengeMembersMidScans { get; set; }
        public virtual DbSet<VwChallengeMembersStartScans> VwChallengeMembersStartScans { get; set; }
        public virtual DbSet<VwClasses> VwClasses { get; set; }
        public virtual DbSet<VwIndividualScans> VwIndividualScans { get; set; }
        public virtual DbSet<VwIndividualScansBillable> VwIndividualScansBillable { get; set; }
        public virtual DbSet<VwProductDropDownList> VwProductDropDownList { get; set; }
        public virtual DbSet<VwScanBillable> VwScanBillable { get; set; }
        public virtual DbSet<VwScanForBilling> VwScanForBilling { get; set; }
        public virtual DbSet<VwScans> VwScans { get; set; }
        public virtual DbSet<VwVisits> VwVisits { get; set; }
        public virtual DbSet<VwVisitsReport> VwVisitsReport { get; set; }
        public virtual DbSet<WeightedSystem> WeightedSystem { get; set; }

        #endregion

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            //Scaffold-DbContext "Server=PC-305453\SQLEXPRESS;Database=FitCentralDB;Trusted_Connection=True" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models -ContextDir Contexts -Context StudioCentralContext -Force -Project TestDataAccess
            //Scaffold-DbContext "Server=JCP\SQLEXPRESS;Database=FitCentralDB;Trusted_Connection=True" Microsoft.EntityFrameworkCore.SqlServer -OutputDir Models -ContextDir Contexts -Context SudioCentralContext -Force -Project DataAccess
            if (!optionsBuilder.IsConfigured)
            {
                //#warning To protect potentially sensitive information in your connection string, you should move it out of source code. See http://go.microsoft.com/fwlink/?LinkId=723263 for guidance on storing connection strings.
                //                optionsBuilder.UseSqlServer("Server=JCP\\SQLEXPRESS;Database=FitCentralDB;Trusted_Connection=True");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<AppConfig>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.AppConfigCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AppConfigUserCreated");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.AppConfigModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_AppConfigUserModified");
            });

            modelBuilder.Entity<AppFunction>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.FunctionName)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.AppFunctionCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AppFunctionUserCreated");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.AppFunctionModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_AppFunctionUserModified");
            });

            modelBuilder.Entity<AppGroup>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.AppGroupCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AppGroupUserCreated");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.AppGroupModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_AppGroupUserModified");
            });

            modelBuilder.Entity<AppGroupAccess>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.AppGroup)
                    .WithMany(p => p.AppGroupAccess)
                    .HasForeignKey(d => d.AppGroupId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AppGroupAccessGroup");

                entity.HasOne(d => d.AppModule)
                    .WithMany(p => p.AppGroupAccess)
                    .HasForeignKey(d => d.AppModuleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AppGroupAccessModule");

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.AppGroupAccessCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AppGroupAccessUserCreated");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.AppGroupAccessModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_AppGroupAccessUserModified");
            });

            modelBuilder.Entity<AppModule>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.PageUrl)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.AppModuleCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AppModuleUserCreated");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.AppModuleModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_AppModuleUserModified");
            });

            modelBuilder.Entity<AppUser>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.Property(e => e.UserEmail)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.HasOne(d => d.AppGroup)
                    .WithMany(p => p.AppUser)
                    .HasForeignKey(d => d.AppGroupId)
                    //.OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AppUserGroup");

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.InverseCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AppUserUserCreated");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.InverseModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_AppUserUserModified");
            });

            modelBuilder.Entity<AppUserAccess>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.AppUser)
                    .WithMany(p => p.AppUserAccessAppUser)
                    .HasForeignKey(d => d.AppUserId)
                    //.OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AppUserAccessUser");

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.AppUserAccessCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AppUserAccessUserCreated");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.AppUserAccessModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_AppUserAccessUserModified");
            });

            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.Property(e => e.AuditLogId)
                    .HasColumnName("AuditLogID")
                    .HasDefaultValueSql("(newid())");

                entity.Property(e => e.AuditType)
                    .IsRequired()
                    .HasMaxLength(10);

                entity.Property(e => e.TableName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.TimeStamp)
                    .HasColumnType("datetime")
                    .HasDefaultValueSql("(getdate())");

                entity.Property(e => e.Username)
                    .IsRequired()
                    .HasMaxLength(50);
            });

            modelBuilder.Entity<Challenge>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.EndDate).HasColumnType("date");

                entity.Property(e => e.EndScanFromDate).HasColumnType("date");

                entity.Property(e => e.EndScanToDate).HasColumnType("date");

                entity.Property(e => e.MidScanFromDate).HasColumnType("date");

                entity.Property(e => e.MidScanToDate).HasColumnType("date");

                entity.Property(e => e.StartDate).HasColumnType("date");

                entity.Property(e => e.StartScanFromDate).HasColumnType("date");

                entity.Property(e => e.StartScanToDate).HasColumnType("date");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.ChallengeCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ChallengeUserCreated");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.ChallengeModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_ChallengeUserModified");
            });

            modelBuilder.Entity<ChallengeAppointment>(entity =>
            {
                entity.Property(e => e.AppointmentTimeSlot).HasColumnType("datetime");

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.ChallengeBooking)
                    .WithMany(p => p.ChallengeAppointment)
                    .HasForeignKey(d => d.ChallengeBookingId)
                    .HasConstraintName("FK_ChallengeAppointment_ChallengeBooking");

                entity.HasOne(d => d.Member)
                    .WithMany(p => p.ChallengeAppointment)
                    .HasForeignKey(d => d.MemberId)
                    .HasConstraintName("FK_ChallengeAppointment_Member");
            });

            modelBuilder.Entity<ChallengeBooking>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.DateTimeSlot).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.Challenge)
                    .WithMany(p => p.ChallengeBooking)
                    .HasForeignKey(d => d.ChallengeId)
                    .HasConstraintName("FK_ChallengeBooking_Challenge");

                entity.HasOne(d => d.Studio)
                    .WithMany(p => p.ChallengeBooking)
                    .HasForeignKey(d => d.StudioId)
                    .HasConstraintName("FK_ChallengeBooking_Studio");
            });

            modelBuilder.Entity<ChallengeMember>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.Challenge)
                    .WithMany(p => p.ChallengeMember)
                    .HasForeignKey(d => d.ChallengeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ChallengeMemberChallenge");

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.ChallengeMemberCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ChallengeMemberUserCreated");

                entity.HasOne(d => d.EndScan)
                    .WithMany(p => p.ChallengeMemberEndScan)
                    .HasForeignKey(d => d.EndScanId)
                    .HasConstraintName("FK_ChallengeMemberEndScan");

                entity.HasOne(d => d.Member)
                    .WithMany(p => p.ChallengeMember)
                    .HasForeignKey(d => d.MemberId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ChallengeMemberMember");

                entity.HasOne(d => d.MidScan)
                    .WithMany(p => p.ChallengeMemberMidScan)
                    .HasForeignKey(d => d.MidScanId)
                    .HasConstraintName("FK_ChallengeMemberMidScan");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.ChallengeMemberModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_ChallengeMemberUserModified");

                entity.HasOne(d => d.PaymentTransaction)
                    .WithMany(p => p.ChallengeMember)
                    .HasForeignKey(d => d.PaymentTransactionId)
                    .HasConstraintName("FK_ChallengeMember_PaymentTransaction");

                entity.HasOne(d => d.StartScan)
                    .WithMany(p => p.ChallengeMemberStartScan)
                    .HasForeignKey(d => d.StartScanId)
                    .HasConstraintName("FK_ChallengeMemberStartScan");
            });

            modelBuilder.Entity<ChallengeStudio>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.Challenge)
                    .WithMany(p => p.ChallengeStudio)
                    .HasForeignKey(d => d.ChallengeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ChallengeStudioChallenge");

                entity.HasOne(d => d.ScoringSystem)
                    .WithMany(p => p.ChallengeStudio)
                    .HasForeignKey(d => d.ScoringSystemId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ChallengeStudio_ScoringSystem");

                entity.HasOne(d => d.Studio)
                    .WithMany(p => p.ChallengeStudio)
                    .HasForeignKey(d => d.StudioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ChallengeStudioStudio");
            });

            modelBuilder.Entity<ChallengeType>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.Property(e => e.Type)
                    .IsRequired()
                    .HasMaxLength(150);

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.ChallengeTypeCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ChallengeTypeUserCreated");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.ChallengeTypeModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_ChallengeTypeUserModified");
            });

            modelBuilder.Entity<Class>(entity =>
            {
                entity.HasKey(e => e.ScclassId)
                    .HasName("PK_Classes");

                entity.Property(e => e.ScclassId).HasColumnName("SCClassId");

                entity.Property(e => e.BookingStatus).HasMaxLength(150);

                entity.Property(e => e.BookingWindowDailyEndTime).HasColumnType("datetime");

                entity.Property(e => e.BookingWindowDailyStartTime).HasColumnType("datetime");

                entity.Property(e => e.BookingWindowEndDateTime).HasColumnType("datetime");

                entity.Property(e => e.BookingWindowStartDateTime).HasColumnType("datetime");

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.EndDateTime).HasColumnType("datetime");

                entity.Property(e => e.LastModifiedDateTime).HasColumnType("datetime");

                entity.Property(e => e.MbclassDescriptionId).HasColumnName("MBClassDescriptionId");

                entity.Property(e => e.MbclassScheduleId).HasColumnName("MBClassScheduleId");

                entity.Property(e => e.MblocationId).HasColumnName("MBLocationId");

                entity.Property(e => e.MbresourceId).HasColumnName("MBResourceId");

                entity.Property(e => e.MbstaffId).HasColumnName("MBStaffId");

                entity.Property(e => e.StartDateTime).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.Property(e => e.VirtualStreamLink).HasMaxLength(1000);

                entity.HasOne(d => d.Studio)
                    .WithMany(p => p.Class)
                    .HasForeignKey(d => d.StudioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Class_Studio");
            });

            modelBuilder.Entity<ClassDescription>(entity =>
            {
                entity.HasKey(e => e.ScclassDescriptionId)
                    .HasName("PK_MBClassDescription");

                entity.Property(e => e.ScclassDescriptionId).HasColumnName("SCClassDescriptionId");

                entity.Property(e => e.Category).HasMaxLength(255);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.ImageUrl)
                    .HasColumnName("ImageURL")
                    .HasMaxLength(1000);

                entity.Property(e => e.LastUpdated).HasColumnType("datetime");

                entity.Property(e => e.Name).HasMaxLength(150);

                entity.Property(e => e.Notes).HasMaxLength(1000);

                entity.Property(e => e.Prereq).HasMaxLength(1000);

                entity.Property(e => e.Subcategory).HasMaxLength(255);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.Studio)
                    .WithMany(p => p.ClassDescription)
                    .HasForeignKey(d => d.StudioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ClassDescription_Studio");
            });

            modelBuilder.Entity<ClassDescriptionLevel>(entity =>
            {
                entity.HasKey(e => e.ScclassDescriptionLevelId);

                entity.Property(e => e.ScclassDescriptionLevelId).HasColumnName("SCClassDescriptionLevelId");

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.ScclassDescriptionId).HasColumnName("SCClassDescriptionId");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.ScclassDescription)
                    .WithMany(p => p.ClassDescriptionLevel)
                    .HasForeignKey(d => d.ScclassDescriptionId)
                    .HasConstraintName("FK_ClassDescriptionLevel_ClassDescription");
            });

            modelBuilder.Entity<ClassDescriptionProgram>(entity =>
            {
                entity.HasKey(e => e.ScclassDescriptionProgramId);

                entity.Property(e => e.ScclassDescriptionProgramId).HasColumnName("SCClassDescriptionProgramId");

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.ScclassDescriptionId).HasColumnName("SCClassDescriptionId");

                entity.Property(e => e.ScheduleType).HasMaxLength(50);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.ScclassDescription)
                    .WithMany(p => p.ClassDescriptionProgram)
                    .HasForeignKey(d => d.ScclassDescriptionId)
                    .HasConstraintName("FK_ClassDescriptionProgram_ClassDescription");
            });

            modelBuilder.Entity<ClassDescriptionProgramContentFormat>(entity =>
            {
                entity.HasKey(e => e.ScclassDescriptionProgramContentFormatId);

                entity.Property(e => e.ScclassDescriptionProgramContentFormatId).HasColumnName("SCClassDescriptionProgramContentFormatId");

                entity.Property(e => e.ContentFormat).HasMaxLength(100);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.ScclassDescriptionProgramId).HasColumnName("SCClassDescriptionProgramId");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.ScclassDescriptionProgram)
                    .WithMany(p => p.ClassDescriptionProgramContentFormat)
                    .HasForeignKey(d => d.ScclassDescriptionProgramId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_ClassDescriptionProgramContentFormat_ClassDescriptionProgram");
            });

            modelBuilder.Entity<ClassDescriptionSessionType>(entity =>
            {
                entity.HasKey(e => e.ScclassDescriptionSessionTypeId);

                entity.Property(e => e.ScclassDescriptionSessionTypeId).HasColumnName("SCClassDescriptionSessionTypeId");

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.ScclassDescriptionId).HasColumnName("SCClassDescriptionId");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.Property(e => e.Type).HasMaxLength(15);

                entity.HasOne(d => d.ScclassDescription)
                    .WithMany(p => p.ClassDescriptionSessionType)
                    .HasForeignKey(d => d.ScclassDescriptionId)
                    .HasConstraintName("FK_ClassDescriptionSessionType_ClassDescription");
            });

            modelBuilder.Entity<ClassLocation>(entity =>
            {
                entity.HasKey(e => e.ScclassLocationId)
                    .HasName("PK_MBLocation");

                entity.Property(e => e.ScclassLocationId).HasColumnName("SCClassLocationId");

                entity.Property(e => e.Address).HasMaxLength(100);

                entity.Property(e => e.Address2).HasMaxLength(100);

                entity.Property(e => e.AverageRating).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.BusinessDescription).HasMaxLength(255);

                entity.Property(e => e.City).HasMaxLength(50);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Description).HasMaxLength(100);

                entity.Property(e => e.Latitude).HasColumnType("decimal(11, 8)");

                entity.Property(e => e.Longitude).HasColumnType("decimal(11, 8)");

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.Phone).HasMaxLength(50);

                entity.Property(e => e.PhoneExtension).HasMaxLength(50);

                entity.Property(e => e.PostalCode).HasMaxLength(15);

                entity.Property(e => e.StateProvCode).HasMaxLength(10);

                entity.Property(e => e.Tax1).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Tax2).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Tax3).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Tax4).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Tax5).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.Studio)
                    .WithMany(p => p.ClassLocation)
                    .HasForeignKey(d => d.StudioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ClassLocation_Studio");
            });

            modelBuilder.Entity<ClassLocationAmenities>(entity =>
            {
                entity.HasKey(e => e.ScclassLocationAmenitiesId);

                entity.Property(e => e.ScclassLocationAmenitiesId).HasColumnName("SCClassLocationAmenitiesId");

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Name).HasMaxLength(150);

                entity.Property(e => e.ScclassLocationId).HasColumnName("SCClassLocationId");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.ScclassLocation)
                    .WithMany(p => p.ClassLocationAmenities)
                    .HasForeignKey(d => d.ScclassLocationId)
                    .HasConstraintName("FK_ClassLocationAmenities_ClassLocation");
            });

            modelBuilder.Entity<ClassLocationImageUrl>(entity =>
            {
                entity.HasKey(e => e.ScclassLocationImageUrlId);

                entity.Property(e => e.ScclassLocationImageUrlId).HasColumnName("SCClassLocationImageUrlId");

                entity.Property(e => e.AdditionalImageUrl)
                    .HasColumnName("AdditionalImageURL")
                    .HasMaxLength(1000);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.ScclassLocationId).HasColumnName("SCClassLocationId");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.ScclassLocation)
                    .WithMany(p => p.ClassLocationImageUrl)
                    .HasForeignKey(d => d.ScclassLocationId)
                    .HasConstraintName("FK_ClassLocationImageUrl_ClassLocation");
            });

            modelBuilder.Entity<ClassResource>(entity =>
            {
                entity.HasKey(e => e.ScclassResourceId);

                entity.Property(e => e.ScclassResourceId).HasColumnName("SCClassResourceId");

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.Studio)
                    .WithMany(p => p.ClassResource)
                    .HasForeignKey(d => d.StudioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ClassResource_Studio");
            });

            modelBuilder.Entity<ClassSchedule>(entity =>
            {
                entity.HasKey(e => e.ScclassScheduleId);

                entity.Property(e => e.ScclassScheduleId).HasColumnName("SCClassScheduleId");

                entity.Property(e => e.AllowOpenEnrollment).HasDefaultValueSql("((0))");

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.DayFriday).HasDefaultValueSql("((0))");

                entity.Property(e => e.DayMonday).HasDefaultValueSql("((0))");

                entity.Property(e => e.DaySaturday).HasDefaultValueSql("((0))");

                entity.Property(e => e.DaySunday).HasDefaultValueSql("((0))");

                entity.Property(e => e.DayThursday).HasDefaultValueSql("((0))");

                entity.Property(e => e.DayTuesday).HasDefaultValueSql("((0))");

                entity.Property(e => e.DayWednesday).HasDefaultValueSql("((0))");

                entity.Property(e => e.EndDate).HasColumnType("datetime");

                entity.Property(e => e.EndTime).HasColumnType("datetime");

                entity.Property(e => e.StartDate).HasColumnType("datetime");

                entity.Property(e => e.StartTime).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.Studio)
                    .WithMany(p => p.ClassSchedule)
                    .HasForeignKey(d => d.StudioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ClassSchedule_Studio");
            });

            modelBuilder.Entity<ClassStaff>(entity =>
            {
                entity.HasKey(e => e.ScclassStaffId);

                entity.Property(e => e.ScclassStaffId).HasColumnName("SCClassStaffId");

                entity.Property(e => e.Address).HasMaxLength(50);

                entity.Property(e => e.City).HasMaxLength(50);

                entity.Property(e => e.ClassAssistantOne).HasDefaultValueSql("((0))");

                entity.Property(e => e.ClassAssistantOneName).HasMaxLength(50);

                entity.Property(e => e.ClassAssistantTwo).HasDefaultValueSql("((0))");

                entity.Property(e => e.ClassAssistantTwoName).HasMaxLength(50);

                entity.Property(e => e.Country).HasMaxLength(50);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Email).HasMaxLength(150);

                entity.Property(e => e.FirstName).HasMaxLength(100);

                entity.Property(e => e.HomePhone).HasMaxLength(50);

                entity.Property(e => e.ImageUrl).HasMaxLength(1000);

                entity.Property(e => e.LastName).HasMaxLength(150);

                entity.Property(e => e.MobilePhone).HasMaxLength(20);

                entity.Property(e => e.Name).HasMaxLength(150);

                entity.Property(e => e.PostalCode).HasMaxLength(15);

                entity.Property(e => e.ScclassId).HasColumnName("SCClassId");

                entity.Property(e => e.State).HasMaxLength(20);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.Property(e => e.WorkPhone).HasMaxLength(20);

                entity.HasOne(d => d.Scclass)
                    .WithMany(p => p.ClassStaff)
                    .HasForeignKey(d => d.ScclassId)
                    .HasConstraintName("FK_ClassStaff_Class");
            });

            modelBuilder.Entity<CleanedScans>(entity =>
            {
                entity.HasKey(e => e.CleanedScanId);

                entity.Property(e => e.CleanedScanId).ValueGeneratedNever();

                entity.Property(e => e.Ac)
                    .HasColumnName("AC")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Amc)
                    .HasColumnName("AMC")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Bcm)
                    .HasColumnName("BCM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Bfm)
                    .HasColumnName("BFM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Bfmcontrol)
                    .HasColumnName("BFMControl")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.BfmleftArm)
                    .HasColumnName("BFMLeftArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.BfmleftLeg)
                    .HasColumnName("BFMLeftLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.BfmpercLeftArm)
                    .HasColumnName("BFMPercLeftArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.BfmpercLeftLeg)
                    .HasColumnName("BFMPercLeftLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.BfmpercRightArm)
                    .HasColumnName("BFMPercRightArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.BfmpercRightLeg)
                    .HasColumnName("BFMPercRightLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.BfmpercTrunk)
                    .HasColumnName("BFMPercTrunk")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.BfmrightArm)
                    .HasColumnName("BFMRightArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.BfmrightLeg)
                    .HasColumnName("BFMRightLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Bfmtrunk)
                    .HasColumnName("BFMTrunk")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Bmc)
                    .HasColumnName("BMC")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Bmi)
                    .HasColumnName("BMI")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Bmr)
                    .HasColumnName("BMR")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.Diastolic).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ecw)
                    .HasColumnName("ECW")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ecwtbw)
                    .HasColumnName("ECWTBW")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ffm)
                    .HasColumnName("FFM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ffmcontrol)
                    .HasColumnName("FFMControl")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.FfmleftArm)
                    .HasColumnName("FFMLeftArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.FfmleftLeg)
                    .HasColumnName("FFMLeftLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.FfmpercLeftArm)
                    .HasColumnName("FFMPercLeftArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.FfmpercLeftLeg)
                    .HasColumnName("FFMPercLeftLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.FfmpercRightArm)
                    .HasColumnName("FFMPercRightArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.FfmpercRightLeg)
                    .HasColumnName("FFMPercRightLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.FfmpercTrunk)
                    .HasColumnName("FFMPercTrunk")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.FfmrightArm)
                    .HasColumnName("FFMRightArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.FfmrightLeg)
                    .HasColumnName("FFMRightLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ffmtrunk)
                    .HasColumnName("FFMTrunk")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.FileName)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.GrowthScore).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Height).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Icw)
                    .HasColumnName("ICW")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.InBodyScore).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llbcm)
                    .HasColumnName("LLBCM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llbfm)
                    .HasColumnName("LLBFM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llbmc)
                    .HasColumnName("LLBMC")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llbmi)
                    .HasColumnName("LLBMI")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llecw)
                    .HasColumnName("LLECW")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llffm)
                    .HasColumnName("LLFFM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.LlffmleftArm)
                    .HasColumnName("LLFFMLeftArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.LlffmleftLeg)
                    .HasColumnName("LLFFMLeftLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.LlffmrightArm)
                    .HasColumnName("LLFFMRightArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.LlffmrightLeg)
                    .HasColumnName("LLFFMRightLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llffmtrunk)
                    .HasColumnName("LLFFMTrunk")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llicw)
                    .HasColumnName("LLICW")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llminerals)
                    .HasColumnName("LLMinerals")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.LlobesityDegree)
                    .HasColumnName("LLObesityDegree")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.LlobesityDegreeChildNormalRange)
                    .HasColumnName("LLObesityDegreeChildNormalRange")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llpbf)
                    .HasColumnName("LLPBF")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llprotein)
                    .HasColumnName("LLProtein")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llslm)
                    .HasColumnName("LLSLM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llsmm)
                    .HasColumnName("LLSMM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Lltbw)
                    .HasColumnName("LLTBW")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.LlweightNormalRange)
                    .HasColumnName("LLWeightNormalRange")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llwhr)
                    .HasColumnName("LLWHR")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Mcabdomen)
                    .HasColumnName("MCAbdomen")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Mcchest)
                    .HasColumnName("MCChest")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Mchip)
                    .HasColumnName("MCHip")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.McleftArm)
                    .HasColumnName("MCLeftArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.McleftThigh)
                    .HasColumnName("MCLeftThigh")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Mcneck)
                    .HasColumnName("MCNeck")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.McrightArm)
                    .HasColumnName("MCRightArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.McrightThigh)
                    .HasColumnName("MCRightThigh")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.MeanArteryPressure).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Minerals).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.MobileNumber)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.ObesityDegree).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.ObesityDegreeChild).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Pbf)
                    .HasColumnName("PBF")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Protein).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Pulse).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.PulsePressure).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.RatePressureProduct).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Slm)
                    .HasColumnName("SLM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Smi)
                    .HasColumnName("SMI")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Smm)
                    .HasColumnName("SMM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Systolic).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.TargetWeight).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Tbw)
                    .HasColumnName("TBW")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.TestDateTime).HasColumnType("datetime");

                entity.Property(e => e.Ulbcm)
                    .HasColumnName("ULBCM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulbfm)
                    .HasColumnName("ULBFM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulbmc)
                    .HasColumnName("ULBMC")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulbmi)
                    .HasColumnName("ULBMI")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulecw)
                    .HasColumnName("ULECW")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulffm)
                    .HasColumnName("ULFFM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.UlffmleftArm)
                    .HasColumnName("ULFFMLeftArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.UlffmleftLeg)
                    .HasColumnName("ULFFMLeftLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.UlffmrightArm)
                    .HasColumnName("ULFFMRightArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.UlffmrightLeg)
                    .HasColumnName("ULFFMRightLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulffmtrunk)
                    .HasColumnName("ULFFMTrunk")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulicw)
                    .HasColumnName("ULICW")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulminerals)
                    .HasColumnName("ULMinerals")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.UlobesityDegree)
                    .HasColumnName("ULObesityDegree")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.UlobesityDegreeChildNormalRange)
                    .HasColumnName("ULObesityDegreeChildNormalRange")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulpbf)
                    .HasColumnName("ULPBF")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulprotein)
                    .HasColumnName("ULProtein")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulslm)
                    .HasColumnName("ULSLM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulsmm)
                    .HasColumnName("ULSMM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ultbw)
                    .HasColumnName("ULTBW")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.UlweightNormalRange)
                    .HasColumnName("ULWeightNormalRange")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulwhr)
                    .HasColumnName("ULWHR")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Vfl).HasColumnName("VFL");

                entity.Property(e => e.Weight).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.WeightControl).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Whr)
                    .HasColumnName("WHR")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._500kHzLaimpedance)
                    .HasColumnName("500kHzLAImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._500kHzLlimpedance)
                    .HasColumnName("500kHzLLImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._500kHzRaimpedance)
                    .HasColumnName("500kHzRAImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._500kHzRlimpedance)
                    .HasColumnName("500kHzRLImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._500kHzTrimpedance)
                    .HasColumnName("500kHzTRImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._50kHzLaimpedance)
                    .HasColumnName("50kHzLAImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._50kHzLlimpedance)
                    .HasColumnName("50kHzLLImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._50kHzRaimpedance)
                    .HasColumnName("50kHzRAImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._50kHzRlimpedance)
                    .HasColumnName("50kHzRLImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._50kHzTrimpedance)
                    .HasColumnName("50kHzTRImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._5kHzLaimpedance)
                    .HasColumnName("5kHzLAImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._5kHzLlimpedance)
                    .HasColumnName("5kHzLLImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._5kHzRaimpedance)
                    .HasColumnName("5kHzRAImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._5kHzRlimpedance)
                    .HasColumnName("5kHzRLImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._5kHzTrimpedance)
                    .HasColumnName("5kHzTRImpedance")
                    .HasColumnType("numeric(8, 2)");
            });

            modelBuilder.Entity<ClientWebhook>(entity =>
            {
                entity.Property(e => e.EventId).HasMaxLength(50);

                entity.Property(e => e.EventInstanceOriginationDateTime).HasColumnType("datetime");

                entity.Property(e => e.EventSchemaVersion).HasColumnType("decimal(4, 2)");

                entity.Property(e => e.MessageId).HasMaxLength(50);
            });

            modelBuilder.Entity<DateFilter>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Description)
                    .HasMaxLength(15)
                    .IsUnicode(false);

                entity.Property(e => e.TimeStamp)
                    .IsRowVersion()
                    .IsConcurrencyToken();
            });

            modelBuilder.Entity<EmailSetting>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.MailServer)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.Password)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.SenderName)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.Sender)
                  .IsRequired()
                  .HasMaxLength(100);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.EmailSettingCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_EmailSetting_AppUserCreated");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.EmailSettingModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_EmailSetting_AppUserModified");

                entity.HasOne(d => d.Studio)
                    .WithMany(p => p.EmailSetting)
                    .HasForeignKey(d => d.StudioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_EmailSetting_Studio");
            });

            modelBuilder.Entity<Gender>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(10)
                    .IsFixedLength();

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.GenderCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_GenderUserCreated");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.GenderModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_GenderUserModified");
            });

            modelBuilder.Entity<GlobalStudio>(entity =>
            {
                modelBuilder.Entity<GlobalStudio>(entity =>
                {
                    entity.Property(e => e.DateCreated).HasColumnType("datetime");

                    entity.Property(e => e.DateModified).HasColumnType("datetime");

                    entity.Property(e => e.TimeStamp)
                        .IsRequired()
                        .IsRowVersion()
                        .IsConcurrencyToken();

                    entity.HasOne(d => d.GlobalTrainingGym)
                        .WithMany(p => p.GlobalStudio)
                        .HasForeignKey(d => d.GlobalTrainingGymId)
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_GlobalStudio_GlobalTrainingGym");

                    entity.HasOne(d => d.Studio)
                        .WithMany(p => p.GlobalStudio)
                        .HasForeignKey(d => d.StudioId)
                        .OnDelete(DeleteBehavior.ClientSetNull)
                        .HasConstraintName("FK_GlobalStudio_Studio");
                });
            });

            modelBuilder.Entity<GlobalTrainingGym>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.GymName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();
            });

            modelBuilder.Entity<Inbox>(entity =>
            {
                entity.Property(e => e.BodyContentType).HasMaxLength(4);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.ReceivedDateTime).HasColumnType("datetime");

                entity.Property(e => e.SenderEmail).HasMaxLength(150);

                entity.Property(e => e.SenderMobilePhone).HasMaxLength(100);

                entity.Property(e => e.SenderName).HasMaxLength(150);

                entity.Property(e => e.SentDateTime).HasColumnType("datetime");

                entity.Property(e => e.Subject).HasMaxLength(50);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.MessageType)
                    .WithMany(p => p.Inbox)
                    .HasForeignKey(d => d.MessageTypeId)
                    .HasConstraintName("FK_Inbox_MessageType");

                entity.HasOne(d => d.Studio)
                    .WithMany(p => p.Inbox)
                    .HasForeignKey(d => d.StudioId)
                    .HasConstraintName("FK_Inbox_Studio");
            });

            modelBuilder.Entity<Manager>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.AppUser)
                    .WithMany(p => p.Manager)
                    .HasForeignKey(d => d.AppUserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Manager_AppUser");

                entity.HasOne(d => d.GlobalTrainingGym)
                    .WithMany(p => p.Manager)
                    .HasForeignKey(d => d.GlobalTrainingGymId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Manager_GlobalTrainingGym");
            });

            modelBuilder.Entity<Mbapilog>(entity =>
            {
                entity.ToTable("MBAPILog");

                entity.Property(e => e.MbapilogId).HasColumnName("MBAPILogId");

                entity.Property(e => e.DateSynced).HasColumnType("datetime");

                entity.Property(e => e.MbsiteId).HasColumnName("MBSiteId");

                entity.Property(e => e.MbwebApiid).HasColumnName("MBWebAPIId");

                entity.HasOne(d => d.MbwebApi)
                    .WithMany(p => p.Mbapilog)
                    .HasForeignKey(d => d.MbwebApiid)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MBAPILog_MBWebAPI");
            });

            modelBuilder.Entity<MbautopayEvents>(entity =>
            {
                entity.HasKey(e => e.AutoPatEventId);

                entity.ToTable("MBAutopayEvents");

                entity.Property(e => e.ChargeAmount).HasColumnType("money");

                entity.Property(e => e.MbcontractId).HasColumnName("MBContractId");

                entity.Property(e => e.PaymentMethod).HasMaxLength(100);

                entity.Property(e => e.ScheduleDate).HasColumnType("datetime");

                entity.HasOne(d => d.Mbcontract)
                    .WithMany(p => p.UpcomingAutopayEvents)
                    .HasForeignKey(d => d.MbcontractId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MBAutopayEventsMBContract");
            });

            modelBuilder.Entity<MbclassSchedule>(entity =>
            {
                entity.ToTable("MBClassSchedule");

                entity.Property(e => e.MbclassScheduleId).HasColumnName("MBClassScheduleId");

                entity.Property(e => e.AssistantOneName).HasMaxLength(200);

                entity.Property(e => e.AssistantTwoName).HasMaxLength(200);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.DaysOfWeek).HasMaxLength(255);

                entity.Property(e => e.EndDate).HasMaxLength(20);

                entity.Property(e => e.EndTime).HasMaxLength(20);

                entity.Property(e => e.StaffName).HasMaxLength(200);

                entity.Property(e => e.StartDate).HasMaxLength(20);

                entity.Property(e => e.StartTime).HasMaxLength(20);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();
            });

            modelBuilder.Entity<MbclassScheduleResource>(entity =>
            {
                entity.HasKey(e => e.MbclassScheduleResourceId)
                    .HasName("PK_MBClassScheduleResource_1");

                entity.ToTable("MBClassScheduleResource");

                entity.Property(e => e.MbclassScheduleResourceId)
                    .HasColumnName("MBClassScheduleResourceId")
                    .ValueGeneratedNever();

                entity.Property(e => e.MbclassScheduleId).HasColumnName("MBClassScheduleId");

                entity.Property(e => e.Name).HasMaxLength(200);

                entity.HasOne(d => d.MbclassSchedule)
                    .WithMany(p => p.MbclassScheduleResource)
                    .HasForeignKey(d => d.MbclassScheduleId)
                    .HasConstraintName("FK_MBClassScheduleResource_MBClassSchedule");
            });

            modelBuilder.Entity<MbclientActiveMembership>(entity =>
            {
                entity.HasKey(e => e.ActiveMembershipId);

                entity.ToTable("MBClientActiveMembership");

                entity.Property(e => e.ActiveMembershipId).ValueGeneratedNever();

                entity.Property(e => e.Action).HasMaxLength(15);

                entity.Property(e => e.ActiveDate).HasColumnType("datetime");

                entity.Property(e => e.ClientId).HasMaxLength(30);

                entity.Property(e => e.ExpirationDate).HasColumnType("datetime");

                entity.Property(e => e.IconCode).HasMaxLength(50);

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.PaymentDate).HasColumnType("datetime");

                entity.HasOne(d => d.Program)
                    .WithMany(p => p.MbclientActiveMembership)
                    .HasForeignKey(d => d.ProgramId)
                    .HasConstraintName("FK_MBClientActiveMembership_MBMembershipProgram");
            });

            modelBuilder.Entity<MbclientCreaditCard>(entity =>
            {
                entity.HasKey(e => e.MemberCreaditCardId);

                entity.ToTable("MBClientCreaditCard");

                entity.Property(e => e.Address).HasMaxLength(150);

                entity.Property(e => e.CardHolder).HasMaxLength(150);

                entity.Property(e => e.CardNumber)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.CardType).HasMaxLength(50);

                entity.Property(e => e.City).HasMaxLength(100);

                entity.Property(e => e.ExpMonth)
                    .HasMaxLength(2)
                    .IsUnicode(false);

                entity.Property(e => e.ExpYear)
                    .HasMaxLength(4)
                    .IsUnicode(false);

                entity.Property(e => e.LastFour)
                    .HasMaxLength(4)
                    .IsUnicode(false);

                entity.Property(e => e.MbclientId).HasColumnName("MBClientId");

                entity.Property(e => e.MbuniqueId).HasColumnName("MBUniqueId");

                entity.Property(e => e.PostalCode)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.State)
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<MbclientInfo>(entity =>
            {
                entity.HasKey(e => e.MbclientId);

                entity.ToTable("MBClientInfo");

                entity.Property(e => e.MbclientId)
                    .HasColumnName("MBClientId")
                    .ValueGeneratedNever();

                entity.Property(e => e.Action).HasMaxLength(20);

                entity.Property(e => e.AddressLine1).HasMaxLength(100);

                entity.Property(e => e.AddressLine2).HasMaxLength(100);

                entity.Property(e => e.AppointmentGenderPreference).HasMaxLength(50);

                entity.Property(e => e.BirthDate).HasColumnType("datetime");

                entity.Property(e => e.City).HasMaxLength(100);

                entity.Property(e => e.Country).HasMaxLength(100);

                entity.Property(e => e.CreationDate).HasColumnType("datetime");

                entity.Property(e => e.Email).HasMaxLength(100);

                entity.Property(e => e.EmergencyContactInfoEmail).HasMaxLength(100);

                entity.Property(e => e.EmergencyContactInfoName).HasMaxLength(100);

                entity.Property(e => e.EmergencyContactInfoPhone).HasMaxLength(100);

                entity.Property(e => e.EmergencyContactInfoRelationship).HasMaxLength(100);

                entity.Property(e => e.FirstAppointmentDate).HasColumnType("datetime");

                entity.Property(e => e.FirstName).HasMaxLength(50);

                entity.Property(e => e.Gender).HasMaxLength(50);

                entity.Property(e => e.HomePhone).HasMaxLength(100);

                entity.Property(e => e.Id).HasMaxLength(30);

                entity.Property(e => e.IsCompany).HasMaxLength(10);

                entity.Property(e => e.IsProspect).HasMaxLength(10);

                entity.Property(e => e.LastModifiedDateTime).HasColumnType("datetime");

                entity.Property(e => e.LastName).HasMaxLength(100);

                entity.Property(e => e.LiabilityRelease).HasMaxLength(10);

                entity.Property(e => e.MiddleName).HasMaxLength(100);

                entity.Property(e => e.MobilePhone).HasMaxLength(100);

                entity.Property(e => e.MobileProvider).HasMaxLength(100);

                entity.Property(e => e.PhotoUrl).HasMaxLength(1000);

                entity.Property(e => e.PostalCode).HasMaxLength(100);

                entity.Property(e => e.ReferredBy).HasMaxLength(100);

                entity.Property(e => e.SendAccountEmails).HasDefaultValueSql("((0))");

                entity.Property(e => e.SendAccountTexts).HasDefaultValueSql("((0))");

                entity.Property(e => e.SendPromotionalEmails).HasDefaultValueSql("((0))");

                entity.Property(e => e.SendPromotionalTexts).HasDefaultValueSql("((0))");

                entity.Property(e => e.SendScheduleEmails).HasDefaultValueSql("((0))");

                entity.Property(e => e.SendScheduleTexts).HasDefaultValueSql("((0))");

                entity.Property(e => e.State).HasMaxLength(100);

                entity.Property(e => e.Status).HasMaxLength(20);

                entity.Property(e => e.WorkPhone).HasMaxLength(100);
            });

            modelBuilder.Entity<MbclientVisits>(entity =>
            {
                entity.HasKey(e => e.MbclientVisitId);

                entity.ToTable("MBClientVisits");

                entity.Property(e => e.MbclientVisitId).HasColumnName("MBClientVisitId");

                entity.Property(e => e.Action).HasMaxLength(50);

                entity.Property(e => e.AppointmentGenderPreference).HasMaxLength(50);

                entity.Property(e => e.AppointmentStatus).HasMaxLength(50);

                entity.Property(e => e.ClientId).HasMaxLength(30);

                entity.Property(e => e.ClientPassActivationDateTime).HasColumnType("datetime");

                entity.Property(e => e.ClientPassExpirationDateTime).HasColumnType("datetime");

                entity.Property(e => e.EndDateTime).HasColumnType("datetime");

                entity.Property(e => e.LastModifiedDateTime).HasColumnType("datetime");

                entity.Property(e => e.LateCancelled).HasMaxLength(10);

                entity.Property(e => e.MakeUp).HasMaxLength(10);

                entity.Property(e => e.Name).HasMaxLength(150);

                entity.Property(e => e.ServiceName).HasMaxLength(255);

                entity.Property(e => e.SignedIn).HasMaxLength(10);

                entity.Property(e => e.SignedInStatus)
                    .HasColumnName("SignedInStatus")
                    .HasMaxLength(20);

                entity.Property(e => e.StaffName).HasMaxLength(150);

                entity.Property(e => e.StartDateTime).HasColumnType("datetime");

                entity.Property(e => e.WebSignup).HasMaxLength(10);
            });

            modelBuilder.Entity<Mbcontract>(entity =>
            {
                entity.HasKey(e => e.MbcontractId)
                    .HasName("PK_MBContract_1");

                entity.ToTable("MBContract");

                entity.Property(e => e.MbcontractId)
                    .HasColumnName("MBContractId")
                    .ValueGeneratedNever();

                entity.Property(e => e.AgreementDate).HasColumnType("datetime");

                entity.Property(e => e.AutopayStatus).HasMaxLength(50);

                entity.Property(e => e.ClientId).HasMaxLength(30);

                entity.Property(e => e.ContractName).HasMaxLength(255);

                entity.Property(e => e.ContractSoldByStaffFirstName).HasMaxLength(50);

                entity.Property(e => e.ContractSoldByStaffLastName).HasMaxLength(100);

                entity.Property(e => e.EndDate).HasColumnType("datetime");

                entity.Property(e => e.StartDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<MbdirectDebitInfo>(entity =>
            {
                entity.ToTable("MBDirectDebitInfo");

                entity.Property(e => e.MbdirectDebitInfoId).HasColumnName("MBDirectDebitInfoId");

                entity.Property(e => e.AccountNumber)
                    .HasMaxLength(4)
                    .IsUnicode(false);

                entity.Property(e => e.AccountType)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.ClientId)
                    .IsRequired()
                    .HasMaxLength(30);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.MbuniqueId).HasColumnName("MBUniqueId");

                entity.Property(e => e.NameOnAccount).HasMaxLength(150);

                entity.Property(e => e.RoutingNumber)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();
            });

            modelBuilder.Entity<Mbinterface>(entity =>
            {
                entity.HasKey(e => e.InterfaceId);

                entity.ToTable("MBInterface");

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.MbinterfaceCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AppUser_MBInterfaceCreated");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.MbinterfaceModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_AppUser_MBInterfaceModified");

                entity.HasOne(d => d.Studio)
                    .WithMany(p => p.Mbinterface)
                    .HasForeignKey(d => d.StudioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Studio_MindBodyInterface");
            });

            modelBuilder.Entity<MbmembershipProgram>(entity =>
            {
                entity.ToTable("MBMembershipProgram");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.ContentFormats).HasMaxLength(150);

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.ScheduleType).HasMaxLength(20);
            });

            modelBuilder.Entity<MbwebApi>(entity =>
            {
                entity.ToTable("MBWebAPI");

                entity.Property(e => e.MbwebApiid).HasColumnName("MBWebAPIId");

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Description).HasMaxLength(255);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.Property(e => e.Title).HasMaxLength(150);

                entity.Property(e => e.Url).HasMaxLength(300);
            });

            modelBuilder.Entity<Member>(entity =>
            {
                entity.HasIndex(e => new { e.StudioId, e.MemberStatusId, e.GenderId })
                    .HasName("NonClusteredIndex-20201214-072546");

                entity.Property(e => e.Action).HasMaxLength(20);

                entity.Property(e => e.Active).HasDefaultValueSql("((0))");

                entity.Property(e => e.AddressLine1).HasMaxLength(100);

                entity.Property(e => e.AddressLine2).HasMaxLength(100);

                entity.Property(e => e.City).HasMaxLength(100);

                entity.Property(e => e.Country).HasMaxLength(100);

                entity.Property(e => e.CreditCardExpDate).HasColumnType("datetime");

                entity.Property(e => e.CreditCardLastFour)
                    .HasMaxLength(4)
                    .IsUnicode(false);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.DirectDebitLastFour)
                    .HasMaxLength(4)
                    .IsUnicode(false);

                entity.Property(e => e.DisplayName).HasMaxLength(255);

                entity.Property(e => e.Dob)
                    .HasColumnName("DOB")
                    .HasColumnType("date");

                entity.Property(e => e.Email).HasMaxLength(255);

                entity.Property(e => e.EmergencyContactInfoEmail).HasMaxLength(100);

                entity.Property(e => e.EmergencyContactInfoName).HasMaxLength(100);

                entity.Property(e => e.EmergencyContactInfoPhone).HasMaxLength(100);

                entity.Property(e => e.EmergencyContactInfoRelationship).HasMaxLength(100);

                entity.Property(e => e.FirstName).HasMaxLength(255);

                entity.Property(e => e.Height).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.HomePhone).HasMaxLength(100);

                entity.Property(e => e.LastName).HasMaxLength(255);

                entity.Property(e => e.MbcreationDate)
                    .HasColumnName("MBCreationDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.Mbid)
                    .HasColumnName("MBId")
                    .HasMaxLength(30);

                entity.Property(e => e.MblastModifiedDateTime)
                    .HasColumnName("MBLastModifiedDateTime")
                    .HasColumnType("datetime");

                entity.Property(e => e.MbuniqueId).HasColumnName("MBUniqueId");

                entity.Property(e => e.MiddleName).HasMaxLength(255);

                entity.Property(e => e.MobilePhone).HasMaxLength(255);

                entity.Property(e => e.PaidByPaymentType).HasMaxLength(30);

                entity.Property(e => e.PhotoUrl).HasMaxLength(500);

                entity.Property(e => e.PostalCode).HasMaxLength(100);

                entity.Property(e => e.ReferredBy).HasMaxLength(255);

                entity.Property(e => e.ScannerMobile).HasMaxLength(20);

                entity.Property(e => e.SendAccountEmails).HasDefaultValueSql("((0))");

                entity.Property(e => e.SendAccountTexts).HasDefaultValueSql("((0))");

                entity.Property(e => e.SendPromotionalEmails).HasDefaultValueSql("((0))");

                entity.Property(e => e.SendPromotionalTexts).HasDefaultValueSql("((0))");

                entity.Property(e => e.SendScheduleEmails).HasDefaultValueSql("((0))");

                entity.Property(e => e.SendScheduleTexts).HasDefaultValueSql("((0))");

                entity.Property(e => e.State).HasMaxLength(100);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.Property(e => e.WorkPhone).HasMaxLength(100);

                entity.HasOne(d => d.Gender)
                    .WithMany(p => p.Member)
                    .HasForeignKey(d => d.GenderId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_GenderMember");

                entity.HasOne(d => d.MemberCategory)
                    .WithMany(p => p.Member)
                    .HasForeignKey(d => d.MemberCategoryId)
                    .HasConstraintName("FK_MemberCategoryMember");

                entity.HasOne(d => d.MemberStatus)
                    .WithMany(p => p.Member)
                    .HasForeignKey(d => d.MemberStatusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MemberStatusMember");

                entity.HasOne(d => d.ShirtSize)
                    .WithMany(p => p.Member)
                    .HasForeignKey(d => d.ShirtSizeId)
                    .HasConstraintName("FK_Member_ShirtSize");
            });

            modelBuilder.Entity<MemberAchievementReward>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.Member)
                    .WithMany(p => p.MemberAchievementReward)
                    .HasForeignKey(d => d.MemberId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MemberAchievementReward_Member");

                entity.HasOne(d => d.VisitAchievement)
                    .WithMany(p => p.MemberAchievementReward)
                    .HasForeignKey(d => d.VisitAchievementId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MemberAchievementReward_VisitAchievement");
            });

            modelBuilder.Entity<MemberCategory>(entity =>
            {
                entity.Property(e => e.Category)
                    .IsRequired()
                    .HasMaxLength(40);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.StdRate).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.MemberCategoryCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MemberCategoryUserCreated");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.MemberCategoryModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_MemberCategoryUserModified");

                entity.HasOne(d => d.Studio)
                    .WithMany(p => p.MemberCategory)
                    .HasForeignKey(d => d.StudioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MemberCategoryStudio");
            });

            modelBuilder.Entity<MemberScanBooking>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.EndScanBookingDate).HasColumnType("datetime");

                entity.Property(e => e.MidScanBookingDate).HasColumnType("datetime");

                entity.Property(e => e.StartScanBookingDate).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.Challenge)
                    .WithMany(p => p.MemberScanBooking)
                    .HasForeignKey(d => d.ChallengeId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MemberScanBooking_Challenge");

                entity.HasOne(d => d.Member)
                    .WithMany(p => p.MemberScanBooking)
                    .HasForeignKey(d => d.MemberId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MemberScanBooking_Member");
            });

            modelBuilder.Entity<MemberStatus>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasMaxLength(40);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.MemberStatusCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_MemberStatusUserCreated");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.MemberStatusModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_MemberStatusUserModified");
            });

            modelBuilder.Entity<MessageType>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Description).HasMaxLength(10);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();
            });

            modelBuilder.Entity<PaymentGateway>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.Gateway).HasMaxLength(150);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();
            });

            modelBuilder.Entity<PaymentMethod>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.Member)
                    .WithMany(p => p.PaymentMethodMember)
                    .HasForeignKey(d => d.MemberId)
                    .HasConstraintName("FK_PaymentMethod_Member");

                entity.HasOne(d => d.PaidByOtherMember)
                    .WithMany(p => p.PaymentMethodPaidByOtherMember)
                    .HasForeignKey(d => d.PaidByOtherMemberId)
                    .HasConstraintName("FK_PaymentMethod_PaidByOtherMember");

                entity.HasOne(d => d.PaymentMethodType)
                    .WithMany(p => p.PaymentMethod)
                    .HasForeignKey(d => d.PaymentMethodTypeId)
                    .HasConstraintName("FK_PaymentMethod_PaymentMethodType");

                entity.HasOne(d => d.PaymentSource)
                    .WithMany(p => p.PaymentMethod)
                    .HasForeignKey(d => d.PaymentSourceId)
                    .HasConstraintName("FK_PaymentMethod_PaymentSource");
            });

            modelBuilder.Entity<PaymentMethodType>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Description).HasMaxLength(50);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();
            });

            modelBuilder.Entity<PaymentSource>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Description).HasMaxLength(255);

                entity.Property(e => e.TimeStamp)
                    .IsRowVersion()
                    .IsConcurrencyToken();
            });

            modelBuilder.Entity<PaymentTransaction>(entity =>
            {
                entity.Property(e => e.Amount).HasColumnType("money");

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.Member)
                    .WithMany(p => p.PaymentTransaction)
                    .HasForeignKey(d => d.MemberId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PaymentTransaction_Member");

                entity.HasOne(d => d.PaymentMethod)
                    .WithMany(p => p.PaymentTransaction)
                    .HasForeignKey(d => d.PaymentMethodId)
                    .HasConstraintName("FK_PaymentTransaction_PaymentMethod");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.PaymentTransaction)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK_PaymentTransaction_Product");

                entity.HasOne(d => d.Studio)
                    .WithMany(p => p.PaymentTransaction)
                    .HasForeignKey(d => d.StudioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PaymentTransaction_Studio");
            });

            modelBuilder.Entity<PaymentTransactionLog>(entity =>
            {
                entity.Property(e => e.Amount).HasColumnType("money");

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.ReconciledComments).HasMaxLength(500);

                entity.Property(e => e.StatusDescription).HasMaxLength(500);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.Property(e => e.TransactionDate).HasColumnType("datetime");

                entity.HasOne(d => d.Member)
                    .WithMany(p => p.PaymentTransactionLog)
                    .HasForeignKey(d => d.MemberId)
                    .HasConstraintName("FK_PaymentTransactionLog_Member");

                entity.HasOne(d => d.PaymentGateway)
                    .WithMany(p => p.PaymentTransactionLog)
                    .HasForeignKey(d => d.PaymentGatewayId)
                    .HasConstraintName("FK_PaymentTransactionLog_PaymentGateway");

                entity.HasOne(d => d.PaymentMethod)
                    .WithMany(p => p.PaymentTransactionLog)
                    .HasForeignKey(d => d.PaymentMethodId)
                    .HasConstraintName("FK_PaymentTransactionLog_PaymentMethod");

                entity.HasOne(d => d.ProcessedBy)
                    .WithMany(p => p.PaymentTransactionLog)
                    .HasForeignKey(d => d.ProcessedById)
                    .HasConstraintName("FK_PaymentTransactionLog_ProcessedBy");

                entity.HasOne(d => d.Studio)
                    .WithMany(p => p.PaymentTransactionLog)
                    .HasForeignKey(d => d.StudioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PaymentTransactionLog_Studio");
            });

            modelBuilder.Entity<PaymentType>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();
            });

            modelBuilder.Entity<Payments>(entity =>
            {
                entity.HasKey(e => e.PaymentId);

                entity.Property(e => e.Amount).HasColumnType("money");

                entity.Property(e => e.Notes).HasMaxLength(500);

                entity.Property(e => e.ReconciledDatetime).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.Property(e => e.Type).HasMaxLength(50);

                entity.HasOne(d => d.Purchase)
                    .WithMany(p => p.Payments)
                    .HasForeignKey(d => d.PurchaseId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_Payments_Purchases");

                entity.HasOne(d => d.ReconciledBy)
                    .WithMany(p => p.Payments)
                    .HasForeignKey(d => d.ReconciledById)
                    .HasConstraintName("FK_Payments_AppUser");
            });

            modelBuilder.Entity<PointsSystem>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Pbfloss)
                    .HasColumnName("PBFLoss")
                    .HasColumnType("decimal(6, 3)");

                entity.Property(e => e.Smmgain)
                    .HasColumnName("SMMGain")
                    .HasColumnType("decimal(6, 3)");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.Property(e => e.Vflloss)
                    .HasColumnName("VFLLoss")
                    .HasColumnType("decimal(6, 3)");

                entity.Property(e => e.WeightLoss).HasColumnType("decimal(6, 3)");

                entity.HasOne(d => d.GlobalTrainingGym)
                    .WithMany(p => p.PointsSystem)
                    .HasForeignKey(d => d.GlobalTrainingGymId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PointsSystem_GlobalTrainingGym");
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasKey(e => e.ProductId);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Id).HasMaxLength(30);

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.OnlinePrice).HasColumnType("money");

                entity.Property(e => e.Price).HasColumnType("money");

                entity.Property(e => e.ShortDescription).HasMaxLength(100);

                entity.Property(e => e.TaxIncluded).HasColumnType("money");

                entity.Property(e => e.TaxRate).HasColumnType("money");
            });

            modelBuilder.Entity<ProductColor>(entity =>
            {
                entity.HasKey(e => e.ProductColorId);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Id).HasMaxLength(30);

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.ProductColor)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK_ProductColor_Product");
            });

            modelBuilder.Entity<ProductSize>(entity =>
            {
                entity.HasKey(e => e.ProductSizeId);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Id).HasMaxLength(30);

                entity.Property(e => e.Name)
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.ProductSize)
                    .HasForeignKey(d => d.ProductId)
                    .OnDelete(DeleteBehavior.Cascade)
                    .HasConstraintName("FK_ProductSize_ProductSize");
            });

            modelBuilder.Entity<PurchasedItems>(entity =>
            {
                entity.HasKey(e => e.PurchasedItemId);

                entity.Property(e => e.BarcodeId).HasMaxLength(50);

                entity.HasOne(d => d.Purchase)
                    .WithMany(p => p.PurchasedItems)
                    .HasForeignKey(d => d.PurchaseId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PurchasedItems_Purchases");
            });

            modelBuilder.Entity<Purchases>(entity =>
            {
                entity.HasKey(e => e.PurchaseId);

                entity.Property(e => e.AmountPaid).HasColumnType("money");

                entity.Property(e => e.ClientId).HasMaxLength(30);

                entity.Property(e => e.Description).HasMaxLength(255);

                entity.Property(e => e.Discount).HasColumnType("money");

                entity.Property(e => e.Price).HasColumnType("money");

                entity.Property(e => e.SaleDate).HasColumnType("date");

                entity.Property(e => e.SaleDateTime).HasColumnType("datetime");

                entity.Property(e => e.SaleTime).HasColumnType("time(2)");

                entity.Property(e => e.Tax).HasColumnType("money");
            });

            modelBuilder.Entity<PushClientClassBooking>(entity =>
            {
                entity.Property(e => e.ClassEndDateTime).HasColumnType("datetime");

                entity.Property(e => e.ClassStartDateTime).HasColumnType("datetime");

                entity.Property(e => e.ClientEmail).HasMaxLength(100);

                entity.Property(e => e.ClientFirstName).HasMaxLength(50);

                entity.Property(e => e.ClientId).HasMaxLength(30);

                entity.Property(e => e.ClientLastName).HasMaxLength(100);

                entity.Property(e => e.ClientPassActivationDateTime).HasColumnType("datetime");

                entity.Property(e => e.ClientPassExpirationDateTime).HasColumnType("datetime");

                entity.Property(e => e.ClientPassId).HasMaxLength(30);

                entity.Property(e => e.ClientPhone).HasMaxLength(100);

                entity.Property(e => e.ItemName).HasMaxLength(150);

                entity.Property(e => e.SignedInStatus).HasMaxLength(20);

                entity.Property(e => e.StaffName).HasMaxLength(150);

                entity.HasOne(d => d.ClientWebhook)
                    .WithMany(p => p.PushClientClassBooking)
                    .HasForeignKey(d => d.ClientWebhookId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PushClientClassBooking_ClientWebhook");
            });

            modelBuilder.Entity<PushClientContract>(entity =>
            {
                entity.Property(e => e.AgreementDateTime).HasColumnType("datetime");

                entity.Property(e => e.ClientEmail).HasMaxLength(100);

                entity.Property(e => e.ClientFirstName).HasMaxLength(50);

                entity.Property(e => e.ClientId).HasMaxLength(30);

                entity.Property(e => e.ClientLastName).HasMaxLength(100);

                entity.Property(e => e.ContractEndDateTime).HasColumnType("datetime");

                entity.Property(e => e.ContractName).HasMaxLength(200);

                entity.Property(e => e.ContractSoldByStaffFirstName).HasMaxLength(50);

                entity.Property(e => e.ContractSoldByStaffLastName).HasMaxLength(100);

                entity.Property(e => e.ContractStartDateTime).HasColumnType("datetime");

                entity.HasOne(d => d.ClientWebhook)
                    .WithMany(p => p.PushClientContract)
                    .HasForeignKey(d => d.ClientWebhookId)
                    .HasConstraintName("FK_PushClientContract_ClientWebhook");
            });

            modelBuilder.Entity<PushClientDetail>(entity =>
            {
                entity.Property(e => e.AddressLine1).HasMaxLength(150);

                entity.Property(e => e.AddressLine2).HasMaxLength(150);

                entity.Property(e => e.AppointmentGenderPreference).HasMaxLength(10);

                entity.Property(e => e.BirthDateTime).HasMaxLength(30);

                entity.Property(e => e.City).HasMaxLength(100);

                entity.Property(e => e.ClientId).HasMaxLength(30);

                entity.Property(e => e.Country).HasMaxLength(50);

                entity.Property(e => e.CreationDateTime).HasMaxLength(50);

                entity.Property(e => e.CreditCardExpDate).HasColumnType("datetime");

                entity.Property(e => e.CreditCardLastFour)
                    .HasMaxLength(4)
                    .IsUnicode(false);

                entity.Property(e => e.DirectDebitLastFour)
                    .HasMaxLength(4)
                    .IsUnicode(false);

                entity.Property(e => e.Email).HasMaxLength(100);

                entity.Property(e => e.FirstAppointmentDateTime).HasMaxLength(30);

                entity.Property(e => e.FirstName).HasMaxLength(50);

                entity.Property(e => e.Gender).HasMaxLength(20);

                entity.Property(e => e.HomePhone).HasMaxLength(30);

                entity.Property(e => e.IsSynced).HasDefaultValueSql("((0))");

                entity.Property(e => e.LastModifiedDateTime).HasColumnType("datetime");

                entity.Property(e => e.LastName).HasMaxLength(100);

                entity.Property(e => e.LiabilityAgreementDateTime).HasMaxLength(50);

                entity.Property(e => e.MiddleName).HasMaxLength(100);

                entity.Property(e => e.MobilePhone).HasMaxLength(30);

                entity.Property(e => e.PhotoUrl).HasMaxLength(1000);

                entity.Property(e => e.PostalCode).HasMaxLength(30);

                entity.Property(e => e.PreviousEmail).HasMaxLength(100);

                entity.Property(e => e.ReferredBy).HasMaxLength(100);

                entity.Property(e => e.State).HasMaxLength(50);

                entity.Property(e => e.Status).HasMaxLength(20);

                entity.Property(e => e.WorkPhone).HasMaxLength(30);

                entity.HasOne(d => d.ClientWebhook)
                    .WithMany(p => p.PushClientDetail)
                    .HasForeignKey(d => d.ClientWebhookId)
                    .HasConstraintName("FK_PushClientDetail_ClientWebhook");
            });

            modelBuilder.Entity<PushClientMembership>(entity =>
            {
                entity.Property(e => e.ClientEmail).HasMaxLength(100);

                entity.Property(e => e.ClientFirstName).HasMaxLength(50);

                entity.Property(e => e.ClientId).HasMaxLength(30);

                entity.Property(e => e.ClientLastName).HasMaxLength(100);

                entity.Property(e => e.MembershipName).HasMaxLength(150);

                entity.HasOne(d => d.ClientWebhook)
                    .WithMany(p => p.PushClientMembership)
                    .HasForeignKey(d => d.ClientWebhookId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PushClientMembership_ClientWebhook");
            });

            modelBuilder.Entity<PushClientSale>(entity =>
            {
                entity.Property(e => e.PurchasingClientId).HasMaxLength(30);

                entity.Property(e => e.SaleDateTime).HasColumnType("datetime");

                entity.Property(e => e.SoldByName).HasMaxLength(150);

                entity.Property(e => e.TotalAmountPaid).HasColumnType("money");

                entity.HasOne(d => d.ClientWebhook)
                    .WithMany(p => p.PushClientSale)
                    .HasForeignKey(d => d.ClientWebhookId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PushClientSale_ClientWebhook");
            });

            modelBuilder.Entity<PushClientSaleItem>(entity =>
            {
                entity.Property(e => e.AmountDiscounted).HasColumnType("money");

                entity.Property(e => e.AmountPaid).HasColumnType("money");

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.RecipientClientId).HasMaxLength(30);

                entity.Property(e => e.Type).HasMaxLength(100);

                entity.HasOne(d => d.PushClientSale)
                    .WithMany(p => p.PushClientSaleItem)
                    .HasForeignKey(d => d.PushClientSaleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PushClientSaleItem_PushClientSale");
            });

            modelBuilder.Entity<PushClientSalePayment>(entity =>
            {
                entity.Property(e => e.PaymentAmountPaid).HasColumnType("money");

                entity.Property(e => e.PaymentLastFour)
                    .HasMaxLength(4)
                    .IsUnicode(false);

                entity.Property(e => e.PaymentMethod).HasMaxLength(100);

                entity.Property(e => e.PaymentNotes).HasMaxLength(1000);

                entity.HasOne(d => d.PushClientSale)
                    .WithMany(p => p.PushClientSalePayment)
                    .HasForeignKey(d => d.PushClientSaleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PushClientSalePayment_PushClientSale");
            });

            modelBuilder.Entity<PushSiteClass>(entity =>
            {
                entity.Property(e => e.AssistantOneName).HasMaxLength(50);

                entity.Property(e => e.AssistantTwoName).HasMaxLength(50);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.EndDateTime).HasColumnType("datetime");

                entity.Property(e => e.IsCancelled).HasDefaultValueSql("((0))");

                entity.Property(e => e.IsIntendedForOnlineViewing).HasDefaultValueSql("((0))");

                entity.Property(e => e.IsStaffAsubstitute).HasColumnName("IsStaffASubstitute");

                entity.Property(e => e.IsSynced).HasDefaultValueSql("((0))");

                entity.Property(e => e.IsWaitlistAvailable).HasDefaultValueSql("((0))");

                entity.Property(e => e.StaffName).HasMaxLength(50);

                entity.Property(e => e.StartDateTime).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.ClientWebhook)
                    .WithMany(p => p.PushSiteClass)
                    .HasForeignKey(d => d.ClientWebhookId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PushSiteClass_ClientWebhook");
            });

            modelBuilder.Entity<PushSiteClassDescription>(entity =>
            {
                entity.HasKey(e => e.PushSiteClassDescriptionId);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.IsSynced).HasDefaultValueSql("((0))");

                entity.Property(e => e.Name).HasMaxLength(200);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.ClientWebhook)
                    .WithMany(p => p.PushSiteClassDescription)
                    .HasForeignKey(d => d.ClientWebhookId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PushSiteClassDescription_ClientWebhook");
            });

            modelBuilder.Entity<PushSiteClassResource>(entity =>
            {
                entity.HasKey(e => e.PushSiteClassResourceId)
                    .HasName("PK_PushClassResource");

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.Name).HasMaxLength(150);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.PushSiteClass)
                    .WithMany(p => p.PushSiteClassResource)
                    .HasForeignKey(d => d.PushSiteClassId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PushSiteClassResource_PushSiteClass");
            });

            modelBuilder.Entity<PushSiteClassSchedule>(entity =>
            {
                entity.Property(e => e.AssistantOneName).HasMaxLength(50);

                entity.Property(e => e.AssistantTwoName).HasMaxLength(50);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.EndDate).HasColumnType("datetime");

                entity.Property(e => e.EndTime).HasColumnType("datetime");

                entity.Property(e => e.IsActive).HasDefaultValueSql("((0))");

                entity.Property(e => e.IsSynced).HasDefaultValueSql("((0))");

                entity.Property(e => e.StaffName).HasMaxLength(50);

                entity.Property(e => e.StartDate).HasColumnType("datetime");

                entity.Property(e => e.StartTime).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.ClientWebhook)
                    .WithMany(p => p.PushSiteClassSchedule)
                    .HasForeignKey(d => d.ClientWebhookId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PushSiteClassSchedule_ClientWebhook");
            });

            modelBuilder.Entity<PushSiteClassScheduleDow>(entity =>
            {
                entity.ToTable("PushSiteClassScheduleDOW");

                entity.Property(e => e.PushSiteClassScheduleDowid).HasColumnName("PushSiteClassScheduleDOWId");

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.Day)
                    .HasMaxLength(10)
                    .IsUnicode(false);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.PushSiteClassSchedule)
                    .WithMany(p => p.PushSiteClassScheduleDow)
                    .HasForeignKey(d => d.PushSiteClassScheduleId)
                    .HasConstraintName("FK_PushSiteClassScheduleDOW_PushSiteClassSchedule");
            });

            modelBuilder.Entity<PushSiteLocation>(entity =>
            {
                entity.Property(e => e.PushSiteLocationId).ValueGeneratedNever();

                entity.Property(e => e.AddressLine1).HasMaxLength(100);

                entity.Property(e => e.AddressLine2).HasMaxLength(100);

                entity.Property(e => e.City).HasMaxLength(50);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.Description).HasMaxLength(100);

                entity.Property(e => e.HasClasses).HasDefaultValueSql("((0))");

                entity.Property(e => e.IsSynced).HasDefaultValueSql("((0))");

                entity.Property(e => e.Latitude).HasColumnType("decimal(11, 8)");

                entity.Property(e => e.Longitude).HasColumnType("decimal(11, 8)");

                entity.Property(e => e.Name).HasMaxLength(50);

                entity.Property(e => e.Phone).HasMaxLength(50);

                entity.Property(e => e.PhoneExtension).HasMaxLength(50);

                entity.Property(e => e.PostalCode).HasMaxLength(15);

                entity.Property(e => e.State).HasMaxLength(50);

                entity.Property(e => e.Tax1).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Tax2).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Tax3).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Tax4).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Tax5).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.TimeStamp)
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.Property(e => e.WebColor5).HasMaxLength(15);

                entity.HasOne(d => d.ClientWebhook)
                    .WithMany(p => p.PushSiteLocation)
                    .HasForeignKey(d => d.ClientWebhookId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_PushSiteLocation_ClientWebhook");
            });

            modelBuilder.Entity<PushSiteStaff>(entity =>
            {
                entity.Property(e => e.AddressLine1).HasMaxLength(50);

                entity.Property(e => e.AddressLine2).HasMaxLength(50);

                entity.Property(e => e.AlwaysAllowDoubleBooking).HasDefaultValueSql("((0))");

                entity.Property(e => e.City).HasMaxLength(50);

                entity.Property(e => e.Country).HasMaxLength(50);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.Gender)
                    .HasMaxLength(6)
                    .IsUnicode(false);

                entity.Property(e => e.ImageUrl).HasMaxLength(1000);

                entity.Property(e => e.IsIndependentContractor).HasDefaultValueSql("((0))");

                entity.Property(e => e.IsSynced).HasDefaultValueSql("((0))");

                entity.Property(e => e.PostalCode).HasMaxLength(15);

                entity.Property(e => e.StaffFirstName).HasMaxLength(100);

                entity.Property(e => e.StaffLastName).HasMaxLength(150);

                entity.Property(e => e.State).HasMaxLength(50);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.ClientWebhook)
                    .WithMany(p => p.PushSiteStaff)
                    .HasForeignKey(d => d.ClientWebhookId)
                    .HasConstraintName("FK_PushSiteStaff_ClientWebhook");
            });

            modelBuilder.Entity<Recipient>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.EmailAddress).HasMaxLength(150);

                entity.Property(e => e.MobilePhone).HasMaxLength(100);

                entity.Property(e => e.Name).HasMaxLength(100);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.SentItem)
                    .WithMany(p => p.Recipient)
                    .HasForeignKey(d => d.SentItemId)
                    .HasConstraintName("FK_Recipient_SentItem");
            });

            modelBuilder.Entity<ReferralType>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();
            });

            modelBuilder.Entity<Scan>(entity =>
            {
                entity.Property(e => e.Ac)
                    .HasColumnName("AC")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Amc)
                    .HasColumnName("AMC")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Bcm)
                    .HasColumnName("BCM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Bfm)
                    .HasColumnName("BFM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Bfmcontrol)
                    .HasColumnName("BFMControl")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.BfmleftArm)
                    .HasColumnName("BFMLeftArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.BfmleftLeg)
                    .HasColumnName("BFMLeftLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.BfmpercLeftArm)
                    .HasColumnName("BFMPercLeftArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.BfmpercLeftLeg)
                    .HasColumnName("BFMPercLeftLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.BfmpercRightArm)
                    .HasColumnName("BFMPercRightArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.BfmpercRightLeg)
                    .HasColumnName("BFMPercRightLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.BfmpercTrunk)
                    .HasColumnName("BFMPercTrunk")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.BfmrightArm)
                    .HasColumnName("BFMRightArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.BfmrightLeg)
                    .HasColumnName("BFMRightLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Bfmtrunk)
                    .HasColumnName("BFMTrunk")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Bmc)
                    .HasColumnName("BMC")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Bmi)
                    .HasColumnName("BMI")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Bmr)
                    .HasColumnName("BMR")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Diastolic).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ecw)
                    .HasColumnName("ECW")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ecwtbw)
                    .HasColumnName("ECWTBW")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ffm)
                    .HasColumnName("FFM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ffmcontrol)
                    .HasColumnName("FFMControl")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.FfmleftArm)
                    .HasColumnName("FFMLeftArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.FfmleftLeg)
                    .HasColumnName("FFMLeftLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.FfmpercLeftArm)
                    .HasColumnName("FFMPercLeftArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.FfmpercLeftLeg)
                    .HasColumnName("FFMPercLeftLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.FfmpercRightArm)
                    .HasColumnName("FFMPercRightArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.FfmpercRightLeg)
                    .HasColumnName("FFMPercRightLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.FfmpercTrunk)
                    .HasColumnName("FFMPercTrunk")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.FfmrightArm)
                    .HasColumnName("FFMRightArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.FfmrightLeg)
                    .HasColumnName("FFMRightLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ffmtrunk)
                    .HasColumnName("FFMTrunk")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.GrowthScore).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Height).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Icw)
                    .HasColumnName("ICW")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.InBodyScore).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llbcm)
                    .HasColumnName("LLBCM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llbfm)
                    .HasColumnName("LLBFM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llbmc)
                    .HasColumnName("LLBMC")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llbmi)
                    .HasColumnName("LLBMI")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llecw)
                    .HasColumnName("LLECW")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llffm)
                    .HasColumnName("LLFFM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.LlffmleftArm)
                    .HasColumnName("LLFFMLeftArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.LlffmleftLeg)
                    .HasColumnName("LLFFMLeftLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.LlffmrightArm)
                    .HasColumnName("LLFFMRightArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.LlffmrightLeg)
                    .HasColumnName("LLFFMRightLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llffmtrunk)
                    .HasColumnName("LLFFMTrunk")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llicw)
                    .HasColumnName("LLICW")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llminerals)
                    .HasColumnName("LLMinerals")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.LlobesityDegree)
                    .HasColumnName("LLObesityDegree")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.LlobesityDegreeChildNormalRange)
                    .HasColumnName("LLObesityDegreeChildNormalRange")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llpbf)
                    .HasColumnName("LLPBF")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llprotein)
                    .HasColumnName("LLProtein")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llslm)
                    .HasColumnName("LLSLM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llsmm)
                    .HasColumnName("LLSMM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Lltbw)
                    .HasColumnName("LLTBW")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.LlweightNormalRange)
                    .HasColumnName("LLWeightNormalRange")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Llwhr)
                    .HasColumnName("LLWHR")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Mcabdomen)
                    .HasColumnName("MCAbdomen")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Mcchest)
                    .HasColumnName("MCChest")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Mchip)
                    .HasColumnName("MCHip")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.McleftArm)
                    .HasColumnName("MCLeftArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.McleftThigh)
                    .HasColumnName("MCLeftThigh")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Mcneck)
                    .HasColumnName("MCNeck")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.McrightArm)
                    .HasColumnName("MCRightArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.McrightThigh)
                    .HasColumnName("MCRightThigh")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.MeanArteryPressure).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Minerals).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.MobileNumber)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.ObesityDegree).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.ObesityDegreeChild).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Pbf)
                    .HasColumnName("PBF")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Protein).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Pulse).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.PulsePressure).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.RatePressureProduct).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Slm)
                    .HasColumnName("SLM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Smi)
                    .HasColumnName("SMI")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Smm)
                    .HasColumnName("SMM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Systolic).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.TargetWeight).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Tbw)
                    .HasColumnName("TBW")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.TestDateTime).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.Property(e => e.Ulbcm)
                    .HasColumnName("ULBCM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulbfm)
                    .HasColumnName("ULBFM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulbmc)
                    .HasColumnName("ULBMC")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulbmi)
                    .HasColumnName("ULBMI")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulecw)
                    .HasColumnName("ULECW")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulffm)
                    .HasColumnName("ULFFM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.UlffmleftArm)
                    .HasColumnName("ULFFMLeftArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.UlffmleftLeg)
                    .HasColumnName("ULFFMLeftLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.UlffmrightArm)
                    .HasColumnName("ULFFMRightArm")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.UlffmrightLeg)
                    .HasColumnName("ULFFMRightLeg")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulffmtrunk)
                    .HasColumnName("ULFFMTrunk")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulicw)
                    .HasColumnName("ULICW")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulminerals)
                    .HasColumnName("ULMinerals")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.UlobesityDegree)
                    .HasColumnName("ULObesityDegree")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.UlobesityDegreeChildNormalRange)
                    .HasColumnName("ULObesityDegreeChildNormalRange")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulpbf)
                    .HasColumnName("ULPBF")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulprotein)
                    .HasColumnName("ULProtein")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulslm)
                    .HasColumnName("ULSLM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulsmm)
                    .HasColumnName("ULSMM")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ultbw)
                    .HasColumnName("ULTBW")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.UlweightNormalRange)
                    .HasColumnName("ULWeightNormalRange")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Ulwhr)
                    .HasColumnName("ULWHR")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Vfl).HasColumnName("VFL");

                entity.Property(e => e.Weight).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.WeightControl).HasColumnType("numeric(8, 2)");

                entity.Property(e => e.Whr)
                    .HasColumnName("WHR")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._500kHzLaimpedance)
                    .HasColumnName("500kHzLAImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._500kHzLlimpedance)
                    .HasColumnName("500kHzLLImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._500kHzRaimpedance)
                    .HasColumnName("500kHzRAImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._500kHzRlimpedance)
                    .HasColumnName("500kHzRLImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._500kHzTrimpedance)
                    .HasColumnName("500kHzTRImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._50kHzLaimpedance)
                    .HasColumnName("50kHzLAImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._50kHzLlimpedance)
                    .HasColumnName("50kHzLLImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._50kHzRaimpedance)
                    .HasColumnName("50kHzRAImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._50kHzRlimpedance)
                    .HasColumnName("50kHzRLImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._50kHzTrimpedance)
                    .HasColumnName("50kHzTRImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._5kHzLaimpedance)
                    .HasColumnName("5kHzLAImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._5kHzLlimpedance)
                    .HasColumnName("5kHzLLImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._5kHzRaimpedance)
                    .HasColumnName("5kHzRAImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._5kHzRlimpedance)
                    .HasColumnName("5kHzRLImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.Property(e => e._5kHzTrimpedance)
                    .HasColumnName("5kHzTRImpedance")
                    .HasColumnType("numeric(8, 2)");

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.ScanCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ScanUserCreated");

                entity.HasOne(d => d.Gender)
                    .WithMany(p => p.Scan)
                    .HasForeignKey(d => d.GenderId)
                    .HasConstraintName("FK_ScanGender");

                entity.HasOne(d => d.Member)
                    .WithMany(p => p.Scan)
                    .HasForeignKey(d => d.MemberId)
                    .HasConstraintName("FK_ScanMember");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.ScanModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_ScanUserModified");

                entity.HasOne(d => d.ScansImport)
                    .WithMany(p => p.Scan)
                    .HasForeignKey(d => d.ScansImportId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ScanImport");
            });

            modelBuilder.Entity<ScanImage>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.ChallengeMember)
                    .WithMany(p => p.ScanImage)
                    .HasForeignKey(d => d.ChallengeMemberId)
                    .HasConstraintName("FK_ScanImageChallengeMember");

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.ScanImageCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ScanImageUserCreated");

                entity.HasOne(d => d.Member)
                    .WithMany(p => p.ScanImage)
                    .HasForeignKey(d => d.MemberId)
                    .HasConstraintName("FK_ScanImageMember");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.ScanImageModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_ScanImageUserModified");
            });

            modelBuilder.Entity<Scanner>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.PurchaseDate).HasColumnType("date");

                entity.Property(e => e.ScannerName)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.SerialNo).HasMaxLength(50);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.ScannerCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ScannerUserCreated");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.ScannerModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_ScannerUserModified");
            });

            modelBuilder.Entity<ScansImport>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.ImportDate).HasColumnType("datetime");

                entity.Property(e => e.ImportedFileName)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.ScansImportCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ScanImportUserCreated");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.ScansImportModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_ScanImportUserModified");

                entity.HasOne(d => d.Scanner)
                    .WithMany(p => p.ScansImport)
                    .HasForeignKey(d => d.ScannerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ScanImportScanner");
            });

            modelBuilder.Entity<ScoringSystem>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Description)
                    .IsRequired()
                    .HasMaxLength(200);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();
            });

            modelBuilder.Entity<SentItem>(entity =>
            {
                entity.Property(e => e.BodyContentType).HasMaxLength(4);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Subject).HasMaxLength(50);

                entity.Property(e => e.TimeStamp)
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.MessageType)
                    .WithMany(p => p.SentItem)
                    .HasForeignKey(d => d.MessageTypeId)
                    .HasConstraintName("FK_SendItem_MessageType");

                entity.HasOne(d => d.SenderUser)
                    .WithMany(p => p.SentItem)
                    .HasForeignKey(d => d.SenderUserId)
                    .HasConstraintName("FK_SentItem_AppUser");

                entity.HasOne(d => d.Studio)
                    .WithMany(p => p.SentItem)
                    .HasForeignKey(d => d.StudioId)
                    .HasConstraintName("FK_SendItem_Studio");
            });

            modelBuilder.Entity<ShirtSize>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Description)
                    .HasMaxLength(20)
                    .IsUnicode(false);

                entity.Property(e => e.ShortDescription)
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .IsFixedLength();

                entity.Property(e => e.TimeStamp)
                    .IsRowVersion()
                    .IsConcurrencyToken();
            });

            modelBuilder.Entity<ShoppingCart>(entity =>
            {
                entity.HasKey(e => e.ShoppingCartId);

                entity.Property(e => e.ClientId)
                    .IsRequired()
                    .HasMaxLength(30);

                entity.Property(e => e.DiscountTotal).HasColumnType("money");

                entity.Property(e => e.GrandTotal).HasColumnType("money");

                entity.Property(e => e.Id)
                    .IsRequired()
                    .HasMaxLength(50);

                entity.Property(e => e.SubTotal).HasColumnType("money");

                entity.Property(e => e.TaxTotal).HasColumnType("money");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.Property(e => e.TransactionDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<SmsSetting>(entity =>
            {
                entity.Property(e => e.AccountSid)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.AuthToken)
                    .IsRequired()
                    .HasMaxLength(100);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Number)
                    .IsRequired()
                    .HasMaxLength(20);

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.SmsSettingCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SmsSetting_AppUserCreated");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.SmsSettingModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_SmsSetting_AppUserModified");

                entity.HasOne(d => d.Studio)
                    .WithMany(p => p.SmsSetting)
                    .HasForeignKey(d => d.StudioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_SmsSetting_SmsSetting");
            });

            modelBuilder.Entity<Staff>(entity =>
            {
                entity.HasKey(e => e.StaffId);

                entity.Property(e => e.Address).HasMaxLength(150);

                entity.Property(e => e.City).HasMaxLength(100);

                entity.Property(e => e.Country).HasMaxLength(100);

                entity.Property(e => e.Email).HasMaxLength(100);

                entity.Property(e => e.FirstName).HasMaxLength(100);

                entity.Property(e => e.HomePhone).HasMaxLength(100);

                entity.Property(e => e.ImageUrl).HasMaxLength(500);

                entity.Property(e => e.LastName).HasMaxLength(100);

                entity.Property(e => e.MobilePhone).HasMaxLength(100);

                entity.Property(e => e.PostalCode).HasMaxLength(100);

                entity.Property(e => e.State).HasMaxLength(100);

                entity.Property(e => e.WorkPhone).HasMaxLength(100);
            });

            modelBuilder.Entity<Studio>(entity =>
            {
                entity.Property(e => e.ActivationCode).HasMaxLength(150);

                entity.Property(e => e.ActivationLink).HasMaxLength(250);

                entity.Property(e => e.ContactNumber).HasMaxLength(20);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.Email).HasMaxLength(40);

                entity.Property(e => e.Postcode).HasMaxLength(10);

                entity.Property(e => e.StudioName).HasMaxLength(5);

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.Property(e => e.TimeZoneId).HasMaxLength(255);
            });

            modelBuilder.Entity<SyncLog>(entity =>
            {
                entity.Property(e => e.SyncLogId).ValueGeneratedNever();

                entity.Property(e => e.DateSynced).HasColumnType("datetime");

                entity.Property(e => e.MbsiteId).HasColumnName("MBSiteId");
            });

            modelBuilder.Entity<StudioScanner>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.StudioScannerCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_StudioScannerUserCreated");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.StudioScannerModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_StudioScannerUserModified");

                entity.HasOne(d => d.Scanner)
                    .WithMany(p => p.StudioScanner)
                    .HasForeignKey(d => d.ScannerId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_StudioScannerScanner");

                entity.HasOne(d => d.Studio)
                    .WithMany(p => p.StudioScanner)
                    .HasForeignKey(d => d.StudioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_StudioScannerStudio");
            });

            modelBuilder.Entity<StudioUser>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.AppUser)
                    .WithMany(p => p.StudioUserAppUser)
                    .HasForeignKey(d => d.AppUserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_StudioUserUser");

                entity.HasOne(d => d.CreatedBy)
                    .WithMany(p => p.StudioUserCreatedBy)
                    .HasForeignKey(d => d.CreatedById)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_StudioUserUserCreated");

                entity.HasOne(d => d.ModifiedBy)
                    .WithMany(p => p.StudioUserModifiedBy)
                    .HasForeignKey(d => d.ModifiedById)
                    .HasConstraintName("FK_StudioUserUserModified");

                entity.HasOne(d => d.Studio)
                    .WithMany(p => p.StudioUser)
                    .HasForeignKey(d => d.StudioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_StudioUserStudio");
            });

            modelBuilder.Entity<TrainingGymUser>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.AppUser)
                    .WithMany(p => p.TrainingGymUser)
                    .HasForeignKey(d => d.AppUserId)
                    .HasConstraintName("FK_TrainingGymUser_AppUser");

                entity.HasOne(d => d.GlobalTrainingGym)
                    .WithMany(p => p.TrainingGymUser)
                    .HasForeignKey(d => d.GlobalTrainingGymId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_TrainingGymUser_GlobalTrainingGym");
            });

            modelBuilder.Entity<ValidateVisit>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.FromDateValidation).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.Property(e => e.ToDateValidation).HasColumnType("datetime");

                entity.HasOne(d => d.Studio)
                    .WithMany(p => p.ValidateVisit)
                    .HasForeignKey(d => d.StudioId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_ValidateVisit_Studio");
            });

            modelBuilder.Entity<VisitAchievement>(entity =>
            {
                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.HasOne(d => d.Studio)
                    .WithMany(p => p.VisitAchievement)
                    .HasForeignKey(d => d.StudioId)
                    .HasConstraintName("FK_VisitAchievement_Studio");
            });

            modelBuilder.Entity<VwChallegeScans>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vwChallegeScans");

                entity.Property(e => e.DisplayName).HasMaxLength(255);

                entity.Property(e => e.EndTestDate).HasColumnType("datetime");

                entity.Property(e => e.MidTestDate).HasColumnType("datetime");

                entity.Property(e => e.StartTestDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<VwChallegeScansBillable>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vwChallegeScansBillable");

                entity.Property(e => e.TestDateTime).HasColumnType("datetime");
            });

            modelBuilder.Entity<VwChallengeAppointment>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vwChallengeAppointment");

                entity.Property(e => e.TypeDescription).HasMaxLength(10);
            });

            modelBuilder.Entity<VwChallengeMembers>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vwChallengeMembers");

                entity.Property(e => e.DisplayName).HasMaxLength(255);

                entity.Property(e => e.EndDate).HasColumnType("date");

                entity.Property(e => e.EndScanFromDate).HasColumnType("date");

                entity.Property(e => e.EndScanToDate).HasColumnType("date");

                entity.Property(e => e.Mbid)
                    .HasColumnName("MBId")
                    .HasMaxLength(30);

                entity.Property(e => e.MbuniqueId).HasColumnName("MBUniqueId");

                entity.Property(e => e.MidScanFromDate).HasColumnType("date");

                entity.Property(e => e.MidScanToDate).HasColumnType("date");

                entity.Property(e => e.StartDate).HasColumnType("date");

                entity.Property(e => e.StartScanFromDate).HasColumnType("date");

                entity.Property(e => e.StartScanToDate).HasColumnType("date");
            });

            modelBuilder.Entity<VwChallengeMembersEndScans>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vwChallengeMembersEndScans");
            });

            modelBuilder.Entity<VwChallengeMembersMidScans>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vwChallengeMembersMidScans");
            });

            modelBuilder.Entity<VwChallengeMembersStartScans>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vwChallengeMembersStartScans");
            });

            modelBuilder.Entity<VwClasses>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vwClasses");

                entity.Property(e => e.BookingStatus).HasMaxLength(150);

                entity.Property(e => e.BookingWindowDailyEndTime).HasColumnType("datetime");

                entity.Property(e => e.BookingWindowDailyStartTime).HasColumnType("datetime");

                entity.Property(e => e.BookingWindowEndDateTime).HasColumnType("datetime");

                entity.Property(e => e.BookingWindowStartDateTime).HasColumnType("datetime");

                entity.Property(e => e.ClassName).HasMaxLength(150);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.EndDateTime).HasColumnType("datetime");

                entity.Property(e => e.LastModifiedDateTime).HasColumnType("datetime");

                entity.Property(e => e.MbclassDescriptionId).HasColumnName("MBClassDescriptionId");

                entity.Property(e => e.MbclassScheduleId).HasColumnName("MBClassScheduleId");

                entity.Property(e => e.MblocationId).HasColumnName("MBLocationId");

                entity.Property(e => e.MbresourceId).HasColumnName("MBResourceId");

                entity.Property(e => e.MbstaffId).HasColumnName("MBStaffId");

                entity.Property(e => e.ScclassId).HasColumnName("SCClassId");

                entity.Property(e => e.StaffName).HasMaxLength(150);

                entity.Property(e => e.StartDateTime).HasColumnType("datetime");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.Property(e => e.VirtualStreamLink).HasMaxLength(1000);
            });

            modelBuilder.Entity<VwIndividualScans>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vwIndividualScans");

                entity.Property(e => e.DisplayName).HasMaxLength(255);

                entity.Property(e => e.TestDateTime).HasColumnType("datetime");
            });

            modelBuilder.Entity<VwIndividualScansBillable>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vwIndividualScansBillable");

                entity.Property(e => e.TestDateTime).HasColumnType("datetime");
            });

            modelBuilder.Entity<VwProductDropDownList>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vwProductDropDownList");

                entity.Property(e => e.DisplayName).HasMaxLength(247);

                entity.Property(e => e.Name).HasMaxLength(100);
            });

            modelBuilder.Entity<VwScanBillable>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vwScanBillable");

                entity.Property(e => e.DisplayName).HasMaxLength(255);
            });

            modelBuilder.Entity<VwScanForBilling>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vwScanForBilling");

                entity.Property(e => e.DisplayName).HasMaxLength(255);

                entity.Property(e => e.PaymentType)
                    .IsRequired()
                    .HasMaxLength(12)
                    .IsUnicode(false);

                entity.Property(e => e.TotalChallengeScanPrice).HasColumnType("money");

                entity.Property(e => e.TotalIndividualScanPrice).HasColumnType("money");
            });

            modelBuilder.Entity<VwScans>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vwScans");

                entity.Property(e => e.DisplayName).HasMaxLength(255);

                entity.Property(e => e.EndInBodyTotal).HasColumnType("numeric(9, 2)");

                entity.Property(e => e.EndPbftotal)
                    .HasColumnName("EndPBFTotal")
                    .HasColumnType("numeric(24, 11)");

                entity.Property(e => e.EndSmmtotal)
                    .HasColumnName("EndSMMTotal")
                    .HasColumnType("numeric(26, 11)");

                entity.Property(e => e.EndVfltotal).HasColumnName("EndVFLTotal");

                entity.Property(e => e.EndWeightTotal).HasColumnType("numeric(24, 11)");

                entity.Property(e => e.Gender).HasMaxLength(50);

                entity.Property(e => e.MidInBodyTotal).HasColumnType("numeric(9, 2)");

                entity.Property(e => e.MidPbftotal)
                    .HasColumnName("MidPBFTotal")
                    .HasColumnType("numeric(24, 11)");

                entity.Property(e => e.MidSmmtotal)
                    .HasColumnName("MidSMMTotal")
                    .HasColumnType("numeric(26, 11)");

                entity.Property(e => e.MidVfltotal).HasColumnName("MidVFLTotal");

                entity.Property(e => e.MidWeightTotal).HasColumnType("numeric(24, 11)");
            });

            modelBuilder.Entity<VwVisits>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vwVisits");

                entity.Property(e => e.ClientId).HasMaxLength(30);

                entity.Property(e => e.Description).HasMaxLength(150);

                entity.Property(e => e.DisplayName).HasMaxLength(255);

                entity.Property(e => e.EndDateTime).HasColumnType("datetime");

                entity.Property(e => e.LateCancelled).HasMaxLength(10);

                entity.Property(e => e.PaymentInfo).HasMaxLength(255);

                entity.Property(e => e.SignedIn).HasMaxLength(10);

                entity.Property(e => e.StartDateTime).HasColumnType("datetime");

                entity.Property(e => e.Status)
                    .IsRequired()
                    .HasMaxLength(11)
                    .IsUnicode(false);

                entity.Property(e => e.Teacher).HasMaxLength(201);

                entity.Property(e => e.Time)
                    .HasMaxLength(23)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<VwVisitsReport>(entity =>
            {
                entity.HasNoKey();

                entity.ToView("vwVisitsReport");

                entity.Property(e => e.ClientId)
                    .HasColumnName("clientId")
                    .HasMaxLength(30);

                entity.Property(e => e.DisplayName).HasMaxLength(255);
            });

            modelBuilder.Entity<WeightedSystem>(entity =>
            {
                entity.Property(e => e.Category)
                    .IsRequired()
                    .HasMaxLength(255);

                entity.Property(e => e.DateCreated).HasColumnType("datetime");

                entity.Property(e => e.DateModified).HasColumnType("datetime");

                entity.Property(e => e.LowerRange).HasColumnType("decimal(5, 2)");

                entity.Property(e => e.LowerRangeWeighted).HasColumnType("decimal(5, 2)");

                entity.Property(e => e.MidRange).HasColumnType("decimal(5, 2)");

                entity.Property(e => e.MidRangeWeighted).HasColumnType("decimal(5, 2)");

                entity.Property(e => e.TimeStamp)
                    .IsRequired()
                    .IsRowVersion()
                    .IsConcurrencyToken();

                entity.Property(e => e.UpperRange).HasColumnType("decimal(5, 2)");

                entity.Property(e => e.UpperRangeWeighted).HasColumnType("decimal(5, 2)");

                entity.HasOne(d => d.GlobalTrainingGym)
                    .WithMany(p => p.WeightedSystem)
                    .HasForeignKey(d => d.GlobalTrainingGymId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_WeightedSystem_GlobalTrainingGym");
            });

            base.OnModelCreating(modelBuilder);
        } 

        public int SaveChanges(string username)
        {
            this.ChangeTracker.DetectChanges();
            List<AuditLogEntry> auditEntries = new List<AuditLogEntry>();
            foreach (EntityEntry entry in this.ChangeTracker.Entries())
            {
                if (entry.Entity is AuditLog || entry.State == EntityState.Detached || entry.State == EntityState.Unchanged)
                {
                    continue;
                }
                var auditEntry = new AuditLogEntry(entry, username);
                auditEntries.Add(auditEntry);
            }

            if (auditEntries.Any())
            {
                var logs = auditEntries.Select(x => x.ToAuditLog());
                this.AuditLog.AddRange(logs);
            }

            return base.SaveChanges();
        }

        public Task<int> SaveChangesAsync(string username, CancellationToken cancellationToken = new CancellationToken())
        {
            this.ChangeTracker.DetectChanges();
            List<AuditLogEntry> auditEntries = new List<AuditLogEntry>();
            foreach (EntityEntry entry in this.ChangeTracker.Entries())
            {
                if (entry.Entity is AuditLog || entry.State == EntityState.Detached || entry.State == EntityState.Unchanged)
                {
                    continue;
                }
                var auditEntry = new AuditLogEntry(entry, username);
                auditEntries.Add(auditEntry);
            }

            if (auditEntries.Any())
            {
                var logs = auditEntries.Select(x => x.ToAuditLog());
                this.AuditLog.AddRangeAsync(logs, cancellationToken);
            }

            return base.SaveChangesAsync(cancellationToken);
        }

        public IList<T> MapToList<T>(DbDataReader dr)
        {
            var objList = new List<T>();
            var props = typeof(T).GetRuntimeProperties();

            var colMapping = dr.GetColumnSchema()
                .Where(x => props.Any(y => y.Name.ToLower() == x.ColumnName.ToLower()))
                .ToDictionary(key => key.ColumnName.ToLower());

            if (dr.HasRows)
            {
                while (dr.Read())
                {
                    T obj = Activator.CreateInstance<T>();
                    foreach (var prop in props)
                    {
                        if (colMapping.Any(a => a.Key.ToLower() == prop.Name.ToLower()))
                        {
                            var val = dr.GetValue(colMapping[prop.Name.ToLower()].ColumnOrdinal.Value);
                            prop.SetValue(obj, val == DBNull.Value ? null : val);
                        }
                    }
                    objList.Add(obj);
                }
            }
            return objList;
        }

        //Stored Procedures

        public IList<MemberStudioViewModel> uspGetMemberStudio(string email)
        {
            try
            {

                using (var command = this.Database.GetDbConnection().CreateCommand())
                {
                    command.CommandTimeout = 9999;
                    command.CommandText = "[dbo].[uspGetMemberStudio]";
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.Add(new SqlParameter("@Email", SqlDbType.NVarChar) { Value = email });

                    this.Database.OpenConnection();

                    using (var result = command.ExecuteReader())
                    {
                        if (result.HasRows)
                        {
                            return this.MapToList<MemberStudioViewModel>(result);
                        }
                    }
                }

                return new List<MemberStudioViewModel>();
            }
            catch (Exception e)
            {
                return new List<MemberStudioViewModel>();
            }
        }
    }
}
