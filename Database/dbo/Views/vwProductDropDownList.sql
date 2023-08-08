

CREATE VIEW [dbo].[vwProductDropDownList]
AS

SELECT 
	prod.ProductId,
	prod.SiteId,
	prod.Name,
	DisplayName = case
	when (color.Name = 'N/A' or color.Name = 'None') and (size.Name = 'N/A' or size.Name = 'None') 
		then prod.Name + ' - $' + convert(varchar(30), prod.Price, 1)
	when (color.Name = 'N/A' or color.Name = 'None') and (size.Name <> 'N/A' or size.Name <> 'None') 
		then prod.Name + ' - $' + convert(varchar(30), prod.Price, 1) + ' Size:' + size.Name
	when (color.Name <> 'N/A' or color.Name <> 'None') and (size.Name = 'N/A' or size.Name = 'None') 
		then prod.Name + ' - $' + convert(varchar(30), prod.Price, 1) + ' Color:' + color.Name
	else
	prod.Name + ' - $' + convert(varchar(30), prod.Price, 1) + ' Color:' + color.Name + ' Size:' + size.Name
	end
  FROM [dbo].Product prod 
  outer apply
  (select * from ProductColor color where prod.ProductId = color.ProductId) color
   outer apply
  (select * from ProductSize size where prod.ProductId = size.ProductId) size