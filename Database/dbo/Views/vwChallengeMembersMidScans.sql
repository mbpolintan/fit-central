












CREATE VIEW [dbo].[vwChallengeMembersMidScans]
AS
select 
	cm.ChallengeMemberId,
	cm.MemberId,
	--mem.DisplayName,
	--mem.StudioId,	
	scn.ScanId as MidScanId,
	scn.ScansImportId,
	cm.ChallengeId	
	from ChallengeMember cm
	--outer apply
 --   (select top 1 * from Member mem where mem.MemberId = cm.MemberId) mem
	 outer apply
    (select top 1 * from Challenge ch where cm.ChallengeId = ch.ChallengeId) ch
	 outer apply
    (select * from Scan scn where scn.MemberId = cm.MemberId and  CONVERT(date, scn.TestDateTime) between ch.MidScanFromDate and ch.MidScanToDate) scn