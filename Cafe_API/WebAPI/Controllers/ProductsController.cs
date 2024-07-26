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

            if (quantity > products.Count())
                return BadRequest($"Quantity is too large, max possible is {products.Count()}");

            var dto = _mapper.Map<IEnumerable<FoodDto>>(products.Take(quantity));

            return Ok(dto);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetProductDetails(int id)
        {
            var product = await _foodRepository.GetFoodWithVariationsByIdAsync(id);

            var neighbours = await _foodRepository.FindAsync(x => x.Id == id - 1 || x.Id == id + 1);

            var dto = _mapper.Map<FoodDetailsDto>(product);

            foreach (var neighbour in neighbours)
            {
                if (neighbour.Category != product.Category)
                {
                    dto.NeighbourItems.Add(null);
                    continue;
                }
                var foodFullInfo = await _foodRepository.GetFoodWithVariationsByIdAsync(neighbour.Id);

                dto.NeighbourItems.Add(new FoodNavigationDto
                {
                    Id = foodFullInfo.Id,
                    Price = foodFullInfo.FoodItems.Min(x => x.Price),
                    Title = foodFullInfo.Title
                });
            }

            return Ok(dto);
        }

        [HttpGet("similar")]
        public async Task<IActionResult> GetSimilarProducts(int id, int quantity)
        {
            var product = await _foodRepository.GetByIdAsync(id);
            var others = await _foodRepository.FindAsync(x => x.Id != id && x.Category == product.Category);

            if (quantity > others.Count())
                return BadRequest($"Quantity is too large, max possible is {others.Count()}");

            others = others.OrderBy(x => x.Ingredients.Intersect(product.Ingredients).Count()).Take(quantity);

            var dtos = new List<FoodDto>();

            foreach (var current in others)
            {
                var foodWithVariations = await _foodRepository.GetFoodWithVariationsByIdAsync(current.Id);
                dtos.Add(_mapper.Map<FoodDto>(foodWithVariations));
            }

            return Ok(dtos);
        }
    }
}
