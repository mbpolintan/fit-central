CREATE TABLE [dbo].[ScanImage] (
    [ScanImageId]       INT             IDENTITY (1, 1) NOT NULL,
    [MemberId]          INT             NOT NULL,
    [ChallengeMemberId] INT             NOT NULL,
    [BeforeFrontImage]  VARBINARY (MAX) NULL,
    [BeforeSideImage]   VARBINARY (MAX) NULL,
    [BeforeBackImage]   VARBINARY (MAX) NULL,
    [AfterFrontImage]   VARBINARY (MAX) NULL,
    [AfterSideImage]    VARBINARY (MAX) NULL,
    [AfterBackImage]    VARBINARY (MAX) NULL,
    [CreatedById]       INT             NOT NULL,
    [DateCreated]       DATETIME        NOT NULL,
    [ModifiedById]      INT             NULL,
    [DateModified]      DATETIME        NULL,
    [TimeStamp]         ROWVERSION      NULL,
    CONSTRAINT [PK_ScanImage] PRIMARY KEY CLUSTERED ([ScanImageId] ASC),
    CONSTRAINT [FK_ScanImageChallengeMember] FOREIGN KEY ([ChallengeMemberId]) REFERENCES [dbo].[ChallengeMember] ([ChallengeMemberId]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [FK_ScanImageMember] FOREIGN KEY ([MemberId]) REFERENCES [dbo].[Member] ([MemberId]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [FK_ScanImageUserCreated] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_ScanImageUserModified] FOREIGN KEY ([ModifiedById]) REFERENCES [dbo].[AppUser] ([AppUserId])
);



