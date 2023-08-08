-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[uspGetVisitsInChallengePerWeek]
	@ChallengeStartDate datetime,
	@ChallengeEndDate datetime,
	@ChallengeMemberId int,
	@ClientId nvarchar(30),
	@SiteId	int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;	
	
	select count(weekcount) as attendedclass, [Week] = ROW_NUMBER() OVER (ORDER BY weekcount)from (
	select DATEPART(week, StartDateTime) as weekcount 
	FROM [dbo].[MBClientVisits] 	
	where (StartDateTime between @ChallengeStartDate and @ChallengeEndDate)
	and ClientId  = @ClientId 
	and SiteId = @SiteId
	and SignedIn = 'true'
			) as tbl
			group by weekcount 

	--select count(weekcount) as attendedclass, [Week] = ROW_NUMBER() OVER (ORDER BY weekcount)from (
	--select DATEPART(week, StartDateTime) as weekcount 
	--FROM [dbo].[MBClientVisits] v
	--outer apply 
	--(select top 1 * from vwChallengeMembers cm where cm.MBId = v.ClientId and cm.SiteId = v.SiteId) as cm
	
	
	--where (StartDateTime between @ChallengeStartDate and @ChallengeEndDate)
	--and ClientId  = @ClientId 
	--and v.SiteId = @SiteId
	--and SignedIn = 'true'
	--and cm.ChallengeMemberId = @ChallengeMemberId
	--		) as tbl
			--group by weekcount 
END