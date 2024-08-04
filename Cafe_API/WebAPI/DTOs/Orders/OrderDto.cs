using System.ComponentModel.DataAnnotations;

namespace Cafe_API.WebAPI.DTOs.Orders
{
    public class OrderDto
    {
        [Required]
        public string CustomerName { get; set; }
        [Required]
        public string PhoneNumber { get; set; }
        [EmailAddress]
        [Required]
        public string? Email { get; set; }
        public string? AdditionalInfo { get; set; }
        [Required]
        public ICollection<OrderItemDto> Items { get; set; }
    }
}
