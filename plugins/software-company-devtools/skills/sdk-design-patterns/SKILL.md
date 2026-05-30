---
name: sdk-design-patterns
description: Use when designing or refactoring SDKs — API surface, language idioms, type safety, error handling, retries, pagination, streaming, file uploads. Concrete patterns by language.
---

# SDK Design Patterns

## When to use this skill

- Designing new SDK from scratch
- Refactoring poorly-designed SDK
- Adding language to existing SDK family
- Implementing complex SDK features (streaming, pagination)

## Idiomatic Naming

| Language | Method names | Class names | Constants |
|----------|--------------|-------------|-----------|
| JavaScript/TypeScript | camelCase | PascalCase | UPPER_SNAKE |
| Python | snake_case | PascalCase | UPPER_SNAKE |
| Go | PascalCase (export) / camelCase | PascalCase | PascalCase |
| Rust | snake_case | PascalCase | UPPER_SNAKE |
| Java | camelCase | PascalCase | UPPER_SNAKE |

## Client Initialization Patterns

### Pattern: Single Constructor + Options

```typescript
// JS/TS
const client = new Client({
  apiKey: 'sk_xxx',
  baseUrl: 'https://api.custom.com',  // optional override
  timeout: 30000,
  maxRetries: 3,
});

// Python (kwargs)
client = Client(
    api_key='sk_xxx',
    timeout=30,
    max_retries=3,
)

// Go (functional options)
client := example.NewClient(
    example.WithAPIKey("sk_xxx"),
    example.WithTimeout(30 * time.Second),
)

// Rust (builder)
let client = Client::builder()
    .api_key("sk_xxx")
    .timeout(Duration::from_secs(30))
    .build()?;
```

## Method Surface Design

### Pattern: Resource-Method Organization

```typescript
// Group methods by resource
client.users.list()
client.users.create(data)
client.users.retrieve(id)
client.users.update(id, data)
client.users.delete(id)

// Not flat:
// client.listUsers(), client.createUser(), ...

// Nested resources
client.users.list()
client.users(id).orders.list()
client.users(id).orders.create(data)
```

## Pagination Patterns

### Pattern: Auto-Iterator

```typescript
// Async iterator (modern JS/TS)
for await (const user of client.users.list()) {
  console.log(user);
}

// Or explicit pagination
const page1 = await client.users.list({ limit: 50 });
const page2 = await client.users.list({ limit: 50, after: page1.lastId });
```

```python
# Python iterator
for user in client.users.list():
    print(user)

# Or with cursor
page = client.users.list(limit=50)
while page.has_more:
    for user in page:
        print(user)
    page = page.next()
```

```go
// Go iterator
iter := client.Users.List(ctx, nil)
for iter.Next() {
    user := iter.User()
    fmt.Println(user)
}
if err := iter.Err(); err != nil {
    // handle
}
```

## Type Safety

### Pattern: Strong Types Everywhere

```typescript
// Request params types
interface UserCreateParams {
  email: string;
  name: string;
  metadata?: Record<string, string>;
}

// Response types
interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;  // ISO 8601
}

// Method signature is self-documenting
async create(params: UserCreateParams): Promise<User>;
```

### Pattern: Branded Types for IDs

```typescript
// Prevent passing user ID to order method
type UserId = string & { readonly __brand: 'UserId' };
type OrderId = string & { readonly __brand: 'OrderId' };

async retrieveOrder(id: OrderId): Promise<Order>;

// TypeScript catches:
const userId: UserId = 'user_123' as UserId;
client.orders.retrieve(userId);  // ❌ compile error
```

## Error Handling Patterns

### Pattern: Typed Errors

```typescript
// Specific error classes
class ApiError extends Error {
  constructor(public code: string, public statusCode: number, message: string) {
    super(message);
  }
}

class RateLimitError extends ApiError {
  constructor(public retryAfter: number, message: string) {
    super('rate_limit', 429, message);
  }
}

class AuthError extends ApiError {
  constructor() { super('auth', 401, 'Authentication failed'); }
}

// Usage
try {
  await client.users.create(data);
} catch (err) {
  if (err instanceof RateLimitError) {
    await sleep(err.retryAfter * 1000);
    // retry
  } else if (err instanceof AuthError) {
    // re-authenticate
  } else if (err instanceof ApiError) {
    console.error(err.code, err.statusCode);
  } else {
    throw err;  // unexpected
  }
}
```

### Pattern: Result Type (Rust style)

```rust
// Force handling
match client.users().create(params).await {
    Ok(user) => println!("{}", user.id),
    Err(e) => match e {
        Error::RateLimit { retry_after } => sleep(retry_after).await,
        Error::Auth => refresh_auth().await,
        _ => return Err(e),
    },
}
```

## Retry + Idempotency

```typescript
// Built-in retry on transient errors
const client = new Client({
  maxRetries: 3,
  retryDelay: 'exponential',
  retryOn: (err) => {
    return err.statusCode >= 500 ||
           err.statusCode === 429 ||
           err.code === 'ECONNRESET';
  },
});

// Idempotency keys for safe retries on writes
await client.charges.create(data, {
  idempotencyKey: 'order_123_charge',
});
```

## Streaming Patterns

### Pattern: Async Generator (LLMs, server-sent events)

```typescript
const stream = client.chat.complete({
  messages: [...],
  stream: true,
});

for await (const chunk of stream) {
  process.stdout.write(chunk.delta);
}
```

```python
stream = client.chat.complete(
    messages=[...],
    stream=True,
)

for chunk in stream:
    print(chunk.delta, end='')
```

## File Upload Patterns

```typescript
// Streaming upload (don't load whole file)
const file = createReadStream('large.pdf');
await client.documents.upload({
  filename: 'large.pdf',
  contentType: 'application/pdf',
  stream: file,
});

// Or browser File API
await client.documents.upload({
  file: fileInput.files[0],
});
```

## Webhook Verification SDK

```typescript
// Provide helper to verify webhook signatures
client.webhooks.verify({
  payload: req.rawBody,
  signature: req.headers['x-signature'],
  secret: WEBHOOK_SECRET,
});
// Throws on invalid

// Then parse
const event = client.webhooks.constructEvent(req.body);
```

## OAuth Helper SDK

```typescript
// Don't make users implement OAuth themselves
const authUrl = client.oauth.authorizationUrl({
  scope: 'read write',
  redirectUri: '/callback',
  state: crypto.randomUUID(),
});

// After callback
const tokens = await client.oauth.exchangeCode({
  code,
  codeVerifier,
});

client.setAuth(tokens.accessToken);
```

## Versioning Strategy

```typescript
// Package version (semver)
// "@example/sdk": "^2.5.0"

// API version (date-based)
const client = new Client({
  apiVersion: '2026-01-01',  // pin to specific
});
// Sends header: API-Version: 2026-01-01

// Deprecation
// SDK 2.x → API 2026-01-01
// SDK 3.x → API 2027-01-01 (new defaults)
```

## Things You Don't Do

- ❌ Different naming conventions across languages
- ❌ Type-unsafe parameters when language supports types
- ❌ Hand-write SDKs in 2026 (generate)
- ❌ Break v1 with v1.x changes
- ❌ Ignore retry edge cases
- ❌ Force callbacks when async/promises work

## Reference

- [Stripe SDK Design](https://github.com/stripe/stripe-node)
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript)
- [Stainless (SDK generator)](https://www.stainlessapi.com/)
- [Fern (SDK generator)](https://buildwithfern.com/)
- [Speakeasy (SDK generator)](https://www.speakeasy.com/)
