CREATE TABLE [dbo].[Scanner] (
    [ScannerId]    INT           IDENTITY (1, 1) NOT NULL,
    [ScannerName]  NVARCHAR (50) NOT NULL,
    [SerialNo]     NVARCHAR (50) NULL,
    [PurchaseDate] DATE          NULL,
    [CreatedById]  INT           NOT NULL,
    [DateCreated]  DATETIME      NOT NULL,
    [ModifiedById] INT           NULL,
    [DateModified] DATETIME      NULL,
    [TimeStamp]    ROWVERSION    NOT NULL,
    CONSTRAINT [PK_Scanners] PRIMARY KEY CLUSTERED ([ScannerId] ASC),
    CONSTRAINT [FK_ScannerUserCreated] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_ScannerUserModified] FOREIGN KEY ([ModifiedById]) REFERENCES [dbo].[AppUser] ([AppUserId])
);

