CREATE TABLE [dbo].[ChallengeType] (
    [ChallengeTypeId] INT            IDENTITY (1, 1) NOT NULL,
    [Type]            NVARCHAR (150) NOT NULL,
    [CreatedById]     INT            NOT NULL,
    [DateCreated]     DATETIME       NOT NULL,
    [ModifiedById]    INT            NULL,
    [DateModified]    DATETIME       NULL,
    [TimeStamp]       ROWVERSION     NOT NULL,
    CONSTRAINT [PK_ChallengeType] PRIMARY KEY CLUSTERED ([ChallengeTypeId] ASC),
    CONSTRAINT [FK_ChallengeTypeUserCreated] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_ChallengeTypeUserModified] FOREIGN KEY ([ModifiedById]) REFERENCES [dbo].[AppUser] ([AppUserId])
);

