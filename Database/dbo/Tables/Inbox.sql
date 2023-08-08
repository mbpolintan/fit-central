CREATE TABLE [dbo].[Inbox] (
    [InboxId]           INT            IDENTITY (1, 1) NOT NULL,
    [StudioId]          INT            NULL,
    [MessageTypeId]     INT            NULL,
    [Subject]           NVARCHAR (50)  NULL,
    [BodyContentType]   NVARCHAR (4)   NULL,
    [BodyContent]       NVARCHAR (MAX) NULL,
    [IsRead]            BIT            CONSTRAINT [DF_Inbox_IsRead] DEFAULT ((0)) NOT NULL,
    [IsAnonymousSender] BIT            CONSTRAINT [DF_Inbox_IsAnonymousSender] DEFAULT ((0)) NOT NULL,
    [ReceivedDateTime]  DATETIME       NULL,
    [SentDateTime]      DATETIME       NULL,
    [SenderName]        NVARCHAR (150) NULL,
    [SenderEmail]       NVARCHAR (150) NULL,
    [SenderMobilePhone] NVARCHAR (100) NULL,
    [DateCreated]       DATETIME       NOT NULL,
    [DateModified]      DATETIME       NULL,
    [TimeStamp]         ROWVERSION     NOT NULL,
    CONSTRAINT [PK_Inbox] PRIMARY KEY CLUSTERED ([InboxId] ASC),
    CONSTRAINT [FK_Inbox_MessageType] FOREIGN KEY ([MessageTypeId]) REFERENCES [dbo].[MessageType] ([MessageTypeId]),
    CONSTRAINT [FK_Inbox_Studio] FOREIGN KEY ([StudioId]) REFERENCES [dbo].[Studio] ([StudioId])
);



