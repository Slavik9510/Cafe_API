using AutoMapper;
using Cafe_API.Core.Entities;
using Cafe_API.Core.Interfaces;
using Cafe_API.WebAPI.DTOs.Orders;
using Cafe_API.WebAPI.Extensions;
using Cafe_API.WebAPI.SignalR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;

namespace Cafe_API.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : Controller
    {
        private readonly IRepository<Order> _ordersRepository;
        private readonly IFoodRepository _foodRepository;
        private readonly IMapper _mapper;
        private readonly IHubContext<OrderHub> _orderHub;

        public OrdersController(IRepository<Order> ordersRepository,
            IFoodRepository foodRepository, IMapper mapper, IHubContext<OrderHub> orderHub)
        {
            _ordersRepository = ordersRepository;
            _foodRepository = foodRepository;
            _mapper = mapper;
            _orderHub = orderHub;
        }
        [HttpPost]
        public async Task<IActionResult> PlaceNewOrder(OrderDto orderDto)
        {
            var order = _mapper.Map<Order>(orderDto);

            if (User.GetUserRoles().Contains("Employee"))
            {
                order.Status = OrderStatus.Approved;
            }
            else
            {
                int? id = User.TryGetUserId();
                order.CustomerId = id;
                order.Status = OrderStatus.Pending;
            }

            foreach (var item in order.Items)
            {
                var itemDetails = await _foodRepository.GetFoodItemByIdAsync(item.FoodItemId);
                if (itemDetails == null)
                    return BadRequest($"Invalid food item id: {item.FoodItemId}");

                item.Price = itemDetails.Price;
            }
            await _ordersRepository.AddAsync(order);
            await _ordersRepository.SaveChangesAsync();

            var orderConfirmDto = _mapper.Map<OrderPendingDto>(order);

            foreach (var item in order.Items)
            {
                var itemDetails = await _foodRepository.GetFoodItemByIdAsync(item.FoodItemId);
                var foodDetails = await _foodRepository.GetFoodByItemIdAsync(item.FoodItemId);

                var itemDto = new OrderPendingItemDto
                {
                    FoodSize = itemDetails.Size,
                    FoodTitle = foodDetails.Title,
                    Price = item.Price,
                    Quantity = item.Quantity,
                };
                orderConfirmDto.Items.Add(itemDto);
            }
            await _orderHub.Clients.All.SendAsync("NewOrderReceived", orderConfirmDto);

            return Ok(order);
        }
    }
}
