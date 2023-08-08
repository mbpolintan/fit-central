
-- =============================================
-- Author:		JCP
-- Create date: 03/09/2020
-- Description:	get client's visits
-- =============================================
CREATE PROCEDURE [dbo].[uspGetClientVisits] 
	@MemberId int
AS
BEGIN
SET NOCOUNT ON;

    SELECT        
		visit.ClientId,
		mem.DisplayName,
		mem.MemberStatusId,
		visit.SiteId, 
		std.StudioId,
		CONVERT(VARCHAR(10), 
		CAST(CONVERT(datetime, SWITCHOFFSET(visit.StartDateTime, DATEPART(TZOFFSET, 
			visit.StartDateTime AT TIME ZONE std.TimeZoneId))) AS TIME), 0) + ' - '+ 
		CONVERT(VARCHAR(10), 
			CAST(CONVERT(datetime, SWITCHOFFSET(visit.EndDateTime, DATEPART(TZOFFSET, 
			visit.EndDateTime AT TIME ZONE std.TimeZoneId))) AS TIME), 0) 
			as [Time],
		visit.[Name] as [Description], 
		visit.StaffName as [Teacher],  
		CASE 
			WHEN [SignedIn] = 'true' AND [LateCancelled] = 'false' THEN 'Signed in'
			WHEN [LateCancelled] = 'true' THEN 'Late Cancel' 		
			ELSE 'Absent' 
		END AS [Status],
		ServiceName as [PaymentInfo],
		LateCancelled,
		SignedIn,
	CONVERT(datetime, SWITCHOFFSET(visit.StartDateTime, DATEPART(TZOFFSET, 
		visit.StartDateTime AT TIME ZONE std.TimeZoneId))) as StartDateTime,
	CONVERT(datetime, SWITCHOFFSET(visit.EndDateTime, DATEPART(TZOFFSET, 
		visit.EndDateTime AT TIME ZONE std.TimeZoneId))) as EndDateTime
	FROM dbo.MBClientVisits visit 
	outer apply 
	(select top 1 DisplayName, MemberStatusId, MemberId, StudioId  from [dbo].[Member] mem where visit.ClientId = mem.MBId and mem.MemberId = @MemberId) as mem
	outer apply 
	(select top 1 StudioId, TimeZoneId from [dbo].Studio std where visit.SiteId = std.SiteId) as std
	where mem.MemberId = @MemberId
		and StartDateTime <= CONVERT(datetime, SWITCHOFFSET(GetDate(), DATEPART(TZOFFSET,GetDate() AT TIME ZONE std.TimeZoneId)))
	order by visit.StartDateTime desc
END