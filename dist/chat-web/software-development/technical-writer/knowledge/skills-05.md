# skill: project-docs

Use when choosing project docs, onboarding docs or release notes

# project-docs — pick the right docs, then write them for the reader who uses them

> **One rule:** every doc must answer who reads it and what they decide after reading. If it cannot answer, do not write it.

## Pick the part

| Job (what the user says) | Open |
|---|---|
| "Are the paths and commands in CLAUDE.md still true?", agent docs drifted from the code | [`scripts/docs-truth.mjs`](scripts/docs-truth.mjs) · checks that every path with a folder (`docs/guide.md`, `src/auth/login.ts`) and every `npm run` script named in `CLAUDE.md` · `AGENTS.md` · `README.md` exists · bare file names (`SKILL.md`) and two-part names without a dot (`owner/repo`, `ground-rules/simplify`) are skipped on purpose, because in agent docs they are usually generic names, not paths · `--ignore '.claude/**'` for folders kept out of git · put it in CI or a card's `done_when` |
| "Which docs does this project need?", "docs are scattered", "a client asks what we deliver", "open-items Excel" | [`references/project-doc-set.md`](references/project-doc-set.md) (table of docs: [`references/technical-docs.md`](references/technical-docs.md)) |
| "Onboard a new developer", "30/60/90-day guide", "a new QA joins next week" | [`references/onboard.md`](references/onboard.md) |
| "Release notes for 1.4.0", "what changed in this version for users" | [`references/release-notes.md`](references/release-notes.md) (templates: [`references/writer-templates.md`](references/writer-templates.md)) |
| "Put the docs on a website", "searchable manual with versions" | [`references/docs-site.md`](references/docs-site.md) |
| The project has 2 or more sub-projects, each with its own docs | [`references/ecosystem.md`](references/ecosystem.md) |

To list the open items in the open-items Excel, run `scripts/open_items.py`. The checklist of docs is in `assets/doc-set-checklist.md`.

## Steps every part shares

1. Ask who reads the doc, and what they must do after reading. Unknown answers go in as `(รอยืนยัน)` (awaiting confirmation), and the work goes on.
2. Look for the real document first. Keep one source for each fact, and link to it instead of copying it.
3. Put files that come from the client or the old system in `ref/`. Treat `ref/` as read-only.
4. Create a folder only when it has real content, not in advance.
5. Write the doc in the register its reader needs, then check it with a fresh reader who has not seen the project.

## Check before done

- No password, token or account secret is in any doc. Link to the place where access is requested instead.
- A document that outsiders must not see stays in `docs/` in the repo. It does not go on a public docs site.
- A public docs site is not used as free hosting for an online business or a SaaS product, and the site counts as public even when the repo is private.
- Release notes are written for users, from the commits since the last version, and every unknown is marked `(รอยืนยัน)`.
- Every sub-project folder in an ecosystem is named `ecosystem/`, and shared docs live once in the root `docs/`.


## reference: docs-site.md

# Docs site

Pick a docs-site generator when a manual or developer documentation must go on the web, be searchable, and have several versions · use with `SKILL.md` item 1 (where the documents live) and the templates in [`writer-templates.md`](writer-templates.md).
Facts checked 2026-10-23 from official docs · npm · PyPI · GitHub and real tests (section "Sources").
Abbreviations: Application Programming Interface (API) · Software Development Kit (SDK) · Architecture Decision Record (ADR) · SIL Open Font License (OFL) · Software as a Service (SaaS) · user interface (UI)

## 1 · Is a docs site needed

| Situation | Use |
|---|---|
| People outside the team read often (public API · SDK · a manual updated every release) · search needed · several versions at once | a docs site (this file) |
| The team reads it themselves | `README.md` + `docs/*.md` on GitHub is enough |
| The customer signs for acceptance | `.docx` per `SKILL.md` item 2.1 · a docs site does not replace the handover document |

## 2 · Comparing the 4 generators

| | MkDocs Material | Docusaurus | Starlight | VitePress |
|---|---|---|---|---|
| Requires | Python | Node · React | Node · Astro | Node · Vue |
| Latest version | 9.7.7 | 3.10.2 | 0.42.6 (not yet 1.0) | 1.6.4 · 2.0 is still alpha |
| Built-in search | yes · lunr.js + lunr-languages (can set `lang: th`) | no · the official one is Algolia DocSearch · local search uses a community plugin | yes · Pagefind is on by default, no setup | yes · MiniSearch (`provider: 'local'`) or Algolia |
| Versioning | via `mike`, an external tool | built in, `docusaurus docs:version` | community plugin `starlight-versions` | none · issue #109 is still open |
| Multiple languages (i18n) | the UI can be translated (`th` exists) · a multilingual site = one project per language + a language switcher | built in | built in · a Thai UI is included | built in |
| licence | MIT | MIT | MIT | MIT |

MkDocs Material: the maintainers announced they will maintain only critical fixes until 5 May 2027 and told users to move to Zensical (version 0.0.71 · status Alpha · MIT) · a new project that must live for years should record this in an ADR.
Quick pick: Python team → MkDocs Material (plan a move) · need built-in versioning → Docusaurus · want a light site with little setup → Starlight · Vue team → VitePress

## 3 · Thai search, tested for real

Thai has no spaces between words, so a search engine that splits words on spaces cannot find a word in the middle of a sentence · tested 2026-10-23 with 2 Thai pages, searching 9 words: ภาษี · กำกับ · สต็อก · สินค้า · ร้านค้า · ภาษีมูลค่าเพิ่ม · อิเล็กทรอนิกส์ · ตัดสต็อก · ทะเบียน

