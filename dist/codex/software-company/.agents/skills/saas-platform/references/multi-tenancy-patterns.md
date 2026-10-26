> เดิมชื่อ multi-tenancy-patterns (ไม่ใช่ skill แยกแล้ว เนื้อหาอยู่ที่ไฟล์นี้) ใน plugin `software-company-saas-b2b` — รวมเข้า `saas-platform` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [Tenancy Model Selection](#tenancy-model-selection)
- [Row-Level Multi-Tenancy](#row-level-multi-tenancy)
- [Tenant Context Propagation](#tenant-context-propagation)
- [Schema-Per-Tenant](#schema-per-tenant)
- [Database-Per-Tenant](#database-per-tenant)
- [Noisy Neighbor Mitigation](#noisy-neighbor-mitigation)
- [Per-Tenant Feature Flags](#per-tenant-feature-flags)
- [Caching With Tenants](#caching-with-tenants)
- [Background Jobs](#background-jobs)
- [Tenant Offboarding](#tenant-offboarding)
- [Common Pitfalls](#common-pitfalls)
- [Reference](#reference)

# Multi-Tenancy Implementation Patterns

## When to use this skill

- Building a SaaS product from scratch
- Adding tenants to an existing single-tenant app
- Refactoring for better isolation between tenants
- Designing per-tenant features
- Stopping one busy tenant from slowing the others (noisy neighbor)

## Tenancy Model Selection

```
Strict isolation required (regulated)?
├─ Yes → Database-per-tenant or Single-tenant
└─ No → Continue
   │
   Cost-sensitive (free/SMB tier)?
   ├─ Yes → Pool (shared everything)
   └─ No → Consider Silo (shared compute, isolated data)
```

## Row-Level Multi-Tenancy

### Schema
```sql
-- Every business table has tenant_id
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL,
    customer_id UUID NOT NULL,
    total NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Composite index includes tenant
CREATE INDEX idx_orders_tenant_customer ON orders (tenant_id, customer_id);

-- Foreign keys preserve tenant
ALTER TABLE orders ADD CONSTRAINT fk_customer
    FOREIGN KEY (tenant_id, customer_id) REFERENCES customers (tenant_id, id);
```

### Postgres Row-Level Security
```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- Table owners skip RLS unless FORCE is set
ALTER TABLE orders FORCE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON orders
    FOR ALL
    USING      (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid)
    WITH CHECK (tenant_id = NULLIF(current_setting('app.tenant_id', true), '')::uuid);
-- no tenant set → NULL → no rows (fails closed)

-- The app connects as its own role: not the table owner, not superuser, no BYPASSRLS
CREATE ROLE app_user LOGIN NOSUPERUSER NOBYPASSRLS;
GRANT SELECT, INSERT, UPDATE, DELETE ON orders TO app_user;
```

กฎที่ต้องถูกทุกข้อ (ที่มา [PostgreSQL — Row Security Policies](https://www.postgresql.org/docs/current/ddl-rowsecurity.html) · [SET](https://www.postgresql.org/docs/current/sql-set.html) · ตรวจ 22 ต.ค. 2569)

- เจ้าของตารางข้าม RLS ถ้าไม่ได้ `FORCE ROW LEVEL SECURITY` · superuser และ role ที่มี `BYPASSRLS` ข้ามเสมอ → แอปต้องใช้ role แยก
- `SET LOCAL` นอก transaction "emits a warning and otherwise has no effect" → ตั้งค่าภายใน `BEGIN … COMMIT` เท่านั้น
- `SET` (ไม่มี LOCAL) ติดไปทั้ง session → connection ที่คืนเข้า pool จะพา tenant เดิมไปให้ request ถัดไป ห้ามใช้
- ห้ามต่อ string tenant id เข้า SQL — ส่งเป็น parameter (`$1`) ผ่าน `set_config(name, value, true)` (`true` = มีผลเฉพาะ transaction นี้)

### Application Enforcement (defense in depth)
```typescript
// Repository pattern with mandatory tenant
class OrderRepository {
  // client = the transaction client from withTenant() below
  constructor(private client: PoolClient, private tenantId: string) {}

  findAll() {
    return this.client.query(
      'SELECT * FROM orders WHERE tenant_id = $1',
      [this.tenantId],
    );
  }

  // No method exists that DOESN'T filter by tenant
}
```

## Tenant Context Propagation

### Pattern: Middleware Sets Context, One Transaction per Request

Middleware only reads the tenant from a verified token. The database context is set inside the same transaction, on the same pooled client, that runs the queries (node-postgres `pg`).

```typescript
import { Pool, PoolClient } from 'pg';
const pool = new Pool(); // connects as app_user (not table owner)

app.use(async (req, res, next) => {
  const token = req.headers.authorization?.replace(/^Bearer /, '');
  if (!token) return res.status(401).end();
  const claims = await verifyJWT(token); // checks signature, iss, aud, exp
  if (!claims.tenant_id) return res.status(401).end();

  req.tenant = {
    id: claims.tenant_id,
    tier: claims.tier,
    features: await loadFeatures(claims.tenant_id),
  };
  next();
});

// Every DB call goes through this: BEGIN → set tenant (local) → work → COMMIT
async function withTenant<T>(tenantId: string, fn: (c: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query("SELECT set_config('app.tenant_id', $1, true)", [tenantId]);
    const result = await fn(client);
    await client.query('COMMIT');
    return result; // setting is gone once the transaction ends
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Usage in a handler
app.get('/orders', async (req, res) => {
  const rows = await withTenant(req.tenant.id, (c) =>
    new OrderRepository(c, req.tenant.id).findAll());
  res.json(rows.rows);
});
```

### Pattern: Tenant in Async Context

```typescript
import { AsyncLocalStorage } from 'async_hooks';

const tenantStorage = new AsyncLocalStorage<TenantContext>();

// Set at request entry
tenantStorage.run({ id: tenantId }, async () => {
  await processRequest();
});

// Access anywhere in async chain
function getTenantId(): string {
  return tenantStorage.getStore()?.id ?? throwError();
}
```

## Schema-Per-Tenant

```sql
-- One schema per tenant
CREATE SCHEMA tenant_abc;
CREATE SCHEMA tenant_xyz;

-- Tables in tenant schema
CREATE TABLE tenant_abc.orders (...);
CREATE TABLE tenant_xyz.orders (...);

-- search_path only inside a transaction (SET LOCAL), never plain SET on a pooled connection
BEGIN;
SET LOCAL search_path TO tenant_abc;
-- ... queries ...
COMMIT;
```

```typescript
// Schema name comes from your tenant registry, never from user input
async function withTenantSchema<T>(tenantId: string, fn: (c: PoolClient) => Promise<T>) {
  const schema = await lookupTenantSchema(tenantId); // e.g. 'tenant_abc'
  if (!/^tenant_[a-z0-9_]{1,40}$/.test(schema)) throw new Error('bad schema name');

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // local = true → resets at COMMIT/ROLLBACK, so the pooled connection is clean
    await client.query("SELECT set_config('search_path', $1, true)", [schema]);
    const result = await fn(client);
    await client.query('COMMIT');
    return result;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}
// Alternative: one small pool per tenant with search_path fixed at connect time:
// new Pool({ options: `-c search_path=${schema}` })  (schema validated as above)
```

### Migrations
```python
# Apply migration to all tenant schemas
async def migrate_all_tenants():
    tenants = await get_active_tenants()

    for tenant in tenants:
        try:
            await run_migration(tenant.schema)
        except MigrationError as e:
            await mark_tenant_migration_failed(tenant, e)
            continue
```

## Database-Per-Tenant

```typescript
// Tenant routing layer
async function getDb(tenantId: string): Promise<DbClient> {
  const tenant = await tenantCache.get(tenantId);
  return dbPool.connect(tenant.dbConnectionString);
}

// Usage
const db = await getDb(req.tenant.id);
await db.query(`SELECT * FROM orders`);  // tenant_id NOT needed in WHERE
```

### Tenant Provisioning
```python
import re

async def provision_tenant(tenant_id: str, region: str):
    # Create DB — identifiers can't be bound as parameters, so validate then quote
    if not re.fullmatch(r'[a-z0-9_]{1,40}', tenant_id):
        raise ValueError('bad tenant id')
    db_name = f'tenant_{tenant_id}'
    await admin_db.query(f'CREATE DATABASE "{db_name}"')

    # Run migrations
    await run_migrations(db_name)

    # Seed initial data
    await seed_tenant(db_name, tenant_id)

    # Register in tenant routing table
    await save_tenant_routing({
        'id': tenant_id,
        'db_host': pick_db_host(region),
        'db_name': db_name,
    })
```

## Noisy Neighbor Mitigation

### Rate Limiting Per Tenant

```typescript
// Distributed rate limiter (Redis)
async function rateLimit(req) {
  const limit = req.tenant.tier === 'enterprise' ? 10000 : 100;
  // Fixed 1-minute window; the window number is part of the key
  const window = Math.floor(Date.now() / 60_000);
  const key = `rate:${req.tenant.id}:${window}`;

  // MULTI/EXEC (ioredis): INCR and EXPIRE apply together — no key left without a TTL
  const results = await redis.multi().incr(key).expire(key, 60).exec();
  const count = Number(results?.[0]?.[1]);

  if (count > limit) {
    throw new RateLimitError({ retryAfter: 60 });
  }
}
```

### Connection Pool Per Tenant Group

```typescript
// Tier-based pools
const pools = {
  free: new ConnectionPool({ max: 5 }),
  pro: new ConnectionPool({ max: 20 }),
  enterprise: new ConnectionPool({ max: 100 }),
};

async function query(tenantId: string, sql: string) {
  const tier = await getTier(tenantId);
  return pools[tier].query(sql);
}
```

### Query Cost Limits

```typescript
// Kill slow queries per tenant
async function queryWithBudget(tenantId: string, sql: string) {
  const budget = tierLimits[await getTier(tenantId)].queryMs;

  return await db.query(sql, { timeout: budget });
}
```

## Per-Tenant Feature Flags

```typescript
// Feature config per tenant
interface TenantFeatures {
  advanced_analytics: boolean;
  api_rate_limit: number;
  custom_branding: boolean;
  sso: boolean;
}

// Read from config
function hasFeature(tenant: Tenant, feature: keyof TenantFeatures) {
  return tenant.features[feature];
}

// Use in code
if (hasFeature(req.tenant, 'advanced_analytics')) {
  // ...
}
```

## Caching With Tenants

```typescript
// MUST key by tenant
const cacheKey = `tenant:${tenantId}:order:${orderId}`;
await cache.set(cacheKey, order);

// Wrong: NEVER share cache across tenants
const cacheKey = `order:${orderId}`;  // BAD
```

## Background Jobs

```typescript
// Include tenant in job payload
await queue.enqueue('process_export', {
  tenantId: req.tenant.id,
  exportId,
});

// Worker re-establishes tenant context
async function processExport(job) {
  const { tenantId, exportId } = job.data;
  await tenantStorage.run({ id: tenantId }, async () => {
    await doExport(exportId);
  });
}
```

## Tenant Offboarding

```python
async def offboard_tenant(tenant_id):
    # 1. Disable access
    await disable_tenant_access(tenant_id)

    # 2. Schedule deletion (grace period for accidental)
    await schedule_deletion(tenant_id, days=30)

    # 3. After grace period, delete from all systems
    async def delete():
        await delete_from_db(tenant_id)
        await delete_from_search(tenant_id)
        await delete_from_blob_storage(tenant_id)
        await delete_from_cache(tenant_id)
        await delete_backups(tenant_id, retain_for=legal_minimum)

    # 4. Provide attestation
    await issue_deletion_certificate(tenant_id)
```

## Common Pitfalls

- Wrong: **Missing tenant_id in queries** — data leaks and nobody notices
- Wrong: **Shared cache without a tenant key** — one tenant sees another's data
- Wrong: **Background jobs without the tenant** — the job runs as the wrong tenant
- Wrong: **No rate limit per tenant** — one tenant slows everyone down
- Wrong: **Hardcoded tenant assumptions** — breaks as soon as a tenant differs from the first one
- Wrong: **Per-tenant migrations not tested** — surprises in production

## Reference

- [AWS SaaS Lens](https://docs.aws.amazon.com/wellarchitected/latest/saas-lens/)
- [Building Multi-Tenant SaaS Architectures (book)](https://www.oreilly.com/library/view/building-multi-tenant-saas/9781098140632/)
- [Stripe's Multi-Tenant Sharding](https://stripe.com/blog/online-migrations)
- [PostgreSQL Row-Level Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
