CREATE TABLE [dbo].[ScansImport] (
    [ScansImportId]    INT            IDENTITY (1, 1) NOT NULL,
    [ScannerId]        INT            NOT NULL,
    [ImportDate]       DATETIME       NOT NULL,
    [ScanCount]        INT            NOT NULL,
    [UpdatedScans]     INT            NULL,
    [CreatedScans]     INT            NULL,
    [ImportedFileName] NVARCHAR (255) NOT NULL,
    [CreatedById]      INT            NOT NULL,
    [DateCreated]      DATETIME       NOT NULL,
    [ModifiedById]     INT            NULL,
    [DateModified]     DATETIME       NULL,
    [TimeStamp]        ROWVERSION     NOT NULL,
    CONSTRAINT [PK_ScansImport] PRIMARY KEY CLUSTERED ([ScansImportId] ASC),
    CONSTRAINT [FK_ScanImportScanner] FOREIGN KEY ([ScannerId]) REFERENCES [dbo].[Scanner] ([ScannerId]),
    CONSTRAINT [FK_ScanImportUserCreated] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_ScanImportUserModified] FOREIGN KEY ([ModifiedById]) REFERENCES [dbo].[AppUser] ([AppUserId])
);





