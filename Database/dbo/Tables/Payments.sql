CREATE TABLE [dbo].[Payments] (
    [PaymentId]          INT            IDENTITY (1, 1) NOT NULL,
    [PurchaseId]         INT            NOT NULL,
    [Id]                 INT            NULL,
    [Amount]             MONEY          NULL,
    [Method]             INT            NULL,
    [Type]               NVARCHAR (50)  NULL,
    [Notes]              NVARCHAR (500) NULL,
    [ReconciledById]     INT            NULL,
    [Reconciled]         BIT            CONSTRAINT [DF_Payments_Reconciled] DEFAULT ((0)) NOT NULL,
    [ReconciledDatetime] DATETIME       NULL,
    [TimeStamp]          ROWVERSION     NOT NULL,
    CONSTRAINT [PK_Payments] PRIMARY KEY CLUSTERED ([PaymentId] ASC),
    CONSTRAINT [FK_Payments_AppUser] FOREIGN KEY ([ReconciledById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_Payments_Purchases] FOREIGN KEY ([PurchaseId]) REFERENCES [dbo].[Purchases] ([PurchaseId])
);



