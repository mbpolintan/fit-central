CREATE TABLE [dbo].[PaymentMethodType] (
    [PaymentMethodTypeId] INT           IDENTITY (1, 1) NOT NULL,
    [Description]         NVARCHAR (50) NULL,
    [DateCreated]         DATETIME      NULL,
    [DateModified]        DATETIME      NULL,
    [TimeStamp]           ROWVERSION    NOT NULL,
    CONSTRAINT [PK_PaymentMethodType] PRIMARY KEY CLUSTERED ([PaymentMethodTypeId] ASC)
);

