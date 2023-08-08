CREATE TABLE [dbo].[ClassDescriptionProgram] (
    [SCClassDescriptionProgramId] INT            IDENTITY (1, 1) NOT NULL,
    [SCClassDescriptionId]        INT            NOT NULL,
    [Id]                          INT            NULL,
    [Name]                        NVARCHAR (100) NULL,
    [ScheduleType]                NVARCHAR (50)  NULL,
    [CancelOffset]                INT            NULL,
    [DateCreated]                 DATETIME       NOT NULL,
    [DateModified]                DATETIME       NULL,
    [TimeStamp]                   ROWVERSION     NOT NULL,
    CONSTRAINT [PK_ClassDescriptionProgram] PRIMARY KEY CLUSTERED ([SCClassDescriptionProgramId] ASC),
    CONSTRAINT [FK_ClassDescriptionProgram_ClassDescription] FOREIGN KEY ([SCClassDescriptionId]) REFERENCES [dbo].[ClassDescription] ([SCClassDescriptionId]) ON DELETE CASCADE ON UPDATE CASCADE
);



