CREATE TABLE [dbo].[PointsSystem] (
    [PointsSystemId]        INT            IDENTITY (1, 1) NOT NULL,
    [GlobalTrainingGymId]   INT            NOT NULL,
    [PointsAllocation]      INT            NULL,
    [BeforeAndAfterPicture] INT            NULL,
    [InbodyScore]           INT            NULL,
    [WeightLoss]            DECIMAL (6, 3) NULL,
    [PBFLoss]               DECIMAL (6, 3) NULL,
    [SMMGain]               DECIMAL (6, 3) NULL,
    [VFLLoss]               DECIMAL (6, 3) NULL,
    [ClassAttended]         INT            NULL,
    [DateCreated]           DATETIME       NOT NULL,
    [DateModified]          DATETIME       NULL,
    [TimeStamp]             ROWVERSION     NOT NULL,
    CONSTRAINT [PK_PointsSystem] PRIMARY KEY CLUSTERED ([PointsSystemId] ASC),
    CONSTRAINT [FK_PointsSystem_GlobalTrainingGym] FOREIGN KEY ([GlobalTrainingGymId]) REFERENCES [dbo].[GlobalTrainingGym] ([GlobalTrainingGymId])
);

