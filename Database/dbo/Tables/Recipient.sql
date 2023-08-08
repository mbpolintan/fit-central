CREATE TABLE [dbo].[Recipient] (
    [RecipientId]  INT            IDENTITY (1, 1) NOT NULL,
    [SentItemId]   INT            NULL,
    [Name]         NVARCHAR (150) NULL,
    [EmailAddress] NVARCHAR (150) NULL,
    [MobilePhone]  NVARCHAR (100) NULL,
    [DateCreated]  DATETIME       NULL,
    [DateModified] DATETIME       NULL,
    [TimeStamp]    ROWVERSION     NOT NULL,
    CONSTRAINT [PK_Recipient] PRIMARY KEY CLUSTERED ([RecipientId] ASC),
    CONSTRAINT [FK_Recipient_SentItem] FOREIGN KEY ([SentItemId]) REFERENCES [dbo].[SentItem] ([SentItemId])
);

