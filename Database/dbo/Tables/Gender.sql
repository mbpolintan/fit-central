CREATE TABLE [dbo].[Gender] (
    [GenderId]     INT           IDENTITY (1, 1) NOT NULL,
    [Description]  NVARCHAR (50) NOT NULL,
    [CreatedById]  INT           NOT NULL,
    [DateCreated]  DATETIME      NOT NULL,
    [ModifiedById] INT           NULL,
    [DateModified] DATETIME      NULL,
    [TimeStamp]    ROWVERSION    NOT NULL,
    CONSTRAINT [PK_Gender] PRIMARY KEY CLUSTERED ([GenderId] ASC),
    CONSTRAINT [FK_GenderUserCreated] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_GenderUserModified] FOREIGN KEY ([ModifiedById]) REFERENCES [dbo].[AppUser] ([AppUserId])
);



