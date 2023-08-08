-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[uspGetChallengeStats]
	-- Add the parameters for the stored procedure here
	@ChallengeId int,
	@StudioId int

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
Select 
	mem.StudioId,
	strtS.Age,
	gender.[Description] as [Gender],
	chaMem.ChallengeId,
	chaMem.ChallengeMemberId,
	mem.MemberId,
	mem.DisplayName,
	cha.ChallengeNo,
	v.AttendedClass,
	chaMem.ImageScore,			
	MidInBodyTotal = case
		when midS.InBodyScore-strtS.InBodyScore is null then 0
		else midS.InBodyScore-strtS.InBodyScore
		end,
	MidWeightTotal = case
		when Round((strtS.Weight-midS.Weight)/strtS.Weight *100,3) is null then 0
		else Round((strtS.Weight-midS.Weight)/strtS.Weight *100,3)
		end,
	MidPBFTotal = case
		when Round((strtS.PBF-midS.PBF)/strtS.PBF *100,3) is null then 0
		else Round((strtS.PBF-midS.PBF)/strtS.PBF *100,3)
		end,
	MidVFLTotal = case
		when (strtS.VFL-midS.VFL) is null then 0
		else (strtS.VFL-midS.VFL)
		end,
	MidSMMTotal = case
		when Round((((strtS.SMM-midS.SMM)/strtS.SMM)*-1) *100,3) is null then 0
		else Round((((strtS.SMM-midS.SMM)/strtS.SMM)*-1) *100,3)
		end,
	EndInBodyTotal = case
		when endS.InBodyScore-strtS.InBodyScore is null then 0
		else endS.InBodyScore-strtS.InBodyScore
		end,
	EndWeightTotal = case
		when Round((strtS.Weight-endS.Weight)/strtS.Weight *100,3) is null then 0
		else Round((strtS.Weight-endS.Weight)/strtS.Weight *100,3)
		end,
	EndPBFTotal = case
		when Round((strtS.PBF-endS.PBF)/strtS.PBF *100,3) is null then 0
		else Round((strtS.PBF-endS.PBF)/strtS.PBF *100,3)
		end,
	EndVFLTotal = case
		when (strtS.VFL-endS.VFL) is null then 0
		else (strtS.VFL-endS.VFL)
		end,
	EndSMMTotal = case
		when Round((((strtS.SMM-endS.SMM)/strtS.SMM)*-1) *100,3) is null then 0
		else Round((((strtS.SMM-endS.SMM)/strtS.SMM)*-1) *100,3)
		end,	
	WithMidScan = case
		when chaMem.MidScanId is not null then 1
		else 0
		end,
	WithEndScan = case
		when chaMem.EndScanId is not null then 1
		else 0
		end			
From [dbo].[ChallengeMember] chaMem
outer apply
(select top 1 * from [dbo].[Member] mem where mem.MemberId = chaMem.MemberId and mem.StudioId =@StudioId) as mem
outer apply
(select top 1 * from [dbo].[Challenge] cha where cha.ChallengeId = chaMem.ChallengeId) as cha
outer apply
(select top 1 * from [dbo].[Scan] strtS where chaMem.StartScanId = strtS.ScanId ) as strtS
outer apply
(select top 1 * from  [dbo].[Scan] midS where chaMem.MidScanId =midS.ScanId ) as midS
outer apply
(select top 1 * from  [dbo].[Scan] endS where chaMem.EndScanId =endS.ScanId ) as endS
outer apply
(select top 1 [Description] from [dbo].[Gender] gender where mem.GenderId = gender.GenderId) as gender
outer apply
(select top 1 SiteId from [dbo].[Studio] std where mem.StudioId = @StudioId ) as std
outer apply
(select count(v.SignedIn) as AttendedClass from [dbo].[MBClientVisits] v 
	where (v.StartDateTime between cha.StartScanFromDate and cha.EndScanToDate)
	and
	v.ClientId  = mem.MBId and v.SiteId = std.SiteId and SignedIn = 'true') as v  		
WHERE chaMem.ChallengeId = @ChallengeId 
END