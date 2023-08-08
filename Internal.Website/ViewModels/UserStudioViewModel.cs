using System;
using System.ComponentModel;

namespace DataAccess.ViewModels
{
    public class UserStudioViewModel
    {
        public int StudioUserId { get; set; }       
        public int StudioId { get; set; }
        public string StudioName { get; set; }
        public int AppUserId { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }
    }
}
