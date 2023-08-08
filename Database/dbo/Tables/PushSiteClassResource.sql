CREATE TABLE [dbo].[PushSiteClassResource] (
    [PushSiteClassResourceId] INT            IDENTITY (1, 1) NOT NULL,
    [PushSiteClassId]         INT            NOT NULL,
    [Id]                      INT            NULL,
    [Name]                    NVARCHAR (150) NULL,
    [DateCreated]             DATETIME       NULL,
    [TimeStamp]               ROWVERSION     NOT NULL,
    CONSTRAINT [PK_PushClassResource] PRIMARY KEY CLUSTERED ([PushSiteClassResourceId] ASC),
    CONSTRAINT [FK_PushSiteClassResource_PushSiteClass] FOREIGN KEY ([PushSiteClassId]) REFERENCES [dbo].[PushSiteClass] ([PushSiteClassId])
);

