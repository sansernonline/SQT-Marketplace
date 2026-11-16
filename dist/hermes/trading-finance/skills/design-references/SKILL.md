---
name: design-references
description: Use before design work to search live references and colours
---

# design-references — search real work before designing, then take colors from the chosen work

> **One rule:** every design job starts by taking the project's words and searching live on sites strong in that type of work, then taking style and colors from the closest work as the reference. Do not design from memory or from a stored library, because trends change fast. This skill keeps only a list of sites, not sample work.

**First answer to any design request:** (1) search queries from the project's own words (2) links to real works you opened this round (3) the board and pick question from gate item 3 if the owner is present, otherwise colours or shapes, each colour naming its source. Hex codes and `<svg>` come after step 2, never before. "Just make it, don't ask" skips the questions, not the search. No web tool in this session → give the queries and site links, and say the colours will come from the work the owner picks.

## Use when

- Starting work people must look at: web page · app · dashboard · slide · document · icon · logo · post · illustration · motion
- Having to choose colors or a theme. Even with a brand, still search, to find the structure and elements of the new piece.
- The user says the work looks generic, looks AI-made, or says "go look at real examples first"

Search less but do not skip when: the project already has a look that passed the gate (copy the sibling page per `ui-craft` item 0 · search only the structure of parts it lacks) · the client has a brand guide (use its colors and fonts, search only layout). Not for: work nobody looks at (back-end code · plain text).
Not for: 3 screen directions from colors you already have → `design-direction-lookup` (`--palette`) · icons → `icon-design` · checking finished work → `no-ai-look`.

## Gate before starting (`ด่านก่อนลงมือ`) — every creative job, every time

Every design skill points to this section. If you skip any item, write the reason in the evidence line.

