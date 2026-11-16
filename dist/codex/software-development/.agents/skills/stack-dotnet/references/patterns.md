# C# patterns · stack-dotnet

## Result<T> for expected failures

```csharp
public sealed record Result<T>(bool IsSuccess, T? Value, string? Error, string? Code)
{
    public static Result<T> Ok(T value) => new(true, value, null, null);
    public static Result<T> Fail(string error, string? code = null) => new(false, default, error, code);
}

// service
return stock < qty ? Result<Order>.Fail("สต็อกไม่พอ", "OUT_OF_STOCK") : Result<Order>.Ok(order);

// endpoint — one code → status mapping for the whole system, then emit ProblemDetails
return r.IsSuccess ? Results.Ok(r.Value) : Results.Problem(r.Error, statusCode: r.Code switch { "NOT_FOUND" => 404, "OUT_OF_STOCK" => 409, _ => 400 });
```

## Value type with private constructor (Thai national ID)

```csharp
// Thai national ID: 13 digits + check digit · money in satang (long), never double
public readonly record struct ThaiNationalId
{
    public string Value { get; }
    private ThaiNationalId(string v) => Value = v;
    public static ThaiNationalId? Create(string s)
    {
        if (s.Length != 13 || !s.All(char.IsAsciiDigit)) return null;
        var sum = s.Take(12).Select((c, i) => (c - '0') * (13 - i)).Sum();
        return (11 - sum % 11) % 10 == s[12] - '0' ? new ThaiNationalId(s) : null;
    }
}
```
(This C# example has not been compiled · the check-digit formula is the same as in the TypeScript example that has been run)
