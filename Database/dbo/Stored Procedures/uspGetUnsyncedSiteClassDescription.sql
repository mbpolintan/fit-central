-- =============================================
-- Author:		JCP
-- Create date: Jan. 06, 2021
-- Description:	Get unsynced site class description
-- =============================================
CREATE PROCEDURE uspGetUnsyncedSiteClassDescription
	@SiteId int
AS
BEGIN	
	SET NOCOUNT ON;

    select * from PushSiteClassDescription a
	outer apply
	(select top 1 eventId,EventInstanceOriginationDateTime from clientwebhook b where a.clientwebhookid = b.clientwebhookid) as b
	where
	IsSynced = 0 and SiteId = @SiteId
	order by ClientWebhookId,EventInstanceOriginationDateTime, Id 
END