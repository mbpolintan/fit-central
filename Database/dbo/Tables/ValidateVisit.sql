CREATE TABLE [dbo].[ValidateVisit] (
    [ValidateVisitId]    INT        IDENTITY (1, 1) NOT NULL,
    [StudioId]           INT        NOT NULL,
    [FromDateValidation] DATETIME   NOT NULL,
    [ToDateValidation]   DATETIME   NOT NULL,
    [DateCreated]        DATETIME   NOT NULL,
    [DateModified]       DATETIME   NULL,
    [TimeStamp]          ROWVERSION NOT NULL,
    CONSTRAINT [PK_ValidateVisit] PRIMARY KEY CLUSTERED ([ValidateVisitId] ASC),
    CONSTRAINT [FK_ValidateVisit_Studio] FOREIGN KEY ([StudioId]) REFERENCES [dbo].[Studio] ([StudioId])
);

