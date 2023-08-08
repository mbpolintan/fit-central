-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[uspGetChallengeLeaderBoard]
	@ChallengeId int,
	@StudioId int,
	@LeaderBoardType int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;


	IF @LeaderBoardType = 1
	Begin
	 Select * from vwScans	
	 where ChallengeId = @ChallengeId
	   and StudioId = @StudioId
	   and WithMidScan = 1 
   end
   else
   begin
	   Select * from vwScans	
	   where ChallengeId = @ChallengeId
	   and StudioId = @StudioId
	   and WithEndScan = 1 	  
   end
END