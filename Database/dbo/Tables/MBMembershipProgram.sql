CREATE TABLE [dbo].[MBMembershipProgram] (
    [Id]             INT            NOT NULL,
    [Name]           NVARCHAR (50)  NULL,
    [ScheduleType]   NVARCHAR (20)  NULL,
    [CancelOffset]   INT            NULL,
    [ContentFormats] NVARCHAR (150) NULL,
    CONSTRAINT [PK_MBMembershipProgram_1] PRIMARY KEY CLUSTERED ([Id] ASC)
);

