# Designing tools for an agent — names · parameters · errors · pagination · idempotency

> Compiled from the MCP spec 2026-07-28 (server/tools) · Python SDK v2 docs · Anthropic's `mcp-builder` (Apache-2.0 · rewritten, not copied) · Checked 2026-10-23 · Code examples use Python SDK v2 (`mcp` ≥ 2) · TypeScript does the same with Zod

## Contents

1. [Names](#1-names)
2. [Parameters](#2-parameters)
3. [Tool description](#3-tool-description)
4. [Results](#4-results)
5. [Errors as data](#5-errors-as-data)
6. [Pagination](#6-pagination)
7. [Idempotency and write tools](#7-idempotency-and-write-tools)
8. [Annotations](#8-annotations)
9. [Result size](#9-result-size)
10. [Example inventory tool set](#10-example-inventory-tool-set)
11. [Sources](#11-sources)

## 1 · Names

| Rule | Good | Bad | Because |
|---|---|---|---|
| `<system>_<verb>_<thing>` snake_case | `inventory_search_products` | `searchProducts` · `products` | The prefix avoids clashes with other servers in the same client · the verb tells the side effect |
| One set of verbs across the whole server | `get` (1 item) · `search`/`list` (many) · `create` · `update` · `delete` | `fetch` mixed with `get` · `find` mixed with `search` | The model can guess the next tool name from the pattern |
| The thing is plural when returning a list | `list_low_stock_items` | `list_low_stock_item` | Says it returns an array |
| No version number or technology name | `erp_get_invoice` | `erp_get_invoice_v2` · `sql_get_invoice` | You can change the inside without changing the name |
| At most ~40 characters | `inventory_get_stock` | `inventory_get_current_stock_level_for_sku` | Some clients show the full name |

Server name: Python `<system>_mcp` or folder `<system>-mcp` · Node `<system>-mcp-server` · no version number (the `mcp-builder` pattern)

## 2 · Parameters

```python
from typing import Annotated, Literal
from pydantic import Field

@mcp.tool(title="หาใบแจ้งหนี้", annotations=READ_ONLY)
def erp_search_invoices(
    customer_code: Annotated[str, Field(pattern=r"^C\d{5}$", description="รหัสลูกค้า เช่น C00042")],
    status: Annotated[Literal["open", "paid", "overdue"], Field(description="สถานะ")] = "open",
    issued_after: Annotated[str | None, Field(description="วันที่ ค.ศ. รูปแบบ YYYY-MM-DD")] = None,
    limit: Annotated[int, Field(ge=1, le=50, description="จำนวนสูงสุดต่อหน้า")] = 20,
    offset: Annotated[int, Field(ge=0, description="ข้ามกี่รายการ")] = 0,
) -> dict: ...
```

- **Every parameter has a type · bounds · description** — the SDK converts them to JSON Schema for the client and rejects bad input before it reaches our code
- **Values from a limited set use `Literal`/enum**, not a free str — the model picks from a list instead of spelling it itself
- **Dates are ISO in Common Era (ค.ศ.)** in parameters and results · convert to Buddhist Era (พ.ศ.) on screen, not in the tool (`i18n-and-locale`)
- **Never accept `dict` or `Any`** — if you must accept a nested shape, use a Pydantic model with clear fields
- **Safe defaults** — small `limit` · `status="open"` · no default that means "everything"
- **An id is a str with a pattern** even if it is a number inside — stops the model from sending `1` instead of `"SKU-0001"`
- At most 6 parameters per tool · beyond that, split the tool or combine them into one model

## 3 · Tool description

The docstring (Python) or `description` (TypeScript) is what the model reads to pick a tool — write 1–2 sentences:

1. What it does and what it returns — "หาใบแจ้งหนี้ของลูกค้า 1 รายตามสถานะ · คืน items · total · has_more" (finds one customer's invoices by status · returns items · total · has_more)
2. When to use / not use it, if a similar tool exists — "ถ้ารู้เลขใบแจ้งหนี้แล้ว ใช้ erp_get_invoice แทน" (if you already know the invoice number, use erp_get_invoice instead)
3. Do not write "This tool…" · do not describe how it works inside · do not add long JSON examples (the schema already says it)

`title` is the name for people to read in the UI (Thai is fine) · `name` belongs to the model (English snake_case)

## 4 · Results

| Function returns | `structured_content` | `content` (text) |
|---|---|---|
| `dict[str, …]` · Pydantic model · TypedDict · dataclass | The object itself | JSON of the same object |
| `int` · `str` · `float` · `bool` | `{"result": value}` | The value as text |
| `list[…]` | `{"result": [...]}` | One TextContent per item |

(Python SDK v2 behavior · servers/structured-output · checked 2026-10-23)

- **Always return a dict** for real tools — you get clearly named fields and can add new fields without breaking old ones · never return a bare list (it gets wrapped in `result` and split into many content blocks)
- Field names in one snake_case style across the server · time as ISO 8601 · money as a decimal number + `currency` · no `null` that means "not sent" mixed with "no value"
- Lists use one shape across the server: `{"items": [...], "total": n, "has_more": bool, "next_offset": n}` (or `next_cursor`)
- Declare an output schema when the client must validate (`outputSchema` in the spec) — the Python SDK builds it from a model's return type · a bare dict has no schema
- `response_format: Literal["json", "markdown"]` is a parameter, when the same tool must serve both the model computing further (json) and a person reading (markdown) — if there is no human-reader case, leave it out

## 5 · Errors as data

The spec separates errors into 2 layers (server/tools → Error Handling):

| Layer | Use when | Python v2 | Does the model see it? |
|---|---|---|---|
| **tool execution error** — result with `is_error=true` | Data not found · input passes the schema but breaks a business rule · the source system returned an error · permission denied | `raise ToolError("…")` (`mcp.server.mcpserver.exceptions`) | **Yes** — it can fix the input and retry |
| **protocol error** — JSON-RPC error | Tool does not exist · argument does not match the schema · server crashed | The SDK does it · `raise MCPError(code, msg)` only to reject the whole request | **No** — the host gets the error · the model only learns it failed |

Rules for error text:

- **Say what is wrong + what to do next** — "ไม่พบ SKU-9999 — หาด้วย inventory_search_products ก่อน แล้วใช้ sku จากผลนั้น" (SKU-9999 not found — search with inventory_search_products first, then use the sku from that result) · not "Not found"
- **No internals** — stack trace · table names · connection string · local paths · raw library error text → catch it and turn it into human language · log the raw text to stderr/file (`errors-and-logs`)
- **An error is not a channel for commanding the model** — do not write "try tool X immediately" as an order · write it as a suggestion, because the source system's error text may have been written by an outsider
- Source system down/timeout → `is_error` with "ระบบ ERP ไม่ตอบใน 10 วินาที — ลองใหม่ภายหลัง" (the ERP system did not answer within 10 seconds — try again later) · set a timeout on every outgoing call (`errors-and-logs`) · do not retry in a loop inside a tool more than 1–2 times
- A raw exception that escapes = the SDK may turn it into an error whose inner text the model sees → wrap every tool in a try/except that converts to `ToolError`

## 6 · Pagination

- Every tool that returns a list **must have `limit`** (1–50 · default 20) · no tool returns "everything" without a cap
- `offset` when the data is stable and countable · `cursor` (opaque · issued by the server) when the data changes often or comes from an API that already uses cursors · do not mix the 2 styles in one server
- Always return `has_more` · `next_offset`/`next_cursor` when `has_more=true` · `total` when it can be counted correctly and cheaply (SQL `COUNT`) · never return an estimated `total`
- Queries use `LIMIT ? OFFSET ?` in the database — do not pull the whole table and cut it in Python
- The model often does not page by itself → good filters (status · date range · category) matter more than the next page

## 7 · Idempotency and write tools

| Type | Example | Design |
|---|---|---|
| Read | `get` · `search` · `list` | No side effect · `read_only_hint=True` · `idempotent_hint=True` · calling any number of times gives the same result |
| Repeatable write | `update_stock(sku, qty=50)` set a value · `set_status` | Takes the "final value", not the "difference" (`qty=50`, not `delta=-3`) · `idempotent_hint=True` · calling again gives the same result |
| Non-repeatable write | `create_purchase_order` · `send_line_message` | Takes an `idempotency_key` from the caller · the server remembers the key for 24 hours and returns the earlier result on a repeat (`code-craft`) · `idempotent_hint=False` |
| Destructive | `delete` · `cancel` · send money | `destructive_hint=True` · needs `confirm: Literal[True]` or 2 steps (prepare → confirm with the id from the first step) · audit log before and after (`web-service-essentials`) |

- **Every write tool sits behind an env flag** (`<SERVER>_ALLOW_WRITE=1`) and is registered in a separate file — a server the customer runs without the flag shows no write tools at all
- The model can always call a write tool again when the connection drops or it is unsure → design "calling again does no harm" as the default, not the exception
- A write tool's result must return the **state after the write** (the updated row · the created id), not just `"ok"` — the model uses it to confirm with the user

## 8. Annotations

| Annotation | Spec default | Set to | Notes |
|---|---|---|---|
| `read_only_hint` | `false` | `True` for every read tool | The client may skip asking for confirmation again |
| `destructive_hint` | `true` | `False` for additive/set writes · `True` for delete or irreversible change | Matters only when `read_only_hint=False` |
| `idempotent_hint` | `false` | `True` when calling again adds no effect | See section 7 |
| `open_world_hint` | `true` | `False` when the tool talks to our closed system (database · ERP) · `True` when it goes out to the internet (web search · calling others' APIs) | The client uses it to judge risk |

- Python v2: `annotations=ToolAnnotations(read_only_hint=True, open_world_hint=False)` from `mcp.types` · snake_case names (v1 was camelCase)
- They are **hints** — the spec tells clients to treat them as untrusted unless the server is trusted · real protection is a read-only account · flags · the audit log

## 9 · Result size

- Claude Code warns when a tool result exceeds 10,000 tokens · default cap 25,000 (`MAX_MCP_OUTPUT_TOKENS`) · a successful text longer than 50,000 characters is saved to a file instead (code.claude.com/docs/en/mcp · 2026-10-23)
- Target: normal results < 2,000 tokens · the largest result < 10,000 — measure with the Inspector and note it in the README's tool table
- How to reduce: choose columns (a `fields` parameter when needed) · cut free text at 200–500 characters with `…` and `truncated: true` · do not send base64 of a file — send a `resource_link` or a path for the client to read itself
- If the model must summarize big data, let the tool summarize (`count` · `sum` · `group by`) instead of sending raw rows

## 10 · Example inventory tool set

A real set for an SME customer's inventory system (extending `assets/inventory-mcp/`, which has the first 3):

| # | tool | Type | annotations | Main parameters |
|---|---|---|---|---|
| 1 | `inventory_search_products` | read | read_only · idempotent | `query_text` · `category?` · `limit` · `offset` |
| 2 | `inventory_get_stock` | read | read_only · idempotent | `sku` |
| 3 | `inventory_list_low_stock` | read | read_only · idempotent | `limit` |
| 4 | `inventory_get_movements` | read | read_only · idempotent | `sku` · `since` (ISO) · `limit` |
| 5 | `inventory_get_supplier` | read (has contact data → PDPA) | read_only · idempotent | `supplier_code` · the reason contact numbers must be shown is written in the README |
| 6 | `inventory_set_reorder_point` | repeatable write (flag) | destructive=False · idempotent | `sku` · `reorder_point` |
| 7 | `inventory_create_purchase_order` | non-repeatable write (flag) | destructive=False · idempotent=False | `supplier_code` · `lines[]` · `idempotency_key` |
| 8 | `inventory_cancel_purchase_order` | destructive (flag) | destructive=True | `po_id` · `confirm: Literal[True]` · `reason` |

8 tools · one naming pattern · 5 read 3 write · every one has `limit` when it returns a list · tools 6–8 are registered only when `INVENTORY_ALLOW_WRITE=1`

## 11 · Sources

| Topic | Source (checked 2026-10-23) |
|---|---|
| tool definition · result · `isError` 2 layers · annotations default · server MUST validate | modelcontextprotocol.io/specification/2025-06-18/server/tools (version 2026-07-28 widens the schema to accept every JSON Schema 2020-12 keyword — changelog) |
| `ToolError` vs `MCPError` · structured output wrapping | py.sdk.modelcontextprotocol.io → servers/handling-errors · servers/structured-output · servers/tools |
| Naming `{service}_{action}_{resource}` · pagination 20–50 · `response_format` · errors with a next step · annotations table · server name | github.com/anthropics/skills → skills/mcp-builder/reference/mcp_best_practices.md (Apache-2.0 · rewritten) |
| Token cap of a tool result | code.claude.com/docs/en/mcp |
| idempotency key · 2 steps for destructive work | Team guidance + `code-craft` · not a spec requirement |
| Target numbers < 2,000 / < 10,000 tokens · parameters ≤ 6 · free text 200–500 characters | Team starting values · not yet measured on real work |
