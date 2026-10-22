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

app.Run();

// ให้ test เรียก WebApplicationFactory<Program> ได้
public partial class Program { }
