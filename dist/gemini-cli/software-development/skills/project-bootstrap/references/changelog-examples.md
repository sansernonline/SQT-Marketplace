# CHANGELOG — examples

Read this when writing a CHANGELOG for the first time or reviewing one. The rules are in `SKILL.md` item 3. The blank template is in `assets/starter-files.md`. The sample below is Thai because the CHANGELOG itself is written for Thai users.

```markdown
# Changelog

## [ยังไม่ปล่อย]
### เพิ่ม
- ส่งออกรายงานเป็น Excel

## [1.2.0] — 2026-09-25
### เปลี่ยนที่ทำให้ของเดิมพัง
- `GET /orders` คืน `data` แทนอาเรย์ตรง ๆ — ดู API-CONVENTIONS.md
### เพิ่ม
- แจ้งเตือนทาง LINE
### จะเลิกใช้
- ส่งออกรายงานเป็น CSV จะเอาออกในรุ่น 2.0 — ใช้ Excel แทน
### แก้
- ยอดรวมปัดเศษผิดเมื่อมีส่วนลด
### ความปลอดภัย
- ผู้ใช้ที่ถูกปิดบัญชีเปิดลิงก์ใบเสร็จเก่าไม่ได้แล้ว

## [1.1.1] — 2026-09-10 [ถอน]
```

## Headings and version numbers

| Heading (Keep a Changelog) | Use for | Version part to bump (Semantic Versioning) |
|---|---|---|
| เปลี่ยนที่ทำให้ของเดิมพัง (breaking changes; our own addition) | Users or calling systems must change something on their side | MAJOR · in the `0.y.z` range, MINOR is allowed |
| เพิ่ม (Added) | New capability | MINOR |
| เปลี่ยน (Changed) | Existing behavior works differently but does not break | MINOR |
| จะเลิกใช้ (Deprecated) | Still works but will be removed · name the removal version and the replacement | MINOR |
| เอาออก (Removed) | Already removed | MAJOR |
| แก้ (Fixed) | Bugs | PATCH |
| ความปลอดภัย (Security) | Vulnerabilities already closed · do not describe how to attack | PATCH, or by size |

The version-bump column is this skill's own proposal. Semantic Versioning says only this: MAJOR = incompatible with the old version · MINOR = backward-compatible additions or deprecation notices · PATCH = backward-compatible bug fixes.

If a released version must be pulled because of a serious bug or vulnerability, append `[ถอน]` to the version heading (Keep a Changelog uses `[YANKED]`). Do not delete that version. Sources: [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) · [Semantic Versioning 2.0.0](https://semver.org/) · opened 2026-11-07

Write what the user sees, not a list of commits:

| ✗ | ✓ |
|---|---|
| `- fix(items): change > to >= in withdraw() (#42)` | `- เบิกของเท่ากับจำนวนที่เหลือพอดีได้แล้ว` |
| `- refactor lowStockReport to read movements once` | `- รายงานของใกล้หมดเปิดได้ในไม่ถึง 1 วินาที (เดิม 50 วินาที)` |

## Writing rules (full version)

- Write for the **people who use the product**. Do not paste the commit list.
- 1 item = 1 line. Say what the user gains or sees change, not which file changed.
- Leave out file names, function names and ticket numbers, unless the reader is a developer who calls that API.
- Leave out work the user cannot see, such as code restructuring, new tests or CI fixes. The exception is a speed or stability gain big enough to feel. Then write it as the result ("รายงานของใกล้หมดเปิดได้ในไม่ถึง 1 วินาที").
- Within each heading, put the items that affect users most at the top. Drop any heading that has no items.
- The heading "เปลี่ยนที่ทำให้ของเดิมพัง" must always sit at the **top** of that version. Every deprecation, removal and breaking change must be listed, even a small one.
