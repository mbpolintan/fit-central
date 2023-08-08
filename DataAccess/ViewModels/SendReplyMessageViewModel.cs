namespace DataAccess.ViewModels
{
    public class SendReplyMessageViewModel
    {
        public int MessageTypeId { get; set; }
        public int StudioId { get; set; }
        public string SendTo { get; set; }
        public string Message { get; set; }
        public string Subject { get; set; }
        public string DisplayName { get; set; }
        public int SenderUserId { get; set; }
    }
}
