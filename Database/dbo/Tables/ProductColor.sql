CREATE TABLE [dbo].[ProductColor] (
    [ProductColorId] INT           IDENTITY (1, 1) NOT NULL,
    [ProductId]      INT           NOT NULL,
    [Id]             NVARCHAR (30) NULL,
    [Name]           VARCHAR (50)  NULL,
    [DateCreated]    DATETIME      NULL,
    [DateModified]   DATETIME      NULL,
    CONSTRAINT [PK_ProductColor] PRIMARY KEY CLUSTERED ([ProductColorId] ASC),
    CONSTRAINT [FK_ProductColor_Product] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Product] ([ProductId]) ON DELETE CASCADE ON UPDATE CASCADE
);



