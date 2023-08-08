CREATE TABLE [dbo].[PushClientSaleItem] (
    [PushClientSaleItemId] INT            IDENTITY (1, 1) NOT NULL,
    [PushClientSaleId]     INT            NOT NULL,
    [ItemId]               INT            NULL,
    [Type]                 NVARCHAR (100) NULL,
    [Name]                 NVARCHAR (100) NULL,
    [AmountPaid]           MONEY          NULL,
    [AmountDiscounted]     MONEY          NULL,
    [Quantity]             INT            NULL,
    [RecipientClientId]    NVARCHAR (30)  NULL,
    [PaymentReferenceId]   INT            NULL,
    CONSTRAINT [PK_PushClientSaleItem] PRIMARY KEY CLUSTERED ([PushClientSaleItemId] ASC),
    CONSTRAINT [FK_PushClientSaleItem_PushClientSale] FOREIGN KEY ([PushClientSaleId]) REFERENCES [dbo].[PushClientSale] ([PushClientSaleId])
);

