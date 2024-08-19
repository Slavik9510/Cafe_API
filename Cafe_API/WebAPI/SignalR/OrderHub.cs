using Cafe_API.Core.Interfaces;
using Cafe_API.WebAPI.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Cafe_API.WebAPI.SignalR
{
    [Authorize]
    public class OrderHub : Hub
    {
        private readonly IOrdersRepository _repository;
        private readonly OrderProgressTracker _tracker;

        public OrderHub(IOrdersRepository repository, OrderProgressTracker tracker)
        {
            _repository = repository;
            _tracker = tracker;
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            string username = Context.User.TryGetUserName()!;
            var orderId = await _tracker.GetMyProcessingOrder(username);
            if (orderId != null)
            {
                var order = await _repository.GetByIdAsync(orderId.Value);
                order.Status = OrderStatus.Pending;
                await _repository.SaveChangesAsync();
                await Clients.Others.SendAsync("ReleasedOrder", order.Id);
            }
            await base.OnDisconnectedAsync(exception);
        }

        public async Task ProcessOrder(int orderId, OrderStatus status)
        {
            var order = await _repository.GetByIdAsync(orderId);

            if (order == null)
            {
                throw new HubException("Invalid order id");
            }
            else if (order.Status != OrderStatus.Pending)
            {
                throw new HubException("The order has already been processed");
            }

            string username = Context.User.TryGetUserName()!;

            if (status == OrderStatus.Pending)
            {
                throw new HubException("Invalid order status");
            }
            else if (status == OrderStatus.Approved || status == OrderStatus.Rejected)
            {
                order.Status = status;
                await _tracker.OrderProcessed(username);
                await Clients.All.SendAsync("OrderProcessed", order.Id);
            }
            else if (status == OrderStatus.InProgress)
            {
                order.Status = OrderStatus.InProgress;
                await _tracker.ProcessOrder(username, orderId);
                await Clients.Others.SendAsync("OrderInProgress", order.Id);
            }

            await _repository.SaveChangesAsync();
        }
    }
}
