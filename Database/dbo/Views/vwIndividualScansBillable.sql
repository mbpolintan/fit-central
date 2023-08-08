








CREATE VIEW [dbo].[vwIndividualScansBillable]
AS

select ScanId, MemberId, mem.StudioId, TestDateTime from scan scn
outer apply
(select top 1 studioId from Member mem where mem.MemberId = scn.MemberId) as mem
where 
BillStatus = 0 and 
MemberId is not null
and ScanId not in (select ScanId from vwChallegeScansBillable)