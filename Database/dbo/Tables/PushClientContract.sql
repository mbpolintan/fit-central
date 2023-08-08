﻿CREATE TABLE [dbo].[PushClientContract] (
    [PushClientContractId]         INT            IDENTITY (1, 1) NOT NULL,
    [ClientWebhookId]              INT            NULL,
    [IsSynced]                     BIT            NULL,
    [SiteId]                       INT            NULL,
    [ClientId]                     NVARCHAR (30)  NULL,
    [ClientUniqueId]               INT            NULL,
    [ClientFirstName]              NVARCHAR (50)  NULL,
    [ClientLastName]               NVARCHAR (100) NULL,
    [ClientEmail]                  NVARCHAR (100) NULL,
    [AgreementDateTime]            DATETIME       NULL,
    [ContractSoldByStaffId]        INT            NULL,
    [ContractSoldByStaffFirstName] NVARCHAR (50)  NULL,
    [ContractSoldByStaffLastName]  NVARCHAR (100) NULL,
    [ContractOriginationLocation]  INT            NULL,
    [ContractId]                   INT            NULL,
    [ContractName]                 NVARCHAR (200) NULL,
    [ClientContractId]             INT            NULL,
    [ContractStartDateTime]        DATETIME       NULL,
    [ContractEndDateTime]          DATETIME       NULL,
    [IsAutoRenewing]               BIT            NULL,
    CONSTRAINT [PK_PushClientContract] PRIMARY KEY CLUSTERED ([PushClientContractId] ASC),
    CONSTRAINT [FK_PushClientContract_ClientWebhook] FOREIGN KEY ([ClientWebhookId]) REFERENCES [dbo].[ClientWebhook] ([ClientWebhookId])
);

