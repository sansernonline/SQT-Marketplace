---
name: design-gate
description: Use when making designs, documents or visuals that people see
---

# design-gate — gate before design, live references, no AI look, polished documents

> **The one rule:** every design job passes the gate in this order: read the content → read the owner's style → search live references → 3 really different directions → eye check per no-ai-look. Close the answer with the line `ด่านก่อนลงมือ:`.

## Hard rules

- **Evidence line is mandatory.** The answer ends with `ด่านก่อนลงมือ: เนื้อหา <brief 6 ช่อง · เดา n ช่อง> · สไตล์เจ้าของ <อ่านแล้ว · ไม่มี> · ต้นแบบ <n> ชิ้น <ลิงก์> · เลือกโดย <…> · แนว <3 · 1 เพราะ…> · no-ai-look <ผล> · ตรวจตา <ชื่อ agent · รอหัวหน้า · ข้าม เพราะ…> · จดรสนิยม <…>` (keep it in Thai). No such line = the gate has not passed. Skipping any gate item needs its reason in this line.
- **Design-references:** every design job starts by reading the content and writing the 6-field `เนื้อหา:` brief (เรื่อง · ความหมาย · คนดู · อารมณ์ · ธีม · สี with a reason), then searches live on sites strong in that type of work, then takes style and colors from the closest work. Do not design from memory or from a stored library.
- Search even when a brand or sibling page exists: the brand controls color and font, the search finds structure and elements. Hex codes and `<svg>` come after the search, never before. "Just make it, don't ask" skips the questions, not the search.
- Make 3 really different directions (structure and elements, not only color), each citing 1 reference opened this round. Never copy a reference's brand colors as they are.
- Never let a script crawl sites where people post work (Pinterest · Dribbble · Behance · Awwwards · Mobbin · theme stores): open one page at a time, view only, never lift images, logos or layouts.
- **No-ai-look:** every choice (color, font, layout, image, word) must be answerable as "chosen because of this project", not "because it is the default".
- Last line of every answer that makes or reviews a visual piece is the `no-ai-look:` line with real counts (`ด่านตา n/9`, web pages add `(หน้าเว็บ n/14)`). Items not checked count as not passed. A script result of 0 never makes the line pass.
- Someone who did not make the piece must check it by eye (a fresh agent opens the real rendered image) on every job before sending. The maker's own check does not count.
- Never use a framework default as the brand color (Tailwind indigo-500 `#6366f1` · shadcn/ui default dark gray). Never invent content: missing names, numbers or dates get `(รอยืนยัน · ผู้ใช้: <what to give>)`, and anything the agent will still check gets `(รอยืนยัน · agent: …)`.
- **Polished-document-style:** for a document people keep to read, follow the gate above even when a brand exists. Labels are words, never emoji. Never nest bullets (use sub-headings or a table). Code blocks always name the language.
- This skill handles the look; the wording belongs to `human-writing`. Open both for a kept document.

## Parts

| When | Open |
|---|---|
| Any design job in any medium (image · document · voice · music · video · screen): the 12-step method from brief and feelings to hand-off, and what each step means per medium | [parts/design-method/guide.md](parts/design-method/guide.md) |
| Starting any design work, choosing colors or a theme, owner says "go look at real examples", the gate steps and evidence line | [parts/design-references/guide.md](parts/design-references/guide.md) |
| Making or checking a visual so it does not look AI-made, the eye check and result line | [parts/no-ai-look/guide.md](parts/no-ai-look/guide.md) |
| Writing a markdown document people keep (report, proposal, manual): headings, tables, labels, figures | [parts/polished-document-style/guide.md](parts/polished-document-style/guide.md) |

## Check before done

- The 12 steps in `parts/design-method/guide.md` were followed: feelings written, one meaning per direction, real-use test, owner's pick recorded.

- The answer has the `เนื้อหา:` brief, the `ด่านก่อนลงมือ:` line and the `no-ai-look:` line.
- Every colour has a reason or `ล็อกตามแบรนด์`.
- A fresh agent, not the maker, checked the rendered piece by eye.
