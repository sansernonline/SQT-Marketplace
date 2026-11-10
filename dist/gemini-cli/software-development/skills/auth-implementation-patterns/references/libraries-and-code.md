# ไลบรารีและโค้ดตัวอย่าง

โค้ดตัวอย่างการเก็บรหัสผ่าน เครื่องมือจำกัดจำนวนครั้ง และไลบรารีที่แนะนำแยกตามภาษา

## Password storage — code

```typescript
// Good (using bcrypt)
const hash = await bcrypt.hash(password, 12);
const valid = await bcrypt.compare(password, storedHash);

// Bad
const hash = crypto.createHash('sha256').update(password).digest('hex');
```

## Rate limiting tools

Use existing tools:
- `express-rate-limit` (Node.js)
- `django-ratelimit` (Django)
- Cloudflare / AWS WAF (edge)

## Library Recommendations

| Stack | Library | Notes |
|-------|---------|-------|
| Node.js | `passport`, Auth.js, Better Auth | Lucia v3 is deprecated (lucia-auth.com, checked 22 Oct 2026) so do not start new work on it; Better Auth status (รอยืนยัน, check before use) |
| Python | `authlib`, `PyJWT` (or `joserfc`) | authlib for OAuth; python-jose is rarely maintained (รอยืนยัน) |
| Go | `oauth2`, `golang-jwt` | Standard |
| Rust | `axum-login`, `jsonwebtoken` | — |
| Any | Auth0, Clerk, Supabase Auth | Managed (faster) |
