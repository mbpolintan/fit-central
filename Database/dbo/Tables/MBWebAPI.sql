CREATE TABLE [dbo].[MBWebAPI] (
    [MBWebAPIId]   INT            IDENTITY (1, 1) NOT NULL,
    [Title]        NVARCHAR (150) NULL,
    [Description]  NVARCHAR (255) NULL,
    [Url]          NVARCHAR (300) NULL,
    [CreatedById]  INT            NOT NULL,
    [DateCreated]  DATETIME       NOT NULL,
    [ModifiedById] INT            NULL,
    [DateModified] DATETIME       NULL,
    [TimeStamp]    ROWVERSION     NOT NULL,
    CONSTRAINT [PK_MBWebAPI] PRIMARY KEY CLUSTERED ([MBWebAPIId] ASC)
);

