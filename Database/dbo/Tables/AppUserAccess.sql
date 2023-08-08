CREATE TABLE [dbo].[AppUserAccess] (
    [AppUserAccessId] INT        IDENTITY (1, 1) NOT NULL,
    [AppUserId]       INT        NOT NULL,
    [AppModuleId]     INT        NOT NULL,
    [AccessType]      BIT        CONSTRAINT [DF_AppUserAccess_AccessType] DEFAULT ((0)) NOT NULL,
    [CreatedById]     INT        NOT NULL,
    [DateCreated]     DATETIME   NOT NULL,
    [ModifiedById]    INT        NULL,
    [DateModified]    DATETIME   NULL,
    [TimeStamp]       ROWVERSION NOT NULL,
    CONSTRAINT [PK_UserAccess] PRIMARY KEY CLUSTERED ([AppUserAccessId] ASC),
    CONSTRAINT [FK_UserAccessModule] FOREIGN KEY ([AppModuleId]) REFERENCES [dbo].[AppModule] ([AppModuleId]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [FK_UserAccessUser] FOREIGN KEY ([AppUserId]) REFERENCES [dbo].[AppUser] ([AppUserId]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [FK_UserAccessUserCreated] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_UserAccessUserModified] FOREIGN KEY ([ModifiedById]) REFERENCES [dbo].[AppUser] ([AppUserId])
);



