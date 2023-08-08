﻿CREATE TABLE [dbo].[PushSiteStaff] (
    [PushSiteStaffId]          INT             IDENTITY (1, 1) NOT NULL,
    [ClientWebhookId]          INT             NULL,
    [IsSynced]                 BIT             CONSTRAINT [DF_PushSiteStaff_IsSynced] DEFAULT ((0)) NULL,
    [StaffId]                  INT             NULL,
    [SiteId]                   INT             NULL,
    [AddressLine1]             NVARCHAR (50)   NULL,
    [AddressLine2]             NVARCHAR (50)   NULL,
    [StaffFirstName]           NVARCHAR (100)  NULL,
    [StaffLastName]            NVARCHAR (150)  NULL,
    [City]                     NVARCHAR (50)   NULL,
    [State]                    NVARCHAR (50)   NULL,
    [Country]                  NVARCHAR (50)   NULL,
    [PostalCode]               NVARCHAR (15)   NULL,
    [SortOrder]                INT             NULL,
    [IsIndependentContractor]  BIT             CONSTRAINT [DF_PushSiteStaff_IsIndependentContractor] DEFAULT ((0)) NULL,
    [AlwaysAllowDoubleBooking] BIT             CONSTRAINT [DF_PushSiteStaff_AlwaysAllowDoubleBooking] DEFAULT ((0)) NULL,
    [ImageUrl]                 NVARCHAR (1000) NULL,
    [Biography]                NVARCHAR (MAX)  NULL,
    [Gender]                   VARCHAR (6)     NULL,
    [DateCreated]              DATETIME        NULL,
    [TimeStamp]                ROWVERSION      NOT NULL,
    CONSTRAINT [PK_PushSiteStaff] PRIMARY KEY CLUSTERED ([PushSiteStaffId] ASC),
    CONSTRAINT [FK_PushSiteStaff_ClientWebhook] FOREIGN KEY ([ClientWebhookId]) REFERENCES [dbo].[ClientWebhook] ([ClientWebhookId])
);
