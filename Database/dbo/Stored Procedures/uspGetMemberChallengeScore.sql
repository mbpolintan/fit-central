
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	Get Member challenges
-- =============================================
Create PROCEDURE [dbo].[uspGetMemberChallengeScore]
	@MemberId int,
	@ChallengeId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;		
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
		and ChallengeId = @ChallengeId		
END