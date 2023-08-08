CREATE TABLE [dbo].[PaymentTransaction] (
    [PaymentTransactionId] INT        IDENTITY (1, 1) NOT NULL,
    [PaymentMethodTypeId]  INT        NULL,
    [PaymentMethodId]      INT        NULL,
    [MemberId]             INT        NOT NULL,
    [ProductId]            INT        NULL,
    [StudioId]             INT        NOT NULL,
    [Quantity]             INT        NULL,
    [Amount]               MONEY      NULL,
    [DateCreated]          DATETIME   NOT NULL,
    [DateModified]         DATETIME   NULL,
    [TimeStamp]            ROWVERSION NOT NULL,
    CONSTRAINT [PK_BilledScan] PRIMARY KEY CLUSTERED ([PaymentTransactionId] ASC),
    CONSTRAINT [FK_PaymentTransaction_Member] FOREIGN KEY ([MemberId]) REFERENCES [dbo].[Member] ([MemberId]),
    CONSTRAINT [FK_PaymentTransaction_PaymentMethod] FOREIGN KEY ([PaymentMethodId]) REFERENCES [dbo].[PaymentMethod] ([PaymentMethodId]),
    CONSTRAINT [FK_PaymentTransaction_Product] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Product] ([ProductId]),
    CONSTRAINT [FK_PaymentTransaction_Studio] FOREIGN KEY ([StudioId]) REFERENCES [dbo].[Studio] ([StudioId])
);

