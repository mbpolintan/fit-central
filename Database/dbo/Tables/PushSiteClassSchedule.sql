﻿CREATE TABLE [dbo].[PushSiteClassSchedule] (
    [PushSiteClassScheduleId] INT           IDENTITY (1, 1) NOT NULL,
    [ClientWebhookId]         INT           NOT NULL,
    [IsSynced]                BIT           CONSTRAINT [DF_PushSiteClassSchedule_IsSynced] DEFAULT ((0)) NULL,
    [SiteId]                  INT           NULL,
    [LocationId]              INT           NULL,
    [ClassScheduleId]         INT           NULL,
    [ClassDescriptionId]      INT           NULL,
    [MaxCapacity]             INT           NULL,
    [WebCapacity]             INT           NULL,
    [StaffId]                 INT           NULL,
    [StaffName]               NVARCHAR (50) NULL,
    [IsActive]                BIT           CONSTRAINT [DF_PushSiteClassSchedule_IsActive] DEFAULT ((0)) NULL,
    [StartDate]               DATETIME      NULL,
    [EndDate]                 DATETIME      NULL,
    [StartTime]               DATETIME      NULL,
    [EndTime]                 DATETIME      NULL,
    [AssistantOneId]          INT           NULL,
    [AssistantOneName]        NVARCHAR (50) NULL,
    [AssistantTwoId]          INT           NULL,
    [AssistantTwoName]        NVARCHAR (50) NULL,
    [DateCreated]             DATETIME      NULL,
    [TimeStamp]               ROWVERSION    NOT NULL,
    CONSTRAINT [PK_PushClassSchedule] PRIMARY KEY CLUSTERED ([PushSiteClassScheduleId] ASC),
    CONSTRAINT [FK_PushSiteClassSchedule_ClientWebhook] FOREIGN KEY ([ClientWebhookId]) REFERENCES [dbo].[ClientWebhook] ([ClientWebhookId])
);

