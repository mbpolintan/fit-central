CREATE TABLE [dbo].[Challenge] (
    [ChallengeId]         INT        IDENTITY (1, 1) NOT NULL,
    [ChallengeNo]         INT        NOT NULL,
    [StartDate]           DATE       NOT NULL,
    [EndDate]             DATE       NOT NULL,
    [StartScanFromDate]   DATE       NULL,
    [StartScanToDate]     DATE       NULL,
    [MidScanFromDate]     DATE       NULL,
    [MidScanToDate]       DATE       NULL,
    [EndScanFromDate]     DATE       NULL,
    [EndScanToDate]       DATE       NULL,
    [DateCreated]         DATETIME   NOT NULL,
    [CreatedById]         INT        NOT NULL,
    [DateModified]        DATETIME   NULL,
    [ModifiedById]        INT        NULL,
    [TimeStamp]           ROWVERSION NOT NULL,
    [GlobalTrainingGymId] INT        NOT NULL,
    CONSTRAINT [PK_Challenge] PRIMARY KEY CLUSTERED ([ChallengeId] ASC)
);



