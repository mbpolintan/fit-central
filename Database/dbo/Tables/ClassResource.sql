CREATE TABLE [dbo].[ClassResource] (
    [SCClassResourceId] INT            IDENTITY (1, 1) NOT NULL,
    [StudioId]          INT            NOT NULL,
    [Id]                INT            NULL,
    [Name]              NVARCHAR (100) NULL,
    [DateCreated]       DATETIME       NOT NULL,
    [DateModified]      DATETIME       NULL,
    [TimeStamp]         ROWVERSION     NOT NULL,
    CONSTRAINT [PK_ClassResource] PRIMARY KEY CLUSTERED ([SCClassResourceId] ASC),
    CONSTRAINT [FK_ClassResource_Studio] FOREIGN KEY ([StudioId]) REFERENCES [dbo].[Studio] ([StudioId])
);



