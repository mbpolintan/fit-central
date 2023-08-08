-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	Get Scans for Billing per studio
-- =============================================
CREATE PROCEDURE [dbo].[uspGetScanForBilling]
	@StudioId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	select
	memberId,
	DisplayName,
	count(ScanId) as Quantity,
	StudioId,
	prd.ProductId as ProductId,
	prd.Id as MBProductId,
	prd.[Name] as ProductName,
	prd.Price * count(ScanId) as BillableAmount,
	ScanType,
	PaymentType,
	mb.MindbodyStudioId as SiteId,
	cs.ChallengeNo,
	cs.ChallengeMemberId
from (
	/*************** Challenge scans "StartScanId" ***************/ 
	select 
		scn.ScanId, 
		scn.MemberId,
		mem.DisplayName,
		mem.StudioId, 
		std.ChallengeScanProductId as ProductId,
		ScanType = 'Challenge',
		PaymentType = case
			when pay.PaymentMethodTypeId = 1 then 'Credit Card'
			when pay.PaymentMethodTypeId = 2 then 'Direct Debit'	
			when pay.PaymentMethodTypeId = 3 then 'Paid By ' + paidBy.DisplayName	
			else 'Others'
			end

		--PaymentType = case
		--	when mem.DirectDebitLastFour is not null and mem.CreditCardLastFour is null then 'Direct Debit'
		--	when mem.CreditCardLastFour is not null and mem.DirectDebitLastFour is null then 'Credit Card'	
		--	when mem.CreditCardLastFour is not null and mem.DirectDebitLastFour is not null then 'Credit Card/Direct Debit'	
		--	else case 
		--		when mem.PaidById is not null and mem.PaidByPaymentType is not null then mem.PaidByPaymentType
		--		else 'Others'
		--		end
		--	end
	from Scan scn
	left join Member mem
		on mem.MemberId = scn.MemberId
	left join Studio std
		on mem.StudioId = std.StudioId
	left join PaymentMethod pay
		on pay.MemberId = mem.MemberId
	left join Member paidBy
		on pay.PaidByOtherMemberId = paidBy.MemberId
	where 
	BillStatus = 0 
	and
	scn.MemberId is not null
	and 
	scanId in (select ScanId from vwStartChallegeScansBillable where StudioId = @StudioId)
	and pay.IsDefault = 1 and pay.IsActive = 1
	and pay.PaymentMethodTypeId <> 4 --Staff
	union

	/*************** Individual scans ***************/ 
	
	select scn.ScanId, 
		scn.MemberId, 
		mem.DisplayName,
		mem.StudioId, 
		std.IndividualScanProductId as ProductId,
		ScanType = 'Individual',
		PaymentType = case
			when pay.PaymentMethodTypeId = 1 then 'Credit Card'
			when pay.PaymentMethodTypeId = 2 then 'Direct Debit'	
			when pay.PaymentMethodTypeId = 3 then 'Paid By ' + paidBy.DisplayName	
			else 'Others'
			end	
		--PaymentType = case
		--	when mem.DirectDebitLastFour is not null and mem.CreditCardLastFour is null then 'Direct Debit'
		--	when mem.CreditCardLastFour is not null and mem.DirectDebitLastFour is null then 'Credit Card'	
		--	when mem.CreditCardLastFour is not null and mem.DirectDebitLastFour is not null then 'Credit Card/Direct Debit'	
		--	else case 
		--		when mem.PaidById is not null and mem.PaidByPaymentType is not null then mem.PaidByPaymentType
		--		else 'Others'
		--		end
		--	end
	from Scan scn
	left join Member mem
		on mem.MemberId = scn.MemberId
	left join Studio std
		on mem.StudioId = std.StudioId
	left join PaymentMethod pay
		on pay.MemberId = mem.MemberId
	left join Member paidBy
		on pay.PaidByOtherMemberId = paidBy.MemberId
	where 
	BillStatus = 0 and 
	scn.MemberId is not null
	and ScanId not in (select ScanId from vwChallegeScansBillable where StudioId = @StudioId)
	and pay.IsDefault = 1 and pay.IsActive = 1 
	and pay.PaymentMethodTypeId <> 4 --Staff
	) as tbl
	outer apply
	(select top 1 ChallengeNo, ChallengeMemberId from vwChallegeScans cs where cs.StudioId = @StudioId and cs.StartScanId = tbl.ScanId) cs
	outer apply
	(select top 1 MindbodyStudioId from MBInterface mb where mb.StudioId = @StudioId) mb
	outer apply
	(select top 1 Price, Id, [Name], ProductId from Product prd where prd.ProductId = tbl.ProductId and prd.SiteId = mb.MindbodyStudioId) prd

	where studioId = @StudioId
	group by MemberId,DisplayName,StudioId,prd.Id, prd.ProductId,Price, PaymentType,prd.[Name], ScanType,mb.MindbodyStudioId, cs.ChallengeNo,cs.ChallengeMemberId

    --select * from [dbo].[vwScanForBilling] where StudioId = @StudioId
END