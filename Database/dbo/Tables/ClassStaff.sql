﻿CREATE TABLE [dbo].[ClassStaff] (
    [SCClassStaffId]           INT             IDENTITY (1, 1) NOT NULL,
    [SCClassId]                INT             NOT NULL,
    [Address]                  NVARCHAR (50)   NULL,
    [AppointmentInstructor]    BIT             NULL,
    [AlwaysAllowDoubleBooking] BIT             NULL,
    [Bio]                      NVARCHAR (MAX)  NULL,
    [City]                     NVARCHAR (50)   NULL,
    [Country]                  NVARCHAR (50)   NULL,
    [Email]                    NVARCHAR (150)  NULL,
    [FirstName]                NVARCHAR (100)  NULL,
    [HomePhone]                NVARCHAR (50)   NULL,
    [Id]                       INT             NULL,
    [IndependentContractor]    BIT             NULL,
    [IsMale]                   BIT             NULL,
    [LastName]                 NVARCHAR (150)  NULL,
    [MobilePhone]              NVARCHAR (20)   NULL,
    [Name]                     NVARCHAR (150)  NULL,
    [PostalCode]               NVARCHAR (15)   NULL,
    [ClassTeacher]             BIT             NULL,
    [SortOrder]                INT             NULL,
    [State]                    NVARCHAR (20)   NULL,
    [WorkPhone]                NVARCHAR (20)   NULL,
    [ImageUrl]                 NVARCHAR (1000) NULL,
    [ClassAssistantOne]        BIT             CONSTRAINT [DF_ClassStaff_ClassAssistant] DEFAULT ((0)) NULL,
    [ClassAssistantOneId]      INT             NULL,
    [ClassAssistantOneName]    NVARCHAR (50)   NULL,
    [ClassAssistantTwo]        BIT             CONSTRAINT [DF_ClassStaff_ClassAssistant2] DEFAULT ((0)) NULL,
    [ClassAssistantTwoId]      INT             NULL,
    [ClassAssistantTwoName]    NVARCHAR (50)   NULL,
    [DateCreated]              DATETIME        NOT NULL,
    [DateModified]             DATETIME        NULL,
    [TimeStamp]                ROWVERSION      NOT NULL,
    CONSTRAINT [PK_ClassStaff] PRIMARY KEY CLUSTERED ([SCClassStaffId] ASC),
    CONSTRAINT [FK_ClassStaff_Class] FOREIGN KEY ([SCClassId]) REFERENCES [dbo].[Class] ([SCClassId]) ON DELETE CASCADE ON UPDATE CASCADE
);



