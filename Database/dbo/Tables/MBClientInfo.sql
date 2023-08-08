CREATE TABLE [dbo].[MBClientInfo] (
    [MBClientId]                       UNIQUEIDENTIFIER NOT NULL,
    [SiteId]                           INT              NOT NULL,
    [Id]                               NVARCHAR (30)    NULL,
    [UniqueId]                         INT              NULL,
    [FirstName]                        NVARCHAR (50)    NULL,
    [LastName]                         NVARCHAR (100)   NULL,
    [MiddleName]                       NVARCHAR (100)   NULL,
    [BirthDate]                        DATETIME         NULL,
    [Email]                            NVARCHAR (100)   NULL,
    [MobilePhone]                      NVARCHAR (100)   NULL,
    [MobileProvider]                   NVARCHAR (100)   NULL,
    [HomePhone]                        NVARCHAR (100)   NULL,
    [WorkPhone]                        NVARCHAR (100)   NULL,
    [AddressLine1]                     NVARCHAR (100)   NULL,
    [AddressLine2]                     NVARCHAR (100)   NULL,
    [City]                             NVARCHAR (100)   NULL,
    [PostalCode]                       NVARCHAR (100)   NULL,
    [State]                            NVARCHAR (100)   NULL,
    [Country]                          NVARCHAR (100)   NULL,
    [Gender]                           NVARCHAR (50)    NULL,
    [Active]                           BIT              NULL,
    [Status]                           NVARCHAR (20)    NULL,
    [Action]                           NVARCHAR (20)    NULL,
    [PhotoUrl]                         NVARCHAR (1000)  NULL,
    [CreationDate]                     DATETIME         NULL,
    [LastModifiedDateTime]             DATETIME         NULL,
    [SendAccountEmails]                BIT              CONSTRAINT [DF_MBClientInfo_SendAccountEmails] DEFAULT ((0)) NULL,
    [SendAccountTexts]                 BIT              CONSTRAINT [DF_MBClientInfo_SendAccountTexts] DEFAULT ((0)) NULL,
    [SendPromotionalEmails]            BIT              CONSTRAINT [DF_MBClientInfo_SendPromotionalEmails] DEFAULT ((0)) NULL,
    [SendPromotionalTexts]             BIT              CONSTRAINT [DF_MBClientInfo_SendPromotionalTexts] DEFAULT ((0)) NULL,
    [SendScheduleEmails]               BIT              CONSTRAINT [DF_MBClientInfo_SendScheduleEmails] DEFAULT ((0)) NULL,
    [SendScheduleTexts]                BIT              CONSTRAINT [DF_MBClientInfo_SendScheduleTexts] DEFAULT ((0)) NULL,
    [AppointmentGenderPreference]      NVARCHAR (50)    NULL,
    [FirstAppointmentDate]             DATETIME         NULL,
    [IsCompany]                        NVARCHAR (10)    NULL,
    [IsProspect]                       NVARCHAR (10)    NULL,
    [LiabilityRelease]                 NVARCHAR (10)    NULL,
    [MembershipIcon]                   INT              NULL,
    [Notes]                            NVARCHAR (MAX)   NULL,
    [RedAlert]                         NVARCHAR (MAX)   NULL,
    [YellowAlert]                      NVARCHAR (MAX)   NULL,
    [ReferredBy]                       NVARCHAR (100)   NULL,
    [EmergencyContactInfoName]         NVARCHAR (100)   NULL,
    [EmergencyContactInfoEmail]        NVARCHAR (100)   NULL,
    [EmergencyContactInfoPhone]        NVARCHAR (100)   NULL,
    [EmergencyContactInfoRelationship] NVARCHAR (100)   NULL,
    CONSTRAINT [PK_MBClientInfo] PRIMARY KEY CLUSTERED ([MBClientId] ASC)
);









