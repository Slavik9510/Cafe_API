namespace Cafe_API.Core.Entities
{
    public class Food
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Category { get; set; }
        public HashSet<string>? Ingredients { get; set; } = new();
        public DateTime CreationDate { get; set; }

        // Navigation properties
        public ICollection<FoodAdditionalInfo> AdditionalInfo { get; set; }
        public ICollection<FoodItem> FoodItems { get; set; }
    }
}
