-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	Get reply messages that is currently save in to the database.
-- =============================================
CREATE PROCEDURE [dbo].[uspGetLatestReplySMS]
	@StudioId int,
	@SenderMobileNumber nvarchar(15)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

   Select top 1 
		[Subject],
		[MessageTypeId],
		[BodyContent],
		[IsRead],
		[IsAnonymousSender],		
		CONVERT(VARCHAR(20),CONVERT(datetime, SWITCHOFFSET([ReceivedDateTime], DATEPART(TZOFFSET, 
		[ReceivedDateTime] AT TIME ZONE std.TimeZoneId))),0) as MessageDateTime,
		CONVERT(VARCHAR(15),CAST(CONVERT(datetime, SWITCHOFFSET([ReceivedDateTime], 
		DATEPART(TZOFFSET,[ReceivedDateTime] AT TIME ZONE std.[TimeZoneId]))) AS TIME), 0) as [MessageTime], 
		'From : ' + [SenderName] as [Name],
		[SenderName] as [DisplayName],
		[SenderEmail] as [EmailAddress],
		[SenderMobilePhone] as [MobilePhone],
		Mem.[PhotoUrl],
		Mem.[Image],
		cast(0 as bit) as [IsAdmin]
	From Inbox inbox
	outer apply
	(select top 1 PhotoUrl, [Image] from Member Mem where (inbox.[SenderMobilePhone] = Mem.[MobilePhone] or inbox.[SenderEmail] = Mem.[Email])  and StudioId = @StudioId) as Mem
	outer apply
	(select top 1 StudioId, TimeZoneId from [dbo].Studio std where std.StudioId = @StudioId) as std
	Where inbox.StudioId = @StudioId and inbox.SenderMobilePhone = @SenderMobileNumber and MessageTypeId = 1
	order by [ReceivedDateTime] desc
END