-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	Get the startdatetime of member visit per site
-- =============================================
CREATE PROCEDURE [dbo].[uspGetStartDateVisit]
	@SiteId int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    SELECT top 1 StartDateTime From MBClientVisits where SiteId = @SiteId and StartDateTime is not null order by StartDateTime 
	--SELECT top 1 EndDateTime From MBClientVisits where SiteId = 721534 and EndDateTime is not null order by EndDateTime desc 
END