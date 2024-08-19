namespace Cafe_API.WebAPI.DTOs.Orders
{
    public class OrderPendingItemDto
    {
        public string FoodTitle { get; set; }
        public byte? FoodSize { get; set; }
        public byte Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
