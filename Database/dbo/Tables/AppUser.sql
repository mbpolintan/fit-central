CREATE TABLE [dbo].[AppUser] (
    [AppUserId]    INT            IDENTITY (1, 1) NOT NULL,
    [AppGroupId]   INT            NOT NULL,
    [UserEmail]    NVARCHAR (100) NOT NULL,
    [CreatedById]  INT            NOT NULL,
    [DateCreated]  DATETIME       NOT NULL,
    [ModifiedById] INT            NULL,
    [DateModified] DATETIME       NULL,
    [TimeStamp]    ROWVERSION     NOT NULL,
    CONSTRAINT [PK_AppUser] PRIMARY KEY CLUSTERED ([AppUserId] ASC),
    CONSTRAINT [FK_AppUserGroup] FOREIGN KEY ([AppGroupId]) REFERENCES [dbo].[AppGroup] ([AppGroupId]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [FK_AppUserUserCreated] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_AppUserUserModified] FOREIGN KEY ([ModifiedById]) REFERENCES [dbo].[AppUser] ([AppUserId])
);



