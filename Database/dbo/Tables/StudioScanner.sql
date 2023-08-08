CREATE TABLE [dbo].[StudioScanner] (
    [StudioScannerId] INT        IDENTITY (1, 1) NOT NULL,
    [StudioId]        INT        NOT NULL,
    [ScannerId]       INT        NOT NULL,
    [CreatedById]     INT        NOT NULL,
    [DateCreated]     DATETIME   NOT NULL,
    [ModifiedById]    INT        NULL,
    [DateModified]    DATETIME   NULL,
    [TimeStamp]       ROWVERSION NOT NULL,
    CONSTRAINT [PK_StudioScanner] PRIMARY KEY CLUSTERED ([StudioScannerId] ASC),
    CONSTRAINT [FK_StudioScannerScanner] FOREIGN KEY ([ScannerId]) REFERENCES [dbo].[Scanner] ([ScannerId]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [FK_StudioScannerStudio] FOREIGN KEY ([StudioId]) REFERENCES [dbo].[Studio] ([StudioId]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [FK_StudioScannerUserCreated] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_StudioScannerUserModified] FOREIGN KEY ([ModifiedById]) REFERENCES [dbo].[AppUser] ([AppUserId])
);



