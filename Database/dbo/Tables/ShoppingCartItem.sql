CREATE TABLE [dbo].[ShoppingCartItem] (
    [ShoppingCartItemId] INT            IDENTITY (1, 1) NOT NULL,
    [ShoppingCartId]     INT            NOT NULL,
    [Id]                 NVARCHAR (50)  NULL,
    [Name]               NVARCHAR (100) NULL,
    [Price]              MONEY          NULL,
    CONSTRAINT [PK_ShoppingCartItem] PRIMARY KEY CLUSTERED ([ShoppingCartItemId] ASC)
);

