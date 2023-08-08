CREATE TABLE [dbo].[StudioUser] (
    [StudioUserId] INT        IDENTITY (1, 1) NOT NULL,
    [StudioId]     INT        NOT NULL,
    [AppUserId]    INT        NOT NULL,
    [CreatedById]  INT        NOT NULL,
    [DateCreated]  DATETIME   NOT NULL,
    [ModifiedById] INT        NULL,
    [DateModified] DATETIME   NULL,
    [TimeStamp]    ROWVERSION NULL,
    CONSTRAINT [PK_StudioUser] PRIMARY KEY CLUSTERED ([StudioUserId] ASC),
    CONSTRAINT [FK_StudioUserStudio] FOREIGN KEY ([StudioId]) REFERENCES [dbo].[Studio] ([StudioId]),
    CONSTRAINT [FK_StudioUserUser] FOREIGN KEY ([AppUserId]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_StudioUserUserCreated] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_StudioUserUserModified] FOREIGN KEY ([ModifiedById]) REFERENCES [dbo].[AppUser] ([AppUserId])
);

