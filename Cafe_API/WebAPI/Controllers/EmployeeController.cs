using AutoMapper;
using Cafe_API.Core.Interfaces;
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
            return Ok();
        }
    }
}
