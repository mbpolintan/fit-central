




CREATE VIEW [dbo].[vwScanForBilling]
AS
SELECT MemberId, 
	DisplayName,
	tbl.StudioId,
	tbl.PaymentType,
	--AccountType = case
	--when tbl.PaymentType = 'Direct Debit' then (Select top 1 AccountType from [dbo].[MBDirectDebitInfo] where MBUniqueId = tbl.MBUniqueId)
	--when tbl.PaymentType = 'Credit Card' then (Select top 1 CardType from [dbo].[MBClientCreaditCard] where MBUniqueId = tbl.MBUniqueId)
	--else 'None'
	--end,
	ForBillingChallenge,
	TotalChallengeScanPrice =isnull( prodCha.Price,0) * ForBillingChallenge,
	ForBillingIndividual,
	TotalIndividualScanPrice = isnull(prodIndi.Price,0) * ForBillingIndividual
FROM (
		SELECT 
			mem.MemberId,
			mem.MBUniqueId,
			mem.DisplayName,		
			mem.StudioId,		
			PaymentType = case
			when mem.DirectDebitLastFour is not null and mem.CreditCardLastFour is null then 'Direct Debit'
			when mem.CreditCardLastFour is not null and mem.DirectDebitLastFour is null then 'Credit Card'			
			else 'Others'
			end,

			sum(case cha.BillStatus when 0 then 1 else 0 end) as ForBillingChallenge,
			sum(case indi.BillStatus when 0 then 1 else 0 end) as ForBillingIndividual
		FROM [dbo].[Scan] scn 
			outer apply
			(select * from Member mem where mem.MemberId = scn.MemberId) mem
			outer apply
			(select * from [vwChallegeScans] cha where cha.StartScanId = scn.ScanId) cha
			outer apply
			(select * from [vwIndividualScans] indi where indi.ScanId = scn.ScanId) indi  
		WHERE scn.MemberId is not null and scn.BillStatus = 0
		GROUP BY mem.MemberId,mem.DisplayName,mem.StudioId,mem.CreditCardLastFour,mem.DirectDebitLastFour,mem.MBUniqueId
	) as tbl
	outer apply
	(select top 1 * from Studio stud where stud.StudioId = tbl.StudioId) stud
	outer apply
	(select top 1 * from Product prodCha where prodCha.ProductId = stud.ChallengeScanProductId) prodCha
	outer apply
	(select top 1 * from Product prodIndi where prodIndi.ProductId = stud.IndividualScanProductId) prodIndi