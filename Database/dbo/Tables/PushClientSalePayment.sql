CREATE TABLE [dbo].[PushClientSalePayment] (
    [PushClientSalePaymentId] INT             IDENTITY (1, 1) NOT NULL,
    [PushClientSaleId]        INT             NOT NULL,
    [PaymentId]               INT             NULL,
    [PaymentMethodId]         INT             NULL,
    [PaymentMethod]           NVARCHAR (100)  NULL,
    [PaymentAmountPaid]       MONEY           NULL,
    [PaymentLastFour]         VARCHAR (4)     NULL,
    [PaymentNotes]            NVARCHAR (1000) NULL,
    CONSTRAINT [PK_PushClientSalePayment] PRIMARY KEY CLUSTERED ([PushClientSalePaymentId] ASC),
    CONSTRAINT [FK_PushClientSalePayment_PushClientSale] FOREIGN KEY ([PushClientSaleId]) REFERENCES [dbo].[PushClientSale] ([PushClientSaleId])
);

