namespace Cafe_API.Core.Entities
{
    public class Order
    {
        public int Id { get; set; }
        public int? CustomerId { get; set; }
        public string CustomerName { get; set; }
        public string PhoneNumber { get; set; }
        public string? Email { get; set; }
        public string? AdditionalInfo { get; set; }
        public DateTime CreationTime { get; set; }
        public OrderStatus Status { get; set; }

        // Navigation properties
        public AppUser Customer { get; set; }
        public ICollection<OrderItem> Items { get; set; }
    }
}
