using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ChallengeStudio
    {
        public int ChallengeStudioId { get; set; }
        public int StudioId { get; set; }
        public int ChallengeId { get; set; }
        public int ScoringSystemId { get; set; }
        public int? ImageScore { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual Challenge Challenge { get; set; }
        public virtual ScoringSystem ScoringSystem { get; set; }
        public virtual Studio Studio { get; set; }
    }
}
