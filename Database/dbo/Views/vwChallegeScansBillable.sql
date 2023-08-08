


CREATE VIEW [dbo].[vwChallegeScansBillable]
AS
select ScanId, MemberId, mem.StudioId, TestDateTime, ChallengeNo from scan scn
outer apply
(select top 1 studioId from Member mem where mem.MemberId = scn.MemberId) as mem
outer apply
(select top 1 ChallengeNo from vwChallegeScans chScan where scn.MemberId = chScan.MemberId 
	and 
	(
		chScan.StartScanId = scn.ScanId or chScan.MidScanId = scn.ScanId or chScan.EndScanId = scn.ScanId
	)
) as chScan
where 
BillStatus = 0 
and 
(
	scanId in (select StartScanId from ChallengeMember)
	or
	scanId in (select EndScanId from  ChallengeMember)
	or
	scanId in (select MidScanId from  ChallengeMember)
)