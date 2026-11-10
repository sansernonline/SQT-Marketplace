---
name: developer-experience
description: Use when the users are developers (time to hello world, error messages, CLI, SDK design, docs).
argument-hint: <dx-audit | sdk-design> <details>
---

# developer-experience

ผลิตภัณฑ์ที่ผู้ใช้เป็นนักพัฒนา: ประสบการณ์ของนักพัฒนา (Developer Experience · DX) · SDK · เอกสารและเนื้อหาเชิงเทคนิค

**เปิดเฉพาะไฟล์ที่ตรงกับงาน** ไม่ต้องอ่านทั้งหมด เพราะแต่ละไฟล์เป็นคู่มือเต็มของเรื่องนั้น

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| optimizing developer experience — time-to-hello-world, error messages, local dev setup, CLI usability, sample apps, onboarding flows. DX-as-a-discipline patterns | [`references/developer-experience.md`](references/developer-experience.md) |
| designing or refactoring SDKs — API surface, language idioms, type safety, error handling, retries, pagination, streaming, file uploads. Concrete patterns by language | [`references/sdk-design-patterns.md`](references/sdk-design-patterns.md) |
| creating technical content for developers — blog posts, tutorials, videos, sample apps, conference talks. Patterns for technical content that resonates | [`references/technical-content.md`](references/technical-content.md) |

## คู่มือบทบาท

agent ที่ถูกเรียกมาทำงานสายนี้ให้เปิดไฟล์บทบาทของตัวเองก่อนเริ่ม

| บทบาท | อ่าน | agent |
|---|---|---|
| planning developer advocacy programs, creating technical content (blog, video, talks), running developer events, building developer communities, or measuring DevRel impact | [`references/agent-devrel-engineer.md`](references/agent-devrel-engineer.md) | `devrel-engineer` |
| building documentation platforms, API reference generation, docs-as-code workflows, search optimization, or measuring docs effectiveness. Engineer-focused — works alongside technical writers | [`references/agent-docs-engineer.md`](references/agent-docs-engineer.md) | `devrel-engineer` |
| designing developer experience for products targeting developers — onboarding, error messages, CLI tools, error UX, time-to-hello-world optimization | [`references/agent-dx-engineer.md`](references/agent-dx-engineer.md) | `devrel-engineer` |
| building or maintaining SDKs in multiple languages — design, code generation, versioning, type safety, idiomatic API per language | [`references/agent-sdk-builder.md`](references/agent-sdk-builder.md) | `devrel-engineer` |

## agent ของสายนี้

`devrel-engineer`

## ที่มา

รวมจาก plugin `software-development-devtools` (เดิมชื่อ developer-experience → `references/developer-experience.md` · sdk-design-patterns → `references/sdk-design-patterns.md` · technical-content → `references/technical-content.md` ไม่ใช่ skill แยกแล้ว) เข้า `software-development` ใน v2.0.0 และเนื้อหาเดิมอยู่ครบใน `references/`

## โหมดออกแบบ (เรียกเป็นคำสั่ง)

`/software-development:developer-experience <dx-audit | sdk-design> <details>`

Two modes. Read the first word of **$ARGUMENTS**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `dx-audit` | Audit developer experience using devrel-engineer agent. Measures time to first hello world (TTFHW), error UX, sample quality, onboarding flow. |
| `sdk-design` | Design SDK using devrel-engineer agent. Covers multi-language, idioms, types, errors. |

ขั้นตอนเต็มของแต่ละโหมด → [references/design-modes.md](references/design-modes.md)
