-- =============================================
-- Author:		JCP
-- Create date: 07/08/2020
-- Description:	Get Visits Report
-- =============================================
CREATE PROCEDURE [dbo].[uspGetVisitsReport]
	-- Add the parameters for the stored procedure here
	@SiteId int,
	@DateFilterId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF @DateFilterId = 1
	BEGIN
		   SELECT 
				clientId,
				MemberId,
				DisplayName,
				MemberStatusId,
				count(case [Status] when 'Signed in' then 1 else null end) as SignedIn,
				count(case [Status] when 'Absent' then 1 else null end) as AbsencesCancelled,
				count(case [Status] when 'Late Cancel' then 1 else null end) as LateCancelled,
				count(ClientId) as TotalVisits
			FROM vwVisits 
			WHERE SiteId = @SiteId			
			GROUP BY ClientId, DisplayName,MemberId, MemberStatusId
			ORDER BY SignedIn desc
	END
	ELSE IF @DateFilterId = 2
	BEGIN
			SELECT 
				clientId,
				MemberId,
				DisplayName,
				MemberStatusId,
				count(case [Status] when 'Signed in' then 1 else null end) as SignedIn,
				count(case [Status] when 'Absent' then 1 else null end) as AbsencesCancelled,
				count(case [Status] when 'Late Cancel' then 1 else null end) as LateCancelled,
				count(ClientId) as TotalVisits
			FROM vwVisits 
			WHERE SiteId = @SiteId and 
			(StartDateTime between (select DATEADD(wk, DATEDIFF(wk,0,GETDATE()), 0)) and (select DATEADD(dd, 8-(DATEPART(dw, GETDATE())), GETDATE())))
			GROUP BY ClientId, DisplayName,MemberId, MemberStatusId
			ORDER BY SignedIn desc
	END
	ELSE IF @DateFilterId = 3
	BEGIN
			SELECT 
				clientId,
				MemberId,
				DisplayName,
				MemberStatusId,
				count(case [Status] when 'Signed in' then 1 else null end) as SignedIn,
				count(case [Status] when 'Absent' then 1 else null end) as AbsencesCancelled,
				count(case [Status] when 'Late Cancel' then 1 else null end) as LateCancelled,
				count(ClientId) as TotalVisits
			FROM vwVisits 
			WHERE SiteId = @SiteId and 
				(StartDateTime between (select DATEADD(mm, DATEDIFF(mm,0,GETDATE()), 0)) and (select DATEADD(s,-1,DATEADD(mm, DATEDIFF(m,0,GETDATE())+1,0))))
			GROUP BY ClientId, DisplayName, MemberId, MemberStatusId
			ORDER BY SignedIn desc
	END
	ELSE IF @DateFilterId = 4
	BEGIN
			SELECT 
				clientId,
				MemberId,
				DisplayName,
				MemberStatusId,
				count(case [Status] when 'Signed in' then 1 else null end) as SignedIn,
				count(case [Status] when 'Absent' then 1 else null end) as AbsencesCancelled,
				count(case [Status] when 'Late Cancel' then 1 else null end) as LateCancelled,
				count(ClientId) as TotalVisits
			FROM vwVisits 
			WHERE SiteId = @SiteId and 
				(StartDateTime between (select dateadd(d,-datepart(dy,getdate())+1,getdate())) and (select dateadd(d,-datepart(d,getdate()),dateadd(m,13-datepart(m,getdate()),getdate()))))
			GROUP BY ClientId, DisplayName, MemberId, MemberStatusId
			ORDER BY SignedIn desc
	END
	ELSE IF @DateFilterId = 5
	BEGIN
			SELECT 
				visit.clientId,
				visit.MemberId,
				visit.DisplayName,
				MemberStatusId,
				count(case [Status] when 'Signed in' then 1 else null end) as SignedIn,
				count(case [Status] when 'Absent' then 1 else null end) as AbsencesCancelled,
				count(case [Status] when 'Late Cancel' then 1 else null end) as LateCancelled,
				count(ClientId) as TotalVisits
			FROM vwVisits visit
			outer apply
			(select top 1 * from vwChallengeMembers chaMem where visit.ClientId = chaMem.MBId)as chaMem
			WHERE visit.SiteId = @SiteId and 
				(StartDateTime between (select top 1 StartDate from [dbo].[Challenge] order by ChallengeId desc) and (select top 1 EndDate from [dbo].[Challenge] order by ChallengeId desc))				
				and chaMem.ChallengeId = (select top 1 ChallengeId from [dbo].[Challenge] order by ChallengeId desc )
			GROUP BY visit.ClientId, visit.DisplayName, visit.MemberId, MemberStatusId
			ORDER BY SignedIn desc
	END
	ELSE IF @DateFilterId = 6
	BEGIN
			SELECT 
				clientId,
				MemberId,
				DisplayName,
				MemberStatusId,
				count(case [Status] when 'Signed in' then 1 else null end) as SignedIn,
				count(case [Status] when 'Absent' then 1 else null end) as AbsencesCancelled,
				count(case [Status] when 'Late Cancel' then 1 else null end) as LateCancelled,
				count(ClientId) as TotalVisits
			FROM vwVisits 
			WHERE SiteId = @SiteId and 
				(StartDateTime between (select DATEADD(MONTH, DATEDIFF(MONTH, 0, GETDATE())-1, 0)) and (select DATEADD(MONTH, DATEDIFF(MONTH, -1, GETDATE())-1, -1)))
			GROUP BY ClientId, DisplayName, MemberId, MemberStatusId
			ORDER BY SignedIn desc
	END
	ELSE IF @DateFilterId = 6
	BEGIN
			SELECT 
				clientId,
				MemberId,
				DisplayName,
				MemberStatusId,
				count(case [Status] when 'Signed in' then 1 else null end) as SignedIn,
				count(case [Status] when 'Absent' then 1 else null end) as AbsencesCancelled,
				count(case [Status] when 'Late Cancel' then 1 else null end) as LateCancelled,
				count(ClientId) as TotalVisits
			FROM vwVisits 
			WHERE SiteId = @SiteId and 
				(StartDateTime between (select DATEADD(YEAR, DATEDIFF(YEAR, 0, GETDATE())-1, 0)) and (select DATEADD(YEAR, DATEDIFF(YEAR, -1, GETDATE())-1, -1)))
			GROUP BY ClientId, DisplayName, MemberId, MemberStatusId
			ORDER BY SignedIn desc
	END
	ELSE
	BEGIN
		SELECT 
				clientId,
				MemberId,
				DisplayName,
				MemberStatusId,
				count(case [Status] when 'Signed in' then 1 else null end) as SignedIn,
				count(case [Status] when 'Absent' then 1 else null end) as AbsencesCancelled,
				count(case [Status] when 'Late Cancel' then 1 else null end) as LateCancelled,
				count(ClientId) as TotalVisits
			FROM vwVisits 
			WHERE SiteId = @SiteId			
			GROUP BY ClientId, DisplayName, MemberId, MemberStatusId
			ORDER BY SignedIn desc
	END
END