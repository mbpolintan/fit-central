-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE uspGetPaymentReconciliation
	@StudioId int,
	@DateFrom datetime,
	@DateTo datetime,
	@IsReconciled bit = 0
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	
    SELECT 
		a.PaymentId,
		c.DisplayName,
		c.MemberId,
		b.SaleDateTime,
		CONVERT(varchar(15),CAST(SaleDateTime AS TIME),100) as SaleTime,
		b.[Description],
		a.[Type] as PaymentType,
		a.Amount,
		b.Quantity,
		a.Reconciled,
		a.ReconciledById,
		a.ReconciledDatetime,
		d.UserEmail as ReconciledByEmail
	FROM [dbo].[Payments] a
	outer apply 
	(select top 1 * from [dbo].[studio] std where std.StudioId = @StudioId) as std
	outer apply 
	(select top 1 * from [dbo].[Purchases] b where a.purchaseId = b.PurchaseId and b.SiteId = std.SiteId) as b
	outer apply 
	(select top 1 * from [dbo].Member c where b.ClientId = c.MBId and c.StudioId = @Studioid) as c
	outer apply
	(select top 1 UserEmail From [dbo].AppUser d where a.ReconciledById = d.AppUserId) as d
	where  MemberId is not null	
	and b.SaleDateTime between @DateFrom and DateAdd(day,1,@DateTo)
	and a.reconciled = @IsReconciled
	order by SaleDateTime
END