

CREATE VIEW [dbo].[vwIndividualScans]
AS
SELECT 
	scn.MemberId,
	scn.ScanId,
	mem.DisplayName,
	mem.StudioId,
	TestDateTime,
	scn.BillStatus
  FROM [dbo].[Scan] scn
  outer apply
  (select top 1 * from Member mem where mem.MemberId = scn.MemberId) mem
 where 
 scn.ScanId not in (select StartScanId from ChallengeMember where StartScanId is not null)
and
 scn.ScanId not in (select MidScanId from ChallengeMember where MidScanId is not null)
and
 scn.ScanId not in (select EndScanId from ChallengeMember where EndScanId is not null)
and scn.MemberId is not null