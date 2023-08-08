CREATE TABLE [dbo].[ClassSchedule] (
    [SCClassScheduleId]          INT        IDENTITY (1, 1) NOT NULL,
    [StudioId]                   INT        NOT NULL,
    [Id]                         INT        NULL,
    [SemesterId]                 INT        NULL,
    [IsAvailable]                BIT        NULL,
    [StartDate]                  DATETIME   NULL,
    [EndDate]                    DATETIME   NULL,
    [StartTime]                  DATETIME   NULL,
    [EndTime]                    DATETIME   NULL,
    [DaySunday]                  BIT        CONSTRAINT [DF_ClassSchedule_DaySunday] DEFAULT ((0)) NULL,
    [DayMonday]                  BIT        CONSTRAINT [DF_ClassSchedule_DayMonday] DEFAULT ((0)) NULL,
    [DayTuesday]                 BIT        CONSTRAINT [DF_ClassSchedule_DayTuesday] DEFAULT ((0)) NULL,
    [DayWednesday]               BIT        CONSTRAINT [DF_ClassSchedule_DayWednesday] DEFAULT ((0)) NULL,
    [DayThursday]                BIT        CONSTRAINT [DF_ClassSchedule_DayThursday] DEFAULT ((0)) NULL,
    [DayFriday]                  BIT        CONSTRAINT [DF_ClassSchedule_DayFriday] DEFAULT ((0)) NULL,
    [DaySaturday]                BIT        CONSTRAINT [DF_ClassSchedule_DaySaturday] DEFAULT ((0)) NULL,
    [AllowOpenEnrollment]        BIT        CONSTRAINT [DF_ClassSchedule_AllowOpenEnrollment] DEFAULT ((0)) NULL,
    [AllowDateForwardEnrollment] BIT        NULL,
    [DateCreated]                DATETIME   NOT NULL,
    [DateModified]               DATETIME   NULL,
    [TimeStamp]                  ROWVERSION NOT NULL,
    CONSTRAINT [PK_ClassSchedule] PRIMARY KEY CLUSTERED ([SCClassScheduleId] ASC),
    CONSTRAINT [FK_ClassSchedule_Studio] FOREIGN KEY ([StudioId]) REFERENCES [dbo].[Studio] ([StudioId])
);



