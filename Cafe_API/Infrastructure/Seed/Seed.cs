﻿using Cafe_API.Core.Entities;
using Cafe_API.Core.Helpers;
using Cafe_API.Infrastructure.Data;
using Cafe_API.Infrastructure.HTML_Parsers;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Cafe_API.Infrastructure.Seed
{
    public class Seed
    {
        public static async Task SeedAsync(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager,
            DataContext context)
        {
            if (await context.Foods.AnyAsync()) return;

            string filepath = Path.Combine(Directory.GetCurrentDirectory(), "Infrastructure\\Seed");

            var parser = new FoodParser(new HttpClient());
            await parser.ParseAndSaveAsync("https://kvadratsushi.com", filepath);

            var foods = await JsonFileIO.DeserializeFromFile<List<Food>>(Path.Combine(filepath, "food.json"));
            var foodItems = await JsonFileIO
                .DeserializeFromFile<List<FoodItem>>(Path.Combine(filepath, "foodItems.json"));

            foreach (var food in foods)
            {
                var additionalInfos = food.AdditionalInfo;
                foreach (var current in additionalInfos)
                {
                    current.Id = 0;
                }
                var items = foodItems.Where(fi => fi.FoodId == food.Id);

                food.Id = 0;
                food.CreationDate = DateTime.Now;
                await context.Foods.AddAsync(food);
                await context.SaveChangesAsync();

                foreach (var item in items)
                {
                    item.FoodId = food.Id;
                    item.Id = 0;
                }

                foreach (var current in additionalInfos)
                    current.FoodId = food.Id;

                await context.FoodItems.AddRangeAsync(items);
                await context.SaveChangesAsync();
            }

            var roles = new List<AppRole>()
            {
                new AppRole(){Name="Customer"},
                new AppRole(){Name="Admin"},
                new AppRole(){Name="Employee"}
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }
        }
    }
}
