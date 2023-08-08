CREATE TABLE [dbo].[PushClientMembership] (
    [PushClientMembershipId] INT            IDENTITY (1, 1) NOT NULL,
    [ClientWebhookId]        INT            NOT NULL,
    [IsSynced]               BIT            CONSTRAINT [DF_PushClientMembership_IsSynced] DEFAULT ((0)) NOT NULL,
    [SiteId]                 INT            NULL,
    [ClientId]               NVARCHAR (30)  NULL,
    [ClientUniqueId]         INT            NULL,
    [ClientFirstName]        NVARCHAR (50)  NULL,
    [ClientLastName]         NVARCHAR (100) NULL,
    [ClientEmail]            NVARCHAR (100) NULL,
    [MembershipId]           INT            NULL,
    [MembershipName]         NVARCHAR (150) NULL,
    CONSTRAINT [PK_PushClientMembership] PRIMARY KEY CLUSTERED ([PushClientMembershipId] ASC),
    CONSTRAINT [FK_PushClientMembership_ClientWebhook] FOREIGN KEY ([ClientWebhookId]) REFERENCES [dbo].[ClientWebhook] ([ClientWebhookId])
);

