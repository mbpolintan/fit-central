CREATE TABLE [dbo].[MessageType] (
    [MessageTypeId] INT           IDENTITY (1, 1) NOT NULL,
    [Description]   NVARCHAR (10) NULL,
    [DateCreated]   DATETIME      NULL,
    [DateModified]  DATETIME      NULL,
    [TimeStamp]     ROWVERSION    NOT NULL,
    CONSTRAINT [PK_MessageType] PRIMARY KEY CLUSTERED ([MessageTypeId] ASC)
);



