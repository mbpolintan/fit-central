CREATE TABLE [dbo].[AppFunction] (
    [AppFunctionId] INT           IDENTITY (1, 1) NOT NULL,
    [FunctionName]  NVARCHAR (20) NOT NULL,
    [CreatedById]   INT           NOT NULL,
    [DateCreated]   DATETIME      NOT NULL,
    [ModifiedById]  INT           NULL,
    [DateModified]  DATETIME      NULL,
    [TimeStamp]     ROWVERSION    NOT NULL,
    CONSTRAINT [PK_AppFunction] PRIMARY KEY CLUSTERED ([AppFunctionId] ASC),
    CONSTRAINT [FK_AppFunctionUserCreated] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[AppUser] ([AppUserId]),
    CONSTRAINT [FK_AppFunctionUserModified] FOREIGN KEY ([ModifiedById]) REFERENCES [dbo].[AppUser] ([AppUserId])
);

