﻿CREATE TABLE [dbo].[MBAPILog] (
    [MBAPILogId] INT      IDENTITY (1, 1) NOT NULL,
    [StudioId]   INT      NULL,
    [MBSiteId]   INT      NULL,
    [MBWebAPIId] INT      NOT NULL,
    [TotalCalls] INT      NOT NULL,
    [DateSynced] DATETIME NOT NULL,
    CONSTRAINT [PK_MBAPILog] PRIMARY KEY CLUSTERED ([MBAPILogId] ASC),
    CONSTRAINT [FK_MBAPILog_MBWebAPI] FOREIGN KEY ([MBWebAPIId]) REFERENCES [dbo].[MBWebAPI] ([MBWebAPIId])
);



