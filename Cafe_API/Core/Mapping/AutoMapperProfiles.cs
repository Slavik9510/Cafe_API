using AutoMapper;
using Cafe_API.Core.Entities;
using Cafe_API.WebAPI.DTOs.Food;
using Cafe_API.WebAPI.DTOs.Orders;

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
            CreateMap<OrderItemDto, OrderItem>().ReverseMap();

            CreateMap<OrderDto, Order>()
                .ConvertUsing((orderDto, order, context) =>
                {
                    var orderItems = context.Mapper.Map<ICollection<OrderItem>>(orderDto.Items);
                    return new Order
                    {
                        AdditionalInfo = orderDto.AdditionalInfo,
                        CreationTime = DateTime.Now,
                        CustomerName = orderDto.CustomerName,
                        Email = orderDto.Email,
                        PhoneNumber = orderDto.PhoneNumber,
                        Items = orderItems
                    };
                });

            CreateMap<Order, OrderPendingDto>()
                .ConvertUsing((order, orderConfirm, context) =>
                {
                    return new OrderPendingDto
                    {
                        Id = order.Id,
                        AdditionalInfo = order.AdditionalInfo,
                        CustomerName = order.CustomerName,
                        Email = order.Email,
                        PhoneNumber = order.PhoneNumber,
                        CreationTime = order.CreationTime,
                        Status = OrderStatus.Pending,
                        Items = new List<OrderPendingItemDto>()
                    };
                });
        }
    }
}
