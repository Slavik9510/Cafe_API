namespace Cafe_API.Core.Entities
{
    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int FoodItemId { get; set; }
        public byte Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
