namespace DataService.ViewModels
{
    public partial class ClientRelationship
    {
        public string RelatedClientId { get; set; }
        public string RelationshipName { get; set; }
        public bool Delete { get; set; }
        public Relationship Relationship { get; set; }       
    }
}
