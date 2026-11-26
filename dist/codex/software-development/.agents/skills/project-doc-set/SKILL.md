---
name: project-doc-set
description: Use when choosing a project doc set or open-items Excel
---

# Project doc set

> **One rule:** every doc must answer **who reads it** and **what they decide after reading**.
> If it cannot answer, do not write it.

---

## When to use this skill

Use it when: opening a new project and deciding which docs it needs · docs are scattered and nobody knows which is the real one · a client asks what will be delivered · about to write a doc but unsure what must come first.

## When **not** to use it

| Situation | Use instead |
|---|---|
| Folder layout of the **code** (including the `docs/` inside code in type A) · README · CHANGELOG · linter | `project-bootstrap` |
| Naming **files** and version numbers of docs | `workspace-rules/document-naming` |
| Actually writing one doc | The skill for that doc (table in section 4) |
| Making document pages look good | `branded-document-design` |

---

## 1 · Docs inside or outside the repo

**Decide this first** (moving later means fixing links across the whole project). **The default is type B**, even when the docs are pure markdown. The code lives in `<project-name>/` (lowercase, joined with `-`). Use type A only when the user asks.

- **Type B** (docs outside the repo): use it for every set size (S · M · L). `.docx` / `.xlsx` / mockups / PNGs that the client must see stay out of pull requests. The root layout is below (this section owns the root layout).
- **Type A** (docs inside the repo): only when the user asks and the docs are pure markdown. Docs and code change in the same pull request. The root looks like type B but has no root `docs/`. The `docs/` folder sits inside the code folder, and its inner layout belongs to `project-bootstrap` section 1.
- A type A project that grows deliverable docs moves to type B **as a whole set in one go**. A doc that lives in 2 places means 2 versions.

### Type B layout

```
<project-name>/
├─ ref/                 things received — TOR · meeting notes · screenshots of the old system · client files  **read-only, never edit**
├─ docs/                every doc we write — delivered .docx and technical .md live together
│  ├─ figures/          exported figures — .png only        [exists when delivered docs have figures]
│  │  └─ src/           source files of the figures (.html · .mmd · .drawio)
│  ├─ decisions/        ADR-NNNN-<slug>.md, one decision per file  [optional]
│  ├─ runbook-<topic>.md  guide for when the system has problems, one topic per file  [optional]
│  └─ research/         research on a reference app (`reference-app-research`) [optional]
├─ mockup/              .html that opens and really clicks
├─ qa/                  test cases · test results · bugs/ bug reports
├─ assets/              logos · icons in all sizes · favicon · wordmark (.svg source + exports)
├─ _to_delete/          every kind of temporary item
├─ .claude/            project skills (such as verify) — must sit where Claude Code is opened
│  └─ superuser/        SuperUser working files — CONTEXT.md · HISTORY.md · IMPROVEMENTS.md · log/ · inbox/ · learn/
└─ <project-name>/      code repo, project name lowercase joined with `-` — inner layout belongs to `project-bootstrap`
```

**SuperUser files** (`.claude/superuser/` · `docs/BRIEF.md` · `AGENTS.md`/`GEMINI.md`): the single source is [`superuser/references/team-files.md`](../superuser/references/team-files.md).

**ADRs and runbooks live in the root `docs/`, not in `<project-name>/docs/`.** Type A moves the whole `docs/` into the code folder, with the same inner layout. Paths: `docs/decisions/ADR-NNNN-<slug>.md` · `docs/runbook-<topic>.md`. This section is the only place that defines this.

**Root exceptions:** `.sandbox/` may sit at the root when you use `docker-sandbox` · `AGENTS.md` / `GEMINI.md` under the conditions above. Declare every exception in the README of the code folder.

**Create folders when real content exists, not in advance:** `ref/` when you get files from the client or the old system (never mix them into `docs/`) · `docs/figures/` when a delivered doc has a self-drawn figure (otherwise the figure is stuck inside the `.docx` and cannot be edited) · `docs/decisions/` when a decision needs explaining later · `docs/research/` when the user wants an app like an existing one · `qa/` when test cases exist (test cases always live here; `docs/test-plan.md` holds only the plan) · `assets/` when there is a logo or icon.

**Ecosystem project** (2 or more sub-projects, each with its own doc set): the folder is always named `ecosystem/` (never `projects/` `modules/` `apps/`). `ecosystem/<code>-<SUB>/` holds `docs/` `mockup/` `qa/` and its own repo. Docs that cover all sub-projects live in one place, the root `docs/`. Full layout and rules: [`references/ecosystem.md`](references/ecosystem.md). An add-on or sub-program of one app (browser extension · plugin · CLI · hook client · SDK) with no doc set of its own is not a sub-project: it lives in the code repo under `<project-name>/extension/<name>/` (`project-bootstrap` item 1).


