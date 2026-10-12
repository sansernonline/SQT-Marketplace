# แม่แบบของ technical-writer — README · tutorial · API reference · release notes

ย้ายมาจาก agent `technical-writer` · เปิดเมื่อต้องเขียนเอกสารชนิดนี้จริง · ส่วนที่ไม่รู้ใส่ `(รอยืนยัน)`

## Standard Outputs

### README Template

```markdown
# Project Name

> One-line description that fits in a tweet.

[![badges]](#)

**Demo:** [link] · **Docs:** [link] · **Discord:** [link]

---

## ✨ Features

- 🚀 What makes this special — feature 1
- ⚡ Killer feature 2
- 🔒 Reassuring feature 3

## 🚀 Quick Start

\`\`\`bash
npm install package-name
\`\`\`

\`\`\`typescript
import { thing } from 'package-name';

const result = thing({ option: 'value' });
\`\`\`

That's it. You're done.

## 📚 Documentation

- [Getting Started](#) — 10-minute tutorial
- [How-To Guides](#) — Solve specific problems
- [API Reference](#) — Full API spec
- [Concepts](#) — Why and how it works

## 🤝 Contributing

See [CONTRIBUTING.md](#).

## 📄 License

MIT
```

### Tutorial Template

```markdown
# 🎓 Tutorial: Build Your First X in 10 Minutes

> 💡 **What you'll learn:** by the end, you'll have built Y and understand Z.

## What You'll Need

- ✅ Node.js 18+
- ✅ A free account at example.com
- ⏱️ 10 minutes

## Step 1: Set Up

Run:
\`\`\`bash
npx create-thing my-project
cd my-project
\`\`\`

> 💡 **What just happened?** Brief explanation.

You should see:
\`\`\`
✓ Project created
\`\`\`

## Step 2: Configure

...

## Step 3: Run It

...

## ✅ Congratulations!

You've built X. Try these next:

- [Add feature A](#how-to-add-a) (how-to)
- [Understand B](#concept-b) (explanation)
- [Full API](#reference) (reference)
```

### API Reference Template (per endpoint)

```markdown
## POST `/api/v1/resource`

Create a new resource.

### Authentication

🔒 Required. Bearer token in `Authorization` header.

### Request

\`\`\`http
POST /api/v1/resource HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "string (required)",
  "tags": ["string (optional)"]
}
\`\`\`

### Parameters

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `name` | string | ✅ | Display name, 1-100 chars |
| `tags` | string[] | ❌ | Up to 10 tags |

### Response: 201 Created

\`\`\`json
{
  "id": "res_abc123",
  "name": "...",
  "created_at": "2025-01-15T10:30:00Z"
}
\`\`\`

### Errors

| Code | When |
|:----:|------|
| 400 | Validation failed (see body) |
| 401 | Missing/invalid token |
| 429 | Rate limit (60 req/min) |

### Code Examples

\`\`\`typescript
const res = await fetch('/api/v1/resource', {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: JSON.stringify({ name: 'My Resource' })
});
\`\`\`
```

### Release Notes Template

```markdown
# 🚀 Release v2.1.0 — YYYY-MM-DD

## ✨ Highlights

> The TL;DR for busy readers.

- **New:** X feature — try it: `command`
- **Improved:** Y is now 50% faster
- **Fixed:** Z bug affecting users on platform A

## 🆕 New Features

### Feature Name

Description with user-facing benefit.

\`\`\`bash
# Example usage
command --new-flag
\`\`\`

📖 [Read the docs](#)

## 🔧 Improvements

- Faster initial load time
- Better error messages for X

## 🐛 Bug Fixes

- Fix issue where ... ([#1234](#))
- Resolve crash when ... ([#5678](#))

## ⚠️ Breaking Changes

### `api.oldMethod()` removed

**Before:**
\`\`\`typescript
api.oldMethod(arg)
\`\`\`

**After:**
\`\`\`typescript
api.newMethod({ arg })
\`\`\`

📖 [Migration guide](#)

## 🙏 Contributors

Thanks to: @alice, @bob, @charlie
```
