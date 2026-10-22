namespace Orders.Api;

public class Order
{
    public int Id { get; set; }

    public string CustomerName { get; set; } = "";

    public decimal Total { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Pending;

    public DateTimeOffset? CancelledAt { get; set; }
}
