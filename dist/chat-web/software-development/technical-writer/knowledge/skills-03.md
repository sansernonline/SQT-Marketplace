# skill: commit-message-format

Use when setting up commitlint or semantic-release

# Conventional Commit Message Format

> When to commit and logging each step → `workspace-rules/commit-log` (shared skill). This file adds the release side: scope, commitlint, semantic-release.

## When to use this skill

- Writing commits that feed release tooling (commitlint, semantic-release) — everyday commits use `workspace-rules/commit-log`
- Reviewing commits in a PR for consistency
- Setting up commitlint / semantic-release

## Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

## Types

| Type | Use for | Triggers release? |
|------|---------|-------------------|
| `feat` | New feature | minor version bump |
| `fix` | Bug fix | patch version bump |
| `docs` | Documentation only | no |
| `style` | Formatting, no code change | no |
| `refactor` | Refactor without behavior change | no |
| `perf` | Performance improvement | patch |
| `test` | Adding/updating tests | no |
| `build` | Build system, dependencies | no |
| `ci` | CI/CD changes | no |
| `chore` | Maintenance tasks | no |
| `revert` | Revert previous commit | depends |

## Subject Rules

- **Imperative mood** — "add" not "added" or "adds"
- **Lowercase** — start with lowercase letter
- **No period at end**
- **Max 50 characters**
- **Complete this sentence:** "If applied, this commit will _____"

## Short and readable (applies to every commit)

Someone scanning `git log --oneline` should understand each line without opening the diff.

- **Measure the repo's norm, then follow it** — `git log --oneline -30` before the first commit: language, whether `scope` is used, which types appear, typical subject length. A repo that never uses scope does not get one from you; a repo at 40 characters does not get a 72-character subject. Note what you measured in the report once (idea from ECC conventional-commit-review).
- **Language follows the repo** — A Thai repo gets Thai descriptions; `type(scope):` stays English so tools can parse it. Lowercase and imperative mood apply to English only.
- **Subject says what changed for the reader**, not which file was touched: `fix(stock): เบิกของเท่ากับที่เหลือพอดีได้แล้ว`, not `fix: แก้ items.js บรรทัด 42`
- **One line is enough** for most commits. Add a body only when *why* is not obvious from the subject — at most 3 short lines or bullets
- **No filler** — no "this commit", "minor changes", "update code", "แก้นิดหน่อย", or a list of changed files (the diff already shows them)
- **One commit, one topic** — if the subject needs "and" or `·` to join unrelated changes, split the commit. Check `git diff --stat` before writing the subject: when the files fall into more than one topic (feature + unrelated rename, fix + formatting sweep), propose the split as a list of `<subject> → <files>` per commit and stage each with `git add <files>` or `git add -p`; never hide the second topic in the body

| ✗ Hard to read | ✓ Short and clear |
|---|---|
| `update items.js, server.js, add test, fix bug` | `fix(stock): เบิกของเท่ากับที่เหลือพอดีได้แล้ว` |
| `feat: implement new functionality for exporting the low-stock report data to CSV format` | `feat(report): ส่งออกรายงานของใกล้หมดเป็น CSV` |
| `refactor: แก้โค้ดให้ดีขึ้น` | `refactor(report): อ่านประวัติเบิกครั้งเดียวแทนทุกสินค้า` |

## Body Rules

- Separate from subject with blank line
- Wrap at 72 characters
- Explain **why**, not just **what** (diff shows what)
- Use bullet points if multiple points
- Reference issues/tickets at the end

## Footer Conventions

```
Closes #123              ← closes the issue
Refs #456                ← references but doesn't close
BREAKING CHANGE: ...     ← breaking change notice
Co-authored-by: ...      ← attribution
```

## Quality Checklist

