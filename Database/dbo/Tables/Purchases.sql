CREATE TABLE [dbo].[Purchases] (
    [PurchaseId]     INT            IDENTITY (1, 1) NOT NULL,
    [SiteId]         INT            NOT NULL,
    [Id]             INT            NOT NULL,
    [SaleDate]       DATE           NULL,
    [SaleTime]       TIME (2)       NULL,
    [SaleDateTime]   DATETIME       NULL,
    [ClientId]       NVARCHAR (30)  NULL,
    [LocationId]     INT            NULL,
    [Description]    NVARCHAR (255) NULL,
    [AccountPayment] BIT            CONSTRAINT [DF_Purchases_AccountPayment] DEFAULT ((0)) NOT NULL,
    [Price]          MONEY          NULL,
    [AmountPaid]     MONEY          NULL,
    [Discount]       MONEY          NULL,
    [Tax]            MONEY          NULL,
    [Returned]       BIT            CONSTRAINT [DF_Purchases_Returned] DEFAULT ((0)) NOT NULL,
    [Quantity]       INT            NULL,
    CONSTRAINT [PK_Purchases] PRIMARY KEY CLUSTERED ([PurchaseId] ASC)
);

