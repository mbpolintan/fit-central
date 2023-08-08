



CREATE VIEW [dbo].[vwVisitsReport]
AS
 SELECT 
		clientId,
		DisplayName,
		count(case [Status] when 'Signed in' then 1 else null end) as SignedIn,
		count(case [Status] when 'Absent' then 1 else null end) as AbsencesCancelled,
		count(case [Status] when 'Late Cancel' then 1 else null end) as LateCancelled,
		count(ClientId) as TotalVisits
	FROM vwVisits 		
	GROUP BY ClientId, DisplayName