CREATE TABLE [dbo].[ShoppingCart] (
    [ShoppingCartId]  INT           IDENTITY (1, 1) NOT NULL,
    [Id]              NVARCHAR (50) NOT NULL,
    [ClientId]        NVARCHAR (30) NOT NULL,
    [SiteId]          INT           NOT NULL,
    [SubTotal]        MONEY         NULL,
    [DiscountTotal]   MONEY         NULL,
    [TaxTotal]        MONEY         NULL,
    [GrandTotal]      MONEY         NULL,
    [TransactionDate] DATETIME      NULL,
    [TimeStamp]       ROWVERSION    NOT NULL,
    CONSTRAINT [PK_ShoppingCart] PRIMARY KEY CLUSTERED ([ShoppingCartId] ASC)
);



