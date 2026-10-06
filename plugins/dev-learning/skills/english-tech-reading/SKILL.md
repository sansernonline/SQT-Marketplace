---
name: english-tech-reading
description: Use when the user hits an English error message, RFC section or documentation chapter and wants it explained in Thai fast and accurately — sentence structure, RFC keywords like MUST and SHOULD, and error-message anatomy.
---

# English Tech Reading

Read it like an engineer, explain it in Thai.

## Error messages

- Anatomy: what failed (the exception), where (file:line), why (the cause chain) — decode each part, keep the original terms in parentheses so searching stays possible
- "Expected X, found Y" — translate the expectation, not just the words
- Never paraphrase away technical terms — gloss them (จับคู่คำเดิมไว้เสมอ)

## Documentation and RFCs

- RFC 2119 keywords decoded precisely: MUST = ต้องทำ ไม่มีข้อยกเว้น · SHOULD = ควรทำ เว้นแต่มีเหตุผล · MAY = ทำได้ ไม่บังคับ
- Conditionals first: "if A and B, then C" — map the branches before reading details
- Skip the intro and conclusion on first read; the contract is in the middle

## Worked example — an error message

Input:
```
TypeError: Cannot read properties of undefined (reading 'map')
    at OrderList (src/components/OrderList.tsx:14:22)
```

Decoded:
- **What failed** — `TypeError` (ชนิดข้อมูลไม่ตรง): the code called `.map` on something that is `undefined` (ยังไม่มีค่า)
- **Where** — `OrderList.tsx` line 14, column 22: the `orders.map(...)` call
- **Why (the likely cause)** — `orders` has not arrived yet on the first render (ข้อมูลยังโหลดไม่เสร็จ), or the API returned a different shape
- **What to check** — log `orders` before line 14; give it a default `orders ?? []`; check the API response shape
- Search with the original English: `"Cannot read properties of undefined (reading 'map')"`

## Worked example — an RFC sentence

> "A sender MUST NOT generate multiple header fields with the same field name in a message unless either the entire field value for that header field is defined as a comma-separated list [...] or the header field is a well-known exception." (RFC 7230, Section 3.2.2 — now obsoleted by RFC 9110, Section 5.3, which keeps the same rule in newer wording)

1. Keyword: **MUST NOT** = ห้ามเด็ดขาด
2. Conditions (map the branches first): it is allowed only **if** (a) the field is defined as a comma-separated list, **or** (b) the field is a known exception (e.g. `Set-Cookie`)
3. Thai: ผู้ส่งห้ามใส่ header ชื่อเดียวกันซ้ำหลายบรรทัด ยกเว้น header นั้นนิยามให้ค่าเป็นรายการคั่นด้วยจุลภาค หรือเป็นข้อยกเว้นที่รู้กันอยู่แล้ว
4. In practice: combine `Accept: a` + `Accept: b` into `Accept: a, b`; never combine `Set-Cookie`

## Decoding template

Use [references/decode-template.md](references/decode-template.md) for every error, RFC clause or documentation passage.

## Rules

- Speed comes from structure, not vocabulary lists
- When a sentence resists decoding, quote the original back and decode clause by clause
- Encourage re-reading the original after the explanation — the goal is independence, not dependence
