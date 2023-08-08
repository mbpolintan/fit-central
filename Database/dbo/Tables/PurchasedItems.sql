CREATE TABLE [dbo].[PurchasedItems] (
    [PurchasedItemId] INT           IDENTITY (1, 1) NOT NULL,
    [PurchaseId]      INT           NOT NULL,
    [Id]              INT           NOT NULL,
    [IsService]       BIT           CONSTRAINT [DF_PurchasedItems_IsService] DEFAULT ((0)) NOT NULL,
    [BarcodeId]       NVARCHAR (50) NULL,
    CONSTRAINT [PK_PurchasedItems] PRIMARY KEY CLUSTERED ([PurchasedItemId] ASC),
    CONSTRAINT [FK_PurchasedItems_Purchases] FOREIGN KEY ([PurchaseId]) REFERENCES [dbo].[Purchases] ([PurchaseId])
);

