




CREATE VIEW [dbo].[vwChallengeMembers]
AS
SELECT        
	chaMem.[ChallengeId]
	,chaMem.ChallengeMemberId
	,cha.ChallengeNo
	,chaMem.[MemberId]
	,mem.MBId
	,mem.MBUniqueId
	,mem.DisplayName	
	,mem.StudioId	
	,std.SiteId
	,chaMem.[StartScanId]
	,chaMem.[MidScanId]
	,chaMem.[EndScanId]
	,scn.BillStatus
	,cha.StartDate
	,cha.EndDate
	,cha.StartScanFromDate
	,cha.StartScanToDate
	,cha.MidScanFromDate
	,cha.MidScanToDate	
	,cha.EndScanFromDate
	,cha.EndScanToDate

FROM [dbo].[ChallengeMember] chaMem 
outer apply
(select top 1 * from [dbo].[Challenge] cha where chaMem.ChallengeId = cha.ChallengeId) as cha
outer apply 
(select top 1 * from [dbo].[Member] mem where chaMem.MemberId = mem.MemberId) as mem
outer apply
(select Top 1 * from scan scn where chaMem.StartScanId = scn.ScanId) as scn
outer apply
(select Top 1 * from Studio std where std.StudioId = mem.StudioId) as std