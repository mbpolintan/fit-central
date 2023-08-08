using System;

namespace DataService.ViewModels
{
    public class ClassDescriptionViewModel
    {
        public bool? Active { get; set; }
        public string Description { get; set; }
        public int? Id { get; set; }
        public string ImageUrl { get; set; }
        public DateTime? LastUpdated { get; set; }
        public LevelViewModel Level { get; set; }
        public string Name { get; set; }
        public string Notes { get; set; }
        public string Prereq { get; set; }
        public ProgramViewModel Program { get; set; }
        public SessionTypeViewModel SessionType { get; set; }
        public string Category { get; set; }
        public int? CategoryId { get; set; }
        public string Subcategory { get; set; }
        public int? SubcategoryId { get; set; }       
    }


}
