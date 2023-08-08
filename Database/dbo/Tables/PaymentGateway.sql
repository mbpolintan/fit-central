CREATE TABLE [dbo].[PaymentGateway] (
    [PaymentGatewayId] INT            IDENTITY (1, 1) NOT NULL,
    [Gateway]          NVARCHAR (150) NULL,
    [DateCreated]      DATETIME       NOT NULL,
    [TimeStamp]        ROWVERSION     NOT NULL,
    CONSTRAINT [PK_PaymentGateway] PRIMARY KEY CLUSTERED ([PaymentGatewayId] ASC)
);

