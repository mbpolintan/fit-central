-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[uspUpdateChallengeScans]
	@challengeMemberId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	-- update challenge member startscan
	UPDATE ChallengeMember
	SET	ChallengeMember.StartScanId = scn.StartScanId
	FROM
		ChallengeMember CM
	INNER JOIN
		vwChallengeMembersStartScans scn
	ON 
		scn.ChallengeMemberId =  CM.ChallengeMemberId
	where CM.ChallengeMemberId = @challengeMemberId and CM.StartScanId is null

    -- update challenge member Midscan
	UPDATE ChallengeMember
	SET ChallengeMember.MidScanId = scn.MidScanId
	FROM
		ChallengeMember CM
	INNER JOIN
		vwChallengeMembersMidScans scn
	ON 
		scn.ChallengeMemberId =  CM.ChallengeMemberId
	where CM.ChallengeMemberId = @challengeMemberId

	-- update challenge member Endscan
	UPDATE
		ChallengeMember
	SET
		ChallengeMember.EndScanId = scn.EndScanId
	FROM
		ChallengeMember CM
	INNER JOIN
		vwChallengeMembersEndScans scn
	ON 
		scn.ChallengeMemberId =  CM.ChallengeMemberId
	where CM.ChallengeMemberId = @challengeMemberId
END