using AutoMapper;
using Cafe_API.Core.Entities;
using Cafe_API.Core.Interfaces;
using Cafe_API.WebAPI.DTOs.Orders;
using Cafe_API.WebAPI.Extensions;
using Microsoft.AspNetCore.Mvc;

namespace Cafe_API.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : Controller
    {
        private readonly IRepository<Order> _ordersRepository;
        private readonly IFoodRepository _foodRepository;
        private readonly IMapper _mapper;

        public OrdersController(IRepository<Order> ordersRepository, IFoodRepository foodRepository, IMapper mapper)
        {
            _ordersRepository = ordersRepository;
            _foodRepository = foodRepository;
            _mapper = mapper;
        }
        [HttpPost]
        public async Task<IActionResult> PlaceNewOrder(OrderDto orderDto)
        {
            var order = _mapper.Map<Order>(orderDto);
            int? id = User.TryGetUserId();
            order.CustomerId = id;
            foreach (var item in order.Items)
            {
                var itemDetails = await _foodRepository.GetFoodItemByIdAsync(item.FoodItemId);
                if (itemDetails == null)
                    return BadRequest($"Invalid food item id: {item.FoodItemId}");

                item.Price = itemDetails.Price;
            }
            await _ordersRepository.AddAsync(order);
            await _ordersRepository.SaveChangesAsync();

            return Ok(order);
        }
    }
}
