﻿CREATE TABLE [dbo].[ClassLocation] (
    [SCClassLocationId]    INT             IDENTITY (1, 1) NOT NULL,
    [StudioId]             INT             NOT NULL,
    [Id]                   INT             NULL,
    [Address]              NVARCHAR (100)  NULL,
    [Address2]             NVARCHAR (100)  NULL,
    [BusinessDescription]  NVARCHAR (255)  NULL,
    [City]                 NVARCHAR (50)   NULL,
    [Description]          NVARCHAR (100)  NULL,
    [HasClasses]           BIT             NULL,
    [Latitude]             DECIMAL (11, 8) NULL,
    [Longitude]            DECIMAL (11, 8) NULL,
    [Name]                 NVARCHAR (50)   NULL,
    [Phone]                NVARCHAR (50)   NULL,
    [PhoneExtension]       NVARCHAR (50)   NULL,
    [PostalCode]           NVARCHAR (15)   NULL,
    [SiteId]               INT             NULL,
    [StateProvCode]        NVARCHAR (10)   NULL,
    [Tax1]                 NUMERIC (8, 2)  NULL,
    [Tax2]                 NUMERIC (8, 2)  NULL,
    [Tax3]                 NUMERIC (8, 2)  NULL,
    [Tax4]                 NUMERIC (8, 2)  NULL,
    [Tax5]                 NUMERIC (8, 2)  NULL,
    [TotalNumberOfRatings] TINYINT         NULL,
    [AverageRating]        NUMERIC (8, 2)  NULL,
    [TotalNumberOfDeals]   INT             NULL,
    [DateCreated]          DATETIME        NOT NULL,
    [DateModified]         DATETIME        NULL,
    [TimeStamp]            ROWVERSION      NOT NULL,
    CONSTRAINT [PK_MBLocation] PRIMARY KEY CLUSTERED ([SCClassLocationId] ASC),
    CONSTRAINT [FK_ClassLocation_Studio] FOREIGN KEY ([StudioId]) REFERENCES [dbo].[Studio] ([StudioId])
);



