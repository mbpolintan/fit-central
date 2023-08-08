using System;
using System.Collections.Generic;
using System.ComponentModel;

namespace DataAccess.Models
{
    public partial class WeightedSystem
    {
        public int WeightedSystemId { get; set; }
        public int GlobalTrainingGymId { get; set; }
        public string Category { get; set; }
        [DisplayName("Upper Range")]
        public decimal UpperRange { get; set; }
        [DisplayName("Weighted")]
        public decimal UpperRangeWeighted { get; set; }
        [DisplayName("Mid Range")]
        public decimal MidRange { get; set; }
        [DisplayName("Weighted")]
        public decimal MidRangeWeighted { get; set; }
        [DisplayName("Lower Range")]
        public decimal LowerRange { get; set; }
        [DisplayName("Weighted")]
        public decimal LowerRangeWeighted { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual GlobalTrainingGym GlobalTrainingGym { get; set; }
    }
}
