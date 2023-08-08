using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace DataAccess.ViewModels
{
    public class ManagerViewModel
    {
        public int ManagerId { get; set; }
        public int AppUserId { get; set; }
        public string  UserEmail { get; set; }
        public int GlobalTrainingGymId { get; set; }
        public int StudioId { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }
    }
}
