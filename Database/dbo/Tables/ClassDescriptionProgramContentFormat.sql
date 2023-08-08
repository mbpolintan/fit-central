CREATE TABLE [dbo].[ClassDescriptionProgramContentFormat] (
    [SCClassDescriptionProgramContentFormatId] INT            IDENTITY (1, 1) NOT NULL,
    [SCClassDescriptionProgramId]              INT            NULL,
    [ContentFormat]                            NVARCHAR (100) NULL,
    [DateCreated]                              DATETIME       NOT NULL,
    [DateModified]                             DATETIME       NULL,
    [TimeStamp]                                ROWVERSION     NOT NULL,
    CONSTRAINT [PK_ClassDescriptionProgramContentFormat] PRIMARY KEY CLUSTERED ([SCClassDescriptionProgramContentFormatId] ASC),
    CONSTRAINT [FK_ClassDescriptionProgramContentFormat_ClassDescriptionProgram] FOREIGN KEY ([SCClassDescriptionProgramId]) REFERENCES [dbo].[ClassDescriptionProgram] ([SCClassDescriptionProgramId]) ON DELETE CASCADE ON UPDATE CASCADE
);



