-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
CREATE PROCEDURE [dbo].[uspGetMessageList]
	@StudioId int,
	@MessageClassification nvarchar(10)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	if @MessageClassification = 'Inbox'
	   begin
SELECT distinct [StudioId]
      ,[MessageTypeId]
      ,[Subject]
	  ,[Name]
	  ,[DisplayName]
	  ,[SenderMobilePhone]
	  ,[EmailAddress]
	  ,[IsAnonymousSender]
	  ,[PhotoUrl]
	  ,[Image]
	  ,[Classification]
	  ,sum(NewMessage) as NewMsg 
FROM(
	SELECT 
      inbox.[StudioId]
      ,[MessageTypeId]
      ,[Subject]
	  ,'From : ' + [SenderName] as [Name]
	  ,[SenderName] as [DisplayName]
	  ,SenderEmail as [EmailAddress]
	  ,[SenderMobilePhone]
	  ,[IsAnonymousSender]
	  ,Mem.[PhotoUrl]
	  ,Mem.[Image]
	  ,NewMessage = case
		  when IsRead = 0 then 1
		  else 0
	  end    
	  ,0 as [Classification]
	from Inbox inbox
	outer apply
	(select top 1 PhotoUrl, [Image] from Member Mem where (inbox.SenderMobilePhone = Mem.MobilePhone or inbox.SenderEmail = Mem.Email)  and StudioId = @StudioId) as Mem	
	where inbox.StudioId = @StudioId
) as tbl
GROUP BY  [StudioId],[MessageTypeId],[Subject],[SenderMobilePhone],[PhotoUrl],[Image],[IsAnonymousSender],[Name],[DisplayName],[EmailAddress],[Classification]

			--Select 
			--	[Subject],
			--	MessageTypeId,
			--	BodyContent,
			--	IsRead,
			--	IsAnonymousSender,
			--	CONVERT(datetime, SWITCHOFFSET(ReceivedDateTime, DATEPART(TZOFFSET, 
			--	ReceivedDateTime AT TIME ZONE std.TimeZoneId))) as MessageDateTime,
			--	CONVERT(VARCHAR(10),CAST(CONVERT(datetime, SWITCHOFFSET(ReceivedDateTime, 
			--	DATEPART(TZOFFSET,ReceivedDateTime AT TIME ZONE std.TimeZoneId))) AS TIME), 0) as MessageTime, 
			--	'From : ' + SenderName as [Name],
			--	SenderName as DisplayName,
			--	SenderEmail as [EmailAddress],
			--	SenderMobilePhone as MobilePhone,
			--	Mem.PhotoUrl,
			--	Mem.[Image]
			--from Inbox inbox
			--outer apply
			--(select top 1 PhotoUrl, [Image] from Member Mem where (inbox.SenderMobilePhone = Mem.MobilePhone or inbox.SenderEmail = Mem.Email)  and StudioId = @StudioId) as Mem
			--outer apply
			--(select top 1 StudioId, TimeZoneId from [dbo].Studio std where inbox.StudioId = std.StudioId ) as std
			--where inbox.StudioId = @StudioId
	   end
	else if @MessageClassification = 'SentItems'
	   begin
		SELECT distinct 
			[StudioId]			
			,[MessageTypeId]
			,[Subject]
			,[Name]
			,[DisplayName]
			,[SenderMobilePhone]
			,[EmailAddress]
			,[PhotoUrl]
			,[Image]
			,[Classification]
		FROM(
			SELECT 
				sItem.[StudioId]				
				,[MessageTypeId]
				,[Subject]
				,Mem.[PhotoUrl]
				,Mem.[Image]	 
				,rec.MobilePhone  as [SenderMobilePhone]  
				,'To : ' + rec.[Name] as [Name]
				,rec.[Name] as [DisplayName]
				,rec.EmailAddress
				,1 as [Classification]
			FROM SentItem sItem 
			outer apply
			(select top 1 * from Recipient rec where sItem.SentItemId = rec.SentItemId and sItem.StudioId = @StudioId) as rec
			outer apply
			(select top 1 PhotoUrl, [Image] from Member c where rec.MobilePhone = c.MobilePhone and sItem.StudioId = @StudioId) as mem
			outer apply
			(select top 1 StudioId, TimeZoneId from [dbo].Studio std where sItem.StudioId = std.StudioId ) as std
			where rec.RecipientId is not null
		) as tbl
		--	Select 
			--	sItem.[Subject],
			--	sItem.MessageTypeId,
			--	sItem.BodyContent,	
			--	CONVERT(datetime, SWITCHOFFSET(rec.[DateCreated], DATEPART(TZOFFSET, 
			--	rec.[DateCreated] AT TIME ZONE std.TimeZoneId))) as MessageDateTime,
			--	CONVERT(VARCHAR(15),CAST(CONVERT(datetime, SWITCHOFFSET(rec.[DateCreated], 
			--	DATEPART(TZOFFSET,rec.[DateCreated] AT TIME ZONE std.[TimeZoneId]))) AS TIME), 0) as [MessageTime], 	
			--	--true as IsRead,
			--	--0 as IsAnonymousSender,
			--	--rec.DateCreated  as MessageDateTime,					
			--	--CONVERT(VARCHAR(10),CAST(CONVERT(datetime, rec.DateCreated) AS TIME), 0) as MessageTime, 
			--	'To : ' + rec.[Name] as [Name] ,
			--	rec.[Name] as DisplayName,
			--	rec.EmailAddress,
			--	rec.MobilePhone,
			--	mem.PhotoUrl,
			--	mem.[Image]			
		--	from SentItem sItem 
		--	outer apply
		--		(select top 1 * from Recipient rec where sItem.SentItemId = rec.SentItemId and sItem.StudioId = @StudioId) as rec
		--	outer apply
		--		(select top 1 PhotoUrl, [Image] from Member c where rec.MobilePhone = c.MobilePhone and sItem.StudioId = @StudioId) as mem
		--	outer apply
		--		(select top 1 StudioId, TimeZoneId from [dbo].Studio std where sItem.StudioId = std.StudioId ) as std
		--	where rec.RecipientId is not null
	   end
END