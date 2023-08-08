CREATE TABLE [dbo].[MBInterface] (
    [InterfaceId]      INT        IDENTITY (1, 1) NOT NULL,
    [StudioId]         INT        NOT NULL,
    [MindbodyStudioId] INT        NOT NULL,
    [CreatedById]      INT        NOT NULL,
    [DateCreated]      DATETIME   NOT NULL,
    [ModifiedById]     INT        NULL,
    [DateModified]     DATETIME   NULL,
    [TimeStamp]        ROWVERSION NOT NULL,
    CONSTRAINT [PK_MBInterface] PRIMARY KEY CLUSTERED ([InterfaceId] ASC),
    CONSTRAINT [FK_AppUser_MBInterfaceCreated] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_AppUser_MBInterfaceModified] FOREIGN KEY ([ModifiedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_Studio_MindBodyInterface] FOREIGN KEY ([StudioId]) REFERENCES [dbo].[Studio] ([StudioId])
);