| Search engine (version tested) | Used in | What the docs say about Thai | Found |
|---|---|---|---|
| Pagefind 1.5.2 (builds an index, searches in the browser) | Starlight | has `th` · no stemming · the word-segmentation section mentions only Chinese, Japanese, Korean | 6/9 · missed กำกับ · ทะเบียน · ภาษีมูลค่าเพิ่ม |
| lunr 2.3.9 + lunr-languages 1.23.0 `th` (word splitting with wordcut · tested in Node, not in the theme) | MkDocs Material · plugin `@easyops-cn/docusaurus-search-local` (accepts every lunr-languages language) | Material accepts `lang: th` | 6/9 · missed ร้านค้า · ตัดสต็อก · ภาษีมูลค่าเพิ่ม |
| MiniSearch 7.2.0 defaults (prefix + fuzzy as in VitePress) | VitePress | VitePress segments with `Intl.Segmenter` only for Chinese and Japanese | 0/9 |
| MiniSearch + a `tokenize` that uses `Intl.Segmenter('th', { granularity: 'word' })` | VitePress (`options.miniSearch.options.tokenize`) | `tokenize` can be set by yourself | 9/9 (tested in Node 22 · not yet tested in a whole VitePress site) |
| Algolia DocSearch | Docusaurus · Starlight · VitePress | Algolia's language table: Thai segmentation "Not supported" | not tested |

- Results depend on the project's vocabulary → before delivery, search 20 real terms and record the results in the docs site's README.
- DocSearch is free only for technical documentation and technical blogs that are public. The site must be live and have no non-technical content.

## 4 · Hosting

| | GitHub Pages | Cloudflare |
|---|---|---|
| Price | free · a free account needs a public repo | Pages has a free plan · Workers static assets: static file requests are free and unlimited |
| Limits | site ≤ 1 GB · bandwidth 100 GB/month (soft) · build 10 times/hour (soft · builds through GitHub Actions do not count) · a deploy over 10 minutes fails | Pages free plan: 500 builds/month · 1 build at a time · max 20 minutes · 20,000 files · each file ≤ 25 MiB |
| Conditions | must not be used as free hosting for an online business or SaaS · the site is public even if the repo is private | the Pages page tells new projects to start on Workers |

A document that outsiders must not see does not go on a public site. Keep it as `docs/*.md` in the repo (how each host restricts readers has not been checked).

## 5 · Thai fonts

- Use the same fonts as the app: `Inter` + `Noto Sans Thai` (`ui-craft` → `references/tokens.md`) · other Google Fonts choices that have Thai letters and are OFL: Sarabun · IBM Plex Sans Thai · Anuphan
- Load through the Google Fonts CSS2 API with `display=swap` · the API splits out the `/* thai */` block with `unicode-range: U+0E01-0E5B …` by itself, so the browser loads only the parts the page uses (seen in the CSS the API returned 2026-10-23)
- Thai line-height is the English value plus 0.1 (`ui-craft` item 2)
- Set the font in the slot the theme exposes · the setting names and CSS variables of each theme have not been checked

## 6 · Content lives in the repo beside the code

- The docs site source lives in the code folder `<project-name>/docs/` with the generator's config file (layout A of `project-bootstrap` item 1) · code and manual change in the same pull request
- Type B projects: the handover `.docx` · ADR · runbook · BUILD-PLAN stay in `docs/` at the root · the docs site takes only what outsiders read (manual · tutorial · API reference · release notes) · the same content must never live in 2 places
- Build in Continuous Integration (CI) on every pull request and deploy on merge (`cicd-and-release`)
- An exception to the root is declared in the code folder's README (`SKILL.md` item 1)

## Sources

| Topic | URL or evidence (2026-10-23) |
|---|---|
| MkDocs Material | https://squidfunk.github.io/mkdocs-material/ (status · Zensical) · .../plugins/search/ · .../setup/changing-the-language/ · .../setup/setting-up-versioning/ |
| Docusaurus | https://docusaurus.io/docs/search · https://docusaurus.io/docs/versioning · https://docusaurus.io/docs/i18n/introduction |
| Starlight | https://starlight.astro.build/guides/site-search/ · .../guides/i18n/ · .../resources/plugins/ |
| VitePress | https://vitepress.dev/reference/default-theme-search · https://vitepress.dev/guide/i18n · https://github.com/vuejs/vitepress/issues/109 |
| Pagefind | https://pagefind.app/docs/multilingual/ |
| lunr-languages | https://github.com/MihaiValentin/lunr-languages (file `lunr.th.js` uses wordcut) |
| MiniSearch | https://lucaong.github.io/minisearch/types/MiniSearch.Options.html |
| Algolia | https://www.algolia.com/doc/guides/managing-results/optimize-search-results/handling-natural-languages-nlp/in-depth/supported-languages/ · https://docsearch.algolia.com/docs/who-can-apply/ |
| Docusaurus local-search plugin | https://github.com/easyops-cn/docusaurus-search-local |
| Versions and licence | registry.npmjs.org · pypi.org · api.github.com (Zensical: GitHub = MIT · PyPI = Alpha) |
| GitHub Pages | https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits · .../creating-a-github-pages-site |
| Cloudflare | https://developers.cloudflare.com/pages/platform/limits/ · https://developers.cloudflare.com/pages/ · https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/ |
| Google Fonts | https://developers.google.com/fonts/docs/css2 · `METADATA.pb` in https://github.com/google/fonts · real CSS from fonts.googleapis.com |
| Thai search test | Pagefind via `npx pagefind@1.5.2` + a browser · lunr and MiniSearch via Node 22 · 2 test pages, the 9 search words in item 3 |


## reference: ecosystem.md

# Ecosystem project: 1 system split into several sub-projects

Read this when a project has 2 or more sub-projects and each one has its own doc set. The short rule is in `SKILL.md` section 1.

Use it when the project is a product suite with 2 or more sub-projects, and each has its own doc set (SRS · mockup · architecture). Example: Quanton, split into CONNECT · LAB · INTEL · DESK.
**The folder must always be named `ecosystem/`.** Never use `projects/`, `modules/` or `apps/`. When someone opens the folder, they must see at once that everything inside is a piece of one system.

