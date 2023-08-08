







CREATE VIEW [dbo].[vwChallegeScans]
AS
SELECT 
	chaMem.ChallengeMemberId,
	chaMem.MemberId,
	cha.ChallengeNo,
	mem.DisplayName,
	mem.StudioId,
	chaMemS.TestDateTime as StartTestDate,
	chaMem.StartScanId,
	chaMemM.TestDateTime as MidTestDate,
	chaMem.MidScanId,
	chaMemE.TestDateTime as EndTestDate,
	chaMem.EndScanId,
	scn.BillStatus
  FROM [dbo].[Scan] scn
  outer apply
  (select top 1 * from Member mem where mem.MemberId = scn.MemberId) mem
  outer apply 
  (Select top 1 * from ChallengeMember chaMem where scn.ScanId = chaMem.StartScanId) as chaMem
  outer apply 
  (Select top 1 * from Challenge cha where cha.ChallengeId = chaMem.ChallengeId) as cha
   outer apply 
  (Select top 1 * from [Scan] chaMemS where chaMemS.ScanId = chaMem.StartScanId) as chaMemS
   outer apply 
  (Select top 1 * from [Scan] chaMemM where chaMemM.ScanId = chaMem.MidScanId) as chaMemM
   outer apply 
  (Select top 1 * from [Scan] chaMemE where chaMemE.ScanId = chaMem.EndScanId) as chaMemE
 where chaMem.MemberId is not null