using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace DataAccess.Models
{
    public partial class PointsSystem
    {
        public int PointsSystemId { get; set; }
        public int GlobalTrainingGymId { get; set; }
        [DisplayName("Points Allocation")]
        public int? PointsAllocation { get; set; }
        [DisplayName("Before and After Picture")]
        public int? BeforeAndAfterPicture { get; set; }
        [DisplayName("In Body Score")]
        public int? InbodyScore { get; set; }
        [DisplayName("Weight")]
        public decimal? WeightLoss { get; set; }
        [DisplayName("Percent Body Fat")]
        public decimal? Pbfloss { get; set; }
        [DisplayName("Skeletal Muscle Mass")]
        public decimal? Smmgain { get; set; }
        [DisplayName("Visceral Fat Level")]
        public decimal? Vflloss { get; set; }
        [DisplayName("Class Attended")]
        public int? ClassAttended { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual GlobalTrainingGym GlobalTrainingGym { get; set; }
    }
}
