-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[uspGetMemberScanInChallenge]
	@ChallengeMemberId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
	select * from scan where scanid in(
	   select StartScanId as scanid from [dbo].[vwChallengeMembersStartScans] where ChallengeMemberId = @ChallengeMemberId
	   union
		select MidScanId as scanid from [dbo].[vwChallengeMembersMidScans] where ChallengeMemberId = @ChallengeMemberId
		union
		 select EndScanId as scanid from [dbo].[vwChallengeMembersEndScans] where ChallengeMemberId = @ChallengeMemberId
	 )
	 order by TestDateTime
END