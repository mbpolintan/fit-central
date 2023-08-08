CREATE TABLE [dbo].[AuditLog] (
    [AuditLogID]     UNIQUEIDENTIFIER CONSTRAINT [DF_AuditLog_AuditLogID] DEFAULT (newid()) NOT NULL,
    [TimeStamp]      DATETIME         CONSTRAINT [DF_AuditLog_TimeStamp] DEFAULT (getdate()) NOT NULL,
    [AuditType]      NVARCHAR (10)    NOT NULL,
    [Username]       NVARCHAR (50)    NOT NULL,
    [TableName]      NVARCHAR (100)   NOT NULL,
    [KeyValues]      NVARCHAR (MAX)   NULL,
    [OldValues]      NVARCHAR (MAX)   NULL,
    [NewValues]      NVARCHAR (MAX)   NULL,
    [ChangedColumns] NVARCHAR (MAX)   NULL,
    CONSTRAINT [PK_AuditLog] PRIMARY KEY CLUSTERED ([AuditLogID] ASC)
);

