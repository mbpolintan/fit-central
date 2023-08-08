CREATE TABLE [dbo].[SyncLog] (
    [SyncLogId]     UNIQUEIDENTIFIER NOT NULL,
    [DateSynced]    DATETIME         NOT NULL,
    [MBSiteId]      INT              NOT NULL,
    [StudioId]      INT              NOT NULL,
    [UpdatedMember] INT              NOT NULL,
    [CreatedMember] INT              NOT NULL,
    CONSTRAINT [PK_SyncLog] PRIMARY KEY CLUSTERED ([SyncLogId] ASC)
);

