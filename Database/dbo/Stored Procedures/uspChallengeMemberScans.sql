-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[uspChallengeMemberScans]
	@ChallengeMemberId int
AS
BEGIN
	SET NOCOUNT ON;
     SELECT     
		 mem.DisplayName,
		chaMem.[ChallengeId],
		chaMem.[MemberId],	
		chaMem.ChallengeMemberId,
		chaMem.ImageScore,
		isnull(S.[Weight],0) as SWeight,
		isnull(M.[Weight],0) as MWeight,
		isnull(E.[Weight],0) as EWeight,
		isnull(S.InBodyScore,0) as SInBodyScore,
		isnull(M.InBodyScore,0) as MInBodyScore,
		isnull(E.InBodyScore,0) as EInBodyScore,
		isnull(S.PBF,0) as SPBF,
		isnull(M.PBF,0) as MPBF,
		isnull(E.PBF,0) as EPBF,
		isnull(S.VFL,0) as SVFL,
		isnull(M.VFL,0) as MVFL,
		isnull(E.VFL,0) as EVFL,
		isnull(S.SMM,0) as SSMM,
		isnull(M.SMM,0) as MSMM,
		isnull(E.SMM,0) as ESMM,
		IsBilled = case
		when S.BillStatus = 1 then 1
		else 0
		end	
			--chaMem.[StartScanId],
		--chaMem.[MidScanId],
		--chaMem.[EndScanId],
FROM [dbo].[ChallengeMember] chaMem 
outer apply 
	(select top 1 * from [dbo].[Member] mem where chaMem.MemberId = mem.MemberId) as mem
outer apply
	(select Top 1 * from scan S where chaMem.StartScanId = S.ScanId) as S
outer apply
	(select Top 1 * from scan M where chaMem.MidScanId = M.ScanId) as M
outer apply
	(select Top 1 * from scan E where chaMem.EndScanId = E.ScanId) as E
where chaMem.ChallengeMemberId = @ChallengeMemberId 
END