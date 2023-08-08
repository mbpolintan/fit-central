
CREATE VIEW [dbo].[vwScanBillable]
AS

SELECT 
	mem.MemberId,
	mem.DisplayName,
	mem.StudioId,		
	sum(case scn.BillStatus when 1 then 1 else 0 end) as Billed,
	sum(case scn.BillStatus when 0 then 1 else 0 end) as ForBilling,
	sum(case scn.BillStatus when 2 then 1 else 0 end) as Ingnored
  FROM [dbo].[Scan] scn 
  outer apply
  (select * from Member mem where mem.MemberId = scn.MemberId) mem
  where scn.MemberId is not null
    Group By 
	mem.MemberId,
	mem.DisplayName,
	mem.StudioId