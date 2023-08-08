CREATE TABLE [dbo].[MemberStatus] (
    [MemberStatusId] INT           IDENTITY (1, 1) NOT NULL,
    [Status]         NVARCHAR (40) NOT NULL,
    [StatusOrder]    INT           NOT NULL,
    [CreatedById]    INT           NOT NULL,
    [DateCreated]    DATETIME      NOT NULL,
    [ModifiedById]   INT           NULL,
    [DateModified]   DATETIME      NULL,
    [TimeStamp]      ROWVERSION    NOT NULL,
    CONSTRAINT [PK_MembersStatus] PRIMARY KEY CLUSTERED ([MemberStatusId] ASC),
    CONSTRAINT [FK_MemberStatusUserCreated] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_MemberStatusUserModified] FOREIGN KEY ([ModifiedById]) REFERENCES [dbo].[AppUser] ([AppUserId])
);



