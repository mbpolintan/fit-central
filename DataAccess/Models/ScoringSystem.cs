using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ScoringSystem
    {
        public ScoringSystem()
        {
            ChallengeStudio = new HashSet<ChallengeStudio>();
        }

        public int ScoringSystemId { get; set; }
        public string Description { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual ICollection<ChallengeStudio> ChallengeStudio { get; set; }
    }
}
