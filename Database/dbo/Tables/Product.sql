CREATE TABLE [dbo].[Product] (
    [ProductId]        INT            IDENTITY (1, 1) NOT NULL,
    [SiteId]           INT            NULL,
    [Price]            MONEY          NULL,
    [TaxIncluded]      MONEY          NULL,
    [TaxRate]          MONEY          NULL,
    [Id]               NVARCHAR (30)  NULL,
    [GroupId]          INT            NULL,
    [Name]             NVARCHAR (100) NULL,
    [OnlinePrice]      MONEY          NULL,
    [ShortDescription] NVARCHAR (100) NULL,
    [LongDescription]  NVARCHAR (MAX) NULL,
    [DateCreated]      DATETIME       NOT NULL,
    [DateModified]     DATETIME       NULL,
    CONSTRAINT [PK_Product] PRIMARY KEY CLUSTERED ([ProductId] ASC)
);



