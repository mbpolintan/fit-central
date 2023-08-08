CREATE TABLE [dbo].[ChallengeStudio] (
    [ChallengeStudioId] INT        IDENTITY (1, 1) NOT NULL,
    [StudioId]          INT        NOT NULL,
    [ChallengeId]       INT        NOT NULL,
    [ScoringSystemId]   INT        NOT NULL,
    [ImageScore]        INT        NULL,
    [DateCreated]       DATETIME   NOT NULL,
    [DateModified]      DATETIME   NULL,
    [TimeStamp]         ROWVERSION NOT NULL,
    CONSTRAINT [PK_ChallengeStudio] PRIMARY KEY CLUSTERED ([ChallengeStudioId] ASC),
    CONSTRAINT [FK_ChallengeStudio_ScoringSystem] FOREIGN KEY ([ScoringSystemId]) REFERENCES [dbo].[ScoringSystem] ([ScoringSystemId]),
    CONSTRAINT [FK_ChallengeStudioChallenge] FOREIGN KEY ([ChallengeId]) REFERENCES [dbo].[Challenge] ([ChallengeId]),
    CONSTRAINT [FK_ChallengeStudioStudio] FOREIGN KEY ([StudioId]) REFERENCES [dbo].[Studio] ([StudioId])
);



