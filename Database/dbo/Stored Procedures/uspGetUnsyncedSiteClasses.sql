-- =============================================
-- Author:		JCP
-- Create date: Jan. 06, 2021
-- Description:	Get unsynced site classes
-- =============================================
CREATE PROCEDURE uspGetUnsyncedSiteClasses 
	@SiteId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    select * from PushSiteClass a
	outer apply
	(select top 1 eventId,EventInstanceOriginationDateTime from clientwebhook b where a.clientwebhookid = b.clientwebhookid) as b
	where
	IsSynced = 0 and SiteId = @SiteId
	order by ClientWebhookId,EventInstanceOriginationDateTime, ClassId 
END