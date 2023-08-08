CREATE TABLE [dbo].[ClassDescriptionSessionType] (
    [SCClassDescriptionSessionTypeId] INT           IDENTITY (1, 1) NOT NULL,
    [SCClassDescriptionId]            INT           NOT NULL,
    [Type]                            NVARCHAR (15) NULL,
    [DefaultTimeLength]               INT           NULL,
    [Id]                              INT           NULL,
    [Name]                            NVARCHAR (50) NULL,
    [NumDeducted]                     INT           NULL,
    [ProgramId]                       INT           NULL,
    [DateCreated]                     DATETIME      NOT NULL,
    [DateModified]                    DATETIME      NULL,
    [TimeStamp]                       ROWVERSION    NOT NULL,
    CONSTRAINT [PK_ClassDescriptionSessionType] PRIMARY KEY CLUSTERED ([SCClassDescriptionSessionTypeId] ASC),
    CONSTRAINT [FK_ClassDescriptionSessionType_ClassDescription] FOREIGN KEY ([SCClassDescriptionId]) REFERENCES [dbo].[ClassDescription] ([SCClassDescriptionId]) ON DELETE CASCADE ON UPDATE CASCADE
);



