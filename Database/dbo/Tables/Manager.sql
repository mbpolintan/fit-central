CREATE TABLE [dbo].[Manager] (
    [ManagerId]           INT        IDENTITY (1, 1) NOT NULL,
    [AppUserId]           INT        NOT NULL,
    [GlobalTrainingGymId] INT        NOT NULL,
    [CreatedById]         INT        NOT NULL,
    [DateCreated]         DATETIME   NOT NULL,
    [ModifiedById]        INT        NULL,
    [DateModified]        DATETIME   NULL,
    [TimeStamp]           ROWVERSION NOT NULL,
    CONSTRAINT [PK_Manager] PRIMARY KEY CLUSTERED ([ManagerId] ASC),
    CONSTRAINT [FK_Manager_AppUser] FOREIGN KEY ([AppUserId]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_Manager_GlobalTrainingGym] FOREIGN KEY ([GlobalTrainingGymId]) REFERENCES [dbo].[GlobalTrainingGym] ([GlobalTrainingGymId])
);





