CREATE TABLE [dbo].[DateFilter] (
    [DateFilterId] INT          IDENTITY (1, 1) NOT NULL,
    [Description]  VARCHAR (15) NULL,
    [CreatedById]  INT          NOT NULL,
    [DateCreated]  DATETIME     NOT NULL,
    [ModifiedById] INT          NULL,
    [DateModified] DATETIME     NULL,
    [TimeStamp]    ROWVERSION   NULL,
    CONSTRAINT [PK_DateFilter] PRIMARY KEY CLUSTERED ([DateFilterId] ASC)
);

