CREATE TABLE [dbo].[WeightedSystem] (
    [WeightedSystemId]    INT            IDENTITY (1, 1) NOT NULL,
    [GlobalTrainingGymId] INT            NOT NULL,
    [Category]            NVARCHAR (255) NOT NULL,
    [UpperRange]          DECIMAL (5, 2) NOT NULL,
    [UpperRangeWeighted]  DECIMAL (5, 2) NOT NULL,
    [MidRange]            DECIMAL (5, 2) NOT NULL,
    [MidRangeWeighted]    DECIMAL (5, 2) NOT NULL,
    [LowerRange]          DECIMAL (5, 2) NOT NULL,
    [LowerRangeWeighted]  DECIMAL (5, 2) NOT NULL,
    [DateCreated]         DATETIME       NOT NULL,
    [DateModified]        DATETIME       NULL,
    [TimeStamp]           ROWVERSION     NOT NULL,
    CONSTRAINT [PK_WeightedSystem] PRIMARY KEY CLUSTERED ([WeightedSystemId] ASC),
    CONSTRAINT [FK_WeightedSystem_GlobalTrainingGym] FOREIGN KEY ([GlobalTrainingGymId]) REFERENCES [dbo].[GlobalTrainingGym] ([GlobalTrainingGymId])
);

