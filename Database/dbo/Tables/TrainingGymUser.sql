CREATE TABLE [dbo].[TrainingGymUser] (
    [TrainingGymUserId]   INT        IDENTITY (1, 1) NOT NULL,
    [AppUserId]           INT        NOT NULL,
    [GlobalTrainingGymId] INT        NOT NULL,
    [CreatedById]         INT        NOT NULL,
    [DateCreated]         DATETIME   NOT NULL,
    [ModifiedById]        INT        NULL,
    [DateModified]        DATETIME   NULL,
    [TimeStamp]           ROWVERSION NOT NULL,
    CONSTRAINT [PK_TrainingGymUser] PRIMARY KEY CLUSTERED ([TrainingGymUserId] ASC),
    CONSTRAINT [FK_TrainingGymUser_AppUser] FOREIGN KEY ([AppUserId]) REFERENCES [dbo].[AppUser] ([AppUserId]) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT [FK_TrainingGymUser_GlobalTrainingGym] FOREIGN KEY ([GlobalTrainingGymId]) REFERENCES [dbo].[GlobalTrainingGym] ([GlobalTrainingGymId])
);

