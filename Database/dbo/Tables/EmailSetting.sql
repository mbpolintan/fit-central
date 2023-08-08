CREATE TABLE [dbo].[EmailSetting] (
    [EmailSettingId] INT            IDENTITY (1, 1) NOT NULL,
    [StudioId]       INT            NOT NULL,
    [MailServer]     NVARCHAR (50)  NOT NULL,
    [MailPort]       INT            NOT NULL,
    [SenderName]     NVARCHAR (100) NOT NULL,
    [Sender]         NVARCHAR (100) NOT NULL,
    [Password]       NVARCHAR (100) NOT NULL,
    [CreatedById]    INT            NOT NULL,
    [DateCreated]    DATETIME       NOT NULL,
    [ModifiedById]   INT            NULL,
    [DateModified]   DATETIME       NULL,
    [TimeStamp]      ROWVERSION     NOT NULL,
    CONSTRAINT [PK_EmailSetting] PRIMARY KEY CLUSTERED ([EmailSettingId] ASC),
    CONSTRAINT [FK_EmailSetting_AppUserCreated] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_EmailSetting_AppUserModified] FOREIGN KEY ([ModifiedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_EmailSetting_Studio] FOREIGN KEY ([StudioId]) REFERENCES [dbo].[Studio] ([StudioId])
);

