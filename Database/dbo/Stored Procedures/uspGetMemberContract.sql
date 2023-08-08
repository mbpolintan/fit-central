-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	Get Member contracts
-- =============================================
CREATE PROCEDURE uspGetMemberContract
	@MemberId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
		select * from [dbo].[MBContract] a
		outer apply 
			(select top 1 StudioId from Studio b where a.SiteId = b.SiteId) as b
		outer apply 
			(select top 1 MemberId from [dbo].[Member] c where a.ClientId = c.MBId and c.StudioId = b.StudioId and c.MemberId = @MemberId) as c
        where MemberId = @MemberId
		order by AutopayStatus, EndDate desc
END