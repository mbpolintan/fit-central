
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[uspGetChallengeGenderStats]
	-- Add the parameters for the stored procedure here
	@ChallengeId int,
	@StudioId int,
	@LeaderBoardType int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
IF @LeaderBoardType = 1
	Begin
	Select 
	*,
	(Male + Female + Undisclose) AS TMember
	From(
		Select 	
		SUM(CASE When mem.GenderId = 1 Then 1 Else 0 End ) as Male,
		SUM(CASE When mem.GenderId = 2 Then 1 Else 0 End ) as Female,
		SUM(CASE When mem.GenderId = 4 or mem.GenderId = 3  Then 1 Else 0 End ) as Undisclose,	
		AVG(scn.Age) as Age,
		AVG(scn.ImageScore) as ImageScore,
		CAST(AVG(scn.MidInBodyTotal)AS DECIMAL(10,2)) as InbodyScore,
		CAST(AVG(scn.MidWeightTotal)AS DECIMAL(10,2)) as [Weight],
		CAST(AVG(scn.MidPBFTotal)AS DECIMAL(10,2)) as PBF,
		CAST(AVG(scn.MidSMMTotal)AS DECIMAL(10,2)) as SMM,
		AVG(scn.MidVFLTotal) as VFL
		From [dbo].[ChallengeMember] chaMem
		outer apply
		(Select Top 1 * From [dbo].[Member] mem Where mem.MemberId = chaMem.MemberId and mem.StudioId = @StudioId) as mem 
		outer apply
		(Select Top 1 * From [dbo].[vwScans] scn Where scn.MemberId = chaMem.MemberId and scn.StudioId = @StudioId and scn.ChallengeId = @ChallengeId) as scn
		Where chaMem.ChallengeId = @ChallengeId
	) as tbl
	End
Else
   Begin
   Select 
	*,
	(Male + Female + Undisclose) AS TMember
	From(
		Select 	
		SUM(CASE When mem.GenderId = 1 Then 1 Else 0 End ) as Male,
		SUM(CASE When mem.GenderId = 2 Then 1 Else 0 End ) as Female,
		SUM(CASE When mem.GenderId = 4 or mem.GenderId = 3  Then 1 Else 0 End ) as Undisclose,	
		AVG(scn.Age) as Age,
		AVG(scn.ImageScore) as ImageScore,
		CAST(AVG(scn.EndInBodyTotal)AS DECIMAL(10,2)) as InbodyScore,
		CAST(AVG(scn.EndWeightTotal)AS DECIMAL(10,2)) as [Weight],
		CAST(AVG(scn.EndPBFTotal)AS DECIMAL(10,2)) as PBF,
		CAST(AVG(scn.EndSMMTotal)AS DECIMAL(10,2)) as SMM,
		AVG(scn.EndVFLTotal) as VFL
		From [dbo].[ChallengeMember] chaMem
		outer apply
		(Select Top 1 * From [dbo].[Member] mem Where mem.MemberId = chaMem.MemberId and mem.StudioId = @StudioId) as mem 
		outer apply
		(Select Top 1 * From [dbo].[vwScans] scn Where scn.MemberId = chaMem.MemberId and scn.StudioId = @StudioId and scn.ChallengeId = @ChallengeId) as scn
		Where chaMem.ChallengeId = @ChallengeId
	) as tbl
	End
END