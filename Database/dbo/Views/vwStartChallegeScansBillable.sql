








CREATE VIEW [dbo].[vwStartChallegeScansBillable]
AS
select ScanId, MemberId, mem.StudioId from scan scn
outer apply
(select top 1 studioId from Member mem where mem.MemberId = scn.MemberId) as mem
where 
BillStatus = 0 
and 
scanId in (select StartScanId from ChallengeMember)