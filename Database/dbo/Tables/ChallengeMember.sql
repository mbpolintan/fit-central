CREATE TABLE [dbo].[ChallengeMember] (
    [ChallengeMemberId]    INT        IDENTITY (1, 1) NOT NULL,
    [ChallengeId]          INT        NOT NULL,
    [MemberId]             INT        NOT NULL,
    [StartScanId]          INT        NULL,
    [MidScanId]            INT        NULL,
    [EndScanId]            INT        NULL,
    [CreatedById]          INT        NOT NULL,
    [DateCreated]          DATETIME   NOT NULL,
    [ModifiedById]         INT        NULL,
    [DateModified]         DATETIME   NULL,
    [TimeStamp]            ROWVERSION NOT NULL,
    [PaymentTransactionId] INT        NULL,
    [ImageScore]           INT        CONSTRAINT [DF_ChallengeMember_ImageScore] DEFAULT ((0)) NOT NULL,
    CONSTRAINT [PK_ChallengeMember] PRIMARY KEY CLUSTERED ([ChallengeMemberId] ASC),
    CONSTRAINT [FK_ChallengeMember_PaymentTransaction] FOREIGN KEY ([PaymentTransactionId]) REFERENCES [dbo].[PaymentTransaction] ([PaymentTransactionId]),
    CONSTRAINT [FK_ChallengeMemberChallenge] FOREIGN KEY ([ChallengeId]) REFERENCES [dbo].[Challenge] ([ChallengeId]),
    CONSTRAINT [FK_ChallengeMemberEndScan] FOREIGN KEY ([EndScanId]) REFERENCES [dbo].[Scan] ([ScanId]),
    CONSTRAINT [FK_ChallengeMemberMember] FOREIGN KEY ([MemberId]) REFERENCES [dbo].[Member] ([MemberId]),
    CONSTRAINT [FK_ChallengeMemberMidScan] FOREIGN KEY ([MidScanId]) REFERENCES [dbo].[Scan] ([ScanId]),
    CONSTRAINT [FK_ChallengeMemberStartScan] FOREIGN KEY ([StartScanId]) REFERENCES [dbo].[Scan] ([ScanId]),
    CONSTRAINT [FK_ChallengeMemberUserCreated] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_ChallengeMemberUserModified] FOREIGN KEY ([ModifiedById]) REFERENCES [dbo].[AppUser] ([AppUserId])
);





