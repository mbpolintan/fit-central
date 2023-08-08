CREATE TABLE [dbo].[PaymentMethod] (
    [PaymentMethodId]     INT        IDENTITY (1, 1) NOT NULL,
    [MemberId]            INT        NULL,
    [IsDefault]           BIT        CONSTRAINT [DF_PaymentMethod_IsDefault] DEFAULT ((0)) NOT NULL,
    [IsActive]            BIT        CONSTRAINT [DF_PaymentMethod_IsActive] DEFAULT ((0)) NOT NULL,
    [PaymentSourceId]     INT        NULL,
    [PaymentMethodTypeId] INT        NULL,
    [PaidByOtherMemberId] INT        NULL,
    [DateCreated]         DATETIME   NULL,
    [DateModified]        DATETIME   NULL,
    [TimeStamp]           ROWVERSION NOT NULL,
    CONSTRAINT [PK_PaymentMethod] PRIMARY KEY CLUSTERED ([PaymentMethodId] ASC),
    CONSTRAINT [FK_PaymentMethod_Member] FOREIGN KEY ([MemberId]) REFERENCES [dbo].[Member] ([MemberId]),
    CONSTRAINT [FK_PaymentMethod_PaidByOtherMember] FOREIGN KEY ([PaidByOtherMemberId]) REFERENCES [dbo].[Member] ([MemberId]),
    CONSTRAINT [FK_PaymentMethod_PaymentMethodType] FOREIGN KEY ([PaymentMethodTypeId]) REFERENCES [dbo].[PaymentMethodType] ([PaymentMethodTypeId]),
    CONSTRAINT [FK_PaymentMethod_PaymentSource] FOREIGN KEY ([PaymentSourceId]) REFERENCES [dbo].[PaymentSource] ([PaymentSourceId])
);



