﻿CREATE TABLE [dbo].[PushSiteClass] (
    [PushSiteClassId]            INT           IDENTITY (1, 1) NOT NULL,
    [ClientWebhookId]            INT           NOT NULL,
    [IsSynced]                   BIT           CONSTRAINT [DF_PushSiteClass_IsSynced] DEFAULT ((0)) NULL,
    [SiteId]                     INT           NULL,
    [LocationId]                 INT           NULL,
    [ClassId]                    INT           NULL,
    [ClassScheduleId]            INT           NULL,
    [IsCancelled]                BIT           CONSTRAINT [DF_PushSiteClass_IsCancelled] DEFAULT ((0)) NULL,
    [IsStaffASubstitute]         BIT           NULL,
    [IsWaitlistAvailable]        BIT           CONSTRAINT [DF_PushSiteClass_IsWaitlistAvailable] DEFAULT ((0)) NULL,
    [IsIntendedForOnlineViewing] BIT           CONSTRAINT [DF_PushSiteClass_IsIntendedForOnlineViewing] DEFAULT ((0)) NULL,
    [StaffId]                    INT           NULL,
    [StaffName]                  NVARCHAR (50) NULL,
    [StartDateTime]              DATETIME      NULL,
    [EndDateTime]                DATETIME      NULL,
    [ClassDescriptionId]         INT           NULL,
    [AssistantOneId]             INT           NULL,
    [AssistantOneName]           NVARCHAR (50) NULL,
    [AssistantTwoId]             INT           NULL,
    [AssistantTwoName]           NVARCHAR (50) NULL,
    [DateCreated]                DATETIME      NULL,
    [TimeStamp]                  ROWVERSION    NOT NULL,
    CONSTRAINT [PK_PushSiteClass] PRIMARY KEY CLUSTERED ([PushSiteClassId] ASC),
    CONSTRAINT [FK_PushSiteClass_ClientWebhook] FOREIGN KEY ([ClientWebhookId]) REFERENCES [dbo].[ClientWebhook] ([ClientWebhookId])
);

