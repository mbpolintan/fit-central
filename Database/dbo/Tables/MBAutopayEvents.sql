CREATE TABLE [dbo].[MBAutopayEvents] (
    [AutoPatEventId]   INT              IDENTITY (1, 1) NOT NULL,
    [MBContractId]     UNIQUEIDENTIFIER NOT NULL,
    [ClientContractId] INT              NULL,
    [ChargeAmount]     MONEY            NULL,
    [PaymentMethod]    NVARCHAR (100)   NULL,
    [ScheduleDate]     DATETIME         NULL,
    CONSTRAINT [PK_MBAutopayEvents] PRIMARY KEY CLUSTERED ([AutoPatEventId] ASC),
    CONSTRAINT [FK_MBAutopayEventsMBContract] FOREIGN KEY ([MBContractId]) REFERENCES [dbo].[MBContract] ([MBContractId])
);





