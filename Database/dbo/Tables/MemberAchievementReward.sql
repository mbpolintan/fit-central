CREATE TABLE [dbo].[MemberAchievementReward] (
    [MemberAchievementRewardId] INT        IDENTITY (1, 1) NOT NULL,
    [MemberId]                  INT        NOT NULL,
    [VisitAchievementId]        INT        NOT NULL,
    [IsGiven]                   BIT        CONSTRAINT [DF_MemberAchievementReward_IsGiven] DEFAULT ((0)) NOT NULL,
    [DateCreated]               DATETIME   NOT NULL,
    [DateModified]              DATETIME   NULL,
    [TimeStamp]                 ROWVERSION NOT NULL,
    CONSTRAINT [PK_MemberAchievementReward] PRIMARY KEY CLUSTERED ([MemberAchievementRewardId] ASC),
    CONSTRAINT [FK_MemberAchievementReward_Member] FOREIGN KEY ([MemberId]) REFERENCES [dbo].[Member] ([MemberId]),
    CONSTRAINT [FK_MemberAchievementReward_VisitAchievement] FOREIGN KEY ([VisitAchievementId]) REFERENCES [dbo].[VisitAchievement] ([VisitAchievementId])
);

