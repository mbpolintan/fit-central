-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[uspGetMessageThread] --exec uspGetMessageThread 'Stephen Betts', 1
	@SenderName nvarchar(100),
	@StudioId int,
	@Classification int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	If @Classification = 0
	Begin
		Select * from(
		Select 
			[Subject],
			[MessageTypeId],
			[BodyContent],
			[IsRead],
			[IsAnonymousSender],	
			CONVERT(datetime, SWITCHOFFSET([ReceivedDateTime], DATEPART(TZOFFSET, 
			[ReceivedDateTime] AT TIME ZONE std.TimeZoneId))) as [DateTime],
			CONVERT(VARCHAR(20),CONVERT(datetime, SWITCHOFFSET([ReceivedDateTime], DATEPART(TZOFFSET, 
			[ReceivedDateTime] AT TIME ZONE std.TimeZoneId))),0) as MessageDateTime,
			--CONVERT(VARCHAR(15),CAST(CONVERT(datetime, SWITCHOFFSET([ReceivedDateTime], 
			--DATEPART(TZOFFSET,[ReceivedDateTime] AT TIME ZONE std.[TimeZoneId]))) AS TIME), 0) as [MessageTime], 
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
		Where inbox.StudioId = @StudioId and inbox.SenderName = @SenderName
	union
		Select 
			sItem.[Subject],
			sItem.[MessageTypeId],
			sItem.[BodyContent],			
			cast(1 as bit),
			cast(0 as bit),
			CONVERT(datetime, SWITCHOFFSET(rec.[DateCreated], DATEPART(TZOFFSET, 
			rec.[DateCreated] AT TIME ZONE std.TimeZoneId))) as [DateTime],
			CONVERT(VARCHAR(20),CONVERT(datetime, SWITCHOFFSET(rec.[DateCreated], DATEPART(TZOFFSET, 
			rec.[DateCreated] AT TIME ZONE std.TimeZoneId))),0) as MessageDateTime,
			--CONVERT(VARCHAR(15),CAST(CONVERT(datetime, SWITCHOFFSET(rec.[DateCreated], 
			--DATEPART(TZOFFSET,rec.[DateCreated] AT TIME ZONE std.[TimeZoneId]))) AS TIME), 0) as [MessageTime], 		 
			'To : ' + rec.[Name] as [Name] ,
			usr.UserEmail as [DisplayName],
			rec.[EmailAddress],
			rec.[MobilePhone],
			mem.[PhotoUrl],
			mem.[Image],
			cast(1 as bit) as [IsAdmin]
		From SentItem sItem 
		outer apply
		(select top 1 * from [dbo].[Recipient] rec where sItem.[SentItemId] = rec.[SentItemId] and sItem.[StudioId] = @StudioId) as rec
		outer apply
		(select top 1 PhotoUrl, [Image] from [dbo].[Member] c where rec.[MobilePhone] = c.[MobilePhone] and sItem.[StudioId] = @StudioId) as mem
		outer apply
		(select top 1 StudioId, TimeZoneId from [dbo].[Studio] std where  std.StudioId = @StudioId) as std	
		outer apply
		(select top 1  UserEmail from [dbo].[AppUser] usr where sItem.SenderUserId = usr.AppUserId) as usr

		Where rec.RecipientId is not null and rec.[Name] = @SenderName
		) as tbl
		order by [DateTime]
	End
	Else If @Classification = 1
	Begin
		Select 
			sItem.[Subject],
			sItem.[MessageTypeId],
			sItem.[BodyContent],			
			cast(1 as bit),
			cast(0 as bit),
			CONVERT(datetime, SWITCHOFFSET(rec.[DateCreated], DATEPART(TZOFFSET, 
			rec.[DateCreated] AT TIME ZONE std.TimeZoneId))) as [DateTime],
			CONVERT(VARCHAR(20),CONVERT(datetime, SWITCHOFFSET(rec.[DateCreated], DATEPART(TZOFFSET, 
			rec.[DateCreated] AT TIME ZONE std.TimeZoneId))),0) as MessageDateTime,
			--CONVERT(VARCHAR(15),CAST(CONVERT(datetime, SWITCHOFFSET(rec.[DateCreated], 
			--DATEPART(TZOFFSET,rec.[DateCreated] AT TIME ZONE std.[TimeZoneId]))) AS TIME), 0) as [MessageTime], 		 
			'To : ' + rec.[Name] as [Name] ,
			usr.UserEmail as [DisplayName],
			rec.[EmailAddress],
			rec.[MobilePhone],
			mem.[PhotoUrl],
			mem.[Image],
			cast(1 as bit) as [IsAdmin]
		From SentItem sItem 
		outer apply
		(select top 1 * from [dbo].[Recipient] rec where sItem.[SentItemId] = rec.[SentItemId] and sItem.[StudioId] = @StudioId) as rec
		outer apply
		(select top 1 PhotoUrl, [Image] from [dbo].[Member] c where rec.[MobilePhone] = c.[MobilePhone] and sItem.[StudioId] = @StudioId) as mem
		outer apply
		(select top 1 StudioId, TimeZoneId from [dbo].[Studio] std where  std.StudioId = @StudioId) as std	
		outer apply
		(select top 1  UserEmail from [dbo].[AppUser] usr where sItem.SenderUserId = usr.AppUserId) as usr
		Where rec.RecipientId is not null and rec.[Name] = @SenderName	
		order by [DateTime]
	End

END