using Cafe_API.Core.Entities;
using Cafe_API.Core.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace Cafe_API.Infrastructure.Data
{
    public class OrdersRepository : Repository<Order>, IOrdersRepository
    {
        public OrdersRepository(DataContext context) : base(context)
        { }
        public async Task<IEnumerable<Order>> FindOrdersWithItemsAsync(Expression<Func<Order, bool>> predicate)
        {
            var orders = await _dbSet.Include(o => o.Items)
                .Where(predicate)
                .ToListAsync();
            return orders;
        }

        public async Task<Order?> GetOrderWithItemsByIdAsync(int orderId)
        {
            return await _dbSet.Include(o => o.Items)
                .FirstOrDefaultAsync(x => x.Id == orderId);
        }
    }
}
