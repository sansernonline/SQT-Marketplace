using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Orders.Api;
using Xunit;

namespace Orders.Tests;

public class GetOrderTests
{
    [Fact]
    public async Task Get_existing_order_returns_200_with_status()
    {
        await using var factory = new WebApplicationFactory<Program>();
        var repository = factory.Services.GetRequiredService<IOrderRepository>();
        repository.Add(new Order { Id = 1, CustomerName = "Somchai", Total = 250m, Status = OrderStatus.Paid });
        var client = factory.CreateClient();

        var response = await client.GetAsync("/orders/1");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var body = JsonDocument.Parse(await response.Content.ReadAsStringAsync());
        Assert.Equal("Paid", body.RootElement.GetProperty("status").GetString());
    }

    [Fact]
    public async Task Get_missing_order_returns_404()
    {
        await using var factory = new WebApplicationFactory<Program>();
        var client = factory.CreateClient();

        var response = await client.GetAsync("/orders/999");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
