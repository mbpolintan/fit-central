CREATE TABLE [dbo].[AppGroupAccess] (
    [AppGroupAccessId] INT        IDENTITY (1, 1) NOT NULL,
    [AppGroupId]       INT        NOT NULL,
    [AppModuleId]      INT        NOT NULL,
    [CreatedById]      INT        NOT NULL,
    [DateCreated]      DATETIME   NOT NULL,
    [ModifiedById]     INT        NULL,
    [DateModified]     DATETIME   NULL,
    [TimeStamp]        ROWVERSION NOT NULL,
    CONSTRAINT [PK_GroupAccess] PRIMARY KEY CLUSTERED ([AppGroupAccessId] ASC),
    CONSTRAINT [FK_AppGroupAccessGroup] FOREIGN KEY ([AppGroupId]) REFERENCES [dbo].[AppGroup] ([AppGroupId]),
    CONSTRAINT [FK_AppGroupAccessModule] FOREIGN KEY ([AppModuleId]) REFERENCES [dbo].[AppModule] ([AppModuleId]),
    CONSTRAINT [FK_AppGroupAccessUserCreated] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_AppGroupAccessUserModified] FOREIGN KEY ([ModifiedById]) REFERENCES [dbo].[AppUser] ([AppUserId])
);

