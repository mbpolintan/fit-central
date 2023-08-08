CREATE TABLE [dbo].[ProductSize] (
    [ProductSizeId] INT           IDENTITY (1, 1) NOT NULL,
    [ProductId]     INT           NULL,
    [Id]            NVARCHAR (30) NULL,
    [Name]          VARCHAR (50)  NULL,
    [DateCreated]   DATETIME      NULL,
    [DateModified]  DATETIME      NULL,
    CONSTRAINT [PK_ProductSize] PRIMARY KEY CLUSTERED ([ProductSizeId] ASC),
    CONSTRAINT [FK_ProductSize_ProductSize] FOREIGN KEY ([ProductId]) REFERENCES [dbo].[Product] ([ProductId]) ON DELETE CASCADE ON UPDATE CASCADE
);



