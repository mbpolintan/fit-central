CREATE TABLE [dbo].[SmsSetting] (
    [SmsSettingId] INT            IDENTITY (1, 1) NOT NULL,
    [StudioId]     INT            NOT NULL,
    [AccountSid]   NVARCHAR (100) NOT NULL,
    [AuthToken]    NVARCHAR (100) NOT NULL,
    [Number]       NVARCHAR (20)  NOT NULL,
    [CreatedById]  INT            NOT NULL,
    [DateCreated]  DATETIME       NOT NULL,
    [ModifiedById] INT            NULL,
    [DateModified] DATETIME       NULL,
    CONSTRAINT [PK_SmsSetting] PRIMARY KEY CLUSTERED ([SmsSettingId] ASC),
    CONSTRAINT [FK_SmsSetting_AppUserCreated] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_SmsSetting_AppUserModified] FOREIGN KEY ([ModifiedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_SmsSetting_SmsSetting] FOREIGN KEY ([StudioId]) REFERENCES [dbo].[Studio] ([StudioId])
);

