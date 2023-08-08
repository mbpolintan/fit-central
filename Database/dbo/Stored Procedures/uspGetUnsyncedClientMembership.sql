﻿-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[uspGetUnsyncedClientMembership]
	@SiteId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	select * from [dbo].[PushClientMembership] a
	outer apply
	(select top 1 eventId,EventInstanceOriginationDateTime from clientwebhook b where a.clientwebhookid = b.clientwebhookid) as b
	where
	IsSynced = 0 and SiteId = @SiteId
	order by ClientId,MembershipId,EventInstanceOriginationDateTime
END