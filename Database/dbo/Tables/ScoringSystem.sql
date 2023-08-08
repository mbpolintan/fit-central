CREATE TABLE [dbo].[ScoringSystem] (
    [ScoringSystemId] INT            IDENTITY (1, 1) NOT NULL,
    [Description]     NVARCHAR (200) NOT NULL,
    [DateCreated]     DATETIME       NOT NULL,
    [DateModified]    DATETIME       NULL,
    [TimeStamp]       ROWVERSION     NOT NULL,
    CONSTRAINT [PK_ScoringSystem] PRIMARY KEY CLUSTERED ([ScoringSystemId] ASC)
);

