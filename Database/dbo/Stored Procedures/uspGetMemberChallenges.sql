
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	Get Member challenges
-- =============================================
CREATE PROCEDURE [dbo].[uspGetMemberChallenges]
	@MemberId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;
		--select 
		--ChallengeMemberId,
		--a.ChallengeId,
		--b.ChallengeNo,
		--StartScanId,
		--MidScanId,
		--EndScanId as FinalScanId,
		--StartScanDates = Convert(varchar(10),b.StartScanFromDate,103) + ' - ' + Convert(varchar(10),b.StartScanToDate,103),
		--MidScanDates = Convert(varchar(10),b.MidScanFromDate,103) + ' - ' + Convert(varchar(10),b.MidScanToDate,103),
		--EndScanDates = Convert(varchar(10),b.EndScanFromDate,103) + ' - ' + Convert(varchar(10),b.EndScanToDate,103) 
		--from [dbo].[ChallengeMember] a	
		--outer apply 
		--	(select top 1 * from [dbo].[Challenge] b where a.ChallengeId = b.ChallengeId) as b		
  --      where MemberId = @MemberId
		--order by b.ChallengeId desc

		Select 
		MemberId,
		ChallengeMemberId,
		ChallengeId,
		ChallengeNo,
		isnull(AttendedClass,0) as AttendedClass,
		isnull(MidInBodyTotal,0) as MidInBodyTotal,
		isnull(EndInBodyTotal,0) as EndInBodyTotal,
		isnull(MidWeightTotal,0) as MidWeightTotal,
		isnull(EndWeightTotal,0) as EndWeightTotal,
		isnull(MidPBFTotal,0) as MidPBFTotal,
		isnull(EndPBFTotal,0) as EndPBFTotal,
		isnull(MidSMMTotal,0) as MidSMMTotal,
		isnull(EndSMMTotal,0) as EndSMMTotal,
		isnull(MidVFLTotal,0) as MidVFLTotal,
		isnull(EndVFLTotal,0) as EndVFLTotal
		from vwScans
		where MemberId = @MemberId
		order by ChallengeId desc
END