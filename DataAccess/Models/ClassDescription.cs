using System;
using System.Collections.Generic;

namespace DataAccess.Models
{
    public partial class ClassDescription
    {
        public ClassDescription()
        {
            ClassDescriptionLevel = new HashSet<ClassDescriptionLevel>();
            ClassDescriptionProgram = new HashSet<ClassDescriptionProgram>();
            ClassDescriptionSessionType = new HashSet<ClassDescriptionSessionType>();
        }

        public int ScclassDescriptionId { get; set; }
        public int StudioId { get; set; }
        public bool? Active { get; set; }
        public string Description { get; set; }
        public int? Id { get; set; }
        public string ImageUrl { get; set; }
        public DateTime? LastUpdated { get; set; }
        public string Name { get; set; }
        public string Notes { get; set; }
        public string Prereq { get; set; }
        public string Category { get; set; }
        public int? CategoryId { get; set; }
        public string Subcategory { get; set; }
        public int? SubcategoryId { get; set; }
        public DateTime DateCreated { get; set; }
        public DateTime? DateModified { get; set; }
        public byte[] TimeStamp { get; set; }

        public virtual Studio Studio { get; set; }
        public virtual ICollection<ClassDescriptionLevel> ClassDescriptionLevel { get; set; }
        public virtual ICollection<ClassDescriptionProgram> ClassDescriptionProgram { get; set; }
        public virtual ICollection<ClassDescriptionSessionType> ClassDescriptionSessionType { get; set; }
    }
}
