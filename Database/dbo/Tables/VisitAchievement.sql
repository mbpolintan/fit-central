CREATE TABLE [dbo].[VisitAchievement] (
    [VisitAchievementId] INT        IDENTITY (1, 1) NOT NULL,
    [StudioId]           INT        NULL,
    [VisitCount]         INT        NULL,
    [DateCreated]        DATETIME   NULL,
    [DateModified]       DATETIME   NULL,
    [TimeStamp]          ROWVERSION NULL,
    CONSTRAINT [PK_VisitAchievement] PRIMARY KEY CLUSTERED ([VisitAchievementId] ASC),
    CONSTRAINT [FK_VisitAchievement_Studio] FOREIGN KEY ([StudioId]) REFERENCES [dbo].[Studio] ([StudioId])
);

