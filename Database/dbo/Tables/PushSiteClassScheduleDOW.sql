CREATE TABLE [dbo].[PushSiteClassScheduleDOW] (
    [PushSiteClassScheduleDOWId] INT          IDENTITY (1, 1) NOT NULL,
    [PushSiteClassScheduleId]    INT          NULL,
    [Day]                        VARCHAR (10) NULL,
    [DateCreated]                DATETIME     NULL,
    [TimeStamp]                  ROWVERSION   NOT NULL,
    CONSTRAINT [PK_PushSiteClassScheduleDOW] PRIMARY KEY CLUSTERED ([PushSiteClassScheduleDOWId] ASC),
    CONSTRAINT [FK_PushSiteClassScheduleDOW_PushSiteClassSchedule] FOREIGN KEY ([PushSiteClassScheduleId]) REFERENCES [dbo].[PushSiteClassSchedule] ([PushSiteClassScheduleId])
);