```
<project-name>/
├─ docs/                ecosystem-level docs — README (index) · BUILD-PLAN · project-plan · BRD · figures/
├─ ecosystem/
│  └─ <code>-<SUB>/     1 folder per sub-project, e.g. QTN-CONNECT
│     ├─ docs/          srs.md · architecture.md · decisions/ · figures/ · fsd-*.md · test-plan.md
│     ├─ mockup/
│     ├─ qa/
│     └─ <sub-name>/    code repo of this sub-project (lowercase, joined with `-`)
├─ ref/ · assets/ · _to_delete/ · .claude/   shared by the whole ecosystem (same rules as type B)
```

- Docs that cover every sub-project (BRD · project plan · BUILD-PLAN) live in one place, the root `docs/`. Never copy them into each sub-project.
- Create a sub-project folder when you start writing that sub-project's docs. Do not create folders in advance.
- Sub-project folder name = project code + sub-project name in capitals (`QTN-CONNECT`). Use the same code the docs cite.
- If a project already uses `projects/`, rename it to `ecosystem/` and fix the paths in every doc and script in the same pass.
- A project with a single product does not need `ecosystem/`. Use type B as usual.
- An add-on or sub-program of one app (browser extension · plugin · CLI · hook client · SDK) without its own doc set is not a sub-project. It stays in that app's repo under `extension/<name>/` (`project-bootstrap` item 1). Move it here only when it gets its own SRS, mockup or release cycle.


## reference: onboard.md

<!-- merged from skill `onboard` on 2026-11-27 · description was: Use when a new team member needs onboarding docs (30/60/90-day guide) via technical-writer. -->
Use the `technical-writer` agent to create an onboarding guide for: **the user's request**

The technical writer should:

1. **Initial Discovery** — gather:
   - Role + level (junior, senior, lead)
   - Team they're joining
   - Tech stack they'll work with
   - Existing onboarding materials
   - Common confusion points from past onboards

2. **Apply Diátaxis framework** — onboarding has 4 parts:
   - **Tutorial** — first day setup + first task
   - **How-To** — common dev workflows (pull request (PR), deploy, test)
   - **Reference** — links to systems, who-owns-what
   - **Explanation** — architecture overview, history

3. **Structure as 30/60/90 day plan:**

   **Day 1-7: Setup & Orientation**
   - Environment setup checklist
   - Setup check before hand-over: run every setup command in the README on a clean checkout (fresh clone or a `infra-and-deploy` container), note the first step that fails, and fix the README — the guide must not paper over a broken README (แนวคิดจาก borghei codebase-onboarding · เขียนใหม่)
   - Tool access (Slack, GitHub, Amazon Web Services (AWS), etc.) — put the link to where access is requested; never put passwords or tokens in the document
   - Key people to meet (intros)
   - Codebase tour (key directories)
   - First small task (warm-up)

   **Day 8-30: Foundation**
   - Architecture overview
   - Domain knowledge basics
   - First real feature/bug fix
   - Pair programming sessions
   - Code review participation

   **Day 31-60: Contribution**
   - Independent feature delivery
   - On-call shadowing (if applicable)
   - Participate in planning meetings
   - Start mentoring suggestions

   **Day 61-90: Full Productivity**
   - Lead small initiatives
   - Contribute to design discussions
   - Improve team processes
   - Performance check-in

4. **Include practical sections:**

   **Quick Reference Card:**
   - Critical commands
   - Important Slack channels
   - On-call info / escalation (channel names and the on-call schedule; no passwords or tokens — link to where access is requested instead)
   - Where to find docs
   - Who to ask about X

   **Codebase Tour:**
   - Repository structure
   - Build / test / deploy commands
   - Branching strategy
   - Code style + linting

   **Team Norms:**
   - Meeting cadence
   - Communication channels (Slack vs email vs sync)
   - PR review expectations
   - Working hours / time zones

5. **Produce polished onboarding doc** using `design-gate/polished-document-style` skill:
   - Welcome message
   - 30/60/90 timeline (a timeline figure in the house style of the skill `diagrams` — project documents must not use default Mermaid · Mermaid is allowed only for a rough sketch in chat or a short README note)
   - Checklist per phase
   - Frequently Asked Questions (FAQ) section
   - Glossary of company terms

6. **Hand-off suggestions:**
   - Architecture deep dive → `solution-architect`
   - Security training → `security-engineer`
   - Domain training → `business-analyst`
   - Buddy system pairing → `project-manager`


## reference: project-doc-set.md

<!-- merged from skill `project-doc-set` on 2026-11-27 · description was: Use when choosing a project doc set or open-items Excel -->
# Project doc set

## Contents

