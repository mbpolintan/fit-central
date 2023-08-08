CREATE TABLE [dbo].[PaymentType] (
    [PaymentTypeId] INT           IDENTITY (1, 1) NOT NULL,
    [Description]   NVARCHAR (50) NOT NULL,
    [DateCreated]   DATETIME      NOT NULL,
    [DateModified]  DATETIME      NULL,
    [TimeStamp]     ROWVERSION    NOT NULL,
    CONSTRAINT [PK_PaymentType] PRIMARY KEY CLUSTERED ([PaymentTypeId] ASC)
);

