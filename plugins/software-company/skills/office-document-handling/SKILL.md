---
name: office-document-handling
description: Use when given Office documents (.docx, .xlsx, .pptx, .pdf) as input or when output should be in Office format. Wraps Anthropic's built-in office skills (anthropic-skills:docx, xlsx, pptx, pdf) for consistent agent usage. Critical for agents that consume client documents (BRDs in Word, requirements in Excel, etc.) or produce stakeholder deliverables.
---

# Office Document Handling

## When to use this skill

- User attaches a **.docx, .xlsx, .pptx, or .pdf** file
- User asks to "read", "extract", "analyze" a document
- User asks for output as Word/Excel/PowerPoint
- User mentions a file by name (e.g., "the BRD.docx", "the spec.xlsx")
- Migrating content between formats

## The Skills You'll Use

Claude Code ships with built-in skills for Office formats. **Don't try to parse these yourself** — invoke the appropriate skill:

| File type | Skill | Use for |
|-----------|-------|---------|
| `.docx` (Word) | `anthropic-skills:docx` | BRDs, FSDs, contracts, reports |
| `.xlsx`, `.csv`, `.tsv` | `anthropic-skills:xlsx` | Requirements matrices, data, plans |
| `.pptx` (PowerPoint) | `anthropic-skills:pptx` | Roadmaps, pitches, training decks |
| `.pdf` | `anthropic-skills:pdf` | Scanned contracts, RFPs, reports |

## Decision Tree: Which Skill?

```
User input has a file?
│
├─ .docx → anthropic-skills:docx
│   - Read content + structure (headings, tables, lists)
│   - Edit existing doc (find/replace, tracked changes)
│   - Produce final Word output
│
├─ .xlsx / .csv → anthropic-skills:xlsx
│   - Read tabular data
│   - Compute (formulas, pivots)
│   - Produce Excel output
│
├─ .pptx → anthropic-skills:pptx
│   - Read slides + speaker notes
│   - Produce slide decks
│   - Modify templates
│
└─ .pdf → anthropic-skills:pdf
    - Extract text + tables
    - OCR scanned PDFs
    - Produce PDF output (cert of completion, formal reports)
```

## Common Patterns by Role

### Business Analyst — Reading BRD/PRD

```
1. User attaches "requirements.docx"
2. Use anthropic-skills:docx to extract structure + content
3. Map to internal BRD format
4. Identify gaps + ambiguities
5. Produce polished BRD (markdown by default, .docx if requested)
```

### System Analyst — Reading API Spec

```
1. User attaches "api-spec.xlsx" with endpoint matrix
2. Use anthropic-skills:xlsx to extract rows
3. Convert to FSD endpoint definitions
4. Verify completeness vs source
```

### Product Manager — Reading Pitch / Roadmap

```
1. User attaches "Q1-roadmap.pptx"
2. Use anthropic-skills:pptx to extract slides + speaker notes
3. Update with current state
4. Produce updated deck OR convert to markdown for review
```

### Technical Writer — Producing Deliverables

```
1. Write content in markdown (always source of truth)
2. If user wants .docx: use anthropic-skills:docx to render
3. If user wants .pptx: use anthropic-skills:pptx to slidify
4. Keep markdown source for version control + future edits
```

### QA Tester — Test Plans + Matrices

```
1. Read test plan template (.xlsx) with anthropic-skills:xlsx
2. Populate test cases per matrix structure
3. Output back to .xlsx for upload to test management tool
```

### Legal/Compliance — Contracts + Filings

```
1. Receive contract.docx or contract.pdf
2. Use appropriate skill to extract clauses
3. Apply contract-parsing-patterns skill (if legaltech installed)
4. Produce review notes + redlined version
```

## Workflow Patterns

### Pattern 1: Read → Process → Output Same Format

```
Input: .docx → Extract content → Process → Output: .docx
```

Use when: round-tripping documents (e.g., redline editing)

### Pattern 2: Read → Transform → Markdown

```
Input: .docx/.xlsx/.pptx → Extract → Output: markdown
```

Use when: importing into your workflow, version control needed

### Pattern 3: Markdown → Render to Office

```
Source: markdown → Process → Output: .docx/.pptx/.pdf
```

Use when: user wants formal deliverable, keep markdown for editing

### Pattern 4: Cross-Format

```
.pptx → markdown (for review) → .docx (final deliverable)
```

Use when: pitching → contract, roadmap → spec, etc.

## Format Selection Guidance

### Default: Always start with markdown

```
✅ Markdown advantages:
- Version control friendly (git diffs)
- Searchable
- Editable in any tool
- Renders everywhere
- Easy to convert to Office formats

❌ Office formats as source of truth:
- Lost in version control
- Hard to diff
- Tool lock-in
- Heavy file size
```

### When to render to Office

| User says | Render to |
|-----------|-----------|
| "Send to legal" | `.docx` (lawyers expect Word) |
| "Present to board" | `.pptx` |
| "Track in our system" | `.xlsx` |
| "Sign with DocuSign" | `.pdf` |
| "Email the report" | `.pdf` (universal) |
| "Edit collaboratively" | Markdown (link to repo) |

## Quality Checklist

When producing Office output:

- [ ] Markdown source preserved + version controlled
- [ ] Output matches requested format
- [ ] Tables render correctly (esp. in Word)
- [ ] Images embedded properly
- [ ] Page breaks at logical points (Word)
- [ ] Headers/footers per template (Word)
- [ ] Slide notes included (PowerPoint)
- [ ] Formulas computed correctly (Excel)
- [ ] PDF accessibility tags (if needed)
- [ ] Spell check passed
- [ ] Brand styling applied

## Anti-patterns

- ❌ **Roll your own parser** — use anthropic-skills:* instead
- ❌ **Markdown only when user wants .docx** — render to final format
- ❌ **Office format as version control source** — keep markdown
- ❌ **Skip extracting tables** (Excel has structure, use it)
- ❌ **Lose formatting** when round-tripping
- ❌ **Ignore speaker notes** in pptx
- ❌ **Assume PDFs are text** — may need OCR (anthropic-skills:pdf handles)

## When to Hand Off

- Need bulk conversion (1000s of files) → DevOps engineer + Pandoc pipeline
- Custom branded templates → designer creates template, we populate
- Heavy data analysis → Data engineer + pandas
- Document automation system → Document automation engineer (legaltech)

## Quick Reference

```
File ends in    → Use skill              → Common use case
─────────────────────────────────────────────────────────────
.docx, .doc     → anthropic-skills:docx  → BRD, FSD, contracts
.xlsx, .xlsm    → anthropic-skills:xlsx  → Requirements, data, plans
.csv, .tsv      → anthropic-skills:xlsx  → Tabular data export
.pptx           → anthropic-skills:pptx  → Decks, roadmaps
.pdf            → anthropic-skills:pdf   → Reports, contracts, RFPs
.md, .txt       → (no skill needed)      → Native handling
```
