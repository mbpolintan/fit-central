using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.ViewModels
{
    public class UserViewModel
    {
        public int AppUserId { get; set; }
        [DisplayName("User's Group")]
        public int AppGroupId { get; set; }
        [DisplayName("User's Email Address")]
        [RegularExpression("^[a-zA-Z0-9_\\.-]+@([a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,}$", ErrorMessage = "E-mail is not valid")]
        public string UserEmail { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        [Timestamp]
        public byte[] TimeStamp { get; set; }

    }
}
