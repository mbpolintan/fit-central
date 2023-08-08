CREATE TABLE [dbo].[ClientWebhook] (
    [ClientWebhookId]                  INT            IDENTITY (1, 1) NOT NULL,
    [EventId]                          NVARCHAR (50)  NULL,
    [EventSchemaVersion]               DECIMAL (4, 2) NULL,
    [EventInstanceOriginationDateTime] DATETIME       NULL,
    [MessageId]                        NVARCHAR (50)  NULL,
    CONSTRAINT [PK_ClientWebhook] PRIMARY KEY CLUSTERED ([ClientWebhookId] ASC)
);

