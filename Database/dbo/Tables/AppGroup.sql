CREATE TABLE [dbo].[AppGroup] (
    [AppGroupId]   INT            IDENTITY (1, 1) NOT NULL,
    [Description]  NVARCHAR (255) NOT NULL,
    [CreatedById]  INT            NOT NULL,
    [DateCreated]  DATETIME       NOT NULL,
    [ModifiedById] INT            NULL,
    [DateModified] DATETIME       NULL,
    [TimeStamp]    ROWVERSION     NOT NULL,
    CONSTRAINT [PK_Group] PRIMARY KEY CLUSTERED ([AppGroupId] ASC),
    CONSTRAINT [FK_AppGroupUserCreated] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_AppGroupUserModified] FOREIGN KEY ([ModifiedById]) REFERENCES [dbo].[AppUser] ([AppUserId])
);

