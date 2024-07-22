namespace Cafe_API.WebAPI.DTOs.Food
{
    public class FoodDto
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Ingredients { get; set; }
        public DateTime CreationDate { get; set; }
        public string? WeightVariations { get; set; }
        public IEnumerable<FoodItemDto> FoodItems { get; set; }
    }
}
