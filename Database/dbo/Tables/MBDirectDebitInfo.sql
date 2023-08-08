CREATE TABLE [dbo].[MBDirectDebitInfo] (
    [MBDirectDebitInfoId] INT            IDENTITY (1, 1) NOT NULL,
    [ClientId]            NVARCHAR (30)  NOT NULL,
    [MBUniqueId]          INT            NOT NULL,
    [SiteId]              INT            NOT NULL,
    [StudioId]            INT            NOT NULL,
    [NameOnAccount]       NVARCHAR (150) NULL,
    [RoutingNumber]       VARCHAR (50)   NULL,
    [AccountNumber]       VARCHAR (4)    NULL,
    [AccountType]         VARCHAR (50)   NULL,
    [DateCreated]         DATETIME       NOT NULL,
    [DateModified]        DATETIME       NULL,
    [TimeStamp]           ROWVERSION     NOT NULL,
    CONSTRAINT [PK_MBDirectDebitInfo] PRIMARY KEY CLUSTERED ([MBDirectDebitInfoId] ASC)
);

