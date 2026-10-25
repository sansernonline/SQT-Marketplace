using System.Collections.Concurrent;

namespace Orders.Api;

public class InMemoryOrderRepository : IOrderRepository
{
    private readonly ConcurrentDictionary<int, Order> _orders = new();

    public Order? GetById(int id)
    {
        return _orders.TryGetValue(id, out var order) ? order : null;
    }

    public void Add(Order order)
    {
        _orders[order.Id] = order;
    }

    public void Update(Order order)
    {
        _orders[order.Id] = order;
    }
}
