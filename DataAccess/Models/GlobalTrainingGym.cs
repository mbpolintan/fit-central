using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace DataAccess.Models
{
    public partial class GlobalTrainingGym
    {
        public GlobalTrainingGym()
        {
            GlobalStudio = new HashSet<GlobalStudio>();           
            Manager = new HashSet<Manager>();
            PointsSystem = new HashSet<PointsSystem>();
            TrainingGymUser = new HashSet<TrainingGymUser>();
            WeightedSystem = new HashSet<WeightedSystem>();
        }

        public int GlobalTrainingGymId { get; set; }
        [DisplayName("Parent Studio")]
        public string GymName { get; set; }
        public int CreatedById { get; set; }
        public DateTime DateCreated { get; set; }
        public int? ModifiedById { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }


        public virtual ICollection<GlobalStudio> GlobalStudio { get; set; }
        public virtual ICollection<Manager> Manager { get; set; }
        public virtual ICollection<PointsSystem> PointsSystem { get; set; }
        public virtual ICollection<TrainingGymUser> TrainingGymUser { get; set; }
        public virtual ICollection<WeightedSystem> WeightedSystem { get; set; }
    }
}
