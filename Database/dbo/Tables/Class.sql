﻿CREATE TABLE [dbo].[Class] (
    [SCClassId]                   INT             IDENTITY (1, 1) NOT NULL,
    [StudioId]                    INT             NOT NULL,
    [MBClassScheduleId]           INT             NULL,
    [MBLocationId]                INT             NULL,
    [MBResourceId]                INT             NULL,
    [MBClassDescriptionId]        INT             NULL,
    [MBStaffId]                   INT             NULL,
    [MaxCapacity]                 INT             NULL,
    [WebCapacity]                 INT             NULL,
    [TotalBooked]                 INT             NULL,
    [TotalBookedWaitlist]         INT             NULL,
    [WebBooked]                   INT             NULL,
    [SemesterId]                  INT             NULL,
    [IsCanceled]                  BIT             NULL,
    [Substitute]                  BIT             NULL,
    [Active]                      BIT             NULL,
    [IsWaitlistAvailable]         BIT             NULL,
    [IsEnrolled]                  BIT             NULL,
    [HideCancel]                  BIT             NULL,
    [Id]                          INT             NULL,
    [IsAvailable]                 BIT             NULL,
    [StartDateTime]               DATETIME        NULL,
    [EndDateTime]                 DATETIME        NULL,
    [LastModifiedDateTime]        DATETIME        NULL,
    [BookingWindowStartDateTime]  DATETIME        NULL,
    [BookingWindowEndDateTime]    DATETIME        NULL,
    [BookingWindowDailyStartTime] DATETIME        NULL,
    [BookingWindowDailyEndTime]   DATETIME        NULL,
    [BookingStatus]               NVARCHAR (150)  NULL,
    [VirtualStreamLink]           NVARCHAR (1000) NULL,
    [DateCreated]                 DATETIME        NOT NULL,
    [DateModified]                DATETIME        NULL,
    [TimeStamp]                   ROWVERSION      NOT NULL,
    CONSTRAINT [PK_Classes] PRIMARY KEY CLUSTERED ([SCClassId] ASC),
    CONSTRAINT [FK_Class_Studio] FOREIGN KEY ([StudioId]) REFERENCES [dbo].[Studio] ([StudioId])
);



