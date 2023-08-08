-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	Get Member Active membership
-- =============================================
CREATE PROCEDURE [dbo].[uspGetActiveMembership]
	@MemberId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
		select * from [dbo].[MBClientActiveMembership] a	
		outer apply 
			(select top 1 MemberId, StudioId from [dbo].[Member] b where a.ClientId = b.MBId and b.MemberId = @MemberId) as b
			outer apply 
			(select top 1 StudioId from Studio c where b.StudioId = c.StudioId) as c
        where MemberId =  @MemberId
		order by ExpirationDate desc
END