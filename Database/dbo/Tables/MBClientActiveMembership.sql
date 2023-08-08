CREATE TABLE [dbo].[MBClientActiveMembership] (
    [ActiveMembershipId] UNIQUEIDENTIFIER NOT NULL,
    [ClientId]           NVARCHAR (30)    NULL,
    [MembershipId]       INT              NULL,
    [ActiveDate]         DATETIME         NULL,
    [ExpirationDate]     DATETIME         NULL,
    [PaymentDate]        DATETIME         NULL,
    [Count]              INT              NULL,
    [Current]            BIT              NULL,
    [Id]                 INT              NULL,
    [ProductId]          INT              NULL,
    [Name]               NVARCHAR (100)   NULL,
    [Remaining]          INT              NULL,
    [SiteId]             INT              NULL,
    [Action]             NVARCHAR (15)    NULL,
    [IconCode]           NVARCHAR (50)    NULL,
    [ProgramId]          INT              NULL,
    CONSTRAINT [PK_MBClientActiveMembership] PRIMARY KEY CLUSTERED ([ActiveMembershipId] ASC),
    CONSTRAINT [FK_MBClientActiveMembership_MBMembershipProgram] FOREIGN KEY ([ProgramId]) REFERENCES [dbo].[MBMembershipProgram] ([Id])
);



