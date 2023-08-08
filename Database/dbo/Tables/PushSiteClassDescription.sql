CREATE TABLE [dbo].[PushSiteClassDescription] (
    [PushSiteClassDescriptionId] INT            IDENTITY (1, 1) NOT NULL,
    [ClientWebhookId]            INT            NOT NULL,
    [IsSynced]                   BIT            CONSTRAINT [DF_PushSiteClassDescription_IsSynced] DEFAULT ((0)) NULL,
    [SiteId]                     INT            NULL,
    [Id]                         INT            NULL,
    [Name]                       NVARCHAR (200) NULL,
    [Description]                NVARCHAR (MAX) NULL,
    [DateCreated]                DATETIME       NULL,
    [TimeStamp]                  ROWVERSION     NOT NULL,
    CONSTRAINT [PK_PushSiteClassDescription] PRIMARY KEY CLUSTERED ([PushSiteClassDescriptionId] ASC),
    CONSTRAINT [FK_PushSiteClassDescription_ClientWebhook] FOREIGN KEY ([ClientWebhookId]) REFERENCES [dbo].[ClientWebhook] ([ClientWebhookId])
);

