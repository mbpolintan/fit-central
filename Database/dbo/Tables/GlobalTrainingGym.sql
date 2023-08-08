CREATE TABLE [dbo].[GlobalTrainingGym] (
    [GlobalTrainingGymId] INT           IDENTITY (1, 1) NOT NULL,
    [GymName]             NVARCHAR (50) NOT NULL,
    [CreatedById]         INT           NOT NULL,
    [DateCreated]         DATETIME      NOT NULL,
    [ModifiedById]        INT           NULL,
    [DateModified]        DATETIME      NULL,
    [TimeStamp]           ROWVERSION    NOT NULL,
    CONSTRAINT [PK_GlobalTrainingGym] PRIMARY KEY CLUSTERED ([GlobalTrainingGymId] ASC)
);



