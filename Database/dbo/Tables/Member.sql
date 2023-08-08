CREATE TABLE [dbo].[Member] (
    [MemberId]                         INT             IDENTITY (1, 1) NOT NULL,
    [StudioId]                         INT             NOT NULL,
    [MBId]                             NVARCHAR (30)   NULL,
    [MBUniqueId]                       INT             NULL,
    [MemberCategoryId]                 INT             NULL,
    [MemberStatusId]                   INT             NOT NULL,
    [DisplayName]                      NVARCHAR (255)  NULL,
    [LastName]                         NVARCHAR (255)  NULL,
    [FirstName]                        NVARCHAR (255)  NULL,
    [MiddleName]                       NVARCHAR (255)  NULL,
    [MobilePhone]                      NVARCHAR (255)  NULL,
    [ScannerMobile]                    NVARCHAR (20)   NULL,
    [Email]                            NVARCHAR (255)  NULL,
    [Height]                           NUMERIC (8, 2)  NULL,
    [GenderId]                         INT             NOT NULL,
    [DOB]                              DATE            NULL,
    [CreatedById]                      INT             NOT NULL,
    [DateCreated]                      DATETIME        NOT NULL,
    [ModifiedById]                     INT             NULL,
    [DateModified]                     DATETIME        NULL,
    [TimeStamp]                        ROWVERSION      NOT NULL,
    [Image]                            VARBINARY (MAX) NULL,
    [HomePhone]                        NVARCHAR (100)  NULL,
    [WorkPhone]                        NVARCHAR (100)  NULL,
    [AddressLine1]                     NVARCHAR (100)  NULL,
    [AddressLine2]                     NVARCHAR (100)  NULL,
    [City]                             NVARCHAR (100)  NULL,
    [PostalCode]                       NVARCHAR (100)  NULL,
    [State]                            NVARCHAR (100)  NULL,
    [Country]                          NVARCHAR (100)  NULL,
    [Active]                           BIT             CONSTRAINT [DF_Member_Active] DEFAULT ((0)) NULL,
    [Action]                           NVARCHAR (20)   NULL,
    [PhotoUrl]                         NVARCHAR (500)  NULL,
    [MBCreationDate]                   DATETIME        NULL,
    [MBLastModifiedDateTime]           DATETIME        NULL,
    [SendAccountEmails]                BIT             CONSTRAINT [DF_Member_SendAccountEmails] DEFAULT ((0)) NULL,
    [SendAccountTexts]                 BIT             CONSTRAINT [DF_Member_SendAccountTexts] DEFAULT ((0)) NULL,
    [SendPromotionalEmails]            BIT             CONSTRAINT [DF_Member_SendPromotionalEmails] DEFAULT ((0)) NULL,
    [SendPromotionalTexts]             BIT             CONSTRAINT [DF_Member_SendPromotionalTexts] DEFAULT ((0)) NULL,
    [SendScheduleEmails]               BIT             CONSTRAINT [DF_Member_SendScheduleEmails] DEFAULT ((0)) NULL,
    [SendScheduleTexts]                BIT             CONSTRAINT [DF_Member_SendScheduleTexts] DEFAULT ((0)) NULL,
    [EmergencyContactInfoName]         NVARCHAR (100)  NULL,
    [EmergencyContactInfoEmail]        NVARCHAR (100)  NULL,
    [EmergencyContactInfoPhone]        NVARCHAR (100)  NULL,
    [EmergencyContactInfoRelationship] NVARCHAR (100)  NULL,
    [IsInitialSynced]                  BIT             CONSTRAINT [DF_Member_IsInitialSynced] DEFAULT ((0)) NOT NULL,
    [IsDeactivated]                    BIT             CONSTRAINT [DF_Member_IsDeactivated] DEFAULT ((0)) NOT NULL,
    [CreditCardLastFour]               VARCHAR (4)     NULL,
    [DirectDebitLastFour]              VARCHAR (4)     NULL,
    [CreditCardExpDate]                DATETIME        NULL,
    [PaidById]                         INT             NULL,
    [PaidByPaymentType]                NVARCHAR (30)   NULL,
    [ReferredBy]                       NVARCHAR (255)  NULL,
    [ShirtSizeId]                      INT             NULL,
    CONSTRAINT [PK_Member] PRIMARY KEY CLUSTERED ([MemberId] ASC),
    CONSTRAINT [FK_GenderMember] FOREIGN KEY ([GenderId]) REFERENCES [dbo].[Gender] ([GenderId]),
    CONSTRAINT [FK_Member_Member] FOREIGN KEY ([MemberId]) REFERENCES [dbo].[Member] ([MemberId]),
    CONSTRAINT [FK_Member_ShirtSize] FOREIGN KEY ([ShirtSizeId]) REFERENCES [dbo].[ShirtSize] ([ShirtSizeId]),
    CONSTRAINT [FK_MemberCategoryMember] FOREIGN KEY ([MemberCategoryId]) REFERENCES [dbo].[MemberCategory] ([MemberCategoryId]),
    CONSTRAINT [FK_MemberStatusMember] FOREIGN KEY ([MemberStatusId]) REFERENCES [dbo].[MemberStatus] ([MemberStatusId])
);


































GO
CREATE NONCLUSTERED INDEX [NonClusteredIndex-20201214-072546]
    ON [dbo].[Member]([StudioId] ASC, [MemberStatusId] ASC, [GenderId] ASC);

