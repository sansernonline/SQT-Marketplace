namespace Orders.Api;

public interface IOrderRepository
{
    Order? GetById(int id);

    void Add(Order order);

    void Update(Order order);
}
