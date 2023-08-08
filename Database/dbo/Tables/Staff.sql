﻿CREATE TABLE [dbo].[Staff] (
    [StaffId]                  INT            IDENTITY (1, 1) NOT NULL,
    [Id]                       INT            NOT NULL,
    [SiteId]                   INT            NOT NULL,
    [FirstName]                NVARCHAR (100) NULL,
    [LastName]                 NVARCHAR (100) NULL,
    [Email]                    NVARCHAR (100) NULL,
    [Address]                  NVARCHAR (150) NULL,
    [PostalCode]               NVARCHAR (100) NULL,
    [City]                     NVARCHAR (100) NULL,
    [State]                    NVARCHAR (100) NULL,
    [Country]                  NVARCHAR (100) NULL,
    [MobilePhone]              NVARCHAR (100) NULL,
    [HomePhone]                NVARCHAR (100) NULL,
    [WorkPhone]                NVARCHAR (100) NULL,
    [IsMale]                   BIT            CONSTRAINT [DF_Staff_IsMale] DEFAULT ((0)) NOT NULL,
    [AppointmentInstructor]    BIT            CONSTRAINT [DF_Staff_AppointmentInstructor] DEFAULT ((0)) NOT NULL,
    [AlwaysAllowDoubleBooking] BIT            CONSTRAINT [DF_Staff_AlwaysAllowDoubleBooking] DEFAULT ((0)) NOT NULL,
    [IndependentContractor]    BIT            CONSTRAINT [DF_Staff_IndependentContractor] DEFAULT ((0)) NOT NULL,
    [ClassTeacher]             BIT            CONSTRAINT [DF_Staff_ClassTeacher] DEFAULT ((0)) NOT NULL,
    [SortOrder]                INT            NULL,
    [ImageUrl]                 NVARCHAR (500) NULL,
    CONSTRAINT [PK_Staff] PRIMARY KEY CLUSTERED ([StaffId] ASC)
);
