# API Authentication และ Authorization Patterns

How each type of API authentication works, principles for managing API keys, and examples of RBAC and ABAC

## Pattern 7: API Authentication

| Method | Use case | Token format |
|--------|----------|--------------|
| **API Keys** | Server-to-server, simple | `sk_live_xxx` |
| **OAuth 2.0 Client Credentials** | Service-to-service | JWT bearer |
| **mTLS** (both sides present certificates) | High-security, internal | X.509 certs |
| **HMAC signing** | Webhook verification | `HMAC-SHA256` |

### API Key best practices
- Prefix with environment: `sk_test_xxx`, `sk_live_xxx`
- Show the secret ONCE, when it is created
- Store it hashed (like a password)
- Allow scopes/permissions per key
- Allow expiry and replacement
- Show when each key was last used
- Let users revoke a key instantly

## Authorization Patterns (after authentication)

### RBAC (Role-Based Access Control)
```
User → Role → Permissions
e.g., user@example.com → admin → [users.read, users.write, billing.read]
```

### Enforcing a role on an endpoint
- Check on the server in middleware before the handler runs; never trust a role sent by the client
- Deny by default: a route with no rule is closed
- No or bad credentials → `401`; signed in but without the role → `403`; do not reveal whether the resource exists
- Test both: a request without the role gets `403`, one with it gets `200` (name tests after the rule, e.g. `A01_non_manager_gets_403`)

### ABAC (Attribute-Based) — fine-grained
```
Allow if user.department === resource.department AND action === "read"
```
