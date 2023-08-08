CREATE TABLE [dbo].[ClassLocationImageUrl] (
    [SCClassLocationImageUrlId] INT             IDENTITY (1, 1) NOT NULL,
    [SCClassLocationId]         INT             NOT NULL,
    [AdditionalImageURL]        NVARCHAR (1000) NULL,
    [DateCreated]               DATETIME        NULL,
    [DateModified]              DATETIME        NULL,
    [TimeStamp]                 ROWVERSION      NOT NULL,
    CONSTRAINT [PK_ClassLocationImageUrl] PRIMARY KEY CLUSTERED ([SCClassLocationImageUrlId] ASC),
    CONSTRAINT [FK_ClassLocationImageUrl_ClassLocation] FOREIGN KEY ([SCClassLocationId]) REFERENCES [dbo].[ClassLocation] ([SCClassLocationId]) ON DELETE CASCADE ON UPDATE CASCADE
);



