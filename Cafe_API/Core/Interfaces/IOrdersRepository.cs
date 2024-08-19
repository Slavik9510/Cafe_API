using Cafe_API.Core.Entities;
using System.Linq.Expressions;

namespace Cafe_API.Core.Interfaces
{
    public interface IOrdersRepository : IRepository<Order>
    {
        public Task<IEnumerable<Order>> FindOrdersWithItemsAsync(Expression<Func<Order, bool>> predicate);
        public Task<Order?> GetOrderWithItemsByIdAsync(int orderId);
    }
}
