using AutoMapper;
using Cafe_API.Core.Entities;
using Cafe_API.WebAPI.DTOs.Food;

namespace Cafe_API.Core.Mapping
{
    public class AutoMapperProfiles : Profile
    {
        public AutoMapperProfiles()
        {
            CreateMap<IEnumerable<FoodAdditionalInfo>, Dictionary<string, string>>()
                .ConvertUsing((source, destination, context) =>
                {
                    var dictionary = new Dictionary<string, string>();

                    foreach (var item in source)
                    {
                        dictionary[item.Key] = item.Value;
                    }

                    return dictionary;
                });

            CreateMap<FoodItem, FoodItemDto>();

            CreateMap<Food, FoodDto>()
                .ConvertUsing((food, foodDto, context) =>
                {
                    var weightVariations = food.AdditionalInfo
                        .FirstOrDefault(info => info.Key == "Вага")?.Value ?? string.Empty;

                    return new FoodDto
                    {
                        Id = food.Id,
                        Title = food.Title,
                        Ingredients = string.Join(", ", food.Ingredients),
                        FoodItems = context.Mapper.Map<IEnumerable<FoodItemDto>>(food.FoodItems),
                        WeightVariations = weightVariations
                    };
                });

            CreateMap<Food, FoodDetailsDto>()
                    .ConvertUsing((food, foodDto, context) =>
                    {
                        var weightVariations = food.AdditionalInfo
                            .FirstOrDefault(info => info.Key == "Вага")?.Value ?? string.Empty;

                        return new FoodDetailsDto
                        {
                            Id = food.Id,
                            Title = food.Title,
                            Ingredients = string.Join(", ", food.Ingredients),
                            FoodItems = context.Mapper.Map<IEnumerable<FoodItemDto>>(food.FoodItems),
                            WeightVariations = weightVariations,
                            AdditionalInfo = context.Mapper.Map<Dictionary<string, string>>(food.AdditionalInfo)
                        };
                    });
        }
    }
}
