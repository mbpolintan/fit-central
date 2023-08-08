CREATE TABLE [dbo].[MBContract] (
    [MBContractId]                 UNIQUEIDENTIFIER NOT NULL,
    [Id]                           INT              NOT NULL,
    [SiteId]                       INT              NULL,
    [ClientId]                     NVARCHAR (30)    NULL,
    [OriginationLocationId]        INT              NULL,
    [ContractId]                   INT              NULL,
    [ContractName]                 NVARCHAR (255)   NULL,
    [AgreementDate]                DATETIME         NULL,
    [StartDate]                    DATETIME         NULL,
    [EndDate]                      DATETIME         NULL,
    [AutopayStatus]                NVARCHAR (50)    NULL,
    [ContractSoldByStaffId]        INT              NULL,
    [ContractSoldByStaffFirstName] NVARCHAR (50)    NULL,
    [ContractSoldByStaffLastName]  NVARCHAR (100)   NULL,
    [ContractOriginationLocation]  INT              NULL,
    [IsAutoRenewing]               BIT              NULL,
    CONSTRAINT [PK_MBContract_1] PRIMARY KEY CLUSTERED ([MBContractId] ASC)
);







