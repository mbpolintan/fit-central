CREATE TABLE [dbo].[ClassDescription] (
    [SCClassDescriptionId] INT             IDENTITY (1, 1) NOT NULL,
    [StudioId]             INT             NOT NULL,
    [Active]               BIT             NULL,
    [Description]          NVARCHAR (MAX)  NULL,
    [Id]                   INT             NULL,
    [ImageURL]             NVARCHAR (1000) NULL,
    [LastUpdated]          DATETIME        NULL,
    [Name]                 NVARCHAR (150)  NULL,
    [Notes]                NVARCHAR (1000) NULL,
    [Prereq]               NVARCHAR (1000) NULL,
    [Category]             NVARCHAR (255)  NULL,
    [CategoryId]           INT             NULL,
    [Subcategory]          NVARCHAR (255)  NULL,
    [SubcategoryId]        INT             NULL,
    [DateCreated]          DATETIME        NOT NULL,
    [DateModified]         DATETIME        NULL,
    [TimeStamp]            ROWVERSION      NOT NULL,
    CONSTRAINT [PK_MBClassDescription] PRIMARY KEY CLUSTERED ([SCClassDescriptionId] ASC),
    CONSTRAINT [FK_ClassDescription_Studio] FOREIGN KEY ([StudioId]) REFERENCES [dbo].[Studio] ([StudioId])
);