**Folder rules (both types):**

- **`.docx` and `.md` may share one `docs/`.** No need for separate folders, because the extension already says who reads it.
- **Never lose the source files of figures.** If a figure must change next year and only the PNG is left, the whole figure must be redrawn.
- **Every button in a mockup must really click**, because a fake button makes the review wrong.
- **`.docx` / `.xlsx` live only in `docs/` and `qa/`.** Do not scatter them to the project root.
- **Temporary items go to `_to_delete/`** (`workspace-rules/temp-file-discipline`).
- **`docs/README.md` is the index.** It says what to read first and who owns what (template in `project-bootstrap` → `assets/starter-files.md`).

---

## 2 · Choose the doc set by project size

Size is measured by **duration × number of people who must agree**, not by lines of code.

**S** ≤ 2 weeks · one team · nobody outside the team signs — **M** 1–3 months · internal client · delivered in rounds — **L** > 3 months · external client signs off · contractual obligations

### 2.1 · Deliverable docs: people read and sign them

| Doc | Format | Readers | S | M | L |
|---|---|---|:-:|:-:|:-:|
| Project Plan | `.docx` | client · team | ○ | ● | ● |
| SRS | `.docx` | dev · client | ○ | ● | ● |
| Architecture | `.docx` | dev · ops | ○ | ● | ● |
| Test Plan | `.docx` | QA · client | ○ | ● | ● |
| User guide (`MAN`) | `.docx` → `.pdf` | end users | ○ | ● | ● |
| FSD | `.docx` | dev · QA | ○ | ○ | ● |
| BRD | `.docx` | business side | ○ | ○ | ● |
| Document Checklist | `.docx` | everyone | ○ | ○ | ● |
| Test Cases | `.xlsx` | QA | ○ | ○ | ● |

● required · ○ not needed unless there is a specific reason
**Set S has none of these docs.** That is correct.

---

### 2.2 · Technical docs: the team and agents use them while building

All markdown. They **depend on what the project contains**, not on project size. Full table (file · question answered): [`references/technical-docs.md`](references/technical-docs.md).

- **Always:** `<project-name>/README.md` · `docs/BUILD-PLAN.md`
- **Conditional:** USER-STORIES and `docs/sprints/sprint-NN.md` (work runs in sprints) · AGENT-LOOP (an agent writes code in rounds) · API-SPEC (an API that others call) · DATA-DICTIONARY (a database exists) · EVALUATION-POLICY and PROMPT-LIBRARY (LLM used) · `docs/decisions/ADR-NNNN-<slug>.md` (decisions that will be questioned again) · `docs/runbook-<topic>.md` (system in real use and someone on call)

---

## 3 · Writing order

**Delivery track.** Never skip a step that belongs to the set for that size. Skip steps that are not in the set, such as BRD · FSD in set M.

```
Project Plan ─► BRD ─► SRS ─┬─► mockup
                            └─► Architecture ─► FSD
                                                 │
              User Guide ◄─ Test Cases ◄─ Test Plan
```

**The next doc may build on the DRAFT of the previous one.** Put `(รอยืนยัน)` (awaiting confirmation) on every unconfirmed item in both docs. Never set the next doc to APPROVED before the previous one, because if the upstream doc changes, the whole chain must be redone.
The one exception: **the mockup may run in parallel with the SRS**, because screenshots help the SRS get confirmed faster.

### 3.1 · Open-items register: when the user asks "what is still stuck", answer with an Excel file, not chat text

Labels such as `(รอยืนยัน)` · `(รอวัดใน Phase 0)` (awaiting measurement in Phase 0) and question tables are spread over every doc, so the decision maker sees no overall picture. Merge them into one file with the script. Do not read them all by hand:

```
python scripts/open_items.py docs/ docs/<CODE>-OPEN-ITEMS.xlsx --project <CODE>    # test the script: --self-test
```

- It reads every `.docx` in `docs/`: question tables · tables of undecided assumptions · sign-off tables still "waiting" · labels in the body. It skips revision history, table of contents, label-explanation lines and `(รอบหลัง)` (later round).
- The **สรุป** (summary) sheet counts by document × type with formulas. The **รายการค้าง** (open items) sheet has the heading in the doc · who answers · decide by · value used for now · cross-references · and "สถานะ" (status) and "คำตอบ" (answer) columns for people to fill in.
- Types (ประเภทที่ต้องเลือก), shown in Thai in the sheet: **เจ้าของตัดสิน** (owner decides: a web search cannot close it) · **ทีมตัดสิน** (team decides: BA · SA) · **กฎหมาย** (legal) · **วัดจริง** (needs a real-world number: none is published) · **ลงนาม** (sign-off). A question that cites an owner question in another doc also counts as "เจ้าของตัดสิน".
- **Before sending, read the list by eye.** The script matches wording. A row that was already answered but does not use the words "ตอบแล้ว · ปิดแล้ว · ตัดสินแล้ว" (answered · closed · decided) still gets through.
- When the user fills in answers: write the answer into the source doc, remove the label, record it in the revision history, then rerun the script. This file is a work list, not a source. Do not edit answers in this file in place of the doc.

