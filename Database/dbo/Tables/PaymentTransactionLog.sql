CREATE TABLE [dbo].[PaymentTransactionLog] (
    [PaymentTransactionLogId] INT            IDENTITY (1, 1) NOT NULL,
    [StudioId]                INT            NOT NULL,
    [PaymentGatewayId]        INT            NULL,
    [TransactionDate]         DATETIME       NULL,
    [ProcessedById]           INT            NULL,
    [MemberId]                INT            NULL,
    [PaymentMethodId]         INT            NULL,
    [Amount]                  MONEY          NULL,
    [Status]                  BIT            NULL,
    [StatusDescription]       NVARCHAR (500) NULL,
    [Reconciled]              BIT            NULL,
    [ReconciledComments]      NVARCHAR (500) NULL,
    [DateCreated]             DATETIME       NOT NULL,
    [TimeStamp]               ROWVERSION     NOT NULL,
    CONSTRAINT [PK_PaymentTransactionLog] PRIMARY KEY CLUSTERED ([PaymentTransactionLogId] ASC),
    CONSTRAINT [FK_PaymentTransactionLog_Member] FOREIGN KEY ([MemberId]) REFERENCES [dbo].[Member] ([MemberId]),
    CONSTRAINT [FK_PaymentTransactionLog_PaymentGateway] FOREIGN KEY ([PaymentGatewayId]) REFERENCES [dbo].[PaymentGateway] ([PaymentGatewayId]),
    CONSTRAINT [FK_PaymentTransactionLog_PaymentMethod] FOREIGN KEY ([PaymentMethodId]) REFERENCES [dbo].[PaymentMethod] ([PaymentMethodId]),
    CONSTRAINT [FK_PaymentTransactionLog_ProcessedBy] FOREIGN KEY ([ProcessedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_PaymentTransactionLog_Studio] FOREIGN KEY ([StudioId]) REFERENCES [dbo].[Studio] ([StudioId])
);