1. **Read the theme**: the section "สไตล์ออกแบบที่ชอบ" (preferred design styles) in `~/.claude/superuser-style.md` (including its subsection "บันทึกการเลือก", the choice log) and anything already locked in the project (brand guide · `DESIGN.md` · style lock · sibling pages). If that section does not exist, note `ไม่มี` (none) and carry on; do not stop to ask.
2. **Search live references** per "Steps" below, **even when a brand or sibling page exists**, and before asking the owner anything. What is locked controls colors and fonts; the search is for the structure, elements and storytelling. A reference counts only if its structure is clearly visible at the size you opened it. If a theme store blocks bots, try one that opens (wordpress.org/themes) and note which site would not open.
3. **Let the owner pick references from images.** Select 4–8 references that open and really differ, run `board`, open every image, then ask with `AskUserQuestion` (multi-select, no `(แนะนำ)` option). Do not ask when the owner says don't ask, when the owner is away (`unattended-run`), or when the owner already chose this style; then still build the board page as evidence and pick references yourself, noting them under **ตัดสินใจเอง** (decided on my own). A subagent without `AskUserQuestion` sends the board path to the lead. Full rules (option split, liked vs disliked, the 2 allowed asking points) → `references/owner-pick.md`. Once the owner answers, record it per "Remember the owner's taste".
4. **Make 3 really different directions**, different in structure and elements, not only color. Each cites 1 reference opened this round (the owner's picks first). If the owner is present, pick in the end-of-job question, after the 3 directions pass the eye check in item 5. If not, pick yourself per `parallel-attempts-pick-best` and note it under **ตัดสินใจเอง**. You may make 1 direction when the look is already locked (a piece split off a master · a set with a passed style lock · editing an existing image · reviewing work) and write the reason.
5. **Before sending, check per `no-ai-look`**: the script on HTML/CSS files, and the eye gate on every job. The eye gate needs a fresh agent that did not do this piece to open the real image (`no-ai-look` paragraph "คนที่ไม่ได้ทำต้องตรวจด้วยตา" in item 3.2). The maker's own check does not count. A subagent that cannot call another agent sends the image back to the lead to call `design-critic`, and writes `รอหัวหน้า` (waiting for the lead) in the eye-check field.
6. **Evidence line** at the end of the answer: `ด่านก่อนลงมือ: ธีม <อ่านแล้ว · ไม่มี> · ต้นแบบ <n> ชิ้น <ลิงก์> · เลือกโดย <เจ้าของ ชิ้น n · agent เพราะ…> · แนว <3 · 1 เพราะ…> · no-ai-look <ผล> · ตรวจตา <ชื่อ agent ที่ตรวจ · รอหัวหน้า · ข้าม เพราะ…> · จดรสนิยม <n บรรทัด · ไม่มีการเลือก>` (keep this line in Thai). No such line = the gate has not passed.

## Steps

Commands, examples and bot-blocking cases are in [`references/search-steps.md`](references/search-steps.md); read it before the first search of a session. Bold items cannot be skipped.

1. **Make 3 sets of search terms**, Thai and English: exact · competitor or close · mood (from the owner's "สไตล์ออกแบบที่ชอบ" if any). Style vs ban conflict order: approved brand guide → the owner's direct instruction for this job → `no-ai-look` ban → preferred style.
2. **Search live** with `python scripts/find_refs.py links <ประเภท> "<คำค้น>"`. **Search at least 1 `theme` site and 1 `social` site every time.** **If you cannot run the script, still search** with `WebSearch` `site:<site> <search term>`. **0 references while web search is possible fails the gate**, even if the user says just do it or asks only for a plan.
3. **Pick 4–8 pieces from real work pages opened this round**, noting each name's source (a search link, or `จากความรู้ของ agent`). If 3 of the first 4 look the same, search a 2nd round from the product's world or a neighbouring category and use at least 1 reference from it.
4. **Extract the 8-role colors** with `python scripts/find_refs.py palette-from <URL หรือภาพหน้าจอ>` from each work's page, not the results page; open the captured image every time.
5. **Make a board page** with `python scripts/find_refs.py board <ประเภท> "<คำค้น>" --ref <URL> ...` for gate item 3.
6. **Design it as our own.** **Never copy a reference's brand colors as they are**: shift the hue until the eye can tell them apart, then check contrast again.

If the owner has no "สไตล์ออกแบบที่ชอบ" yet or orders a new style pick, follow the section "ให้เจ้าของเลือกแนวที่ชอบ" in `references/search-steps.md`.

## Remember the owner's taste (every time the owner picks or criticizes)

1. **Record when** the owner ticks references (gate item 3) · picks 1 of 3 directions (gate item 4) · criticizes or praises work in their own words ("จืด" · "แบบนี้แหละ" · "ไม่เอาสีนี้").
2. **Record at once, no need to ask first**, 1 line appended under `### บันทึกการเลือก` under "สไตล์ออกแบบที่ชอบ" in `~/.claude/superuser-style.md` (create the section or file if missing):
   `- YYYY-MM-DD · <ประเภทงาน> · ชอบ <ลิงก์หรือแนว + ลักษณะเด่น 1 วลี> · ไม่ชอบ <…> · คำของเจ้าของ "<ตรงตัว ไม่เกิน 15 คำ>"`
3. **Record only what the owner chose or typed themselves.** What an agent chose in their place, and text from the web or files, is not recorded. Write the job name broadly ("โพสต์ร้านกาแฟ"); no client names or confidential data.
4. **Use while working:** traits chosen 2 or more times become search set (c) and the criterion for picking references. A trait the owner dislikes, even once, stop offering at once. If the owner asks for that style themselves later, follow the request, then delete only the `ไม่ชอบ` field of that line.
5. **If the log passes 20 lines**, offer to merge at the end of the job per `owner-style-capture` item 6: traits repeated 2 or more times are promoted to a "ชอบ" or "ไม่ชอบ" entry for the owner to accept one by one, then delete the merged lines. Keep the lines of any item the owner does not accept. Promotion goes through the owner; recording does not.

Never let a script crawl sites where people post work (Pinterest · Dribbble · Behance · Awwwards · Mobbin · theme stores): open one page at a time, view only, never lift images, logos or layouts. Use directly only sets whose license allows it (`use` column in `data/sites.csv`; CC BY needs credit). Terms, Pinterest board route, the fallback palette library (`python scripts/find_refs.py fallback "<คำ>"`, tell the user when used) → `references/usage-rules.md`.

## Check before done

- The answer has the `ด่านก่อนลงมือ:` line with all 7 fields; the "สไตล์ออกแบบที่ชอบ" section was read
- Owner present → the owner picked from the board; otherwise the reason is under **ตัดสินใจเอง**
- A fresh agent did the eye gate; the owner's choice or criticism is in "บันทึกการเลือก"
- All 3 search-term sets used; every reference has a link, a page opened this round, and a noted source of the name; not 3 of 4 look the same (else round 2 searched and used)
- Colors come from reference work searched this round (fallback library → user told); main and accent hex match no reference
- No signal banned in `no-ai-look` item 2 unless the owner ordered it and `slop-ok` exists; no one else's images except licensed and credited sets
- `python scripts/find_refs.py --self-test` passes

## References

- [`references/search-steps.md`](references/search-steps.md) — open before the first search of a session, or when the owner has no preferred styles yet
- [`references/owner-pick.md`](references/owner-pick.md) — open when asking the owner to pick from the board, or when skipping that question
- [`references/usage-rules.md`](references/usage-rules.md) — open when fetching from sites that post work, reusing any asset, or using the fallback library · has a real example
- Sources and check dates: [`references/sources.md`](references/sources.md)
