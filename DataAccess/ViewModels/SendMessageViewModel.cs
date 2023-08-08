namespace DataAccess.ViewModels
{
    public class SendMessageViewModel
    {
        public string MessageType { get; set; }
        public int? MessageTypeId { get; set; }
        public int StudioId { get; set; }
        public string RecipientType { get; set; }
        public int?[] MemberIds { get; set; }
        public int? StatusId { get; set; }
        public string Message { get; set; }
        public string Subject { get; set; }

        public int SenderUserId { get; set; }

    }
}
