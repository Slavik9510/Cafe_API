﻿using Cafe_API.Core.Entities;
using Cafe_API.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Cafe_API.Infrastructure.Data
{
    public class FoodRepository : Repository<Food>, IFoodRepository
    {
        public FoodRepository(DataContext context) : base(context)
        { }

        public async Task<IEnumerable<Food>> GetFoodWithVariationsAsync(Expression<Func<Food, bool>> predicate)
        {
            var food = await _dbSet.Include(f => f.FoodItems)
                .Include(f => f.AdditionalInfo)
                .Where(predicate)
                .ToListAsync();
            return food;
        }

        public async Task<Food> GetFoodWithVariationsByIdAsync(int id)
        {
            var food = await _dbSet.Include(f => f.FoodItems)
                .Include(f => f.AdditionalInfo)
                .Where(f => f.Id == id).FirstOrDefaultAsync();
            return food;
        }

        public async Task<FoodItem> GetFoodItemByIdAsync(int id)
        {
            var foodItem = await _context.FoodItems.FirstOrDefaultAsync(x => x.Id == id);
            return foodItem;
        }

        public async Task<Food?> GetFoodByItemIdAsync(int id)
        {
            var food = await _dbSet.FirstOrDefaultAsync(x => x.FoodItems.Any(y => y.Id == id));
            return food;
        }
    }
}
