CREATE TABLE [dbo].[Studio] (
    [StudioId]                INT            IDENTITY (1, 1) NOT NULL,
    [StudioName]              NVARCHAR (30)  NULL,
    [ContactNumber]           NVARCHAR (20)  NULL,
    [Email]                   NVARCHAR (40)  NULL,
    [Postcode]                NVARCHAR (10)  NULL,
    [ActivationCode]          NVARCHAR (150) NULL,
    [ActivationLink]          NVARCHAR (250) NULL,
    [SiteId]                  INT            NULL,
    [CreatedById]             INT            NOT NULL,
    [DateCreated]             DATETIME       NOT NULL,
    [ModifiedById]            INT            NULL,
    [DateModified]            DATETIME       NULL,
    [TimeStamp]               ROWVERSION     NOT NULL,
    [ChallengeScanProductId]  INT            NULL,
    [IndividualScanProductId] INT            NULL,
    [TimeZoneId]              NVARCHAR (255) NULL,
    CONSTRAINT [PK_Location] PRIMARY KEY CLUSTERED ([StudioId] ASC)
);