- [When to use this skill](#when-to-use-this-skill)
- [When **not** to use it](#when-not-to-use-it)
- [1 · Docs inside or outside the repo](#1--docs-inside-or-outside-the-repo)
- [2 · Choose the doc set by project size](#2--choose-the-doc-set-by-project-size)
- [3 · Writing order](#3--writing-order)
- [4 · Who writes which doc, with which skill](#4--who-writes-which-doc-with-which-skill)
- [5 · Figures in docs: choose correctly from the start](#5--figures-in-docs-choose-correctly-from-the-start)
- [6 · Colour theme of the doc set](#6--colour-theme-of-the-doc-set)
- [7 · Checklist before delivering the doc set](#7--checklist-before-delivering-the-doc-set)
- [8 · Anti-patterns](#8--anti-patterns)
- [10 · Links to other skills](#10--links-to-other-skills)

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
| Making document pages look good | `document-design` |

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

**SuperUser files** (`.claude/superuser/` · `docs/BRIEF.md` · `AGENTS.md`/`GEMINI.md`): the single source is [`superuser/references/team-files.md`](../../superuser/references/team-files.md).

**ADRs and runbooks live in the root `docs/`, not in `<project-name>/docs/`.** Type A moves the whole `docs/` into the code folder, with the same inner layout. Paths: `docs/decisions/ADR-NNNN-<slug>.md` · `docs/runbook-<topic>.md`. This section is the only place that defines this.

**Root exceptions:** `.sandbox/` may sit at the root when you use `infra-and-deploy` · `AGENTS.md` / `GEMINI.md` under the conditions above. Declare every exception in the README of the code folder.

**Create folders when real content exists, not in advance:** `ref/` when you get files from the client or the old system (never mix them into `docs/`) · `docs/figures/` when a delivered doc has a self-drawn figure (otherwise the figure is stuck inside the `.docx` and cannot be edited) · `docs/decisions/` when a decision needs explaining later · `docs/research/` when the user wants an app like an existing one · `qa/` when test cases exist (test cases always live here; `docs/test-plan.md` holds only the plan) · `assets/` when there is a logo or icon.

**Ecosystem project** (2 or more sub-projects, each with its own doc set): the folder is always named `ecosystem/` (never `projects/` `modules/` `apps/`). `ecosystem/<code>-<SUB>/` holds `docs/` `mockup/` `qa/` and its own repo. Docs that cover all sub-projects live in one place, the root `docs/`. Full layout and rules: [`ecosystem.md`](ecosystem.md). An add-on or sub-program of one app (browser extension · plugin · CLI · hook client · SDK) with no doc set of its own is not a sub-project: it lives in the code repo under `<project-name>/extension/<name>/` (`project-bootstrap` item 1).


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

All markdown. They **depend on what the project contains**, not on project size. Full table (file · question answered): [`technical-docs.md`](technical-docs.md).

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

**Technical track.** Write when you reach the point of need. No need to wait for anyone: README · BUILD-PLAN before the first line of code · DATA-DICTIONARY when designing the first table · API-SPEC at the first endpoint · PROMPT-LIBRARY at the first prompt really used · ADR at decision time (not in the final wrap-up, because the real reasons are gone by then) · Runbook before going live. Full table in [`technical-docs.md`](technical-docs.md).

---

## 4 · Who writes which doc, with which skill

Full table (agent · skill for each of 16 doc types): [`technical-docs.md`](technical-docs.md). Main ones: SRS → `requirements-writing` · FSD → `requirements-writing` · ADR → `architecture` · Test → `qa-docs` · mockup → `ui-craft` · README → `project-bootstrap`

---

## 5 · Figures in docs: choose correctly from the start

- Figures in every kind of project doc (BRD · SRS · FSD · ADR · ER · flowcharts) · slides · print work → `diagrams` (one house style). Keep them in `docs/figures/` with sources in `src/`. **Default Mermaid is banned from project docs.**
- Quick figures in a README · PR · code notes → Mermaid (`diagrams`) embedded in `.md` (colours are random and meaningless, Thai overflows the boxes, and shrunk to A4 it is unreadable).

**Every figure header needs all 6 items:** project logo · title · 1-line subtitle · figure number · version and date · owner (details in `diagrams` → `references/diagram-figures.md` section 3).

---

## 6 · Colour theme of the doc set

Declare it once per project, at the top of every doc's source file:

```markdown
<!-- doc-theme: accent=#2A78D6 -->
```

(The example uses the house colour `#2A78D6`. Replace it with the project's main colour.)

`document-design` · `slide-deck` · `diagrams`
read this value instead of picking colours themselves, so docs, slides and every figure form one set.

**Colour comes from the work, not from taste.** If there is a brand colour, use it. If not, use the house colour of `document-design`, write `(รอยืนยัน)`, and carry on without stopping to ask.
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

**Read more when needed:** [`writer-templates.md`](writer-templates.md): `technical-writer` doc templates (tutorial · API reference · release notes · for README see `project-bootstrap`)

**When the guide must go on the web, be searchable and have many versions:** [`docs-site.md`](docs-site.md): choosing MkDocs Material · Docusaurus · Starlight · VitePress · Thai search test results · hosting · Thai fonts


## reference: release-notes.md

<!-- merged from skill `release-notes` on 2026-11-27 · description was: Write user-facing release notes for a version with the technical-writer agent. -->
Use the `technical-writer` agent to create release notes for: **the user's request**

The technical writer should:

1. **Initial Discovery** — gather (unknown → `(รอยืนยัน)`, keep going):
   - Audience (end users, developers, both?)
   - Tone (formal, friendly, technical)
   - Channel (in-app, email, blog, GitHub)
   - Time period covered (date range or version range)

2. **Gather inputs** — source is the commits since the last tag (written per `git-and-review`) plus `CHANGELOG.md`:
   - Commit log since last release (`git log`)
   - Merged pull requests (PRs) with their descriptions
   - Closed issues/tickets
   - Breaking changes noted

3. **Categorize changes:**
   - New features (user-visible)
   - Improvements (existing features enhanced)
   - Bug fixes (with severity context)
   - Breaking changes — every one carries 3 fields: **what changed** · **who is affected** (which users, integrations or versions) · **how to migrate** (steps or link); a field unknown → `(รอยืนยัน)`, never a one-line "X removed"
   - Security updates (Common Vulnerabilities and Exposures (CVE) entries patched)
   - Documentation updates (if significant)

4. **Translate dev-speak to user value:**
   - ผิด: "Refactored auth middleware"
   - ถูก: "Login is now 40% faster" — only with a measured number (before/after, how measured); no measurement → describe the change without a number
   - ผิด: "Fixed null pointer in cart.ts:127"
   - ถูก: "Fixed crash when removing the last item from cart"

   **Thai text:** use the news register (`human-writing` `thai-grammar.md` section 4). No first person. Write each line as subject + verb + object ("ส่งออกรายงานเป็น CSV ได้แล้ว"). End with the version number and the date.
   - ผิด: "ได้มีการปรับปรุงประสิทธิภาพในส่วนของการส่งออก ซึ่งทำให้ผู้ใช้ได้รับประสบการณ์ที่ดีขึ้น"
   - ถูก: "ส่งออกรายงาน 1,000 แถวใช้เวลา 3 วินาที จาก 12 วินาที"
   - ผิด: "เราได้แก้ไขข้อผิดพลาดที่เกิดขึ้นเมื่อผู้ใช้ทำการลบสินค้าชิ้นสุดท้าย"
   - ถูก: "ลบสินค้าชิ้นสุดท้ายในตะกร้าแล้วแอปไม่ปิดตัวเองอีก"

5. **Produce release notes** following the release-notes template in `project-docs/references/writer-templates.md`:
   - Too long; didn't read (TL;DR) highlights at top
   - Feature sections with examples
   - Migration guide for breaking changes
   - Contributors acknowledgment

6. **Generate accompanying communications** (if requested):
   - X / social post draft
   - Email announcement
   - Changelog entry (technical, separate)

7. **Hand-off suggestions:**
   - Marketing copy → `growth-specialist`
   - User docs updates → technical-writer (continue)
   - Migration code examples → `developer`


## reference: technical-docs.md

# Technical docs: table, writing order and who writes what

Read this when choosing the technical doc set or about to write one of them. The summary is in `SKILL.md` sections 2.2–4.

## Technical docs (section 2.2)

This group is **all markdown** and **does not depend on project size**. It depends on what the project contains.

| Doc | File | Answers the question | Needed when |
|---|---|---|---|
| README | `<project-name>/README.md` | How to install and run | **Always** |
| BUILD-PLAN | `docs/BUILD-PLAN.md` | What to build first and next · where we are now | **Always** |
| USER-STORIES | `docs/USER-STORIES.md` | What to build for whom · which story is ready for a sprint · what the AC (acceptance criteria) are | Work runs in sprints or there is a backlog (`requirements-writing`) |
| Sprint plan | `docs/sprints/sprint-NN.md` | Which stories this sprint takes · what the goal is · what the risks are | Work runs in sprints (`/sprint-plan`). One file per sprint; never overwrite old ones |
| AGENT-LOOP | `docs/AGENT-LOOP.md` | How the agent works in a cycle · what the stop condition is | An agent writes code in rounds (`spec-to-code-loop`) |
| API-SPEC | `docs/API-SPEC.md` | What each endpoint accepts, returns and how it fails | There is an API that others call (`api-design`) |
| DATA-DICTIONARY | `docs/DATA-DICTIONARY.md` | What a field means · what values it can take | There is a database or data schema (`database-design`) |
| EVALUATION-POLICY | `docs/EVALUATION-POLICY.md` | What measures whether the output is good enough · what the pass threshold is | Output comes from a model or LLM that is not always right |
| PROMPT-LIBRARY | `docs/PROMPT-LIBRARY.md` | Which prompt is the real one · which version · what changed | An LLM sits on the system's main path |
| ADR | `docs/decisions/ADR-*.md` | Why we chose this way and not the other | A decision will be questioned again (`architecture`) |
| Runbook | `docs/runbook-<topic>.md`, one topic per file | What to do when the system goes down at 2 a.m. | A system is really running and someone is on call |

> **The 4 conditional docs (LLM · API · database) are the ones people forget most often.**
> The team then ends up asking the agent every round "which prompt is the real one" or "what does this field mean".

## Technical track: when to write (section 3)

| Write when | Doc |
|---|---|
| Before the first line of code | README · BUILD-PLAN |
| Before letting an agent work in rounds | AGENT-LOOP |
| When designing the first table | DATA-DICTIONARY |
| When designing the first endpoint | API-SPEC |
| When writing the first prompt that will really be used | PROMPT-LIBRARY · EVALUATION-POLICY |
| When deciding something that will be questioned again | ADR |
| Before going live | Runbook |

> **Write the ADR and DATA-DICTIONARY at decision time, not in the project wrap-up.**
> You can write them afterwards, but the real reasons are gone by then.

## Who writes which doc, with which skill (section 4)

| Doc | agent | skill used |
|---|---|---|
| README · CHANGELOG | `technical-writer` | `project-bootstrap` |
| Project Plan | `project-manager` | `document-design` |
| BRD · user story | `business-analyst` | `requirements-writing` |
| SRS | `system-analyst` | `requirements-writing` |
| FSD | `system-analyst` | `requirements-writing` |
| Architecture | `solution-architect` | `architecture` · `diagrams` |
| ADR | `solution-architect` | `architecture` |
| Test Plan · Test Cases | `qa-tester` | `qa-docs` |
| mockups | `ux-designer` | `ui-craft` |
| User guide (`MAN`) | `technical-writer` | `design-gate/polished-document-style` |
| Runbook | `devops-engineer` | `incidents-and-monitoring` |
| BUILD-PLAN | `project-manager` | `superuser:ground-rules` |
| AGENT-LOOP | `developer` | `spec-to-code-loop` |
| API-SPEC | `system-analyst` | `api-design` |
| DATA-DICTIONARY | `system-analyst` | `database-design` |
| PROMPT-LIBRARY · EVALUATION-POLICY | `developer` | none (pairs with skill `ai-engineering`) |


## reference: writer-templates.md

# technical-writer templates — README · tutorial · API reference · release notes

**Contents:** README · Tutorial Template · API Reference Template · Release Notes Template

Open when you actually have to write this kind of document · put `(รอยืนยัน)` (to be confirmed) on any part you do not know.

## Standard Outputs

### README

There is no README template here — use the single template of `project-bootstrap` (`SKILL.md` item 2 and `assets/starter-files.md`). The 15-section skeleton (9 always present · 6 present when the project has that thing) is in `references/readme-skeleton.md` · commands per language are in `references/readme-by-stack.md`.

### Tutorial Template

````markdown
# Tutorial: Build Your First X in 10 Minutes

> **What you'll learn:** by the end, you'll have built Y and understand Z.

## What You'll Need

- Node.js 22+ (Node 18 หมดอายุ 30 เม.ย. 2568, Node 20 หมด 30 เม.ย. 2569 — endoflife.date ตรวจ 22 ต.ค. 2569)
- A free account at example.com
- 10 minutes

## Step 1: Set Up

Run:
```bash
npx create-thing my-project
cd my-project
```

> **What just happened?** Brief explanation.

You should see:
```
✓ Project created
```

## Step 2: Configure

...

## Step 3: Run It

...

## Congratulations!

You've built X. Try these next:

- [Add feature A](#how-to-add-a) (how-to)
- [Understand B](#concept-b) (explanation)
- [Full API](#reference) (reference)
````

### API Reference Template (per endpoint)

````markdown
## POST `/api/v1/resource`

Create a new resource.

### Authentication

Required. Bearer token in `Authorization` header.

### Request

```http
POST /api/v1/resource HTTP/1.1
Content-Type: application/json
Authorization: Bearer <token>

{
  "name": "string (required)",
  "tags": ["string (optional)"]
}
```

### Parameters

| Field | Type | Required | Description |
|-------|------|:--------:|-------------|
| `name` | string | ✓ | Display name, 1-100 chars |
| `tags` | string[] | ✗ | Up to 10 tags |

### Response: 201 Created

```json
{
  "id": "res_abc123",
  "name": "...",
  "created_at": "2025-01-15T10:30:00Z"
}
```

### Errors

| Code | When |
|:----:|------|
| 400 | Validation failed (see body) |
| 401 | Missing/invalid token |
| 429 | Rate limit (60 req/min) |

### Code Examples

```typescript
const res = await fetch('/api/v1/resource', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ name: 'My Resource' })
});
```
````

### Release Notes Template

> Breaking Changes must always come before the other sections (right after Highlights) — the full release notes rules are in the skill `release-notes.md`.

````markdown
# Release v2.1.0 — YYYY-MM-DD

## Highlights

> The TL;DR for busy readers.

- **New:** X feature — try it: `command`
- **Improved:** Y is faster — <measured number only, e.g. p95 login 1.2 s → 0.7 s; drop the number if not measured>
- **Fixed:** Z bug affecting users on platform A

## Breaking Changes

### `api.oldMethod()` removed

**Before:**
```typescript
api.oldMethod(arg)
```

**After:**
```typescript
api.newMethod({ arg })
```

[Migration guide](#)

## New Features

### Feature Name

Description with user-facing benefit.

```bash
# Example usage
command --new-flag
```

[Read the docs](#)

## Improvements

- Faster initial load time
- Better error messages for X

## Bug Fixes

- Fix issue where ... ([#1234](#))
- Resolve crash when ... ([#5678](#))

## Contributors

Thanks to: @alice, @bob, @charlie
````

### Release Notes Template (Thai)

> Same structure as the English version · wording at news register (`human-writing` `references/thai-grammar.md` section 4): no first person · each line has subject + verb + object · numbers must be measured, and if there are none, leave them out · right/wrong examples are in the skill `release-notes.md` item 4.

````markdown
# เวอร์ชัน 2.1.0 — YYYY-MM-DD

## สรุป

- **ใหม่:** ส่งออกรายงานเป็น CSV ได้แล้ว — เมนู รายงาน → ส่งออก
- **เร็วขึ้น:** ส่งออกรายงาน 1,000 แถวใช้เวลา 3 วินาที จาก 12 วินาที
- **แก้แล้ว:** ลบสินค้าชิ้นสุดท้ายในตะกร้าแล้วแอปไม่ปิดตัวเองอีก

## สิ่งที่ต้องแก้ก่อนอัปเดต

### `api.oldMethod()` ถูกถอดออก

**เดิม:** `api.oldMethod(arg)` · **ใหม่:** `api.newMethod({ arg })` · [วิธีย้าย](#)

## ฟีเจอร์ใหม่

### ชื่อฟีเจอร์

ผู้ใช้ทำอะไรได้ 1 ประโยค แล้วตามด้วยตัวอย่างคำสั่งหรือภาพหน้าจอ

## ปรับปรุง

- หน้าแรกโหลดเสร็จใน 1.2 วินาที จาก 2.8 วินาที
- ข้อความแจ้งเตือนตอนอัปโหลดไฟล์ผิดชนิด บอกชนิดที่รับได้แล้ว

## แก้บั๊ก

- ยอดรวมในใบเสนอราคาไม่เพี้ยนเมื่อมีส่วนลดเป็นเปอร์เซ็นต์ ([#1234](#))

## ผู้ร่วมพัฒนา

ขอบคุณ @alice @bob @charlie

เวอร์ชัน 2.1.0 · ออก YYYY-MM-DD
````


---

# skill: product-naming

Use when naming a product, shop, app or brand

# Naming a product

> **The one rule:** a good name is one a person **types correctly the first time, after hearing it once.**
> Deeper meaning can come later, but if people misspell the name, customers cannot find you.

## When to use this skill

- Naming a product, shop, service, app, brand, module or internal project
- A name exists but feels dated, long or the same as someone else's
- There are several products and the names should form one family
- You must choose from a brainstormed list of names and cannot decide

Not for: logo, colours, brand typography → `graphic-design:design-by-type` · naming document files → `workspace-rules/document-naming` · naming tables and columns → `database-design` · naming endpoints → `api-design`

---

## 1 · Six tests that cut a name at once

Test before you think further. If a name fails any one, cut it. Do not feel sorry.

| # | Test | Fails when |
|:--:|---|---|
| 1 | **Phone test**: say the name to someone over the phone. Do they type it correctly? | You have to spell it out |
| 2 | **Length** | More than 3 syllables, or more than 12 letters |
| 3 | **Domain and handle** | `.com` and `.co` are both taken and no social handle is free anywhere |
| 4 | **Collision with what exists** | A product, shop or service in the same category has the same or a very close name |
| 5 | **Meaning in other languages** | It means something bad in a language your customers speak |
| 6 | **Thai speakers can pronounce it** | It has a consonant cluster Thai speakers avoid, or ends in a sound that gets swallowed |

**Also cut:** a number in the name (`App360` · `Pro24` go stale when the version changes) · 3 or more words (nobody says the whole thing, so it gets shortened until it cannot be recognised).

> **People often forget test 6.** If the name has `th`, `v` or `z` at the end of a word, or a cluster like `str-` or `spl-`,
> Thai speakers will pronounce it off and type what they heard.

---

## 2 · Nine formulas for producing names

Do not sit and think in the air. Walk through the formulas one at a time, come up with 5–10 names per formula, then select.

| # | Formula | Method | Example |
|:--:|---|---|---|
| 1 | **Real word, cut the end** | Take an English word and drop the last syllable | `figure` → **Figma** · `velocity` → **Velo** |
| 2 | **2 words collided** | Cut the head and tail of 2 words and join them | `fold`+`drop` → **Foldrop** · `data`+`dog` → **Datadog** |
| 3 | **Word + suffix** | Add `-io` `-ly` `-ify` `-o` `-a` `-ex` | `home`+`ify` → **Homify** · `aurum`+`io` → **Aurio** |
| 4 | **Latin/Greek root** | Find the root word for what it does, then shorten it | `lumen` → **Lumo** · `nexus` → **Nexa** |
| 5 | **Family letters** | A word for the function + a family ending | **TradeXI · TelXI · DockXI · SoundXI** |
| 6 | **Short meaningless word** | 4–5 letters, consonant-vowel-consonant, readable at once | **Quix · Zeno · Riva · Volt** |
| 7 | **Real word borrowed across contexts** | An ordinary word unrelated to the work that gives the right feeling | **Slack · Notion · Arc · Linear** |
| 8 | **2 syllables that read smoothly** | 2 short real words side by side | **Speak Go · Cash App** |
| 9 | **2 whole unrelated words** | Join 2 real words that relate neither to the product nor to each other into one word | **Tailscale · Snowflake · Firebase · Basecamp** |

**The formulas that give the most "cool + clean" names** are 1 · 4 · 6, because they give short names with no literal meaning that are easy to remember.
**Formula 7 gives names that look grown-up**, but its domains are the hardest to find.

**Letters that feel modern:** start with `x` `z` `q` `v`, or end with `-o` `-a` `-ix` `-ex`.
**Letters that look dated:** ending with `-soft` `-tech` `-sys` `-pro` `-plus` `-max`.

---

**Formula 9 in depth:** take 2 whole real words (cut nothing) that relate neither to the product nor to each other, and put them side by side · at most 3 syllables in total · the first word concrete · read every pair aloud before choosing → reasons, rules and the A/B word pools for pairing are in [`references/formula-9-deep-dive.md`](references/formula-9-deep-dive.md). Open it when you use formula 9.

## 3 · Giving the name a meaning

A short, modern name does not have to be meaningless, because meaning can arrive 2 ways.

| Way | Formulas that give it | Example |
|---|---|---|
| **Built in from birth** | 4 Latin/Greek roots · 7 real words borrowed across contexts | `Aurio` from *aurum*, gold · `Anchor`, stability |
| **Added later** | 6 short meaningless words | `Quix` is chosen first, then tied to speed |

**Rule for meaning:** find the root from **what the user gets**, not from what the system does.
For example, for a gold inventory system, use the root "gold", not the root "warehouse".

**Test:** can you write the meaning in **1 line**?
"Aurio: from Latin aurum, meaning gold." That is all. If it takes more than 1 sentence to explain, the meaning is too weak.

**Thinking libraries:** a table of Latin/Greek roots that work in practice (light · gold · connect · time · protect and others) and a table of real words borrowed across contexts, grouped by feeling (fast · stable · clear · orderly · connected · guiding · quiet) → [`references/meaning-libraries.md`](references/meaning-libraries.md). Open it when you use formula 4 or 7. Real words are the hardest to find domains for, so keep a fallback (`arc.app` · `getprism.com`).

**The story:** short, memorable, easy to retell (not a chain of initials, and not the family dog's name) → good and bad examples in `references/meaning-libraries.md`

**Write the meaning into the brand document** on the day you pick the name, not when someone asks.
That way the sales team tells it the same way every time.

---

## 4 · Name families, when there are several products

Pick one pattern and use it for the whole family.

| Pattern | Looks like | Good | Bad |
|---|---|---|---|
| **Same ending** | `TradeXI` `TelXI` `DockXI` | You know at once they share a house, and new names are easy to make | If one name is damaged, the whole family suffers |
| **Same prefix** | `QuixChat` `QuixFlow` | The parent brand stands out | Every name gets longer |
| **Independent** | `Aurio` `Homify` `Foldrop` | Each one sells itself and can be sold separately | You must build a new brand for each |

**How to choose:** if you sell them as a bundle, use one family. If you might sell them separately or sell the business later, make them independent.

> **Write the family's naming rules down in a document**, together with the rule for naming the next one.
> Otherwise the 5th name breaks the pattern and the whole set looks messy.

---

## 5 · Check what is available before you fall in love

**Check when 5 names are left, not when 1 is left.** If you love a name and then learn you cannot use it, it hurts more.

| Check what | Where | Fails when |
|---|---|---|
| Domain | Domain registrar | `.com` and `.co` are taken and no fallback is left |
| Thai trademark | กรมทรัพย์สินทางปัญญา (Department of Intellectual Property) | A registration exists in our goods or services category |
| International trademark | WIPO database | Same as above, if you will sell abroad |
| Package name (if software) | npm · PyPI · NuGet | Already used in the ecosystem you will publish to |
| App store name (if an app) | App Store · Play Store | An app with the same name exists in the same category |
| Social handles | X · Instagram · Facebook · TikTok · GitHub · LINE | None is free |
| Plain search | Search engine | The first page is full of other people's results |

**Decision rule:** you must get the main domain, at least half the handles must be free, and
there must be no trademark collision in our category. These 3 have no exceptions.

---

## 6 · Sound and typing in the Thai context

| Topic | Rule |
|---|---|
| Thai customers will certainly write the name in Thai | Try writing it yourself first, for example `Aurio` as "ออริโอ", and see if it reads smoothly |
| Choose 1 official Thai form | Follow the transliteration rules of the Royal Society of Thailand (ราชบัณฑิตยสภา) with no tone marks (ซอฟต์แวร์, not ซ้อฟต์แว่ร์) · record it in the brand kit · keep other forms that customers actually type as search keywords, not for the work itself |
| Sounds Thai speakers swallow | `-th` `-v` `-s` at the end of a word vanish almost every time |
| Clusters they avoid | `str-` `spl-` `thr-` |
| Names easy to mistype on a Thai keyboard | Avoid letters so close together that they can swap |
| Length when written in Thai | No more than 5 Thai syllables |

**Real test:** say the name to 3 Thai speakers over the phone and have them type it in LINE and send it back.
If even 1 person types it differently, the name fails.

---

## 7 · Five tests before the final decision

| # | Test | Passes when |
|:--:|---|---|
| 1 | Write it in a real sentence | "ลองใช้ ___ ดูสิ" (Thai for "try ___") sounds natural |
| 2 | Write it next to the category word | "___ — ระบบจัดการคลังทอง" (Thai for "___, a gold inventory system") reads and makes sense |
| 3 | Shrink it to an icon | The first letter or 2 can become a symbol |
| 4 | Survives when the scope grows | A name with the word "gold" breaks the day you also sell silver |
| 5 | Resists teasing | Try making up jokes about your own name. If they come too easily, beware |

**Test 4 matters most for anything that will keep growing.** A meaningless name is safer in the long run.

## Related skills

Logo, colours, typography → `graphic-design:design-by-type` · same product already exists under this name → `research-with-sources/prior-art-review` · names in documents → `workspace-rules/document-naming` · feature terms inside the product → `i18n-and-locale` · presenting the shortlist → `slide-deck`. A shortlist table you can fill in right away → `assets/name-shortlist.md`


## reference: formula-9-deep-dive.md

# Formula 9 in depth

Open this when you generate names with formula 9.

## The pattern that makes a name look coolest without inventing a word

`Tailscale` = *tail* + *scale*. Neither word has anything to do with private networks, and the two words have nothing to do with each other either.

| How it differs from formula 2 | |
|---|---|
| Formula 2 | **Cuts** syllables before joining, such as `fold`+`drop` → Foldrop, so the result is not a real word |
| Formula 9 | **Cuts nothing.** Put 2 whole real words side by side |

**Why it works**

| Reason | |
|---|---|
| Easy to remember | The listener already knows both words, so there is no new spelling to learn |
| Unique | Nothing forces these words together, so nobody has paired them before |
| Domains are easier to find | Usually easier than a single word, but still check them as in section 5 of `SKILL.md` |
| Passes the phone test | The listener types it correctly at once, because the words are familiar |

**Rules for this formula**

- Total of at most **3 syllables**: `Tailscale` 2 · `Basecamp` 2 · `Snowflake` 2
- **The first word should be concrete**, something you can picture (tail, snow, fire, base, bit, black, cloud)
- Do not let the pair describe the product. If it explains the product, it becomes a dated name like `DataSync`
- **The combined meaning must not come out odd.** Read it aloud and picture it first
- Spellings must not collide into something hard to read. Avoid a first word that ends with the same letter the second word starts with

**How to generate** — build 2 separate pools, then pair at random and read every pair aloud

| Pool A: concrete | Pool B: structure/measure |
|---|---|
| tail · snow · fire · bit · black · cloud · iron · salt · moon · north · glass · pine | scale · flake · base · bucket · camp · bird · flare · stack · frame · gate · port · line |

Example pairs: `Saltframe` · `Pinegate` · `Moonstack` · `Ironport` · `Glassline`

> **Meaning can be added fully afterward** (see item 3). `Tailscale` had no meaning at the start,
> but after some use, people tied it to the idea of a network that can scale.


## reference: meaning-libraries.md

# Libraries for developing a name's meaning

Contents: Latin/Greek root library → real words borrowed across contexts → good and bad stories

## Latin/Greek roots that work in practice

| Meaning | Root | Resulting names |
|---|---|---|
| light · clarity | *lux · lumen* | Lumo · Lumen · Lucent |
| gold · valuable | *aurum* | Aurio · Aura |
| connect | *nexus · syn-* | Nexa · Syno · Nexo |
| power · electricity | *volta · vis* | Volta · Vira |
| circle · world | *orbis · kyklos* | Orbis · Kyklo |
| time · rhythm | *tempus · chronos · kairos* | Tempo · Chrono · Kairo |
| flow · move | *fluxus · kinesis* | Flux · Kinet |
| sound | *sonus · vox* | Sona · Voxa |
| store · chest | *arca* | Arca · Arka |
| protect · shield | *aegis · scutum* | Aegis · Scuto |
| care · look after | *cura* | Cura · Curo |
| beginning | *arche* | Arka · Archo |
| form | *morphe* | Morpho · Forma |
| word · language | *lexis · verbum* | Lexi · Verba |
| look · inspect | *specto* | Specta · Scopo |
| new | *nova* | Nova · Novo |
| true | *veritas* | Vera · Verio |
| work · output | *opus* | Opus · Opero |
| port · door | *portus · porta* | Porta · Portio |

## Real words borrowed across contexts, grouped by feeling

| Feeling | Words |
|---|---|
| fast · agile | Arc · Bolt · Dash · Swift · Rush · Skim |
| stable · safe | Anchor · Vault · Keel · Bastion · Forge · Bedrock |
| clear · visible | Prism · Lens · Beacon · Signal · Facet |
| orderly | Grid · Frame · Ledger · Atlas · Index · Stack |
| connected | Bridge · Relay · Mesh · Loom · Thread · Weave |
| guiding | Compass · Pilot · Helm · North · Trail |
| quiet · smooth | Slate · Quill · Linen · Drift · Still |

> Warning: **real words are the hardest to find domains for**, so prepare a fallback, such as adding a category word (`arc.app`, `getprism.com`)
> or using another short domain style.

## Good and bad stories

| | Example |
|---|---|
| ✓ Good | "Aegis is the shield of Zeus. This system exists to protect." Short, memorable, easy to retell |
| ✗ Bad | "A stands for Advanced, U for Unified, R for Realtime…" Nobody remembers it |
| ✗ Bad | "The name comes from the family dog's name." A personal meaning, so customers feel nothing |
