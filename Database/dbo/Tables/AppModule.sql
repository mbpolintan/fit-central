CREATE TABLE [dbo].[AppModule] (
    [AppModuleId]  INT          IDENTITY (1, 1) NOT NULL,
    [Name]         VARCHAR (50) NULL,
    [Description]  VARCHAR (50) NOT NULL,
    [PageUrl]      VARCHAR (50) NULL,
    [CreatedById]  INT          NOT NULL,
    [DateCreated]  DATETIME     NOT NULL,
    [ModifiedById] INT          NULL,
    [DateModified] DATETIME     NULL,
    [TimeStamp]    ROWVERSION   NOT NULL,
    CONSTRAINT [PK_Module] PRIMARY KEY CLUSTERED ([AppModuleId] ASC),
    CONSTRAINT [FK_AppModuleUserCreated] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_AppModuleUserModified] FOREIGN KEY ([ModifiedById]) REFERENCES [dbo].[AppUser] ([AppUserId])
);

