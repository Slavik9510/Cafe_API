using AutoMapper;
using Cafe_API.Core.Helpers;
using Cafe_API.Core.Interfaces;
using Cafe_API.WebAPI.DTOs.Food;
using Microsoft.AspNetCore.Mvc;

namespace Cafe_API.WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : Controller
    {
        private readonly IFoodRepository _foodRepository;
        private readonly IMapper _mapper;

        public ProductsController(IFoodRepository foodRepository, IMapper mapper)
        {
            _foodRepository = foodRepository;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetProductsByCategory(string category, string orderBy)
        {
            var products = await _foodRepository.GetFoodWithVariationsAsync(f => f.Category == category);

            switch (orderBy)
            {
                case "price":
                    products = products.OrderBy(x => x, new FoodPriceComparer());
                    break;
                case "price-desc":
                    products = products.OrderByDescending(x => x, new FoodPriceComparer());
                    break;
                case "date":
                    products = products.OrderByDescending(x => x.CreationDate);
                    break;
                default:
                    break;
            }

            var dto = _mapper.Map<IEnumerable<FoodDto>>(products);

            foreach (var foodDto in dto)
            {
                foodDto.WeightVariations = products.First(p => p.Id == foodDto.Id)
                    .AdditionalInfo.FirstOrDefault(k => k.Key == "Вага")?.Value;
            }
            return Ok(dto);
        }

        [HttpGet("popular")]
        public async Task<IActionResult> GetPopularProducts(int quantity)
        {
            var products = await _foodRepository
                .GetFoodWithVariationsAsync(x => true);

            var dto = _mapper.Map<IEnumerable<FoodDto>>(products.Take(quantity));

            return Ok(dto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductDetails(int id)
        {
            var product = await _foodRepository.GetFoodWithVariationsByIdAsync(id);

            return Ok(_mapper.Map<FoodDetailsDto>(product));
        }
    }
}
