CREATE TABLE [dbo].[MBClassSchedule] (
    [SiteId]             INT            NULL,
    [LocationId]         INT            NULL,
    [ClassScheduleId]    INT            NULL,
    [ClassDescriptionId] INT            NULL,
    [MaxCapacity]        INT            NULL,
    [WebCapacity]        INT            NULL,
    [StaffId]            INT            NULL,
    [StaffName]          NVARCHAR (200) NULL,
    [IsActive]           BIT            NULL,
    [StartDate]          NVARCHAR (20)  NULL,
    [EndDate]            NVARCHAR (20)  NULL,
    [StartTime]          NVARCHAR (20)  NULL,
    [EndTime]            NVARCHAR (20)  NULL,
    [AssistantOneId]     INT            NULL,
    [AssistantOneName]   NVARCHAR (200) NULL,
    [AssistantTwoId]     INT            NULL,
    [AssistantTwoName]   NVARCHAR (200) NULL,
    [DaysOfWeek]         NVARCHAR (255) NULL,
    [DateCreated]        DATETIME       NULL,
    [DateModified]       DATETIME       NULL,
    [TimeStamp]          ROWVERSION     NOT NULL
);

