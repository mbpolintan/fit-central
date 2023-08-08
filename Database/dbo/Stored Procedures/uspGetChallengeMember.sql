-- =============================================
-- Author:		JC Polintan
-- Create date: 27/10/2020
-- Description:	Get Challenge Members
-- =============================================
CREATE PROCEDURE [dbo].[uspGetChallengeMember]
	@ChallengeId int,
	@StudioId	int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

   SELECT        
		chaMem.[ChallengeId],
		chaMem.ChallengeMemberId,
		chaMem.[MemberId],	
		mem.DisplayName,	
		chaMem.[StartScanId],
		chaMem.[MidScanId],
		chaMem.[EndScanId],
		IsBilled = case
		when scn.BillStatus = 1 then 1
		else 0
		end,
		mem.MBUniqueId,
		mem.MBId,
		chaMem.ImageScore
FROM [dbo].[ChallengeMember] chaMem 
outer apply
	(select top 1 * from [dbo].[Challenge] cha where chaMem.ChallengeId = @ChallengeId) as cha
outer apply 
	(select top 1 * from [dbo].[Member] mem where chaMem.MemberId = mem.MemberId and mem.StudioId = @StudioId) as mem
outer apply
	(select Top 1 * from scan scn where chaMem.StartScanId = scn.ScanId) as scn
where chaMem.ChallengeId = @ChallengeId and StudioId = @StudioId
END