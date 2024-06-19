namespace Cafe_API.Core.Entities
{
    public class FoodItem
    {
        public int Id { get; set; }
        public int FoodId { get; set; }
        public decimal Price { get; set; }
        public short Weight { get; set; }
        public byte? Size { get; set; }

        // Navigation properties
        public Food Food { get; set; }
    }
}
