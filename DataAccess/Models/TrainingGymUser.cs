using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class TrainingGymUser
    {
        public int TrainingGymUserId { get; set; }
        public int AppUserId { get; set; }
        public int GlobalTrainingGymId { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual AppUser AppUser { get; set; }
        public virtual GlobalTrainingGym GlobalTrainingGym { get; set; }
    }
}
