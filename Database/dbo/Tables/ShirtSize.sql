CREATE TABLE [dbo].[ShirtSize] (
    [ShirtSizeId]      TINYINT      IDENTITY (1, 1) NOT NULL,
    [Description]      VARCHAR (20) NULL,
    [ShortDescription] CHAR (3)     NULL,
    [DateCreated]      DATETIME     NULL,
    [DateModified]     DATETIME     NULL,
    [TimeStamp]        ROWVERSION   NULL,
    CONSTRAINT [PK_ShirtSize] PRIMARY KEY CLUSTERED ([ShirtSizeId] ASC)
);

