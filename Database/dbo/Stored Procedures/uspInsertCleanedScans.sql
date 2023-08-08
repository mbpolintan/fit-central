-- =============================================
-- Author:		JCP
-- Create date: 28/07/2020
-- Description:	Insert Scans
-- =============================================
CREATE PROCEDURE [dbo].[uspInsertCleanedScans]	
	@ScanImportId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	INSERT INTO Scan
	(
		[ScansImportId],[MemberId],[MobileNumber],[Height],[GenderId],[Age],[TestDateTime],[Weight],[LLWeightNormalRange],[ULWeightNormalRange]
		,[TBW],[LLTBW],[ULTBW],[ICW],[LLICW],[ULICW],[ECW],[LLECW],[ULECW],[Protein],[LLProtein],[ULProtein],[Minerals],[LLMinerals],[ULMinerals]
		,[BFM],[LLBFM],[ULBFM],[SLM],[LLSLM],[ULSLM],[FFM],[LLFFM],[ULFFM],[SMM],[LLSMM],[ULSMM],[BMI],[LLBMI],[ULBMI],[PBF],[LLPBF],[ULPBF]
		,[FFMRightArm],[LLFFMRightArm],[ULFFMRightArm],[FFMPercRightArm],[FFMLeftArm],[LLFFMLeftArm],[ULFFMLeftArm],[FFMPercLeftArm],[FFMTrunk]
		,[LLFFMTrunk],[ULFFMTrunk],[FFMPercTrunk],[FFMRightLeg],[LLFFMRightLeg],[ULFFMRightLeg],[FFMPercRightLeg],[FFMLeftLeg],[LLFFMLeftLeg]
		,[ULFFMLeftLeg],[FFMPercLeftLeg],[ECWTBW],[BFMRightArm],[BFMPercRightArm],[BFMLeftArm],[BFMPercLeftArm],[BFMTrunk],[BFMPercTrunk]
		,[BFMRightLeg],[BFMPercRightLeg],[BFMLeftLeg],[BFMPercLeftLeg],[InBodyScore],[TargetWeight],[WeightControl],[BFMControl],[FFMControl],[BMR]
		,[WHR],[LLWHR],[ULWHR],[VFL],[ObesityDegree],[LLObesityDegree],[ULObesityDegree],[BCM],[LLBCM],[ULBCM],[AC],[AMC],[BMC],[LLBMC],[ULBMC]
		,[5kHzRAImpedance],[5kHzLAImpedance],[5kHzTRImpedance],[5kHzRLImpedance],[5kHzLLImpedance],[50kHzRAImpedance],[50kHzLAImpedance]
		,[50kHzTRImpedance],[50kHzRLImpedance],[50kHzLLImpedance],[500kHzRAImpedance],[500kHzLAImpedance],[500kHzTRImpedance],[500kHzRLImpedance]
		,[500kHzLLImpedance],[MCNeck],[MCChest],[MCAbdomen],[MCHip],[MCRightArm],[MCLeftArm],[MCRightThigh],[MCLeftThigh],[GrowthScore]
		,[ObesityDegreeChild],[LLObesityDegreeChildNormalRange],[ULObesityDegreeChildNormalRange],[Systolic],[Diastolic],[Pulse],[MeanArteryPressure]
		,[PulsePressure],[RatePressureProduct],[SMI],[CreatedById],[DateCreated],[ModifiedById],[DateModified])
    SELECT * FROM (
		SELECT 
			[ScansImportId],[MemberId],[MobileNumber],[Height],[GenderId],[Age],[TestDateTime],[Weight],[LLWeightNormalRange],[ULWeightNormalRange],[TBW]
			,[LLTBW],[ULTBW],[ICW],[LLICW],[ULICW],[ECW],[LLECW],[ULECW],[Protein],[LLProtein],[ULProtein],[Minerals],[LLMinerals],[ULMinerals],[BFM],[LLBFM]
			,[ULBFM],[SLM],[LLSLM],[ULSLM],[FFM],[LLFFM],[ULFFM],[SMM],[LLSMM],[ULSMM],[BMI],[LLBMI],[ULBMI],[PBF],[LLPBF],[ULPBF],[FFMRightArm],[LLFFMRightArm]
			,[ULFFMRightArm],[FFMPercRightArm],[FFMLeftArm],[LLFFMLeftArm],[ULFFMLeftArm],[FFMPercLeftArm],[FFMTrunk],[LLFFMTrunk],[ULFFMTrunk],[FFMPercTrunk]
			,[FFMRightLeg],[LLFFMRightLeg],[ULFFMRightLeg],[FFMPercRightLeg],[FFMLeftLeg],[LLFFMLeftLeg],[ULFFMLeftLeg],[FFMPercLeftLeg],[ECWTBW],[BFMRightArm]
			,[BFMPercRightArm],[BFMLeftArm],[BFMPercLeftArm],[BFMTrunk],[BFMPercTrunk],[BFMRightLeg],[BFMPercRightLeg],[BFMLeftLeg],[BFMPercLeftLeg],[InBodyScore]
			,[TargetWeight],[WeightControl],[BFMControl],[FFMControl],[BMR],[WHR],[LLWHR],[ULWHR],[VFL],[ObesityDegree],[LLObesityDegree],[ULObesityDegree],[BCM]
			,[LLBCM],[ULBCM],[AC],[AMC],[BMC],[LLBMC],[ULBMC],[5kHzRAImpedance],[5kHzLAImpedance],[5kHzTRImpedance],[5kHzRLImpedance],[5kHzLLImpedance]
			,[50kHzRAImpedance],[50kHzLAImpedance],[50kHzTRImpedance],[50kHzRLImpedance],[50kHzLLImpedance],[500kHzRAImpedance],[500kHzLAImpedance]
			,[500kHzTRImpedance],[500kHzRLImpedance],[500kHzLLImpedance],[MCNeck],[MCChest],[MCAbdomen],[MCHip],[MCRightArm],[MCLeftArm],[MCRightThigh],[MCLeftThigh]
			,[GrowthScore],[ObesityDegreeChild],[LLObesityDegreeChildNormalRange],[ULObesityDegreeChildNormalRange],[Systolic],[Diastolic],[Pulse],[MeanArteryPressure]
			,[PulsePressure],[RatePressureProduct],[SMI],[CreatedById],[DateCreated],[ModifiedById],[DateModified]
		FROM [dbo].[CleanedScans] WHERE [ScansImportId] = @ScanImportId) cScan
    WHERE NOT EXISTS 
		(SELECT 1 FROM Scan scan WHERE scan.TestDateTime = cScan.TestDateTime AND scan.MobileNumber = cScan.MobileNumber);

	-- update challenge member startscan
	UPDATE
		ChallengeMember
	SET
		ChallengeMember.StartScanId = scn.StartScanId
	FROM
		ChallengeMember CM
	INNER JOIN
		vwChallengeMembersStartScans scn
	ON 
		CM.ChallengeMemberId = scn.ChallengeMemberId
	where scn.ScansImportId = @ScanImportId and CM.StartScanId is null

	-- update challenge member Midscan
	UPDATE
		ChallengeMember
	SET
		ChallengeMember.MidScanId = scn.MidScanId
	FROM
		ChallengeMember CM
	INNER JOIN
		vwChallengeMembersMidScans scn
	ON 
		CM.ChallengeMemberId = scn.ChallengeMemberId
	where scn.ScansImportId = @ScanImportId

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
		CM.ChallengeMemberId = scn.ChallengeMemberId
	where scn.ScansImportId = @ScanImportId

END