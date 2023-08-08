CREATE TABLE [dbo].[ChallengeAppointment] (
    [ChallengeAppointmentId] INT        IDENTITY (1, 1) NOT NULL,
    [ChallengeBookingId]     INT        NULL,
    [MemberId]               INT        NULL,
    [AppointmentTimeSlot]    DATETIME   NULL,
    [IsAvailable]            BIT        NULL,
    [DateCreated]            DATETIME   NULL,
    [DateModified]           DATETIME   NULL,
    [TimeStamp]              ROWVERSION NULL,
    CONSTRAINT [PK_ChallengeAppointment] PRIMARY KEY CLUSTERED ([ChallengeAppointmentId] ASC),
    CONSTRAINT [FK_ChallengeAppointment_ChallengeBooking] FOREIGN KEY ([ChallengeBookingId]) REFERENCES [dbo].[ChallengeBooking] ([ChallengeBookingId]),
    CONSTRAINT [FK_ChallengeAppointment_Member] FOREIGN KEY ([MemberId]) REFERENCES [dbo].[Member] ([MemberId])
);

