using Cafe_API.Core.Entities;
using System.Linq.Expressions;

namespace Cafe_API.Core.Interfaces
{
    public interface IFoodRepository : IRepository<Food>
    {
        public Task<IEnumerable<Food>> GetFoodWithVariationsAsync(Expression<Func<Food, bool>> predicate);
        public Task<Food> GetFoodWithVariationsByIdAsync(int id);
    }
}
