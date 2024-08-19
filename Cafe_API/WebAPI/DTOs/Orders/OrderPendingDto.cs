namespace Cafe_API.WebAPI.DTOs.Orders
{
    public class OrderPendingDto
    {
        public int Id { get; set; }
        public string CustomerName { get; set; }
        public string PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? AdditionalInfo { get; set; }
        public OrderStatus Status { get; set; }
        public DateTime CreationTime { get; set; }
        public ICollection<OrderPendingItemDto> Items { get; set; }
    }
}
