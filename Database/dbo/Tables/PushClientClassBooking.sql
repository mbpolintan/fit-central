﻿CREATE TABLE [dbo].[PushClientClassBooking] (
    [PushClientClassBookingId]      INT            IDENTITY (1, 1) NOT NULL,
    [ClientWebhookId]               INT            NOT NULL,
    [IsSynced]                      BIT            CONSTRAINT [DF_PushClientClassBooking_IsSynced] DEFAULT ((0)) NOT NULL,
    [SiteId]                        INT            NULL,
    [LocationId]                    INT            NULL,
    [ClassId]                       INT            NULL,
    [ClassRosterBookingId]          INT            NULL,
    [ClassStartDateTime]            DATETIME       NULL,
    [ClassEndDateTime]              DATETIME       NULL,
    [SignedInStatus]                NVARCHAR (20)  NULL,
    [StaffId]                       INT            NULL,
    [StaffName]                     NVARCHAR (150) NULL,
    [MaxCapacity]                   INT            NULL,
    [WebCapacity]                   INT            NULL,
    [TotalBooked]                   INT            NULL,
    [WebBooked]                     INT            NULL,
    [TotalWaitlisted]               INT            NULL,
    [ClientId]                      NVARCHAR (30)  NULL,
    [ClientUniqueId]                INT            NULL,
    [ClientFirstName]               NVARCHAR (50)  NULL,
    [ClientLastName]                NVARCHAR (100) NULL,
    [ClientEmail]                   NVARCHAR (100) NULL,
    [ClientPhone]                   NVARCHAR (100) NULL,
    [ClientPassId]                  NVARCHAR (30)  NULL,
    [ClientPassSessionsTotal]       INT            NULL,
    [ClientPassSessionsDeducted]    INT            NULL,
    [ClientPassSessionsRemaining]   INT            NULL,
    [ClientPassActivationDateTime]  DATETIME       NULL,
    [ClientPassExpirationDateTime]  DATETIME       NULL,
    [BookingOriginatedFromWaitlist] BIT            NULL,
    [ClientsNumberOfVisitsAtSite]   INT            NULL,
    [ItemId]                        INT            NULL,
    [ItemName]                      NVARCHAR (150) NULL,
    [ItemSiteId]                    INT            NULL,
    CONSTRAINT [PK_PushClientClassBooking] PRIMARY KEY CLUSTERED ([PushClientClassBookingId] ASC),
    CONSTRAINT [FK_PushClientClassBooking_ClientWebhook] FOREIGN KEY ([ClientWebhookId]) REFERENCES [dbo].[ClientWebhook] ([ClientWebhookId])
);

