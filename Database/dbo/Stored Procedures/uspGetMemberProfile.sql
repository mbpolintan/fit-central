-- =============================================
-- Author:		JC Polintan
-- Create date: <Create Date,,>
-- Description:	Get Member Profile
-- =============================================
CREATE PROCEDURE uspGetMemberProfile
	@MemberId int
	
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    -- Insert statements for procedure here
	SELECT 
	[MemberId]
      ,[StudioId]
      ,[MBId]
      ,[MBUniqueId]
      ,[MemberCategoryId]
      ,mem.[MemberStatusId]
	  ,sts.[Status]
      ,[DisplayName]
      ,[LastName]
      ,[FirstName]
      ,[MiddleName]
      ,[MobilePhone]
      ,[ScannerMobile]
      ,[Email]
      ,[Height]
      ,mem.[GenderId]
	  ,gen.[Description] as Gender
      ,[DOB]
      ,[Image]
      ,[HomePhone]
      ,[WorkPhone]
      ,[AddressLine1]
      ,[AddressLine2]
      ,[City]
      ,[PostalCode]
      ,[State]
      ,[Country]
      ,[Active]
      ,[Action]
      ,[PhotoUrl]
      ,[MBCreationDate]
      ,[MBLastModifiedDateTime]
      ,[SendAccountEmails]
      ,[SendAccountTexts]
      ,[SendPromotionalEmails]
      ,[SendPromotionalTexts]
      ,[SendScheduleEmails]
      ,[SendScheduleTexts]
      ,[EmergencyContactInfoName]
      ,[EmergencyContactInfoEmail]
      ,[EmergencyContactInfoPhone]
      ,[EmergencyContactInfoRelationship]
      ,[IsInitialSynced]
      ,[IsDeactivated]
      ,[CreditCardLastFour]
      ,[DirectDebitLastFour]
      ,[CreditCardExpDate]
      ,[PaidById]
      ,[PaidByPaymentType]	
	  ,mem.[CreatedById]
      ,mem.[DateCreated]
      ,mem.[ModifiedById]
      ,mem.[DateModified]
      ,mem.[TimeStamp]
	FROM [dbo].[Member] mem
	outer apply
	(select top 1 * from MemberStatus sts where sts.MemberStatusId = mem.MemberStatusId) as sts
	outer apply
	(select top 1 * from Gender gen where gen.GenderId = mem.GenderId) as gen
	WHERE mem.MemberId = @MemberId
END