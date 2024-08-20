using AutoMapper;
using Cafe_API.Core.Interfaces;
using Cafe_API.WebAPI.DTOs.Orders;
using Cafe_API.WebAPI.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace Cafe_API.WebAPI.SignalR
{
    [Authorize]
    public class OrderHub : Hub
    {
        private readonly IOrdersRepository _repository;
        private readonly IFoodRepository _foodRepository;
        private readonly OrderProgressTracker _tracker;
        private readonly IMapper _mapper;

        public OrderHub(IOrdersRepository repository, IFoodRepository foodRepository,
            OrderProgressTracker tracker, IMapper mapper)
        {
            _repository = repository;
            _foodRepository = foodRepository;
            _tracker = tracker;
            _mapper = mapper;
        }
        public override async Task OnConnectedAsync()
        {
            var pendingOrders = await _repository
               .FindOrdersWithItemsAsync(x => x.Status == OrderStatus.Pending
                   || x.Status == OrderStatus.InProgress);

            var dtos = new List<OrderPendingDto>();

            foreach (var order in pendingOrders)
            {
                var dto = _mapper.Map<OrderPendingDto>(order);
                foreach (var item in order.Items)
                {
                    var itemDetails = await _foodRepository.GetFoodItemByIdAsync(item.FoodItemId);
                    var foodDetails = await _foodRepository.GetFoodByItemIdAsync(item.FoodItemId);

                    var itemDto = new OrderPendingItemDto
                    {
                        FoodSize = itemDetails.Size,
                        FoodTitle = foodDetails.Title,
                        Price = item.Price,
                        Quantity = item.Quantity,
                    };
                    dto.Items.Add(itemDto);
                }
                dtos.Add(dto);
            }

            dtos = dtos.OrderBy(o => o.CreationTime).ToList();
            await Clients.Caller.SendAsync("GetPendingOrders", dtos);
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            string username = Context.User.TryGetUserName()!;
            var orderId = await _tracker.GetMyProcessingOrder(username);
            if (orderId != null)
            {
                var order = await _repository.GetByIdAsync(orderId.Value);
                order.Status = OrderStatus.Pending;
                try
                {
                    await _tracker.ReleaseOrder(username);
                }
                catch (Exception ex)
                {
                    throw new HubException(ex.Message);
                }
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
            else if (order.Status != OrderStatus.Pending && order.Status != OrderStatus.InProgress)
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
                try
                {
                    await _tracker.ReleaseOrder(username);
                }
                catch (Exception ex)
                {
                    throw new HubException(ex.Message);
                }

                await Clients.All.SendAsync("OrderProcessed", order.Id);
            }
            else if (status == OrderStatus.InProgress)
            {
                order.Status = OrderStatus.InProgress;
                try
                {
                    await _tracker.ProcessOrder(username, orderId);
                }
                catch (Exception ex)
                {
                    throw new HubException(ex.Message);
                }

                await Clients.All.SendAsync("OrderInProgress", order.Id);
            }

            await _repository.SaveChangesAsync();
        }
    }
}
