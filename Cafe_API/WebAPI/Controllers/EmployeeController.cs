using AutoMapper;
using Cafe_API.Core.Interfaces;
using Cafe_API.WebAPI.DTOs.Orders;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Cafe_API.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Employee")]
    public class EmployeeController : Controller
    {
        private readonly IOrdersRepository _repository;
        private readonly IFoodRepository _foodRepository;
        private readonly IMapper _mapper;

        public EmployeeController(IOrdersRepository repository, IFoodRepository foodRepository, IMapper mapper)
        {
            _repository = repository;
            _foodRepository = foodRepository;
            _mapper = mapper;
        }
        [HttpGet("pending-orders")]
        public async Task<IActionResult> GetPendingOrders()
        {
            var pendingOrders = await _repository.FindOrdersWithItemsAsync(x => x.Status == OrderStatus.Pending);

            var dtos = new List<OrderPendingDto>();

            foreach (var order in pendingOrders)
            {
                var dto = _mapper.Map<OrderPendingDto>(order);
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
                    dto.Items.Add(itemDto);
                }
                dtos.Add(dto);
            }

            dtos = dtos.OrderBy(o => o.CreationTime).ToList();

            return Ok(dtos);
        }
    }
}
