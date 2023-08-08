CREATE TABLE [dbo].[SentItem] (
    [SentItemId]      INT            IDENTITY (1, 1) NOT NULL,
    [StudioId]        INT            NULL,
    [MessageTypeId]   INT            NULL,
    [Subject]         NVARCHAR (50)  NULL,
    [BodyContentType] NVARCHAR (4)   NULL,
    [BodyContent]     NVARCHAR (MAX) NULL,
    [SenderUserId]    INT            NULL,
    [DateCreated]     DATETIME       NULL,
    [DateModified]    DATETIME       NULL,
    [TimeStamp]       ROWVERSION     NULL,
    CONSTRAINT [PK_SendItem] PRIMARY KEY CLUSTERED ([SentItemId] ASC),
    CONSTRAINT [FK_SendItem_MessageType] FOREIGN KEY ([MessageTypeId]) REFERENCES [dbo].[MessageType] ([MessageTypeId]),
    CONSTRAINT [FK_SendItem_Studio] FOREIGN KEY ([StudioId]) REFERENCES [dbo].[Studio] ([StudioId]),
    CONSTRAINT [FK_SentItem_AppUser] FOREIGN KEY ([SenderUserId]) REFERENCES [dbo].[AppUser] ([AppUserId])
);





