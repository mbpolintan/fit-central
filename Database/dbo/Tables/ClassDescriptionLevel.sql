CREATE TABLE [dbo].[ClassDescriptionLevel] (
    [SCClassDescriptionLevelId] INT            IDENTITY (1, 1) NOT NULL,
    [SCClassDescriptionId]      INT            NOT NULL,
    [Id]                        INT            NULL,
    [Name]                      NVARCHAR (100) NULL,
    [DateCreated]               DATETIME       NOT NULL,
    [DateModified]              DATETIME       NULL,
    [TimeStamp]                 ROWVERSION     NOT NULL,
    CONSTRAINT [PK_ClassDescriptionLevel] PRIMARY KEY CLUSTERED ([SCClassDescriptionLevelId] ASC),
    CONSTRAINT [FK_ClassDescriptionLevel_ClassDescription] FOREIGN KEY ([SCClassDescriptionId]) REFERENCES [dbo].[ClassDescription] ([SCClassDescriptionId]) ON DELETE CASCADE ON UPDATE CASCADE
);



