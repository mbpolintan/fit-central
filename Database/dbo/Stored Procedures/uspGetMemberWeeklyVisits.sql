-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[uspGetMemberWeeklyVisits]
	@SiteId int,
	@StudioId int
AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.

SET NOCOUNT ON;

select * from Member where MBId in (
	SELECT distinct ClientId FROM MBClientVisits
	where siteId = @SiteId
	and  
	(convert(date,StartDateTime) between convert(date,DATEADD(DAY,-6, GETDATE())) and convert(date,GETDATE()))
) and StudioId = @StudioId

END