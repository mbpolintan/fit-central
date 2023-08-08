CREATE TABLE [dbo].[GlobalStudio] (
    [GlobalStudioId]      INT        IDENTITY (1, 1) NOT NULL,
    [GlobalTrainingGymId] INT        NOT NULL,
    [StudioId]            INT        NOT NULL,
    [CreatedById]         INT        NOT NULL,
    [DateCreated]         DATETIME   NOT NULL,
    [ModifiedById]        INT        NULL,
    [DateModified]        DATETIME   NULL,
    [TimeStamp]           ROWVERSION NOT NULL,
    CONSTRAINT [PK_StudioGroup] PRIMARY KEY CLUSTERED ([GlobalStudioId] ASC),
    CONSTRAINT [FK_GlobalStudio_GlobalTrainingGym] FOREIGN KEY ([GlobalTrainingGymId]) REFERENCES [dbo].[GlobalTrainingGym] ([GlobalTrainingGymId]),
    CONSTRAINT [FK_GlobalStudio_Studio] FOREIGN KEY ([StudioId]) REFERENCES [dbo].[Studio] ([StudioId])
);

