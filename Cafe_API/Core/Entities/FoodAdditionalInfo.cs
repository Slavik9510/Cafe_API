namespace Cafe_API.Core.Entities
{
    public class FoodAdditionalInfo
    {
        public int Id { get; set; }
        public int FoodId { get; set; }
        public string Key { get; set; }
        public string Value { get; set; }

        // Navigation
        public Food Food { get; set; }
    }
}
