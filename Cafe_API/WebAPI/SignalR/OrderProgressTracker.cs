namespace Cafe_API.WebAPI.SignalR
{
    public class OrderProgressTracker
    {
        private static readonly Dictionary<string, int> ProcessingOrders = new();

        public Task ProcessOrder(string username, int orderId)
        {
            lock (ProcessingOrders)
            {
                if (ProcessingOrders.ContainsKey(username))
                {
                    throw new Exception("You can not process more than one order at once");
                }
                else if (ProcessingOrders.ContainsValue(orderId))
                {
                    throw new Exception("Order is already being processing by another employee");
                }
                ProcessingOrders.Add(username, orderId);
            }

            return Task.CompletedTask;
        }

        public Task OrderProcessed(string username)
        {
            lock (ProcessingOrders)
            {
                if (ProcessingOrders.ContainsKey(username))
                {
                    ProcessingOrders.Remove(username);
                }
                else
                {
                    throw new Exception("You are not currently processing any orders");
                }
            }
            return Task.CompletedTask;
        }

        public Task<int?> GetMyProcessingOrder(string username)
        {
            int? orderId = ProcessingOrders[username];

            return Task.FromResult(orderId);
        }
    }
}
