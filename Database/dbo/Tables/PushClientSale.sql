CREATE TABLE [dbo].[PushClientSale] (
    [PushClientSaleId]   INT            IDENTITY (1, 1) NOT NULL,
    [ClientWebhookId]    INT            NOT NULL,
    [IsSynced]           BIT            CONSTRAINT [DF_PushClientSale_IsSynced] DEFAULT ((0)) NOT NULL,
    [SiteId]             INT            NULL,
    [SaleId]             INT            NULL,
    [PurchasingClientId] NVARCHAR (30)  NULL,
    [SaleDateTime]       DATETIME       NULL,
    [SoldById]           INT            NULL,
    [SoldByName]         NVARCHAR (150) NULL,
    [LocationId]         INT            NULL,
    [TotalAmountPaid]    MONEY          NULL,
    CONSTRAINT [PK_PushClientSale] PRIMARY KEY CLUSTERED ([PushClientSaleId] ASC),
    CONSTRAINT [FK_PushClientSale_ClientWebhook] FOREIGN KEY ([ClientWebhookId]) REFERENCES [dbo].[ClientWebhook] ([ClientWebhookId])
);

