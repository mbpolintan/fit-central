CREATE TABLE [dbo].[ClassLocationAmenities] (
    [SCClassLocationAmenitiesId] INT            IDENTITY (1, 1) NOT NULL,
    [SCClassLocationId]          INT            NOT NULL,
    [Id]                         INT            NULL,
    [Name]                       NVARCHAR (150) NULL,
    [DateCreated]                DATETIME       NOT NULL,
    [DateModified]               DATETIME       NULL,
    [TimeStamp]                  ROWVERSION     NOT NULL,
    CONSTRAINT [PK_ClassLocationAmenities] PRIMARY KEY CLUSTERED ([SCClassLocationAmenitiesId] ASC),
    CONSTRAINT [FK_ClassLocationAmenities_ClassLocation] FOREIGN KEY ([SCClassLocationId]) REFERENCES [dbo].[ClassLocation] ([SCClassLocationId]) ON DELETE CASCADE ON UPDATE CASCADE
);



