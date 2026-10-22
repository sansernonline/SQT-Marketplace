using System.Net;
using System.Text.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Orders.Api;
using Xunit;

namespace Orders.Tests.Hidden;

public class CancelOrderHiddenTests
{
    private static readonly DateTimeOffset FixedNow = new DateTimeOffset(2026, 3, 1, 10, 30, 0, TimeSpan.Zero);

    private sealed class FixedTimeProvider : TimeProvider
    {
        private readonly DateTimeOffset _now;

        public FixedTimeProvider(DateTimeOffset now)
        {
            _now = now;
        }

        public override DateTimeOffset GetUtcNow()
        {
            return _now;
        }
    }

    private sealed class TestFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.ConfigureTestServices(services =>
            {
                services.AddSingleton<TimeProvider>(new FixedTimeProvider(FixedNow));
            });
        }
    }

    private static IOrderRepository Seed(TestFactory factory, int id, OrderStatus status, DateTimeOffset? cancelledAt = null)
    {
        var repository = factory.Services.GetRequiredService<IOrderRepository>();
        repository.Add(new Order
        {
            Id = id,
            CustomerName = "Customer " + id,
            Total = 100m + id,
            Status = status,
            CancelledAt = cancelledAt
        });
        return repository;
    }

    private static async Task<JsonDocument> ReadJson(HttpResponseMessage response)
    {
        var text = await response.Content.ReadAsStringAsync();
        return JsonDocument.Parse(text);
    }

    [Fact]
    public async Task Cancel_missing_order_returns_404()
    {
        await using var factory = new TestFactory();
        Seed(factory, 1, OrderStatus.Pending);
        var client = factory.CreateClient();

        var response = await client.PostAsync("/orders/12345/cancel", null);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task Cancel_pending_order_sets_status_and_time_from_TimeProvider()
    {
        await using var factory = new TestFactory();
        Seed(factory, 10, OrderStatus.Pending);
        var client = factory.CreateClient();

        var response = await client.PostAsync("/orders/10/cancel", null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var body = await ReadJson(response);
        Assert.Equal("Cancelled", body.RootElement.GetProperty("status").GetString());
        Assert.Equal(FixedNow, body.RootElement.GetProperty("cancelledAt").GetDateTimeOffset());

        var after = await client.GetAsync("/orders/10");
        using var afterBody = await ReadJson(after);
        Assert.Equal("Cancelled", afterBody.RootElement.GetProperty("status").GetString());
    }

    [Fact]
    public async Task Cancel_paid_order_is_saved_in_repository()
    {
        await using var factory = new TestFactory();
        var repository = Seed(factory, 11, OrderStatus.Paid);
        var client = factory.CreateClient();

        var response = await client.PostAsync("/orders/11/cancel", null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var saved = repository.GetById(11);
        Assert.NotNull(saved);
        Assert.Equal(OrderStatus.Cancelled, saved.Status);
        Assert.Equal(FixedNow, saved.CancelledAt);
    }

    [Fact]
    public async Task Cancel_shipped_order_returns_409_with_json_error()
    {
        await using var factory = new TestFactory();
        var repository = Seed(factory, 20, OrderStatus.Shipped);
        var client = factory.CreateClient();

        var response = await client.PostAsync("/orders/20/cancel", null);

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
        Assert.Equal("application/json", response.Content.Headers.ContentType?.MediaType);
        using var body = await ReadJson(response);
        Assert.False(string.IsNullOrWhiteSpace(body.RootElement.GetProperty("error").GetString()));

        var saved = repository.GetById(20);
        Assert.NotNull(saved);
        Assert.Equal(OrderStatus.Shipped, saved.Status);
        Assert.Null(saved.CancelledAt);
    }

    [Fact]
    public async Task Cancel_delivered_order_returns_409_and_keeps_status()
    {
        await using var factory = new TestFactory();
        var repository = Seed(factory, 21, OrderStatus.Delivered);
        var client = factory.CreateClient();

        var response = await client.PostAsync("/orders/21/cancel", null);

        Assert.Equal(HttpStatusCode.Conflict, response.StatusCode);
        using var body = await ReadJson(response);
        Assert.False(string.IsNullOrWhiteSpace(body.RootElement.GetProperty("error").GetString()));

        var saved = repository.GetById(21);
        Assert.NotNull(saved);
        Assert.Equal(OrderStatus.Delivered, saved.Status);
        Assert.Null(saved.CancelledAt);
    }

    [Fact]
    public async Task Cancel_already_cancelled_order_returns_200_and_keeps_first_cancel_time()
    {
        var firstCancel = new DateTimeOffset(2026, 2, 1, 8, 0, 0, TimeSpan.Zero);
        await using var factory = new TestFactory();
        var repository = Seed(factory, 30, OrderStatus.Cancelled, firstCancel);
        var client = factory.CreateClient();

        var response = await client.PostAsync("/orders/30/cancel", null);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        using var body = await ReadJson(response);
        Assert.Equal("Cancelled", body.RootElement.GetProperty("status").GetString());
        Assert.Equal(firstCancel, body.RootElement.GetProperty("cancelledAt").GetDateTimeOffset());

        var saved = repository.GetById(30);
        Assert.NotNull(saved);
        Assert.Equal(firstCancel, saved.CancelledAt);
    }
}
