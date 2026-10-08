---
name: personal-kb
description: Use when the user cannot find a note they wrote, or wants a personal knowledge base or second brain. Plain-file notes, naming and tags that search finds.
---

# Personal KB (คลังความรู้ส่วนตัว)

A knowledge base works only if search finds the note in ten seconds. Plain Markdown files, so it survives any app change. When a notes plugin or app (Obsidian, Notion, Apple Notes) is installed, write there and keep this as the naming and tagging convention.

## Layout

```
kb/
  index.md            ← evergreen notes by category, refreshed monthly
  inbox/              ← quick captures, emptied weekly
  people/             ← one note per person (context, last talk, preferences)
  projects/           ← one folder per active project; archive when done
  reference/          ← how-tos, recipes, manuals, addresses, procedures
  journal/            ← dated notes, meeting notes, weekly reviews
  archive/
```

Two levels deep at most. A note's home is decided in two seconds: *is it about a person, a project, a reusable fact, or a day?*

## Naming

| Kind | Pattern | Example |
|---|---|---|
| Dated | `YYYY-MM-DD topic.md` | `2026-10-06 condo committee.md` |
| Evergreen | `topic.md` — noun first | `aircon service – Daikin bedroom.md` |
| Person | `firstname lastname.md` (plus Thai name in the note) | `ploy srisuk.md` |

## The Thai search problem

Thai has no spaces between words, so many tools match Thai words badly ("ภาษี" may not find "ภาษีเงินได้" in some apps, or finds too much). Fix:

- **File names in English or transliteration** (`tax 2569 deductions.md`), Thai content inside
- **Tags line at the top in both languages**: `tags: #tax #ภาษี #ลดหย่อน #deduction`
- **One spelling** — pick `Ploy` not `Ploi/พลอย/Ploy S.` and keep an alias line: `aliases: พลอย, Ploi`
- Dates always ค.ศ. `YYYY-MM-DD` in names — sorting and search break with mixed พ.ศ./ค.ศ.

## Note template

```markdown
# [Title]
tags: #area #คำไทย
aliases: [other names people use]
source: [link / book / person] · created YYYY-MM-DD

[One idea, in your own words. Max ~1 screen.]

Related: [[other note]]
```

## Workflow

1. **Capture (< 1 minute)** — drop into `kb/inbox/` with a dated name; formatting optional.
2. **Weekly sort (10 minutes, in `weekly-review`)** — for each inbox note: delete · merge into an existing note · file it with a proper name and tags.
3. **Split** notes over one screen into one-idea notes and link them.
4. **Index monthly** — add new evergreen notes to `kb/index.md` under their category.
5. **Retrieval** — search by file name first, then tags, then full text. When a note was hard to find, rename it or add the alias you searched for — that is the maintenance loop.

## Worked example

User: "I wrote down how to reset the water pump last year." Search `pump` → nothing; full-text `ปั๊ม` → 14 hits in chat exports. Found it in `2025-05-11 notes.md`, mixed with a shopping list. Fix: move into `reference/water pump – reset and service.md`, tags `#home #ปั๊มน้ำ #pump`, alias "Mitsubishi pump", link from `index.md` under Home. Next search: 2 seconds.

## Rules

- Capture is fast; organisation happens weekly, not at capture time
- **Never store passwords, OTPs, recovery codes, full ID or card numbers** — they go to a password manager (`digital-hygiene`)
- Notes about other people: facts and preferences they shared with you, not gossip or health details they did not want written
- Back up the `kb/` folder with the rest of the user's files (3-2-1 rule in `digital-hygiene`)

Related: `meeting-summary` (files into `journal/`) · `important-docs` (documents, not notes) · `weekly-review`.
