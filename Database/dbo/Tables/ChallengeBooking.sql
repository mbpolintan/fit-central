CREATE TABLE [dbo].[ChallengeBooking] (
    [ChallengeBookingId]  INT        IDENTITY (1, 1) NOT NULL,
    [StudioId]            INT        NULL,
    [ChallengeId]         INT        NULL,
    [DateTimeSlot]        DATETIME   NULL,
    [AppointmentTimeSpan] INT        NULL,
    [DateCreated]         DATETIME   NOT NULL,
    [DateModified]        DATETIME   NULL,
    [TimeStamp]           ROWVERSION NULL,
    CONSTRAINT [PK_ChallengeBooking] PRIMARY KEY CLUSTERED ([ChallengeBookingId] ASC),
    CONSTRAINT [FK_ChallengeBooking_Challenge] FOREIGN KEY ([ChallengeId]) REFERENCES [dbo].[Challenge] ([ChallengeId]),
    CONSTRAINT [FK_ChallengeBooking_Studio] FOREIGN KEY ([StudioId]) REFERENCES [dbo].[Studio] ([StudioId])
);

