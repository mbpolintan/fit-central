CREATE TABLE [dbo].[MemberCategory] (
    [MemberCategoryId] INT            IDENTITY (1, 1) NOT NULL,
    [StudioId]         INT            NOT NULL,
    [Category]         NVARCHAR (40)  NOT NULL,
    [StdRate]          NUMERIC (8, 2) NULL,
    [CreatedById]      INT            NOT NULL,
    [DateCreated]      DATETIME       NOT NULL,
    [ModifiedById]     INT            NULL,
    [DateModified]     DATETIME       NULL,
    [TimeStamp]        ROWVERSION     NOT NULL,
    CONSTRAINT [PK_MembersCategory] PRIMARY KEY CLUSTERED ([MemberCategoryId] ASC),
    CONSTRAINT [FK_MemberCategoryStudio] FOREIGN KEY ([StudioId]) REFERENCES [dbo].[Studio] ([StudioId]),
    CONSTRAINT [FK_MemberCategoryUserCreated] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_MemberCategoryUserModified] FOREIGN KEY ([ModifiedById]) REFERENCES [dbo].[AppUser] ([AppUserId])
);

