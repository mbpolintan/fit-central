
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	Get Member Active membership
-- =============================================
CREATE PROCEDURE [dbo].[uspGetTotalPayment] --exec [dbo].[uspGetTotalPayment] 86
	@MemberId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
		select 		
		AmountPaid
		from [dbo].[Purchases] a
		outer apply 
			(select top 1 StudioId from Studio b where a.SiteId = b.SiteId) as b
		outer apply 
			(select top 1 MemberId from [dbo].[Member] c where a.ClientId = c.MBId and c.StudioId = b.StudioId and c.MemberId = @MemberId) as c
        where MemberId = @MemberId
		

END