CREATE TABLE [dbo].[PaymentSource] (
    [PaymentSourceId] INT            IDENTITY (1, 1) NOT NULL,
    [Description]     NVARCHAR (255) NULL,
    [DateCreated]     DATETIME       NULL,
    [DateModified]    DATETIME       NULL,
    [TimeStamp]       ROWVERSION     NULL,
    CONSTRAINT [PK_PaymentSource] PRIMARY KEY CLUSTERED ([PaymentSourceId] ASC)
);

