---
name: document-design
description: Use when Word, PowerPoint or PDF must look designed, MD to Word, or reading a .docx, .xlsx or .pdf someone sent
argument-hint: '<document name or brand name>'
---

# document-design — make a Word, PowerPoint or PDF file look designed, on purpose

> **One rule:** run the pre-work gate before any design work, every time. Read the owner's theme, search live for reference designs, make 3 genuinely different directions, and check the result against `design-gate/no-ai-look` before sending.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Make this .docx or .pptx look professional", "design the cover", "use our brand in the report", "PDF with a designed look" | [`references/branded-document-design.md`](references/branded-document-design.md) (cover work: [`references/cover-design.md`](references/cover-design.md); tokens and fonts: [`references/tokens-and-type.md`](references/tokens-and-type.md); Thai fonts: [`references/thai-fonts.md`](references/thai-fonts.md)) |
| "Read this BRD.docx", "extract the table from the .xlsx", "answer from the attached PDF", "deliver it as Word or Excel" | [`references/office-input-output.md`](references/office-input-output.md) (which built-in `anthropic-skills` file skill to call, by role and format) |
| "Turn this Markdown file into a Word report", "convert the .md to .docx" | [`references/markdown-report-docx.md`](references/markdown-report-docx.md) (layout in Word: [`references/word-layout.md`](references/word-layout.md)) |

Other references: the code API is in [`references/api.md`](references/api.md), the list of mistakes to avoid is in [`references/anti-patterns.md`](references/anti-patterns.md), and the visual check is in [`references/visual-check.md`](references/visual-check.md). Scripts are in `scripts/` (`md_to_docx.py`, `brandkit.py`, `cover-engine/`).

## Steps every part shares

These steps apply to design work. Only reading or extracting an Office file (`office-input-output`) skips them.

1. Write the `เนื้อหา:` brief (what the content says, who reads it, what they do next). Use the brief to choose the design.
2. Read the owner's theme. Follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-gate/design-references` in the `superuser` plugin, even when a brand exists. The brand sets colour and fonts; the search sets the structure.
3. Pick 1 direction out of the 3, then build the file from its tokens.
4. Render the file, look at it, and fix what the visual check finds.
5. Close the work with a line that starts with `ด่านก่อนลงมือ:`.

## Check before done

- The file passes `design-gate/no-ai-look`: no emoji, no decorative filler, and no claims a competitor could also make.
- The file passed the visual check in `references/visual-check.md` before it was sent.
- Every figure in the document comes from the `diagrams` skill and uses the same theme as the rest of the file.
- Every font in the file has its licence checked (see `references/thai-fonts.md`).