- [ ] Type matches the change (not just "chore" for everything)
- [ ] Scope is meaningful (component/module name)
- [ ] Subject is imperative and ≤50 chars — Thai subjects count base consonants only (~50); vowels and tone marks do not count · กติกาเต็มอยู่ใน `superuser` skill `workspace-rules/commit-log`
- [ ] Body explains WHY (if change isn't obvious)
- [ ] Breaking changes marked with `!` AND `BREAKING CHANGE:` footer
- [ ] Linked to issue/ticket when applicable


---

# skill: markdown-report-docx

Use when one Markdown file must become a Word report

# Markdown Report → .docx

> **Pre-work gate "ด่านก่อนลงมือ" (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → check `design-gate/no-ai-look` before sending · follow the section "ด่านก่อนลงมือ" of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts; the search is for finding the structure of this piece) · close the work with the line `ด่านก่อนลงมือ:`

> **The one rule of this skill:** Markdown is the source. The .docx is the result built from the source.
> Edit the .md and rerun the script every time. Never open Word and edit by hand, because the next run wipes it all out.

Page style: logo cover centred on the page · table of contents · tables with a light brand-colour header · note boxes · dark-background figures with captions · short tables that do not split across pages.

## When to use

- Business reports, research summaries, project reports, reports for a teacher, test result reports, handover documents whose content is already written in Markdown
- You must build the report many times (numbers or test results change → rerun → same-looking file)

## When **not** to use

| Work | Use |
|---|---|
| A formal document with a colour-banded cover, a metadata box, a signature table (Software Requirements Specification (SRS) · Business Requirements Document (BRD) · proposal) | `branded-document-design`, calling `BrandDoc` directly |
| Presentation slides | `presentation-design` (its top table chooses .pptx · .html · convert) |
| A document that lives in the repo as Markdown only | `design-gate/polished-document-style` |
| Thesis · independent study · research article | `personal-life:thesis-writing` first (if installed): the faculty guide controls the book structure and layout. This script can still build the .docx afterwards |

---

## 1 · Steps

1. Write the content in `docs/src/<name>.md` (the permanent source, per `workspace-rules/document-naming` item 1) following `design-gate/polished-document-style` (plugin `superuser`). Add front matter (section 2). If there is no `doc-theme` yet, **search for references first:** take the project's keywords and search live as in `design-gate/design-references` (plugin `superuser`), type `document`, then pull colours from the chosen work. Use the stored colour library when live search is not possible.
2. Run `python scripts/md_to_docx.py docs/src/<name>.md -o docs/<deliverable-file-name>.docx --pdf`
   - The script uses `brandkit.py` from `branded-document-design/scripts/` next to it, and needs `python-docx`.
   - `--pdf` uses Word on Windows (it also updates the table of contents). Without Word, it uses LibreOffice. This PDF is for the checks in section 5. Deliver it only for a user manual or when the client asks. Otherwise move it to `_to_delete/` (`workspace-rules/document-naming` item 1).
3. Convert the PDF to images and **open every page** as in section 5. If you find a problem, fix it in the .md and rerun.
4. Name the deliverable file per `workspace-rules/document-naming` (plugin `superuser`), for example `CLINIC-RPT-project-v1.0-DRAFT.docx`

To see an example with every element: `python scripts/md_to_docx.py assets/example-report.md --pdf`

## 2 · Front matter

```yaml
---
title: Clinic Booking Assistant              # large title in brand colour on the cover
subtitle: เอกสารการพัฒนาโครงงานและผลการทดสอบ   # secondary line in bold
meta: วิชา 01234567 · ฉบับ 1.2 · 10 ตุลาคม 2569 # small line under the subtitle
note: ผู้พัฒนา 6500001 ชื่อ นามสกุล             # grey italic (optional)
logo: ../assets/logo-on-light.png             # path relative to the .md file (optional)
logo_width_cm: 6.5
brand: 2A78D6          # the project's main colour (order in diagram-figures item 5) · this value is the house default · used for H1 headings, the cover title, item numbers
brand_deep: 1B4E8B     # H2 headings, table header text, inline code
brand_tint: EAF2FB     # table header background
brand_tint_2: F4F8FD   # alternate row background (tables over 6 rows)
---
```

Optional values: `brand_2` (secondary accent colour) · `toc: no` (no table of contents) · `footer: Page` (the word before the page number, default "หน้า") · `figure_width_cm` (default 17) · `cover_top_pt` (distance from the top edge to the logo, default 150)

**Colours come from the work's owner.** Find them in the order in `diagram-figures` item 5 (colour system). If you find none at all, put `brand: 2A78D6` (the house default), write `(รอยืนยัน)` (awaiting confirmation) in the report, and keep going without stopping to ask. Never copy colours from the example or the reference report. `brand_tint` must be light enough for `brand_deep` text to read clearly (contrast ≥ 7:1 on both white and `brand_tint`; the script checks this and stops with the value if it fails).

## 3 · What each Markdown form becomes

| Written in .md | Result in .docx |
|---|---|
| `# 1. Heading` · `##` · `###` | 3 heading levels in brand colour, in the table of contents, never stranded at the page bottom · **write the item numbers yourself** |
| Paragraph with `**bold**` · `` `code` `` | Body text in dark grey · bold in a dark colour · code in a monospace font in `brand_deep` |
| Table `\| … \|` | Header with `brand_tint` background · first column bold · width by text length · alternate row colours over 6 rows · a table of up to 8 rows stays on one page · header row repeats across pages |
| `> text` | A grey "หมายเหตุ" (note) box |
| `> [!TIP]` · `[!WARNING]` · `[!IMPORTANT]` · `[!CAUTION]` · `[!NOTE]` | Boxes for tip · caution · important · danger · note |
| `![caption](path.png)` | Centred image + italic "รูปที่ N — caption" (Figure N), on the same page as the image |
| `1. …` | Item numbers in brand colour, restarted for every list |
| `- …` | bullet |
| ```` ``` ```` | Code box with grey background |
| `<!-- pagebreak -->` | New page |
| `---` · `<!-- other -->` | Skipped |

A line before a table (a lead-in paragraph or a note box) is tied to stay on the same page as the table.

## 4 · Rules for writing so it looks good

- **Tables are the main tool.** Data with a heading + details is better as a 2-column table than a long paragraph.
- **A table cell is at most ~170 characters.** Longer than that, move it below the table.
- **Pick dark-background or white-background figures and use one for the whole book** · 1600–2000 px wide · draw with [`diagram-figures`](../diagram-figures/SKILL.md) and export PNG
- **Test results come from the real result files.** Build the results table with a script and insert it between `<!-- RESULTS:START -->` and `<!-- RESULTS:END -->` in the .md before running. Do not type numbers by hand.
- **Say when data is simulated.** A 1-line note box from the first page of the content.

## 5 · Check by eye. Never skip.

```bash
python -c "import pymupdf; d=pymupdf.open('report.pdf'); [p.get_pixmap(dpi=70).save(f'_to_delete/p{i+1:02}.png') for i,p in enumerate(d)]"
```

Open the image of every page (Read tool) and go through the checks:

- [ ] Cover: logo is not distorted, the title does not wrap in the middle of a word
- [ ] The table of contents has all page numbers (if empty, open in Word and press F9, or use `--pdf` on Windows)
- [ ] No nearly empty pages · no heading stranded at the page bottom · no figure caption pushed to the next page
- [ ] Table columns do not cut a name or code in the middle. If they do, shorten the text in the longest column
- [ ] Brand colour matches the logo (no brand → house default + `(รอยืนยัน)`) · no leftover Word default blue
- [ ] No leftover `[...]` placeholder · `(รอยืนยัน)` is not a placeholder, so keep it, and every instance appears in the report's awaiting-confirmation list

## 6 · Anti-patterns

- **Editing the .docx in Word and sending it.** It vanishes on the next run. Edit the .md.
- **Using Word's List Number.** It continues counting across lists, which is why the script writes the numbers itself.
- **A small screenshot enlarged to full page.** It breaks up. Retake it at width ≥ 1600 px.
- **A table 7 columns wide or more on a portrait page.** Split it into 2 tables.

## 7 · Links to other skills

| Need | Use |
|---|---|
| Add elements the script lacks (KPI · pill · signature · landscape page) | Call `BrandDoc` in [`branded-document-design`](../branded-document-design/SKILL.md) after `build()` |
| Slides paired with the same report, same colours | [`presentation-design`](../presentation-design/SKILL.md) (its top table chooses .pptx · .html · convert) |
| File names and versions | `workspace-rules/document-naming` (plugin `superuser`) |
| Figures in the report | [`diagram-figures`](../diagram-figures/SKILL.md) |
| A project-specific cover (logo and mockup already exist) | `branded-document-design` `references/cover-design.md` |
