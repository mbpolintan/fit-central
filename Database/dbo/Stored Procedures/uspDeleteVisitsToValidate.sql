-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[uspDeleteVisitsToValidate]
@ClientId varchar(30),
	@SiteId int,
	@DateFrom datetime,
	@DateTo datetime

AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

    delete from MBClientVisits
	where SiteId = @SiteId and ClientId = @ClientId
	and
	(Convert(Date,StartDateTime) between @DateFrom and @DateTo)
	--order by StartDateTime desc
END