-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE uspCustomMemberGetVisits

AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.

SET NOCOUNT ON;

   select * from member where mbid not in (
		select distinct clientId from mbclientvisits where siteId = 992379 
		and clientUniqueId is null
		) 
		and studioid = 2 and memberstatusid in (1,5)
END