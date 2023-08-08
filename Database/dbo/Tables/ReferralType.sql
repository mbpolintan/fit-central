CREATE TABLE [dbo].[ReferralType] (
    [ReferralTypeId] INT           IDENTITY (1, 1) NOT NULL,
    [StudioId]       INT           NOT NULL,
    [Description]    NVARCHAR (50) NOT NULL,
    [DateCreated]    DATETIME      NULL,
    [DateModified]   DATETIME      NULL,
    [TimeStamp]      ROWVERSION    NOT NULL,
    CONSTRAINT [PK_ReferralType] PRIMARY KEY CLUSTERED ([ReferralTypeId] ASC)
);