**Technical track.** Write when you reach the point of need. No need to wait for anyone: README · BUILD-PLAN before the first line of code · DATA-DICTIONARY when designing the first table · API-SPEC at the first endpoint · PROMPT-LIBRARY at the first prompt really used · ADR at decision time (not in the final wrap-up, because the real reasons are gone by then) · Runbook before going live. Full table in [`references/technical-docs.md`](references/technical-docs.md).

---

## 4 · Who writes which doc, with which skill

Full table (agent · skill for each of 16 doc types): [`references/technical-docs.md`](references/technical-docs.md). Main ones: SRS → `srs-writing` · FSD → `fsd-writing` · ADR → `adr-writer` · Test → `test-case-template` · mockup → `web-app-design` + `ui-craft` · README → `project-bootstrap`

---

## 5 · Figures in docs: choose correctly from the start

- Figures in every kind of project doc (BRD · SRS · FSD · ADR · ER · flowcharts) · slides · print work → `diagram-figures` (one house style). Keep them in `docs/figures/` with sources in `src/`. **Default Mermaid is banned from project docs.**
- Quick figures in a README · PR · code notes → Mermaid (`software-diagrams`) embedded in `.md` (colours are random and meaningless, Thai overflows the boxes, and shrunk to A4 it is unreadable).

**Every figure header needs all 6 items:** project logo · title · 1-line subtitle · figure number · version and date · owner (details in `diagram-figures` section 3).

---

## 6 · Colour theme of the doc set

Declare it once per project, at the top of every doc's source file:

```markdown
<!-- doc-theme: accent=#2A78D6 -->
```

(The example uses the house colour `#2A78D6`. Replace it with the project's main colour.)

`branded-document-design` · `presentation-design` · `diagram-figures`
read this value instead of picking colours themselves, so docs, slides and every figure form one set.

**Colour comes from the work, not from taste.** If there is a brand colour, use it. If not, use the house colour of `branded-document-design`, write `(รอยืนยัน)`, and carry on without stopping to ask.
Exceptions that do not follow the theme: service provider logo colours · grey structural lines · green = pass / red = fail

---

## 7 · Checklist before delivering the doc set

- [ ] In every `.docx`, open the Navigation Pane and **see all headings** (use real Heading styles, not bold text)
- [ ] Every doc has a revision history page · version number · date · author
- [ ] Every figure has a figure number and is cited in the body at least once
- [ ] The source file of every figure is in `docs/figures/src/` (if this folder exists)
- [ ] Technical docs that meet the conditions in section 2.2 are all present. For example, if there is an API there must be an API-SPEC, and if an LLM is used there must be a PROMPT-LIBRARY
- [ ] Every abbreviation is spelled out at first appearance
- [ ] File names follow `workspace-rules/document-naming`: no `final2`, no `ล่าสุด` ("latest")
- [ ] Docs in the set cite each other's versions consistently
- [ ] Run `scripts/open_items.py`, and the open-items register has no row with status "เปิด" (open), or the client knows about every row still open
- [ ] Tell the user what is left in `_to_delete/` (delete only what `workspace-rules/temp-file-discipline` step 9 allows: old task folders nothing else still uses)

---

## 8 · Anti-patterns

Wrong: `.docx` with no Heading style · keeping only the PNG and not the source · `.docx` and mockups inside the code repo (at this point move to type B) · a doc in 2 places (= 2 versions) · FSD before the SRS is confirmed · using an LLM with no PROMPT-LIBRARY · sub-projects named `projects/` `modules/` `apps/` · empty folders created in advance · one doc that answers every question

---

## 10 · Links to other skills

Doc status in `docs/BUILD-PLAN.md` → `superuser/status-report` · checklist for the printed version → `assets/doc-set-checklist.md`

**Read more when needed:** [`references/writer-templates.md`](references/writer-templates.md): `technical-writer` doc templates (tutorial · API reference · release notes · for README see `project-bootstrap`)

**When the guide must go on the web, be searchable and have many versions:** [`references/docs-site.md`](references/docs-site.md): choosing MkDocs Material · Docusaurus · Starlight · VitePress · Thai search test results · hosting · Thai fonts
