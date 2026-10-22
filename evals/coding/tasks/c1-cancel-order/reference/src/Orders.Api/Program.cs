using System.Text.Json.Serialization;
using Orders.Api;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddSingleton<IOrderRepository, InMemoryOrderRepository>();
builder.Services.AddSingleton<TimeProvider>(TimeProvider.System);
builder.Services.ConfigureHttpJsonOptions(options =>
{
    options.SerializerOptions.Converters.Add(new JsonStringEnumConverter());
});

var app = builder.Build();

app.MapGet("/orders/{id:int}", (int id, IOrderRepository orders) =>
{
    var order = orders.GetById(id);
    return order is null ? Results.NotFound() : Results.Ok(order);
});

app.MapPost("/orders/{id:int}/cancel", (int id, IOrderRepository orders, TimeProvider clock) =>
{
    var order = orders.GetById(id);
    if (order is null)
    {
        return Results.NotFound();
    }

    // ยกเลิกซ้ำ: ตอบเหมือนเดิม ไม่เปลี่ยนเวลาที่ยกเลิกครั้งแรก
    if (order.Status == OrderStatus.Cancelled)
    {
        return Results.Ok(order);
    }

    if (order.Status == OrderStatus.Shipped || order.Status == OrderStatus.Delivered)
    {
        return Results.Conflict(new { error = $"ยกเลิกไม่ได้ เพราะคำสั่งซื้ออยู่ในสถานะ {order.Status}" });
    }

    order.Status = OrderStatus.Cancelled;
    order.CancelledAt = clock.GetUtcNow();
    orders.Update(order);
    return Results.Ok(order);
});

app.Run();

// ให้ test เรียก WebApplicationFactory<Program> ได้
public partial class Program { }
