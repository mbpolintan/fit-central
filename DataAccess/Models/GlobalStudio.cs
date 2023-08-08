using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace DataAccess.Models
{
    public partial class GlobalStudio
    {        
        public int GlobalStudioId { get; set; }
        [DisplayName("Training Gym")]
        public int GlobalTrainingGymId { get; set; }
        [DisplayName("Studio Name")]
        public int StudioId { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }        

        public virtual GlobalTrainingGym GlobalTrainingGym { get; set; }
        public virtual Studio Studio { get; set; }
    }
}
