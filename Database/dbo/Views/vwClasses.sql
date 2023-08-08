

CREATE VIEW [dbo].[vwClasses]
AS
/****** Script for SelectTopNRows command from SSMS  ******/
SELECT a.[SCClassId]
      ,a.[StudioId]
	  ,d.[MindbodyStudioId] as [SiteId]
      ,a.[MBClassScheduleId]
      ,a.[MBLocationId]
      ,a.[MBResourceId]
      ,a.[MBClassDescriptionId]
	  ,b.[Name] as ClassName
      ,a.[MBStaffId]
	  ,c.[Name] as StaffName
      ,a.[MaxCapacity]
      ,a.[WebCapacity]
      ,a.[TotalBooked]
      ,a.[TotalBookedWaitlist]
      ,a.[WebBooked]
      ,a.[SemesterId]
      ,a.[IsCanceled]
      ,a.[Substitute]
      ,a.[Active]
      ,a.[IsWaitlistAvailable]
      ,a.[IsEnrolled]
      ,a.[HideCancel]
      ,a.[Id] as [ClassId]
      ,a.[IsAvailable]
      ,a.[StartDateTime]
      ,a.[EndDateTime]
      ,a.[LastModifiedDateTime]
      ,a.[BookingWindowStartDateTime]
      ,a.[BookingWindowEndDateTime]
      ,a.[BookingWindowDailyStartTime]
      ,a.[BookingWindowDailyEndTime]
      ,a.[BookingStatus]
      ,a.[VirtualStreamLink]
      ,a.[DateCreated]
      ,a.[DateModified]
      ,a.[TimeStamp]
  FROM [dbo].[Class] a
outer apply
	(select top 1 * from ClassDescription b where a.MBClassDescriptionId = b.Id and a.StudioId = b.StudioId ) as  b
outer apply
	(select top 1 * from ClassStaff c where a.MBStaffId = c.Id and a.SCClassId = c.SCClassId) as  c
outer apply
	(select top 1 * from MBInterface d where a.StudioId = d.StudioId) as  d