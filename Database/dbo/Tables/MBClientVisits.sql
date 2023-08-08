CREATE TABLE [dbo].[MBClientVisits] (
    [MBClientVisitId]               INT            IDENTITY (1, 1) NOT NULL,
    [Id]                            INT            NULL,
    [ClientId]                      NVARCHAR (30)  NULL,
    [ClientUniqueId]                INT            NULL,
    [ClassId]                       INT            NULL,
    [SiteId]                        INT            NULL,
    [LocationId]                    INT            NULL,
    [AppointmentId]                 INT            NULL,
    [ServiceId]                     INT            NULL,
    [ProductId]                     INT            NULL,
    [StaffId]                       INT            NULL,
    [StaffName]                     NVARCHAR (150) NULL,
    [AppointmentGenderPreference]   NVARCHAR (50)  NULL,
    [AppointmentStatus]             NVARCHAR (50)  NULL,
    [StartDateTime]                 DATETIME       NULL,
    [EndDateTime]                   DATETIME       NULL,
    [LastModifiedDateTime]          DATETIME       NULL,
    [LateCancelled]                 NVARCHAR (10)  NULL,
    [MakeUp]                        NVARCHAR (10)  NULL,
    [Name]                          NVARCHAR (150) NULL,
    [ServiceName]                   NVARCHAR (255) NULL,
    [SignedIn]                      NVARCHAR (10)  NULL,
    [WebSignup]                     NVARCHAR (10)  NULL,
    [Action]                        NVARCHAR (50)  NULL,
    [SignedInStatus]                NVARCHAR (20)  NULL,
    [MaxCapacity]                   INT            NULL,
    [WebCapacity]                   INT            NULL,
    [TotalBooked]                   INT            NULL,
    [WebBooked]                     INT            NULL,
    [TotalWaitlisted]               INT            NULL,
    [ClientPassId]                  NVARCHAR (MAX) NULL,
    [ClientPassSessionsTotal]       INT            NULL,
    [ClientPassSessionsDeducted]    INT            NULL,
    [ClientPassSessionsRemaining]   INT            NULL,
    [ClientPassActivationDateTime]  DATETIME       NULL,
    [ClientPassExpirationDateTime]  DATETIME       NULL,
    [BookingOriginatedFromWaitlist] BIT            NULL,
    [ClientsNumberOfVisitsAtSite]   INT            NULL,
    [ItemSiteId]                    INT            NULL,
    CONSTRAINT [PK_MBClientVisits] PRIMARY KEY CLUSTERED ([MBClientVisitId] ASC)
);







