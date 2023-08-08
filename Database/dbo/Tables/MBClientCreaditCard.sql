CREATE TABLE [dbo].[MBClientCreaditCard] (
    [MemberCreaditCardId] INT              IDENTITY (1, 1) NOT NULL,
    [MBClientId]          UNIQUEIDENTIFIER NOT NULL,
    [MBUniqueId]          INT              NULL,
    [SiteId]              INT              NULL,
    [Address]             NVARCHAR (150)   NULL,
    [CardHolder]          NVARCHAR (150)   NULL,
    [CardNumber]          VARCHAR (50)     NULL,
    [CardType]            NVARCHAR (50)    NULL,
    [City]                NVARCHAR (100)   NULL,
    [ExpMonth]            VARCHAR (2)      NULL,
    [ExpYear]             VARCHAR (4)      NULL,
    [LastFour]            VARCHAR (4)      NULL,
    [PostalCode]          VARCHAR (50)     NULL,
    [State]               VARCHAR (50)     NULL,
    CONSTRAINT [PK_MBClientCreaditCard] PRIMARY KEY CLUSTERED ([MemberCreaditCardId] ASC)
);

