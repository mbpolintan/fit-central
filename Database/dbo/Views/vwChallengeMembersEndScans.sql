












CREATE VIEW [dbo].[vwChallengeMembersEndScans]
AS
select 
	cm.ChallengeMemberId,
	cm.MemberId,
	--mem.DisplayName,
	--mem.StudioId,	
	scn.ScanId as EndScanId,
	scn.ScansImportId,
	cm.ChallengeId	
	from ChallengeMember cm
	--outer apply
 --   (select top 1 * from Member mem where mem.MemberId = cm.MemberId) mem
	 outer apply
    (select top 1 * from Challenge ch where cm.ChallengeId = ch.ChallengeId) ch
	 outer apply
    (select * from Scan scn where scn.MemberId = cm.MemberId and CONVERT(date, scn.TestDateTime) between ch.EndScanFromDate and ch.EndScanToDate) scn