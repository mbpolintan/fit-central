CREATE TABLE [dbo].[AppConfig] (
    [AppConfigId]  INT        IDENTITY (1, 1) NOT NULL,
    [CreatedById]  INT        NOT NULL,
    [DateCreated]  DATETIME   NOT NULL,
    [ModifiedById] INT        NULL,
    [DateModified] DATETIME   NULL,
    [TimeStamp]    ROWVERSION NOT NULL,
    CONSTRAINT [PK_AppConfig] PRIMARY KEY CLUSTERED ([AppConfigId] ASC),
    CONSTRAINT [FK_AppConfigUserCreated] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_AppConfigUserModified] FOREIGN KEY ([ModifiedById]) REFERENCES [dbo].[AppUser] ([AppUserId])
);

