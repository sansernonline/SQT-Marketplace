# skill: markdown-visuals

Use when a Markdown doc needs an image, SVG or ASCII art

# Markdown Visuals

> **Pre-work gate (every time):** read the owner's theme → search live references → 3 genuinely different directions → run the `no-ai-look` check before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search finds the structure of this piece) · close the work with a `ด่านก่อนลงมือ:` line

> **Language:** write every line of wording per `human-writing`. This skill gives the format and structure; human-writing gives the way to write so people understand.

> **Scope:** this skill decides *how a picture goes into a markdown file* (inline SVG · image file · ASCII · Mermaid) and how to embed it. What a diagram should show lives in `software-diagrams` (plugin `software-development`) (Mermaid in the house theme) and `diagram-figures` (designed figures). Document formatting around the picture lives in `polished-document-style`.

> **Rule:** Every plan, process, design, spec, or architecture doc must show — not just tell. If you wrote "the button sits top-right," you owe the reader a picture.

## When to use this skill

- A picture *inside a markdown file* — sketch, flow or state in a business plan, report, process guide, spec or README
- Writing a plan, Functional Specification Document (FSD), Business Requirements Document (BRD), Architecture Decision Record (ADR) or architecture doc that describes layout, flow, or relationships (the diagrams themselves follow the routing rule below)
- Explaining state transitions, user journeys, or system interactions
- Comparing 2+ visual options for the user
- The user asked "show me how it looks" inside a markdown doc or chat reply

**If the doc has zero visuals and is about anything visual or structural — stop and add one.**

## When NOT to use

| Task | Use instead |
|---|---|
| "Make a mockup" — clickable HTML screens in `mockup/<CODE>-mockup.html` | `ui-craft` + platform skill (`web-app-design` · `windows-app-design` · `mobile-app-design`) (plugin `software-development`) |
| Chart colours and chart design in an app or dashboard | `web-app-design` (plugin `software-development`) → `references/tokens.md` "สีข้อมูล (กราฟ)" |
| Designed figure for a proposal, slide or print | `diagram-figures` |

## Decision tree: which format?

```
What are you showing?
│
├─ UI sketch in a doc / component state / icon → Inline SVG (doc read on GitHub → same SVG as a `.svg` file, §2)
├─ Layout sketch / box diagram / state map  →  ASCII art (boxes & arrows)
├─ Flow / process / money flow / decision   →  repo note (README · Pull Request (PR) · code note) → Mermaid (`software-diagrams`, plugin `software-development`)
│                                              project document (BRD · Software Requirements Specification (SRS) · FSD · ADR) or read outside the team → `diagram-figures`
├─ Architecture / Entity-Relationship (ER) / class → same rule as the line above
├─ Designed figure (proposal, slide, print) →  diagram-figures → embed the PNG as an image file (§2)
├─ Data viz (chart, pie, quadrant)          →  Mermaid pie/quadrant OR inline SVG, colours from web-app-design (plugin `software-development`) tokens.md "สีข้อมูล (กราฟ)"
├─ Photo, screenshot, complex illustration  →  External file → ![alt](figures/x.png) (file in `docs/figures/`)
└─ Quick concept in chat reply              →  Inline SVG or ASCII (no external file)
```

**Routing rule (same in `software-diagrams` and `diagram-figures`):** markdown in a repo read by the team (README · PR · code note) → Mermaid via `software-diagrams` · a project document (BRD · SRS · FSD · ADR · ER · flows) or anything people outside the team read → `diagram-figures`.

**Follow the tree above.** Where the doc will be read decides inline SVG vs image file:

- **Inline `<svg>` renders** in VS Code preview, Obsidian, many static-site generators and chat replies.
- **Inline `<svg>` does not render on GitHub** — GitHub's sanitizer drops the `<svg>` element, so the reader sees nothing. Other hosts (GitLab, Bitbucket): preview before relying on it.
- **Doc will be read on GitHub** → save the SVG as `docs/figures/x.svg` and reference it with `![alt](figures/x.svg)` or `<img>` (§2). It still versions cleanly in git and stays editable.

## 1 · Inline SVG (for viewers that render it — not GitHub)

### Boilerplate

```markdown
<p align="center">
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 280" role="img" aria-label="<what this shows>">
  <!-- background = bg-canvas of the project palette (see สี below) -->
  <rect width="640" height="280" rx="14" fill="<bg-canvas>"/>

  <!-- content goes here -->
</svg>
</p>
```

**Required attributes:**
- `xmlns="http://www.w3.org/2000/svg"` — required when the same markup is saved as a `.svg` file (GitHub shows `.svg` files only through `![]()` / `<img>`, and only with `xmlns`)
- `viewBox` — sets the coordinate space; lets the SVG scale responsively
- `role="img"` + `aria-label` — accessibility, screen readers
- `<p align="center">` wrapper — centers in the rendered page

**Sizing:** Use `viewBox` (not width/height) so it scales. Common sizes:
- Sketch of a UI bar: `viewBox="0 0 640 200"` (wide, short)
- Component state: `viewBox="0 0 400 300"` (squarer)
- Icon / chip: `viewBox="0 0 64 64"`
- Full screen layout: `viewBox="0 0 800 500"`

### สี

If the document or project already has a colour palette, use it. If not, search for references per `design-references` (plugin `superuser`), type `document`, and take the colours from the chosen work · if live search is not possible, use the house value `#2A78D6`, mark it `(รอยืนยัน)` (awaiting confirmation), and carry on without stopping to ask (order in `diagram-figures` item 5 · colour-by-domain table [`colour-by-domain.md`](../diagram-figures/references/colour-by-domain.md)) · for role-based tokens (`bg-canvas` · `accent-primary` · `state-*` …) see [references/svg-snippets.md](references/svg-snippets.md) · and **1 document uses 1 palette**

### Reusable snippets

Window chrome, phone frame, button, card, status badge, running dot and tooltip snippets, plus the UI-state worked example, are in [references/svg-snippets.md](references/svg-snippets.md). Copy the structure and swap in the agreed colour tokens.

## 2 · External image files

Use when:
- The doc will be read on GitHub (inline `<svg>` is dropped there) — save the SVG as a file
- Photo or screenshot
- Illustration too complex to author as SVG by hand (50+ shapes)
- Reusing the same image across many docs
- Generated by a design tool (Figma export, etc.)

### Folder convention

```
docs/
  figures/
    01-hover-state.svg
    02-empty-state.png
    architecture-overview.svg
    src/                      editable sources (.mmd · .drawio · .html)
```

- Put figures in `docs/figures/` (editable sources in `docs/figures/src/`) — relative to the doc · brand files (logo, icons) live in the project-root `assets/`, not here
- Name files `<doc-section-number>-<short-slug>.<ext>` so they sort with the doc
- Prefer `.svg` over `.png` when possible (scales, smaller, diff-friendly)

### Reference syntax

```markdown
![Hover state showing magnified Projects tile](figures/01-hover-state.svg)
```

- **Alt text** describes what the image shows, for accessibility — not "screenshot.png"
- Path is **relative to the markdown file**, not absolute
- For centered + sized images, wrap in HTML:

```markdown
<p align="center">
  <img src="figures/01-hover-state.svg" alt="Hover state" width="640"/>
</p>
```

### Creating SVG files

When the visual is too big to inline (>50 lines of SVG markup), save it as a file instead. Use the `Write` tool to create the SVG file in `docs/figures/`.

## 3 · ASCII art

For quick layouts, state diagrams, and structural sketches that don't need pixel-perfect visuals. Renders identically in every viewer and in terminal/diff output.

Box-drawing characters plus worked layout sketch, state machine and curve examples are in [references/ascii-patterns.md](references/ascii-patterns.md).

Always wrap ASCII in a fenced code block (` ``` `) so spacing is preserved.

## 4 · Mermaid

**Choosing a diagram type, theme, readability rules and Thai labels is covered in `software-diagrams` (plugin `software-development`) items 1–5 and `assets/mermaid-theme.md`** · for Mermaid in project documents that must be converted to a picture for Word, use the converter in `diagram-figures` → `references/engine-mermaid.md`
This file only says *when to choose Mermaid over other formats*

| Choose Mermaid when | Choose something else when |
|---|---|
| It is boxes and arrows that the engine can lay out | If you must control placement yourself, use inline SVG; for a figure that must look designed, use `diagram-figures` (HTML layout or engine-svg-python) and embed it as an image file |
| It lives in a file that must be diffed in git | It is a real screenshot: use an image file |
| Readers open it in GitHub or Notion | Readers open it in a Word document or slides: use an image file |

## Combining formats in one doc

A full design spec usually mixes formats (SVG mockup, reference table, ASCII sketch, Mermaid state diagram, acceptance table). The 6-part pattern is in [references/combining-formats.md](references/combining-formats.md). Don't force everything into one format.

## Accessibility checklist

For every visual:

- [ ] **Inline SVG** has `role="img"` and `aria-label="<description>"`
- [ ] **Image file** has descriptive alt text (not "image.png")
- [ ] **Mermaid** diagrams have a 1-sentence caption above or below
- [ ] **ASCII art** has a prose summary nearby — screen readers will read the characters literally
- [ ] **Colour** is not the only signal — pair red badges with `!`, green dots with a label
- [ ] **Contrast** for text in SVG ≥ 4.5:1 against its background

## Anti-patterns

- **Text-only design docs** — "the icon is in the top-right" with no picture
- **Linking to Figma / external design tools as the only source** — visuals must render in the repo
- **PNG screenshots of text** — use the text, in a code block
- **Inline `<svg>` in a doc read on GitHub** — GitHub drops it; save as `docs/figures/x.svg` and use `![alt](figures/x.svg)` · a `.svg` file without `xmlns` also fails
- **Inline SVG over 50 lines** — extract to `docs/figures/x.svg` and reference it
- **ASCII art outside a code fence** — proportional fonts will mangle alignment
- **Mermaid syntax newer than the viewer** — GitHub's Mermaid version changes; check it with a ```` ```mermaid ```` block containing `info` before using new diagram types
- **Generated images checked in without source** — commit the `.svg` source, not just the `.png` export
- **Decorative emoji as visuals** — emoji ≠ a mockup; pair them with real diagrams

## Quick-start recipe

When a markdown doc needs a design picture (clickable app screens go to the platform design skill, `mockup/<CODE>-mockup.html`):

1. **Identify what kinds of visuals are needed** (UI state? flow? architecture?)
2. **Pick the format(s)** using the decision tree above
3. **For each visual:**
   - State a one-line caption
   - Emit the SVG/Mermaid/ASCII
   - Add `role="img"` + `aria-label` (SVG) or alt text (file)
4. **Add a feature reference table** below the visuals — what each element means
5. **Cross-check accessibility checklist** before delivery

Not sure a visual will render? Preview it in the viewer the reader will use (GitHub, Notion, VS Code) before delivery.

## Related skills

- `polished-document-style` — overall doc formatting, figure captions, callout boxes
- `simplicity-first` (plugin `software-development`) — don't over-design the diagram; show what's needed
- `software-diagrams` (plugin `software-development`) — which diagram type answers which question, plus the shared Mermaid theme
- `diagram-figures` — designed figures for proposals, slides and print (HTML layouts or engine-svg-python)
- `ui-craft` (plugin `software-development`) — spacing, hierarchy and states when the picture is a screen

## ไม่ให้ดูเหมือน AI ทำ

Before sending, go through item 3 of `no-ai-look` — for HTML work, run its script · every piece must also pass eye check 3.2 (a web page adds items 10–14), because a script result of 0 items is not yet a pass · the bans in this file are specific to this work, and the full list for all media is there

## ตัวย่อ

Spell out each abbreviation in full on first use and put the short form in brackets — for example Model Context Protocol (MCP)
After that, use the short form. Details are in the skill `spell-out-abbreviations`


## reference: ascii-patterns.md

# ASCII patterns

Worked ASCII examples for markdown docs · used by [SKILL.md](../SKILL.md) §3 · always wrap ASCII in a fenced code block so spacing is preserved

## Box-drawing characters

```
┌─────┐  ┏━━━━━┓  ╭─────╮  ┌╌╌╌╌╌┐
│     │  ┃     ┃  │     │  ╎     ╎
└─────┘  ┗━━━━━┛  ╰─────╯  └╌╌╌╌╌┘
 light    heavy   rounded   dashed
```

Corners: `┌ ┐ └ ┘` ‧ `┏ ┓ ┗ ┛` ‧ `╭ ╮ ╰ ╯`
Lines:   `─ │` ‧ `━ ┃` ‧ `═ ║`
Joins:   `├ ┤ ┬ ┴ ┼`
Arrows:  `→ ← ↑ ↓ ▲ ▼ ▶ ◀ ↔ ↕ ⇒ ⇐`
Dots:    `• · ◦ ● ○ ▪ ▫`

## Common patterns

**Layout sketch:**
```
┌─────────────────────────────────────┐
│ Header        [Search]      [👤]    │
├──────────┬──────────────────────────┤
│ Sidebar  │ Main content             │
│  • Item  │                          │
│  • Item  │  ┌────────────────────┐  │
│          │  │  Primary CTA       │  │
│          │  └────────────────────┘  │
└──────────┴──────────────────────────┘
```

**State machine:**
```
┌─────────┐  hover  ┌──────────┐  click  ┌─────────┐
│  REST   │────────►│ MAGNIFIED│────────►│ LAUNCH  │
└─────────┘◄────────└──────────┘◄────────└─────────┘
            exit               done
```

**Curve / chart:**
```
scale
 ↑
1.7│         ╱╲
1.4│       ╱    ╲
1.2│     ╱        ╲
1.0│___╱            ╲___
   └──────────┬──────────→ cursor X
         tile.Center
```


## reference: combining-formats.md

# Combining formats in one doc

Used by [SKILL.md](../SKILL.md) · a full design spec usually mixes formats.

The 6-part pattern for a design spec:

```
1. Inline SVG mockup of each UI state              ← "what it looks like"
2. Feature reference table                          ← "what it does"
3. ASCII layout sketch with measurements           ← "how it's positioned"
4. Mermaid state diagram                            ← "how it transitions"
5. ASCII / inline-SVG zoom curve                    ← "the math"
6. Acceptance criteria table                        ← "how we verify"
```

Don't force everything into one format. Each format is best at something different.


## reference: svg-snippets.md

# Inline SVG snippets

Reusable building blocks for inline SVG pictures of a screen inside .md docs (the real mockup is HTML) · used by [SKILL.md](../SKILL.md) §1

## Colour: it comes from the subject, not from a ready-made table

If the document or project already has a colour set, use that set.
If not, use the house value `#2A78D6`, write `(รอยืนยัน)` (awaiting confirmation), and carry on without stopping to ask. Propose a tone drawn from the subject in the report: medical green · finance dark blue ·
industrial amber · government navy · general software blue (the full table is in [`diagram-figures/references/colour-by-domain.md`](../../diagram-figures/references/colour-by-domain.md))

Define **tokens by role** at the top of the document, then use the same values in every figure in that document:

| Token | Role | Comes from |
|---|---|---|
| `bg-canvas` | Background of the figure | The darkest shade (dark mode) or the lightest (light mode) |
| `bg-surface` | Sheets, panels, cards | Different enough from canvas to show the edge without drawing a line |
| `bg-elevated` | A tile raised one more layer | |
| `accent-primary` | Emphasis, the active state | **The brand colour** (none → `#2A78D6` + `(รอยืนยัน)`) |
| `text-primary` | Main text | Contrast ≥ 4.5:1 against the surface it sits on |
| `text-muted` | Secondary text, placeholder | `rgba(...,0.55)` of `text-primary` |
| `state-success` · `state-warning` · `state-danger` | Status | **Does not change with the brand.** Green always means pass and red always means fail |

**One document, one colour set.** 10 figures in one document with mismatched colours are harder to read than plain figures with matching colours.

## Snippets

> The examples below use one dark-mode colour set as a stand-in only.
> **Change the colour values to match the agreed set before use.** The structure is what you copy, not the colour values.

**Window chrome (desktop app mockup):**
```xml
<rect x="20" y="20" width="600" height="360" rx="10" fill="#2a3245"/>
<circle cx="42" cy="42" r="6" fill="#ff5f57"/>
<circle cx="62" cy="42" r="6" fill="#febc2e"/>
<circle cx="82" cy="42" r="6" fill="#28c940"/>
<text x="320" y="46" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12">Window title</text>
<line x1="20" y1="64" x2="620" y2="64" stroke="rgba(255,255,255,0.08)"/>
```

**Phone frame (mobile mockup):**
```xml
<rect x="100" y="20" width="200" height="400" rx="28" fill="#0a0d14" stroke="#2a3245" stroke-width="2"/>
<rect x="120" y="50" width="160" height="340" rx="6" fill="#1c2230"/>
<rect x="170" y="28" width="60" height="14" rx="7" fill="#0a0d14"/>
```

**Button:**
```xml
<rect x="40" y="100" width="120" height="40" rx="8" fill="#0078d4"/>
<text x="100" y="125" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="14" font-weight="500">Click me</text>
```

**Card with title and body:**
```xml
<rect x="40" y="40" width="240" height="120" rx="12" fill="#2a3245"/>
<text x="60" y="72" fill="#fff" font-family="system-ui" font-size="14" font-weight="600">Card title</text>
<text x="60" y="96" fill="rgba(255,255,255,0.7)" font-family="system-ui" font-size="12">Supporting body text goes here.</text>
<rect x="60" y="116" width="80" height="28" rx="6" fill="#0078d4"/>
<text x="100" y="134" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12">Action</text>
```

**Status badge (top-right of tile):**
```xml
<circle cx="<tile-right-x>" cy="<tile-top-y>" r="9" fill="#e24b4a"/>
<text x="<tile-right-x>" y="<tile-top-y + 4>" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="13" font-weight="500">!</text>
```

**Running dot (indicator below tile):**
```xml
<circle cx="<tile-center-x>" cy="<tile-bottom-y + 12>" r="4" fill="#4cc2ff"/>
```

**Tooltip text (no balloon — plain floating text):**
```xml
<text x="<tile-center-x>" y="<tile-top-y - 12>" text-anchor="middle" fill="#fff" font-family="system-ui" font-size="12" font-weight="500">Tooltip label</text>
```

## Worked example — UI state mockup

Use this pattern by default for showing UI feature states. On GitHub, save the SVG as a file in `docs/figures/` and reference it (inline `<svg>` is dropped there).


---

# skill: web-service-essentials

Use when building or reviewing an HTTP backend

# Web Service Essentials

> **The one rule:** before writing the first business endpoint, the service must be able to answer
> "Are you still alive? · Are you ready for work? · Which version are you running now?" If it cannot, on the day the system goes down you will be guessing blind.

## When to use this skill

- Starting a new service / REST API / microservice
- Someone asks for a health check, ping, readiness, liveness, or version endpoint
- Deploying to production for the first time, or moving into Docker/Kubernetes
- You must set one API error format for the whole system

## When **not** to use it

- To design business endpoints, use the command `/api-design`
- For URL style · paging · dates · API ids, use `api-conventions`
- For log format, use `logging-standards`
- To choose an architecture, use `architecture-patterns`

---

## 1 · The 4 basic endpoints

| Endpoint | What it answers | auth | Checks dependencies | Who calls it |
|---|---|:---:|:---:|---|
| `GET /ping` | `pong` (text) | no | no | load balancer, every second |
| `GET /health/live` | the process is still alive | no | **no** | orchestrator (restarts if dead) |
| `GET /health/ready` | ready to take traffic | no | yes | orchestrator (removes from the pool) |
| `GET /version` | what is running | no* | no | a person, when tracing a problem |

> **live must not check dependencies.** This is the most common mistake.
> If `/health/live` checks the database (DB) and the DB goes down briefly, Kubernetes will **kill every pod**
> even though the app itself is fine. When the DB comes back, no pod is left to take traffic.
> The dependency check belongs in `/health/ready`, which only removes a pod from the pool for a while.

\* If you do not want the public to see the commit hash in `/version`, restrict it so only the internal network can call it.

**Wire it to Kubernetes like this** (adapted from secondsky `health-check-endpoints` · MIT) — live and ready must point to different paths, or the point above means nothing.

```yaml
livenessProbe:            # dead → restart the container
  httpGet: { path: /health/live, port: 3000 }
  initialDelaySeconds: 15 # let the app start first, or it gets killed before it can listen
  periodSeconds: 10
  failureThreshold: 3     # restart only after 3 failures in a row (30 seconds)
readinessProbe:           # not ready → remove from the Service for a while, no restart
  httpGet: { path: /health/ready, port: 3000 }
  initialDelaySeconds: 5
  periodSeconds: 10
```

For an app with a long warm-up (loading a model · a big cache), add a `startupProbe` pointing to `/health/live` with a high `failureThreshold`, instead of stretching the liveness `initialDelaySeconds`.

### Response shape (the same in every language)

```jsonc
// GET /health/ready → 200 normally · 503 when a critical dependency is down
{
  "status": "up",                       // up | degraded | down
  "timestamp": "2026-08-31T09:42:13.482Z",
  "checks": {
    "db":    { "status": "up",   "durationMs": 12 },
    "redis": { "status": "up",   "durationMs": 3 },
    "mail":  { "status": "down", "durationMs": 3001, "error": "smtp timeout" }
  }
}
```

```jsonc
// GET /version → 200
{
  "name": "orders-api", "version": "1.4.0", "commit": "abc1234",
  "buildTime": "2026-08-31T09:00:00Z", "env": "production", "host": "pod-7f9c"
}
```

**3 states, not 2:**
- `up` — everything is normal → 200
- `degraded` — a **non-critical** dependency is down (such as email) but the service can still take traffic → 200
- `down` — a critical dependency is down (such as the DB) → **503**

**Every check must have a timeout** (default 3 seconds). Otherwise a hung dependency
makes the health endpoint hang too, and the orchestrator makes the wrong decision for the whole system.

**Never send a stack trace or connection string out through these endpoints**, because anyone can call them.

---

## 2 · One error format for the whole system

Follow **RFC 9457 (`application/problem+json`)**, which is a real standard, so you do not invent your own.

```jsonc
// 422 — the format is right, but the data fails a rule (see the table below)
{
  "type": "https://api.example.com/errors/validation",
  "title": "ข้อมูลที่ส่งมาไม่ถูกต้อง",
  "status": 422,
  "detail": "จำนวนสินค้าต้องมากกว่า 0",
  "instance": "/api/v1/orders",
  "requestId": "a3f9c1b2",              // matches the cid in the log — trace the case at once
  "errors": [                           // validation only · every field in one response
    { "field": "items[0].qty", "code": "min_value", "message": "ต้องมากกว่า 0" }
  ]
}
```

- `field` is the full path including array indexes · `code` is for programs · `message` is for people

| Status | Use when |
|---|---|
| 400 | Malformed data |
| 401 | Not yet authenticated |
| 403 | Authenticated but not allowed |
| 404 | The thing does not exist |
| 409 | Conflicts with current state (duplicate, overwrite) |
| 422 | Format is right but breaks a business rule |
| 429 | Called too often — must have `Retry-After` |
| 500 | Our side broke — **never send internal details out**, send `requestId` instead |

> **A 500 must say only "an error occurred, please report this requestId".** The real details stay in the log.
> Sending a stack trace out is like handing the system's blueprint to someone looking for a way in.

---

## 3 · Request id

- Accept it from the **`X-Request-Id`** header only when it matches `^[A-Za-z0-9-]{1,64}$` · if it is missing or does not match → create a new one (a uuid cut to 8 characters).
  This value goes into every log line. If you accept it as is, the sender can insert new lines or fake text into the log (log injection).
- **Return it in a response header every time**, including on errors.
- Put it in every log line (see `logging-standards`) and in the error body.
- Pass it on to the downstream service every time you call across systems.

When a customer calls to say "it broke", ask for the requestId and `grep` once to find the whole story.

---

## 4 · Graceful shutdown

On a new deploy the orchestrator sends `SIGTERM`. If the app dies at once, requests in progress are cut off midway.

```
SIGTERM → 1. Stop accepting new requests (make /health/ready answer down at once)
          2. Wait for in-flight requests to finish (timeout 15–30 seconds)
          3. Close the DB pool / queues / files
          4. exit(0)
```

> Step 1 matters more than it looks. `/health/ready` must answer `down` about 5 seconds **before** the real shutdown,
> so the load balancer removes us from the pool in time. Otherwise traffic keeps arriving while we are closing.

---

## 5 · What must exist before deploy (not optional)

- **Timeouts everywhere**: incoming requests, outgoing calls, and DB queries. Without a timeout, the moment a downstream is slow, the whole system hangs with it.
- **Limit body size** (for example 1MB) to stop memory blowing up from a large payload.
- **Cross-Origin Resource Sharing (CORS) names the origin explicitly** — `*` is allowed only for a public API with no cookies.
- **Rate limit** at least on the login endpoint and on anything that sends a one-time password (OTP)/email.
- **Security headers**: `X-Content-Type-Options: nosniff` · `Content-Security-Policy: frame-ancestors 'none'` (replaces the old `X-Frame-Options` header · also add `X-Frame-Options: DENY` for old browsers) ·
  `Strict-Transport-Security` (HTTP Strict Transport Security · HSTS)
  Node: `helmet` sets them all in one line · .NET: `UseHsts()` sets only HSTS, and the rest needs a short middleware or the package `NetEscapades.AspNetCore.SecurityHeaders` (example in `references/per-stack.md`)
- **Turn off the full error page in production** (`app.UseDeveloperExceptionPage()` in dev only)
- **Put the version in the path**: `/api/v1/...` from day one, because moving later costs much more.
- **OpenAPI** generated from the real code, not written by hand and then forgotten.

---

## 6 · Ready-to-use code

| File | Stack | Status |
|---|---|---|
| `assets/health.node.js` | Node / Express | ✓ all 4 endpoints run and tested, plus the degraded/down/timeout cases |
| `assets/health_py.py` | Python / FastAPI | ✓ run and tested the same way, results match on every field |
| `references/per-stack.md` | .NET (ASP.NET Core health checks) + Angular | Caution: not yet compiled or tested |

```js
// Node
app.use(createHealthRouter({
  version: { name: 'orders-api', version: '1.4.0', commit: process.env.GIT_SHA },
  checks: {
    db:   async () => { await pool.query('SELECT 1'); },          // critical
    mail: { critical: false, run: async () => { await smtp.verify(); } },
  },
}));
```

```python
# Python
app.include_router(make_health_router(
    version={"name": "orders-api", "version": "1.4.0", "commit": os.getenv("GIT_SHA")},
    checks={"db": lambda: db.execute("SELECT 1"),
            "mail": {"critical": False, "run": smtp.verify}},
))
```

---

## 7 · Check the work

```bash
curl -i localhost:8080/ping                    # 200 pong
curl -s localhost:8080/health/live  | jq
curl -s localhost:8080/health/ready | jq
curl -s localhost:8080/version      | jq

# stop the DB and call again — ready must be 503 but live must still be 200
docker stop mydb && curl -i localhost:8080/health/ready && curl -i localhost:8080/health/live
```

- [ ] `/health/live` does **not** touch the DB — it still answers 200 with the DB stopped
- [ ] `/health/ready` answers 503 when a critical dependency is down
- [ ] When a non-critical dependency is down, the result is `degraded` + 200 (still takes traffic)
- [ ] Every check has a timeout — make a dependency hang, and the endpoint must answer within ~3 seconds
- [ ] `/version` matches the commit actually deployed
- [ ] Every response has `X-Request-Id`, including a 500
- [ ] Trigger a 500 and confirm no stack trace / connection string leaks out
- [ ] After `SIGTERM`, in-flight requests finish before the app closes
- [ ] `/ping` is not written to the log (or the file fills up with pings)

---

## 8 · Anti-patterns

- **A single `/health` that checks everything** — the orchestrator cannot tell whether to restart or only cut traffic
- **liveness checks the DB** — a 10-second DB hiccup = every pod dies together
- **A health check with no timeout** — a dependency hangs, and health hangs with it
- **Sending a stack trace / connection string in health or in a 500 error**
- **Health requires login** — the orchestrator has no token to give
- **A different error format on every endpoint** — the client must write 5 kinds of parsing code
- **`/ping` written to the log** — every second × 86400 = a file full of junk
- **No graceful shutdown** — every deploy, customers see errors
- **`Access-Control-Allow-Origin: *` together with cookies** — lets other sites send requests as the user

---

## 9 · Links to other skills

| Need | Use together with |
|---|---|
| Log format and correlation id | `logging-standards` |
| Tests for these endpoints | `testing-standards` |
| Check responses against OpenAPI in CI · contract with the frontend team · breaking-change check | `api-conventions` [`references/contract-testing.md`](../api-conventions/references/contract-testing.md) |
| Design business endpoints | command `/api-design` |
| Runbook for when the service is down | `incident-runbook-template` |
| Security review | `security-engineer` + command `/security-scan` (a shortcut to `security-audit` or `security-gate`) |


## reference: per-stack.md

# .NET และ Angular

> Caution: the code in this file is **not yet compiled or tested** (unlike `assets/health.node.js` and
> `assets/health_py.py`, which have been run against every endpoint). It is the standard setup of
> ASP.NET Core. On the first run, compare the response with the shape in SKILL.md section 1.

---

## สารบัญ

1. [ASP.NET Core — health checks](#aspnet-core--health-checks)
2. [Angular — ฝั่งที่เรียกใช้](#angular--ฝั่งที่เรียกใช้)
3. [ตารางเทียบ](#ตารางเทียบ)

---

## ASP.NET Core — health checks

```bash
dotnet add package AspNetCore.HealthChecks.NpgSql
dotnet add package AspNetCore.HealthChecks.Redis
dotnet add package AspNetCore.HealthChecks.Network   # AddSmtpHealthCheck อยู่ในแพ็กเกจนี้
```

```csharp
builder.Services.AddHealthChecks()
    // tag "ready" = ตัวที่ /health/ready จะเรียก · ไม่ติด tag = ไม่ถูกเรียกที่ไหนเลย
    .AddNpgSql(cs, name: "db", timeout: TimeSpan.FromSeconds(3), tags: ["ready", "critical"])
    .AddRedis(redisCs, name: "redis", timeout: TimeSpan.FromSeconds(3), tags: ["ready", "critical"])
    .AddSmtpHealthCheck(o => { }, name: "mail",
        failureStatus: HealthStatus.Degraded,          // ไม่ critical → degraded ไม่ใช่ down
        tags: ["ready"])
    // ตอนกำลังปิด → Unhealthy → /health/ready ตอบ 503 (ดู "Graceful shutdown" ข้างล่าง)
    .AddCheck<ShutdownHealthCheck>("shutdown", tags: ["ready", "critical"]);
```

```csharp
// ---- ping: เบาที่สุด ไม่ผ่าน middleware ที่ไม่จำเป็น ----
app.MapGet("/ping", () => Results.Text("pong")).ExcludeFromDescription();

// ---- liveness: ไม่เรียก check ตัวไหนเลย (predicate = _ => false) ----
// ถ้าเผลอให้เช็ค DB ตรงนี้ DB สะดุด = Kubernetes ฆ่า pod ยกแถว
app.MapHealthChecks("/health/live", new HealthCheckOptions
{
    Predicate = _ => false,
    ResponseWriter = WriteLive,
});

// ---- readiness: เฉพาะ check ที่ติด tag "ready" ----
app.MapHealthChecks("/health/ready", new HealthCheckOptions
{
    Predicate = c => c.Tags.Contains("ready"),
    ResponseWriter = WriteReady,
    ResultStatusCodes =
    {
        [HealthStatus.Healthy]   = StatusCodes.Status200OK,
        [HealthStatus.Degraded]  = StatusCodes.Status200OK,     // ยังรับ traffic ได้
        [HealthStatus.Unhealthy] = StatusCodes.Status503ServiceUnavailable,
    },
});

app.MapGet("/version", () => Results.Ok(new
{
    name = "orders-api",
    version = typeof(Program).Assembly.GetName().Version?.ToString() ?? "0.0.0",
    commit = Environment.GetEnvironmentVariable("GIT_SHA") ?? "unknown",
    buildTime = Environment.GetEnvironmentVariable("BUILD_TIME") ?? "unknown",
    env = app.Environment.EnvironmentName,
    host = Environment.MachineName,
}));
```

Make the response match the same format as the other stacks:

```csharp
static Task WriteReady(HttpContext ctx, HealthReport report)
{
    ctx.Response.ContentType = "application/json; charset=utf-8";
    return ctx.Response.WriteAsJsonAsync(new
    {
        status = report.Status switch
        {
            HealthStatus.Healthy  => "up",
            HealthStatus.Degraded => "degraded",
            _                     => "down",
        },
        timestamp = DateTimeOffset.UtcNow,
        checks = report.Entries.ToDictionary(
            e => e.Key,
            e => new
            {
                status = e.Value.Status == HealthStatus.Healthy ? "up" : "down",
                durationMs = (int)e.Value.Duration.TotalMilliseconds,
                // ข้อความเท่านั้น ห้ามส่ง exception เต็ม ๆ — endpoint นี้เปิดสาธารณะ
                error = e.Value.Exception?.Message,
            }),
    });
}

static Task WriteLive(HttpContext ctx, HealthReport _)
{
    ctx.Response.ContentType = "application/json; charset=utf-8";
    return ctx.Response.WriteAsJsonAsync(new { status = "up", timestamp = DateTimeOffset.UtcNow });
}
```

### Error envelope (RFC 9457)

ASP.NET Core already ships `ProblemDetails`. Use it, and do not invent your own format.

```csharp
builder.Services.AddProblemDetails(o => o.CustomizeProblemDetails = ctx =>
{
    ctx.ProblemDetails.Instance = ctx.HttpContext.Request.Path;
    ctx.ProblemDetails.Extensions["requestId"] =
        ctx.HttpContext.Response.Headers["X-Request-Id"].ToString();
});

app.UseExceptionHandler();      // แปลง exception ที่หลุดเป็น problem+json ให้อัตโนมัติ
app.UseStatusCodePages();
```

### Graceful shutdown

Make `/health/ready` answer down for a short while before the real shutdown, so the load balancer removes the instance from its pool in time.
Use `IHostedLifecycleService.StoppingAsync` (.NET 8 and later), because the host calls it **before** it stops Kestrel (after `ApplicationStopping`).
So you can wait with `await Task.Delay` without blocking a thread, and the server still answers 503 for the load balancer to see.

```csharp
// สถานะร่วม: ตัวรอปิดเขียน · health check อ่าน
public sealed class ReadinessState { public volatile bool IsShuttingDown; }

public sealed class ShutdownHealthCheck(ReadinessState state) : IHealthCheck
{
    public Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken ct = default) =>
        Task.FromResult(state.IsShuttingDown
            ? HealthCheckResult.Unhealthy("shutting down")
            : HealthCheckResult.Healthy());
}

public sealed class DrainOnShutdown(ReadinessState state) : IHostedLifecycleService
{
    public async Task StoppingAsync(CancellationToken ct)
    {
        state.IsShuttingDown = true;                       // /health/ready → 503 ทันที
        await Task.Delay(TimeSpan.FromSeconds(5), ct);     // รอ load balancer ตัดออก
    }
    public Task StartingAsync(CancellationToken ct) => Task.CompletedTask;
    public Task StartAsync(CancellationToken ct)    => Task.CompletedTask;
    public Task StartedAsync(CancellationToken ct)  => Task.CompletedTask;
    public Task StopAsync(CancellationToken ct)     => Task.CompletedTask;
    public Task StoppedAsync(CancellationToken ct)  => Task.CompletedTask;
}

// ก่อน builder.Build()
builder.Services.AddSingleton<ReadinessState>();
builder.Services.AddHostedService<DrainOnShutdown>();
builder.Services.Configure<HostOptions>(o =>
    o.ShutdownTimeout = TimeSpan.FromSeconds(30));   // รวมเวลารอ 5 วินาทีข้างบน + request ที่ค้าง
```

Host shutdown order (.NET 8+): `ApplicationStopping` → `StoppingAsync` → `StopAsync` of the hosted services (including Kestrel) → `StoppedAsync` → `ApplicationStopped` — per the .NET Generic Host page at learn.microsoft.com (checked 22 Oct 2026)

### สิ่งที่ต้องเปิดก่อน deploy

Register services only **before** `builder.Build()`. After Build the service list is read-only, and calling `builder.Services.Add…` then throws `InvalidOperationException` at app start.

```csharp
// ---- ก่อน Build: ลงทะเบียน service ----
builder.Services.Configure<KestrelServerOptions>(o => o.Limits.MaxRequestBodySize = 1_048_576);
builder.Services.AddRateLimiter(o =>
{
    o.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    // อย่างน้อยที่ /login และที่ส่งรหัสผ่านใช้ครั้งเดียว (One-Time Password · OTP)
    o.AddFixedWindowLimiter("login", w => { w.PermitLimit = 5; w.Window = TimeSpan.FromMinutes(1); });
});
builder.Services.AddCors(o => o.AddDefaultPolicy(p =>
    p.WithOrigins("https://app.example.com")   // ระบุ origin ห้าม AllowAnyOrigin คู่กับ cookie
     .AllowAnyHeader().AllowAnyMethod().AllowCredentials()));

var app = builder.Build();

// ---- หลัง Build: ลำดับ middleware ----
if (!app.Environment.IsDevelopment())
    app.UseHsts();                             // ตั้งแค่ Strict-Transport-Security · ไม่ใช้ตอน dev เพราะเบราว์เซอร์จำค่าไว้
app.UseHttpsRedirection();
app.Use(async (ctx, next) =>                   // header ที่ UseHsts ไม่ได้ตั้งให้
{
    ctx.Response.Headers["X-Content-Type-Options"] = "nosniff";
    ctx.Response.Headers["Content-Security-Policy"] = "frame-ancestors 'none'";
    ctx.Response.Headers["X-Frame-Options"] = "DENY";   // สำหรับเบราว์เซอร์เก่า
    await next();
});
app.UseCors();
app.UseRateLimiter();

app.MapPost("/api/v1/login", Login).RequireRateLimiting("login");
```

To avoid writing your own middleware, use the package `NetEscapades.AspNetCore.SecurityHeaders` (`app.UseSecurityHeaders()`) which sets the full basic header set

---

## Angular — ฝั่งที่เรียกใช้

**Interceptor ใส่ request id ทุก request** (คู่กับ `logging-standards`):

```ts
export const requestIdInterceptor: HttpInterceptorFn = (req, next) => {
  const id = crypto.randomUUID().slice(0, 8);
  return next(req.clone({ setHeaders: { 'X-Request-Id': id } }));
};
```

**Turn problem+json into a message the user can understand**:

```ts
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  return next(req).pipe(
    catchError((e: HttpErrorResponse) => {
      const p = e.error;                       // ProblemDetails
      // 500 ไม่มีรายละเอียดให้แสดง — โชว์ requestId เพื่อให้ผู้ใช้แจ้งทีมได้
      const msg = p?.detail || p?.title || 'เกิดข้อผิดพลาด';
      toast.error(p?.requestId ? `${msg} (รหัสอ้างอิง ${p.requestId})` : msg);
      return throwError(() => e);
    }),
  );
};
```

**System status page**, so the support team can check it without calling a developer:

```ts
this.http.get<ReadyResponse>('/health/ready').subscribe(r => this.status.set(r));
// r.status = 'up' | 'degraded' | 'down' → แสดงเป็น pill สีเขียว/เหลือง/แดง
// (ใช้คลาส .pill-green / .pill-amber / .pill-red จาก web-app-design)
```

---

## ตารางเทียบ

| เรื่อง | .NET | Node/Express | Python/FastAPI |
|---|---|---|---|
| health | `AddHealthChecks()` + tag | `createHealthRouter()` | `make_health_router()` |
| error envelope | `ProblemDetails` (มีในตัว) | `express-problem-json` หรือเขียน middleware | `HTTPException` + custom handler |
| request id | middleware + `LogContext` | `AsyncLocalStorage` | `ContextVar` + middleware |
| graceful shutdown | `IHostedLifecycleService.StoppingAsync` | `server.close()` ใน `SIGTERM` | `lifespan` context ของ FastAPI |
| security headers | `UseHsts()` (HTTP Strict Transport Security (HSTS) เท่านั้น) + middleware สั้น ๆ หรือ `NetEscapades.AspNetCore.SecurityHeaders` | `helmet` | `secure` middleware |
| OpenAPI | `Microsoft.AspNetCore.OpenApi` (`AddOpenApi()` + `MapOpenApi()` · มากับ template ตั้งแต่ .NET 9) · ทางเลือก: Swashbuckle / NSwag | `swagger-jsdoc` | มีในตัว `/docs` |
| rate limit | `AddRateLimiter` | `express-rate-limit` | `slowapi` |


---

# skill: api-conventions

Use when adding API endpoints or checking API consistency

# Application Programming Interface (API) conventions

> **The one rule:** decide once, apply to every endpoint.
> An API where every endpoint behaves the same, even if "not quite right in theory", is easier to use
> than an API where each endpoint is correct in its own way, because with the latter the caller must guess again every time.

## When to use this skill

- Starting to design the first API of a project
- Adding an endpoint to an existing API and wanting it to match what is there
- Reviewing an API and feeling that its parts are not alike
- Needing to answer "if we change it this way, will clients break?"

## When to use another skill instead, or alongside

| Task | Skill | |
|---|---|---|
| Design all the endpoints of one feature | command `/api-design` | instead |
| Health check, error envelope, graceful shutdown | `web-service-essentials` | instead |
| Tables, columns, relations | `database-design` | instead |
| Tokens, scopes, permissions | `auth-implementation-patterns` | alongside |
| Correlation id that appears in errors | `logging-standards` | alongside |
| Contract tests between systems | `testing-standards` | alongside |
| Recording why this convention was chosen | `adr-writer` | alongside |
| Abbreviations in work that people read | `spell-out-abbreviations` | alongside |

**A template of the conventions document that you can copy and use** → `assets/API-CONVENTIONS.md`

---

## 1 · The conventions document must exist

Put the file `docs/API-CONVENTIONS.md` in place (the template is at `assets/API-CONVENTIONS.md`).
Write every decision made from this page into that file, with the date and a short reason.

> A convention that lives in one person's head is not a convention — someone who joins the team next month will do it another way.

---

## 2 · Naming URLs

```
GET    /v1/orders                 list
POST   /v1/orders                 create
GET    /v1/orders/{id}            single item
PATCH  /v1/orders/{id}            partial update
PUT    /v1/orders/{id}            replace the whole item
DELETE /v1/orders/{id}            delete
GET    /v1/orders/{id}/items      child resource
POST   /v1/orders/{id}/cancel     an action that is not CRUD (Create, Read, Update, Delete)
```

| Rule | ✓ | ✗ |
|---|---|---|
| Plural nouns | `/orders` | `/getOrders`, `/order` |
| Lowercase, hyphens | `/purchase-orders` | `/purchaseOrders`, `/purchase_orders` |
| At most 2 levels deep | `/orders/{id}/items` | `/customers/{a}/orders/{b}/items/{c}/logs` |
| Use a verb only when it is truly not CRUD | `POST /orders/{id}/cancel` | `POST /orders/cancelOrder` |

**An action that is not CRUD** (approve, cancel, resend) uses `POST /{resource}/{id}/{action}`.
Do not bend it into a `PATCH` that edits `status`, because a status change usually has more side effects than an ordinary field edit.

**How to use `PATCH`:** pick one style for the whole system. Sending only the changed fields (`merge patch`) is recommended,
and you must define clearly whether `null` means "clear the value" or "leave it alone" (see section 6).

---

## 3 · Versioning

| Method | Pros | Cons |
|---|---|---|
| **In the path** `/v1/orders` | Obvious, easy to test, easy to cache | The URL changes when the version goes up |
| In a header `Accept: application/vnd.acme.v1+json` | The URL stays fixed | Invisible when debugging, often forgotten |

> **Choose the path** unless there is a specific reason — everyone can see the version from a single line in the log.

**Which changes break callers:**

| Change | Breaks? |
|---|:--:|
| Add a new endpoint | No |
| Add an **optional** field to a request | No |
| Add a field to a response | No* |
| Add a new enum value | **Breaks** — a client whose `switch` covers every value will meet an unknown one |
| Remove/rename a field | **Breaks** |
| Change a data type (`"12"` → `12`) | **Breaks** |
| Make a formerly optional field required | **Breaks** |
| Change the HTTP status returned in an existing case | **Breaks** |
| Make a validation rule stricter | **Breaks** |

\* Only when callers were told from the start to "skip fields you do not recognize".
This must be written in `API-CONVENTIONS.md`, not left to hope.

**Raise the major version only when truly needed**, because every version still open is another body of code to maintain.

---

## 4 · Pagination

**Every endpoint that returns a list must have pagination from day one**, with no exceptions.
A list that "only has a few items" will have 10,000 in 2 years.

| Method | Use when | Limits |
|---|---|---|
| **cursor** `?limit=50&cursor=eyJ...` | Default · lots of data · data is added while the user is browsing | Cannot jump to page 7 |
| offset `?limit=50&offset=100` | Page numbers must be clickable · little data | Slower the deeper the page · if a row is inserted while browsing, data repeats or goes missing |

```jsonc
// GET /v1/orders?limit=2 → 200
{
  "data": [ { "id": "1042" }, { "id": "1041" } ],
  "page": {
    "limit": 2,
    "nextCursor": "eyJpZCI6MTA0MX0",   // null when there is no more
    "hasMore": true
  }
}
```

- Always wrap the list in `data`, because a bare array leaves no room to add page information later.
- `limit` has a default and a **ceiling enforced on the server** (for example default 20, maximum 100).
- `totalCount` is expensive to count, so make it optional with `?includeTotal=true`. Do not count every time.
- **The cursor must be opaque** (callers must never decode or build one themselves).

---

## 5 · Filtering · sorting · requested fields

```
GET /v1/orders?status=confirmed&createdAt[gte]=2026-01-01&sort=-createdAt&fields=id,orderNo,total
```

| Topic | Convention |
|---|---|
| Filter by equal value | `?status=confirmed` |
| Several values | `?status=confirmed,shipped` |
| Range | `?createdAt[gte]=...&createdAt[lt]=...` |
| Sort | `?sort=-createdAt,orderNo` — `-` means descending |
| Text search | `?q=สมชาย` kept separate from filtering |
| Select fields | `?fields=id,orderNo` |

- **Accept only the fields you have defined.** If any field name is accepted, you get security holes and queries with no index.
- For an unknown parameter, answering `400` is better than skipping it silently. Otherwise a caller who mistypes gets wrong data without knowing.

---

## 6 · Data formats

| Data | Format | Example |
|---|---|---|
| Field names | `camelCase` across the system | `createdAt` |
| Time | RFC 3339 · UTC · ends with `Z` | `"2026-09-25T09:42:13.482Z"` |
| Date only | `YYYY-MM-DD` | `"2026-09-25"` |
| Money | the number as a **string** + a separate currency | `{ "amount": "1250.00", "currency": "THB" }` |
| identifier | **always a string** | `"1042"` not `1042` |
| enum | `SCREAMING_SNAKE` or `lower_snake`, pick one style | `"CONFIRMED"` |
| Duration | seconds as a number, named so the unit is clear | `"timeoutSeconds": 30` |
| Country / currency / language | ISO 3166 · ISO 4217 · BCP 47 | `"TH"` · `"THB"` · `"th-TH"` |

> **A numeric id in JSON is a time bomb** — JavaScript stores integers safely up to 9,007,199,254,740,991.
> A `bigint` above that is silently rounded at `JSON.parse`, and changing it to a string later is a breaking change.
>
> **Money as a float in JSON** — `1250.10` passed through 2 programming languages may become `1250.0999999999999`.

**`null` and "no field" must mean different things:**

- In a response, a field that exists but has no value is sent as `null`, not dropped, so callers do not have to check 2 cases.
- In a `PATCH`, sending `{"note": null}` means clear the value, and leaving out the `note` key entirely means leave it alone.

**An empty array is `[]`, not `null`**, so callers can loop over it directly.

---

## 7 · Errors

The error format (RFC 9457 · `requestId` · an `errors` array of `{field, code, message}`) and examples live in one place, `web-service-essentials` section 2. Follow that.
What still needs agreement is the **field-level error**:

- **`code` is for programs, `message` is for people.** Never make callers write conditions against the message text.
- Point to the field location with the full path, including array indexes.
- **Return the errors for all fields at once**, not one at a time, so users do not have to submit 5 times.
- If several languages are supported, choose Thai or English text from `Accept-Language`.

**Pick the status to match:** `400` malformed request · `401` not authenticated · `403` authenticated but not permitted ·
`404` does not exist, or you do not want to reveal that it exists · `409` conflicts with the current state · `422` well-formed but the data fails the rules · `429` too many calls

---

## 8 · Repeat calls without repeat effects, and edit conflicts

### idempotency key (a request code — sending it again does not do the work again)

**Required on every `POST` that has a financial effect or sends something out to the outside world.**

```
POST /v1/payments
Idempotency-Key: 7f3c1e10-...        ← created by the caller, kept for use when retrying
```

- The server stores the key together with the result for at least 24 hours.
- Same key with the same body: return the earlier result and do not repeat the work.
- Same key with a **different** body: answer `422` and do not do new work.
- A network drop while waiting for the answer is normal, not a special case, so callers always retry.

### Edit conflicts (optimistic concurrency)

```
GET   /v1/orders/1042        → 200  ETag: "v7"
PATCH /v1/orders/1042        If-Match: "v7"
                             → 200 normally · 412 if someone edited it first
```

Without this, whoever saves second overwrites the first person's work and nobody knows.

---

## 9 · Rate limit

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 997
X-RateLimit-Reset: 1758790000
Retry-After: 42                ← must always accompany a 429
```

If a `429` has no `Retry-After`, the caller must guess, and most guess "try again at once".

---

## 10 · Retiring an endpoint

1. Announce in advance, and say what to use instead.
2. Send these headers in every response of that endpoint:
   ```
   Deprecation: @1790812800
   Sunset: Wed, 31 Dec 2026 23:59:59 GMT
   Link: <https://docs.acme.co/v2/orders>; rel="successor-version"
   ```
   `Deprecation` follows the Request for Comments (RFC) 9745 standard (Mar 2025). It must be a date in the form `@<unix seconds>` (this example is 1 Oct 2026 00:00 UTC), not `true`. Checked 22 Oct 2026 (B.E. 2569).
3. **Check the logs for who still calls it**, then contact them directly. Do not wait for them to go quiet on their own.
4. Close it only after the announced date, not before.

A fitting period: for an internal API, 1 release cycle. For an API used by outsiders, at least 6 months.

---

## 11 · Check before releasing a new endpoint

Go through every item against the endpoint you added. Fail one and it is not merged yet (idea from ECC api-design).

- [ ] The URL is a plural noun per section 2 · sits under a version per section 3 · has no `GET` that changes data
- [ ] Every list has pagination and a page-size ceiling (section 4) · filter and sort use the same parameter names as existing endpoints (section 5)
- [ ] Dates · ids · money are in the formats of section 6 · the response is not a raw database entity
- [ ] Every error follows `web-service-essentials` §2 and has a fixed `code` (section 7) · a request that creates or pays accepts an idempotency key · an edit accepts `If-Match` (section 8)
- [ ] Auth and rate limit are stated (section 9) · it is in OpenAPI, and the cURL examples in the docs really run
- [ ] There is a contract test or an endpoint-level test with at least 1 success case and 1 error case — check the response against OpenAPI in CI · Pact when the caller is on another team · `oasdiff breaking` on every PR: [`references/contract-testing.md`](references/contract-testing.md)

## 12 · Anti-patterns

- **`200 OK` with `{"success": false}`** — monitors and logs will not see that it failed.
- **Verbs in the URL** — `/createOrder`, `/getOrderById`
- **A list with no pagination** — one day it will return 50,000 rows at once.
- **A different date format on each endpoint** — for example `"25/09/2026"`, where nobody knows whether day or month comes first.
- **Sending a database entity out as is** — every time a column is added, the API changes by accident, and internal data may leak.
- **Mixed field names** such as `created_at` and `updatedAt` in one response.
- **A `GET` that changes data** — a web page prefetcher will fire it by itself with nobody clicking.
- **Error messages that keep changing** with no fixed `code`.
- **No documentation** — an OpenAPI generated from the real code is better than hand-written docs that do not match.


## reference: contract-testing.md

# Contract testing — OpenAPI is the contract, and CI checks that the real thing matches

The document `docs/API-CONVENTIONS.md` states the rules · the OpenAPI file states the shape of each endpoint · contract tests are what keep these 2 from being just documents

## 1 · OpenAPI as the contract

- Generate it from the real code (annotations · decorators · the framework's generator) and commit the resulting file — do not hand-write it separately · when the 2 sides differ, the code side is the truth, and the diff in the file is what the reviewer sees
- Every response has a schema, including errors (`web-service-essentials` §2) · every field has a `format` for dates · ids · money, per §6 of the main SKILL.md

## 2 · Check responses against the spec in CI (provider side)

| Tool | What it does | licence | Note (checked 2026-10-23) |
|---|---|---|---|
| Schemathesis | reads OpenAPI, builds requests from the schema, fires them at the real service, and checks that responses match the spec and are not 500 · `schemathesis run <url of openapi.json>` | MIT | really fires, creates and deletes data → point it only at dev or staging · Python |
| Prism (Stoplight) | `prism mock <spec>` lets the frontend work before the backend is done · `prism proxy <spec> <upstream>` checks real traffic against the spec | Apache-2.0 | Node ≥ 18.20 · proxy mode can sit in front of the service in a test environment |
| Dredd | checks an API against API Blueprint / OpenAPI 2 (OpenAPI 3 experimental) | MIT | **no longer maintained** (archived 2024-11-08) — do not start using it |

Our default: Schemathesis in a CI job after the service is up with test data (the reset endpoint from `app-verifier-setup`) · failure = no merge

## 3 · Consumer-driven contract — when the frontend team or callers are separate from the backend

- Pact (pact-foundation · MIT): the caller side writes tests of which request/response pairs it uses → produces a pact file → the provider side runs a check against that file in its own CI · the provider can change parts nobody uses without breaking tests
- Use when: the teams are different, release separately, or there is more than 1 caller (mobile + web + partner) · one team does both sides → item 2 is enough
- Pact files are exchanged through a Pact Broker or committed to the provider's repo — agree on one way in `API-CONVENTIONS.md`

## 4 · Check for breaking changes on every PR

- `oasdiff breaking <old spec> <new spec>` (Apache-2.0 · Go · has a Docker image) reports only changes that break existing callers: removing an endpoint or field · a field becoming required · a type change · an enum value removed
- In CI: old spec = the main branch's · new spec = the PR's · on a breaking change → bump to a new version per §3, or deprecate per §10 of the main SKILL.md — do not turn off the check
- Adding an optional field · adding an endpoint · adding an enum value that callers do not crash on in a switch = not breaking

## Check before handing over

- [ ] OpenAPI is in the repo and generated from code · CI fails if the file does not match the code
- [ ] Schemathesis (or equivalent) runs against a service brought up with test data · `oasdiff breaking` runs on every PR
- [ ] Callers in a separate team → at least 1 pact file per caller, and the provider checks it in CI


---

# skill: error-handling-patterns

Use when writing code that can fail, with retry and timeout

# Error handling

> **The one rule:** catch an error only when you **can really do something about it.**
> Catching it and doing nothing is worse than not catching, because the system keeps going while it is already broken inside.

## When to use this skill

- Writing code that calls the network, a database, files, or another team's system
- Deciding whether to retry, how many times, and how long to wait
- The user sees "an error occurred" and does not know what to do next
- Tracing a problem and finding nothing in the log because someone caught and discarded the error

## When to use another skill, or use it alongside

| Task | Skill | |
|---|---|---|
| The JSON shape of errors the API sends out | `web-service-essentials` · `api-conventions` | instead |
| Log line format and data masking | `logging-standards` | instead |
| Fixing one specific bug someone reported | `targeted-fix` | instead |
| Steps when the system is really down | `incident-runbook-template` | instead |
| Error-rate metrics and alerts | `observability-basics` | alongside |
| Where a failed background job goes next | `background-jobs` | alongside |
| Error messages that must be translated into several languages | `i18n-and-locale` | alongside |
| Tests for failure cases | `testing-standards` | alongside |
| Abbreviations in work that people read | `spell-out-abbreviations` | alongside |

---

## 1 · Where to catch, where to let it pass

| Layer | What to do |
|---|---|
| Innermost layer (calls DB, HTTP, files) | **let it pass**, or convert it into a domain error that has meaning |
| Business logic layer | catch only where there is a real fallback (a default value, a backup data source) |
| **Outermost layer** (controller, handler, main) | **catch everything** · log once · convert to an answer the user understands |

> **Log in one place only, the outermost layer.** If every layer catches, logs, and rethrows,
> 1 error becomes 10 log lines and nobody knows they are the same event.

**3 things you must never do:**

```csharp
try { ... } catch { }                      // wrong: swallowed silently
try { ... } catch (Exception) { return null; }   // wrong: the caller gets null and never learns what happened
catch (Exception ex) { log.Error(ex); throw; }   // wrong: logs again at every layer
```

**If you really mean to swallow it, write the reason:**

```csharp
catch (SmtpException ex)
{
    // swallowed on purpose — a failed notification email should not make the order fail
    log.Warning(ex, "ส่งอีเมลยืนยันไม่สำเร็จ orderId={OrderId}", order.Id);
}
```

---

## 2 · The message to the user ≠ the message in the log

| | The user sees | The log keeps |
|---|---|---|
| Content | what happened · what to do next | stack trace · variable values · request id |
| Language | the user's language | English is fine |
| Internal detail | **none at all** | allowed |
| Link between the 2 sides | **a reference code** | the same code |

```
Wrong: "เกิดข้อผิดพลาด" (An error occurred)   the user cannot tell what to do
Wrong: "SqlException: timeout expired"      leaks internal detail, and they cannot read it anyway
Right: "บันทึกไม่สำเร็จเพราะระบบตอบช้า ลองอีกครั้งใน 1 นาที (อ้างอิง: 01J9Z8K)"
       (Save failed because the system was slow. Try again in 1 minute. Reference: 01J9Z8K)
```

**A good message has 3 parts**: what happened · why (if you can say) · what to do next.
The reference code is the same correlation id as in `logging-standards`.

---

## 3 · Classify before deciding

| Type | Example | What to do | Log level |
|---|---|---|---|
| **User mistake** | incomplete input, wrong format | tell them to fix it · **do not retry** | no log needed |
| **Transient** | timeout · 503 · deadlock · dropped connection | **may retry** | warning |
| **Rate limited** | 429 Too Many Requests | may retry **after the time `Retry-After` gives** (if absent, use the formula in §4) · never fire faster than that | warning |
| **Permanent** | 404 · 401 · data fails a condition | do not retry · say so clearly | warning |
| **Our bug** | null reference · cannot convert the type | do not retry · **someone must fix it** | error |
| **Inconsistent data** | totals do not match, an impossible state | stop · **call a person** | error + alert |

> **Retrying an error that no number of tries will cure means firing again at a system that is already down, so it falls harder.**
> Sending `400` or `401` another 100 times gets the same answer.

---

## 4 · Timeout and retry

**Every call that leaves the process needs a timeout** — the default in most libraries is "wait forever"

| Call | A timeout that works in general |
|---|---|
| Ordinary database query | 5–10 seconds |
| Internal HTTP | 3–5 seconds |
| External HTTP | 10–30 seconds |
| Heavy background job | set it from the real work, and it must be possible to cut it off |

**The retry formula** (service-to-service calls · jobs in a queue use the numbers in [`background-jobs`](../background-jobs/SKILL.md) §4 · when a person sits waiting on the screen → see the last item below):

```
at most 3 tries · exponential delay + jitter
try 1 waits 1 second · try 2 waits 2 · try 3 waits 4  (each ±20% random)
```

- **You need the random part** — otherwise every instance retries at the exact same moment and hits the target system again together
- **The total retry time must be less than the caller's timeout**, or the caller has given up while we are still trying
- **Retrying a write needs an idempotency key**, or the customer is charged twice (see `api-conventions`)
- **A person sits waiting on the screen** → at most 1 automatic retry, then show a "ลองอีกครั้ง" (try again) button for them to press (do not use the 3 tries of the formula above)

---

## 5 · Circuit breaker

When the target is down, firing more does not help. It only makes us hang along with it.

```
closed (normal) → N failures in a row → open (do not call at all, answer with an error at once)
                → wait X seconds → half-open: let 1 request try → success: back to closed · failure: stay open
```

A default that works: if 5 calls fail in a row within 30 seconds, keep the circuit open for 60 seconds.

**Add one when** — calling an external system that has gone down before · calling across several services · a slow target spreads the slowness to us
**Not needed when** — calling your own database · a job that runs once a day

---

## 6 · Partial failure

Work that handles many items must be able to answer **"8 of 10 succeeded, where did the other 2 go?"**

| Style | Fits |
|---|---|
| All or nothing (transaction) | money · stock · anything that breaks when half done |
| Do what you can, then report the items that failed | data import · notifying many people |

The second style must **return the failed items with a reason for each**, not just say "some items failed".

**Cleanup must always run**, whether or not the main work succeeds: closing files, returning connections, deleting temp files.
Use `finally` / `using` / `with` / `defer` instead of repeating it on every exit path.

---

## 7 · Check before sending

Go through this against the diff every time you touch code that calls outside the process (idea from ECC error-handling)

- [ ] Every `catch` clearly does one of these: handles it and goes on · converts it to an error of its own layer and throws on · lets it pass to the outermost layer to log (section 1) — no `catch` that logs and rethrows
- [ ] Every outside call (HTTP · DB · queue · file) has a deliberate timeout and retries only the transient types in section 3 · a write that retries has an idempotency key (section 4)
- [ ] The message to the user says what to do next · no stack trace or table name goes out (section 2) · the log for the same error has a correlation id and enough data to reproduce it
- [ ] Outcomes the business expects (not found · insufficient balance · duplicate) are return values or types the caller must handle, not exceptions
- [ ] Each outside dependency has at least 1 failure-path test (timeout · 5xx · bad payload), and a test confirms that partial failure follows section 6 and does not fail the whole page
- [ ] None of these 4 kinds of silent failure swallowing (adapted from silent-failure-hunter in pr-review-toolkit · claude-plugins-official · Apache-2.0 · viewed 2026-11-10):
  - **optional chaining or `?? default`** that lets a missing value pass with nobody knowing (`order?.total ?? 0` turns an order that failed to load into a zero total)
  - **falling back to a mock or sample data outside tests** — the live system shows fake data and looks normal
  - **retries run out, then silence** — after the last try it returns empty or success, throws no error, and tells the caller nothing
  - **a catch that logs and carries on in the UI** — the user sees a normal screen although the data never arrived; show an error state they can see

## 8 · Anti-patterns

- **An empty `catch`** — the hardest problem to find is the one that leaves no trace
- **Returning `null` instead of throwing an error** — the caller cannot tell "no data" from "the system broke"
- **`catch (Exception)` in the innermost layer** — swallows your own bugs too
- **Log and rethrow at every layer** — 1 error gets 10 lines
- **"เกิดข้อผิดพลาด" ("an error occurred")** — does not say what to do next
- **Sending a stack trace to the user** — shows the internal structure to someone hunting for a hole
- **Retry with no delay** — hammering a system that is already down
- **Retrying a write with no idempotency key** — you get duplicate records
- **No timeout** — threads pile up until the system dies
- **Using errors to control normal flow** — for example throwing an exception on "not found", which is a normal event


---

# skill: logging-standards

Use when writing or reviewing code that logs

# Logging Standards

> **The one rule:** Logs exist for a person to read at 3 a.m. when the system is down, not while writing the code.
> If a line does not help answer "what happened, to whom, and when", do not write it.

## When to use this skill

- Starting any new project (service, API, worker, batch, desktop, frontend)
- Someone asks for "a log file", or asks about log format and levels
- You are chasing a production problem and find that the existing logs are unusable

## When **not** to use it

- You need metrics or tracing (Prometheus, OpenTelemetry). That is a different topic from logs, so use `observability-basics`.
- You are building a service health endpoint. Use `web-service-essentials`.

---

## 1 · Line format — the same in every language

```
2026-08-31 09:42:13.482 +07:00  INFO   [a3f9c1b2] orders  สร้างคำสั่งซื้อสำเร็จ  orderId=1042 userId=57 ms=134
└───────── time + timezone ─────────┘ └level┘  └ cid ┘ └source┘ └─ message ─┘  └──── context k=v ────┘
```

| Part | Rule |
|---|---|
| time | `YYYY-MM-DD HH:mm:ss.SSS ±HH:MM` — **the timezone is required**, or you cannot compare logs across machines |
| level | Left-aligned, 5 characters wide (`INFO ` `WARN ` `ERROR` `DEBUG` `FATAL`), so the columns line up |
| cid | An 8-character correlation id in square brackets. If there is none, use `[--------]` (also 8 characters, so the columns line up) |
| source | The module or class that writes the log, not the file name |
| message | One sentence, with no variables embedded in the string |
| context | `key=value` separated by spaces. If a value contains a space, wrap it in `"` |

**Why not JSON:** This file is mainly for people to open and `grep`. This format still works with `grep "\[a3f9c1b2\]"` or `awk`, but the eye reads it at once without any tool.
When you must ship logs to a central system such as Grafana Loki or Elasticsearch, Logstash, Kibana (ELK), add one more JSON sink (the destination logs are sent to). But **do not drop the text file**.

**1 event = 1 line**, except a stack trace, which follows indented by 4 spaces.

---

## 2 · Log levels — write them to match their meaning

| Level | Use when | Example |
|---|---|---|
| `FATAL` | The app is about to die and cannot continue | Cannot connect to the DB at start |
| `ERROR` | This job failed **and someone must look** | Saving an order failed |
| `WARN` | Abnormal, but the system can continue | Retry number 2, disk down to 10% |
| `INFO` | An important business event | Order created, user logged in, job started/finished |
| `DEBUG` | Details for chasing problems — **off in production** | Values computed along the way |
| `TRACE` | Step-by-step detail — turn on only when really chasing | Raw payload |

> Warning: **an `ERROR` that nobody needs to act on is a `WARN`.** If ERROR fires every minute until people stop looking,
> you have just destroyed your own alarm system.

The default is `DEBUG` in dev and `INFO` in production, adjustable with the env var `LOG_LEVEL`. **No new build is needed; just restart (or reload the config).** .NET reads it from `appsettings.json` instead (see `references/per-stack.md`).

---

## 3 · Correlation id — what makes logs usable

One request uses one id from start to finish, so every line that comes from that request has the same id.

```
Client ──X-Request-Id?── API Gateway ──┬── Service A ──┐
                        (create if none)└── Service B ──┴─→ every line has the same cid
```

- Take it from the header **`X-Request-Id`** only when it matches `^[A-Za-z0-9-]{1,64}$`. If it is missing or does not match, create a new one (`uuid v4`, first 8 characters). For the reason, see `web-service-essentials` item 3.
- **Always return it in the response header**, so the customer can send the id when reporting a problem and we can trace it at once.
- Pass it to the downstream service on every cross-system call.
- Store it with a mechanism that is separate per request: `AsyncLocalStorage` (Node) · `ContextVar` (Python)
  · `IHttpContextAccessor`/`LogContext` (.NET). **Never use a global variable**, because ids mix as soon as several requests run at once.

---

## 4 · Log files

```
logs/
  app-20260831.log        all levels · rotate at midnight · keep 30 days · max 100MB per file
  error-20260831.log      ERROR/FATAL only · keep 90 days
  fatal.log               uncaught exceptions (app died)
```

- Set the folder with the env var `LOG_DIR`. **Never hardcode the path.**
- Compress old files (`.gz`) and **retention is required**. Otherwise the disk fills and the system goes down from its own logs.
- In a container, also log to stdout (besides the file) so `docker logs` works.
- `logs/` must be in `.gitignore`.

---

## 5 · What must never go into a log

Passwords · tokens/API keys · cookies/Authorization headers · OTP/PIN · credit card numbers/CVV ·
**national ID numbers** · health data · full payloads that contain personal data

Helper already provided: the redaction function (which hides secret values) checks **whether the key name contains a forbidden word** (`userPassword`, `pwd`,
`accessToken` are all caught) and replaces the value with `***`. It checks up to 4 levels deep inside an object.

> **Log injection** — A value from a user may contain `\n`. If you let it through, the user can "forge" a fake log line,
> which misleads readers and breaks parsers. So the provided code strips `\r\n\t` from every value and from the main message.

---

## 6 · Ready-to-use code

| File | Stack | Status |
|---|---|---|
| `assets/logger.node.js` | Node/TS — winston + winston-daily-rotate-file | ✓ Run and tested 2026-10-25 (Node 22.23.2 · winston 3.19.0 · winston-daily-rotate-file 5.0.0 · password redaction · correlation id · strips line breaks in the main message and values) |
| `assets/logger_py.py` | Python — stdlib only, nothing to install | ✓ Run and tested 2026-10-25 (Python 3.13.5 · same test set) |
| `references/per-stack.md` | .NET (Serilog) + Angular | Caution: not yet compiled or tested |

```js
// Node
const { withCorrelation } = require('./logger.node');
const log = withCorrelation(req.id).child({ source: 'orders' });
log.info('สร้างคำสั่งซื้อสำเร็จ', { orderId: 1042, ms: 134 });
log.error('บันทึกไม่สำเร็จ', err);          // pass an Error directly; the stack is added for you
```

```python
# Python
from logger_py import setup_logging, get_logger, set_correlation_id
setup_logging(app_name="myapi")             # once, when the app starts
log = get_logger("orders")
log.info("สร้างคำสั่งซื้อสำเร็จ", extra={"ctx": {"order_id": 1042, "ms": 134}})
log.exception("บันทึกไม่สำเร็จ")             # inside except — the stack is added for you
```

---

## 7 · Checking the work

```bash
# no leftover print/console.log in production code
grep -rnE "console\.(log|error)|Console\.WriteLine|^\s*print\(" src/ --include="*.ts" \
  --include="*.js" --include="*.cs" --include="*.py" | grep -v test | head -30

# the output logs are readable and greppable
tail -n 50 logs/app-*.log
grep "a3f9c1b2" logs/app-*.log          # does one request show every line?
```

- [ ] Every line has all of: time+timezone · level · cid · source
- [ ] `grep` with one cid shows the story of that request from start to finish
- [ ] No secrets leak: log an object with `password` and `token`, and you must see `***`
- [ ] Feeding in a value that contains `\n` produces no fake line
- [ ] With `LOG_LEVEL=INFO`, DEBUG really disappears
- [ ] Files rotate daily and have retention (left for 1 month, the disk must not fill)
- [ ] `logs/` is in `.gitignore`
- [ ] The response sends `X-Request-Id` back to the customer

---

## 8 · Anti-patterns

- **`console.log` / `print()` in real code** — no level, no time, no cid, not written to a file
- **Logging everything** — the file grows so large you cannot find anything, and it is expensive and slow
- **A silent `try { } catch (e) { }`** — log at least 1 line
- **Log, then rethrow** — one problem shows up 3 times in the file. Log at the top layer that really handles the error instead.
- **Variables embedded in the message** (`` `บันทึก order ${id} ไม่สำเร็จ` ``) — you cannot group the logs.
  Use a fixed message + context instead.
- **Logging inside a loop that runs thousands of times** — log one summary when the loop ends
- **A timestamp with no timezone** — the server uses UTC but Thai readers read it as +07:00, so times are compared 7 hours off
- **No retention** — one day the disk fills and the system goes down from its own logs

---

## 9 · Links to other skills

| Need | Use with |
|---|---|
| health/ping/version endpoint | `web-service-essentials` |
| Writing tests with full coverage | `testing-standards` |
| Runbook during an incident | `incident-runbook-template` |
| Postmortem after an incident | `postmortem-template` |


## reference: per-stack.md

# Set up the logger to produce the same format — .NET and Angular

> Warning: the code in this file is **not yet compiled or tested** (unlike `assets/logger.node.js` and
> `assets/logger_py.py`, which have really been run). It uses the standard setup of each library.
> At the first build, compare the output lines with the format in SKILL.md item 1.

---

## Contents

1. [.NET / C# — Serilog](#net--c--serilog)
2. [Angular / frontend](#angular--frontend)
3. [Comparison table](#comparison-table)

---

## .NET / C# — Serilog

```bash
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Sinks.File
```

`appsettings.json` — keeps the settings outside the code, so you can change the log level without a new build:

```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft.AspNetCore": "Warning",
        "Microsoft.EntityFrameworkCore.Database.Command": "Warning"
      }
    }
  }
}
```

`Program.cs`:

```csharp
using Serilog;
using Serilog.Events;

const string LineTemplate =
    "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz}  {Level:u5}  " +
    "[{CorrelationId}] {SourceContext}  {Message:lj}  {Context:l}{NewLine}{Exception}";

Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .Enrich.WithProperty("CorrelationId", "--------") // default when there is no request (8 characters)
    .Enrich.WithProperty("Context", "")              // empty when there is no context k=v
    .WriteTo.Console(outputTemplate: LineTemplate)
    .WriteTo.File(
        path: Path.Combine(Environment.GetEnvironmentVariable("LOG_DIR") ?? "logs", "app-.log"),
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 30,
        fileSizeLimitBytes: 100 * 1024 * 1024,
        rollOnFileSizeLimit: true,
        outputTemplate: LineTemplate)
    .WriteTo.File(
        path: Path.Combine(Environment.GetEnvironmentVariable("LOG_DIR") ?? "logs", "error-.log"),
        restrictedToMinimumLevel: LogEventLevel.Error,
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 90,
        outputTemplate: LineTemplate)
    .CreateLogger();

builder.Host.UseSerilog();
```

> `{Level:u5}` means upper case, 5 characters wide, which gives `INFO ` `WARN ` `ERROR` to match the other stacks.
> `{Message:lj}` and `{Context:l}` mean the string is not wrapped in an extra layer of `"`.

### Middleware correlation id

```csharp
using System.Text.RegularExpressions;

public sealed class CorrelationIdMiddleware(RequestDelegate next)
{
    public const string Header = "X-Request-Id";
    // accept from the customer only letters, digits, and - up to 36 characters — blocks people stuffing long text or \n into the log
 into the log
    private static readonly Regex Valid = new("^[A-Za-z0-9-]{1,36}$", RegexOptions.Compiled);

    public async Task Invoke(HttpContext ctx)
    {
        var cid = ctx.Request.Headers[Header].FirstOrDefault();
        if (cid is null || !Valid.IsMatch(cid))
            cid = Guid.NewGuid().ToString("N")[..8];   // missing or invalid → create a new one

        var logCid = cid.Length > 8 ? cid[..8] : cid;   // the log uses the first 8 characters to fit the cid column (same as Node/Python) — the header returns the full value

        ctx.Response.Headers[Header] = cid;          // return it so the customer can quote it

        // LogContext is tied only to this request's async flow — it does not mix with other requests
        using (Serilog.Context.LogContext.PushProperty("CorrelationId", logCid))
            await next(ctx);
    }
}
```

### Writing logs

```csharp
// Right: fixed message + values go in {Context} as k=v, per the format in SKILL.md item 1
//    Output: ... INFO   [a3f9c1b2] Orders  สร้างคำสั่งซื้อสำเร็จ  orderId=1042 ms=134
using (Serilog.Context.LogContext.PushProperty("Context", $"orderId={orderId} ms={sw.ElapsedMilliseconds}"))
    _logger.LogInformation("สร้างคำสั่งซื้อสำเร็จ");

// Wrong: a variable embedded in the string — every line becomes a different message and cannot be grouped
_logger.LogInformation($"สร้างคำสั่งซื้อ {orderId} สำเร็จ");
```

### Redacting secrets

Serilog does not redact secrets automatically. The surest way is to **never pass a whole object into the log**.
Pick only the fields you need. If you must pass the whole object, write an `IDestructuringPolicy`
or add `[NotLogged]` through `Destructure.ByTransforming<T>()`.

---

## Angular / frontend

The principle differs from the backend: **a browser cannot write files**, so important logs must be sent up to the backend.

```ts
// core/logger.service.ts
import { Injectable, inject, isDevMode } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type Level = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private http = inject(HttpClient);
  private buffer: unknown[] = [];

  private write(level: Level, message: string, ctx: Record<string, unknown> = {}) {
    // dev: print to the console for chasing problems — prod: silent, except WARN and above, which go to the server
    if (isDevMode()) console[level === 'ERROR' ? 'error' : 'log'](level, message, ctx);
    if (level === 'DEBUG' || (!isDevMode() && level === 'INFO')) return;   // prod sends only WARN and above

    this.buffer.push({ ts: new Date().toISOString(), level, message, ctx });
    if (this.buffer.length >= 10 || level === 'ERROR') this.flush();
  }

  /** Send in batches, not line by line — otherwise the network tab fills with the log's own requests */
  flush() {
    if (!this.buffer.length) return;
    const batch = this.buffer.splice(0);
    this.http.post('/api/client-logs', { entries: batch }).subscribe({ error: () => {} });
  }

  debug = (m: string, c?: Record<string, unknown>) => this.write('DEBUG', m, c);
  info  = (m: string, c?: Record<string, unknown>) => this.write('INFO', m, c);
  warn  = (m: string, c?: Record<string, unknown>) => this.write('WARN', m, c);
  error = (m: string, c?: Record<string, unknown>) => this.write('ERROR', m, c);
}
```

Catch every uncaught error:

```ts
// core/global-error.handler.ts
import { ErrorHandler, Injectable, inject, isDevMode } from '@angular/core';
import { LoggerService } from './logger.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private log = inject(LoggerService);
  handleError(err: unknown) {
    const e = err as Error;
    this.log.error(e?.message ?? 'unknown error', { stack: e?.stack?.slice(0, 2000) });
    if (isDevMode()) console.error(err);
  }
}
// app.config.ts → providers: [{ provide: ErrorHandler, useClass: GlobalErrorHandler }]
```

Send a correlation id with every request so client-side and server-side logs connect:

```ts
// core/correlation.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const correlationInterceptor: HttpInterceptorFn = (req, next) =>
  next(req.clone({ setHeaders: { 'X-Request-Id': crypto.randomUUID().slice(0, 8) } }));
```

**On the backend** you need an endpoint `POST /api/client-logs` that:
- Limits the body size and applies a rate limit. Otherwise it becomes a hole for people to flood you with logs.
- Writes to a separate file `logs/client-YYYYMMDD.log`
- **Treats the content as untrusted data**, so strip `\r\n` from every value just like a normal log

---

## Comparison table

| Topic | .NET | Node | Python | Angular |
|---|---|---|---|---|
| Library | Serilog | winston | stdlib `logging` | Hand-written (thin) |
| File rotation | `rollingInterval: Day` | `winston-daily-rotate-file` | `TimedRotatingFileHandler` | — (sent to the backend) |
| correlation | `LogContext.PushProperty` | `AsyncLocalStorage` + `child()` | `ContextVar` | header `X-Request-Id` |
| Level | `LogEventLevel` | `level` | `setLevel` | Its own enum |
| External configuration | `appsettings.json` | env `LOG_LEVEL` | env `LOG_LEVEL` | `isDevMode()` |


---

# skill: auth-implementation-patterns

Use when building login with sessions, JWT, OAuth or SSO

# Authentication Implementation Patterns

## When to use this skill

- Building login/signup/logout
- Adding password reset flow
- Adding multi-factor authentication (MFA): TOTP, SMS, WebAuthn
- Choosing session vs token authentication
- Integrating OAuth or OpenID Connect (OIDC) logins (Google, GitHub, etc.)
- Implementing single sign-on (SSO) with SAML or OIDC
- Designing API authentication (API keys, JSON Web Token (JWT), OAuth)
- Reviewing existing auth code for security issues

## อ่านเพิ่มเมื่อ

| ไฟล์ | เปิดเมื่อ |
|---|---|
| [references/auth-flows.md](references/auth-flows.md) | When writing session, JWT, OAuth with PKCE or password reset code, open it for the step-by-step order |
| [references/mfa.md](references/mfa.md) | When choosing or building MFA and you need TOTP setup steps, WebAuthn usage or the limits of SMS |
| [references/api-auth-and-authorization.md](references/api-auth-and-authorization.md) | Open this file if you are designing API authentication or API keys, or need RBAC and ABAC examples |
| [references/libraries-and-code.md](references/libraries-and-code.md) | When choosing a library by language, or you need sample code for password hashing and rate limiting |

## Choose the Right Pattern

```
What's authenticating?
│
├─ Browser user
│  ├─ First-party app → Session cookies (HttpOnly, Secure, SameSite)
│  └─ Need cross-domain → JWT with httpOnly cookie (NOT localStorage)
│
├─ Mobile app
│  └─ Token-based: OAuth 2.0 PKCE flow
│
├─ Service-to-service
│  ├─ Same org → mTLS or service mesh
│  └─ External → OAuth 2.0 Client Credentials
│
└─ Third-party developer
   └─ API keys (with rotation) OR OAuth
```

## Pattern 1: Session-Based Auth (Most apps)

**When to use:** server-rendered apps, monoliths, one domain

**Implementation requirements:**
- Cookie: `HttpOnly`, `Secure`, `SameSite=Lax` (or Strict)
- Session ID: cryptographically random, ≥ 128 bits
- Session storage: Redis with a time-to-live (TTL). Not in app memory if you run more than one instance
- Idle timeout: 30 min default
- Absolute timeout: 8-12 hours
- Issue a new session ID when privileges change (login, role change)
- On logout, delete the session from the store

**Pitfalls:**
- ผิด: Storing session in JWT (can't revoke)
- ผิด: Using `localStorage` for the session token (cross-site scripting (XSS) can steal it)
- ผิด: Keeping the same ID after login (session fixation)

## Pattern 2: JWT (Stateless Token)

**When to use:** microservices, mobile, single-page app (SPA) with a backend API

> Caution: **JWT is overused.** If you have a single backend, sessions are simpler and safer.

**Implementation requirements:**
- Algorithm: `RS256` or `ES256` (NOT `HS256` for distributed systems)
- Short-lived access token: 5-15 min
- Refresh token: longer-lived (days), stored separately, revocable
- Issue a new refresh token each time one is used
- Required claims: `sub`, `iat`, `exp`, `iss`, `aud`
- Store JWT in `HttpOnly Secure cookie` (NOT localStorage)
- Have a way to cancel tokens (blocklist, short expiry, etc.)

**Pitfalls:**
- ผิด: `alg: none` attacks (check the algorithm explicitly)
- ผิด: Storing JWT in `localStorage` (XSS-stealable)
- ผิด: Long-lived access tokens (you can't cancel them)
- ผิด: Putting sensitive data in JWT (it's base64, not encrypted)
- ผิด: Skipping signature verification

## Pattern 3: OAuth 2.0 / OIDC

**When to use:** "Login with Google/GitHub", or handing login to an identity provider (IdP)

Use Authorization Code Flow with PKCE (Proof Key for Code Exchange) always, because it stops a stolen code from being exchanged for a token. The steps are in [references/auth-flows.md](references/auth-flows.md)

**Implementation requirements:**
- **Always use PKCE** (even for confidential clients)
- Validate `id_token` signature (use IdP's JWKS)
- Validate `aud`, `iss`, `exp`, `nonce`
- Use the `state` parameter to prevent cross-site request forgery (CSRF)
- Match `code_verifier` to `code_challenge`
- Use a library, don't write your own (Auth0, Passport.js, etc.)

**Pitfalls:**
- ผิด: Implicit flow (deprecated, insecure)
- ผิด: Resource Owner Password Credentials flow (deprecated)
- ผิด: Skipping `state` validation (CSRF risk)
- ผิด: Trusting `id_token` without verifying signature

## Pattern 4: Multi-Factor Authentication (MFA)

There are 3 types. For a new app, use WebAuthn (passkeys) as the default, because there is no shared secret to steal. If you need 2FA that users can set up easily and that is standard, use TOTP. Use SMS or email only as a last resort, because SMS is not safe against SIM swap. Details of all 3 are in [references/mfa.md](references/mfa.md)

## Pattern 5: Password Management

### Storage
- ถูก: **Argon2id** (preferred) or **bcrypt** (cost factor ≥ 12)
- ผิด: Never: MD5, SHA-1, SHA-256 raw, plain text

### Password policy (NIST SP 800-63B-4 §3.1.1.2, checked 2026-10-14 at pages.nist.gov/800-63-4/sp800-63b.html)
- ถูก: Minimum **15 characters** when the password is the only factor · minimum **8** when it is used only inside multi-factor authentication (MFA)
- ถูก: Check against a list of breached passwords (Have I Been Pwned (HIBP) API)
- ถูก: Allow long passphrases (any maximum must be at least 64 chars)
- ถูก: Allow special characters (don't restrict them)
- Don't force composition rules (uppercase + digit + symbol)
- Don't force regular password changes (only when you suspect a breach)

### Password reset flow

Must-haves for password reset: the response message must be the same whether or not the email exists in the system. The token must be random with at least 256 bits, stored as a hash, and expire in 15 minutes. After the new password is set, revoke all old sessions and send a confirmation email. All 9 steps in order are in [references/auth-flows.md](references/auth-flows.md)

## Pattern 6: Account Lockout & Rate Limiting

```
Login attempts:
- 5 failed attempts in 15 min → lock account 15 min
- 10 failed attempts in 1 hour → lock 1 hour
- Use IP + email combo, not just one

Lockout messaging:
ถูก: "Too many failed attempts. Try again in 15 minutes."
ผิด: "Account locked." (reveals account exists)
```

Use existing tools instead of writing your own. The list of tools is in [references/libraries-and-code.md](references/libraries-and-code.md)

## Pattern 7: API Authentication

Choose by caller: API key for simple server-to-server · OAuth 2.0 Client Credentials for service-to-service · mTLS for internal systems that need high security · HMAC signing for verifying webhooks. For an API key, show the secret only once at creation, store it as a hash, and let users revoke it immediately. The comparison table and full principles are in [references/api-auth-and-authorization.md](references/api-auth-and-authorization.md)

## Authorization Patterns (after authentication)

Use RBAC (Role-Based Access Control) as the main model, and use ABAC (Attribute-Based Access Control) when you need fine-grained permissions based on data attributes. Examples are in [references/api-auth-and-authorization.md](references/api-auth-and-authorization.md)

### Implementation tip
- Check authorization at every endpoint
- Don't trust a role sent by the client
- Check on the server, using the user from the session or token

## Common Vulnerabilities Checklist

- [ ] Session fixation (regenerate ID on login)
- [ ] CSRF (token or SameSite cookie)
- [ ] Brute force (rate limiting)
- [ ] Credential stuffing, i.e. logins with leaked passwords (HIBP check, MFA)
- [ ] Open redirect (allowlist redirect URLs)
- [ ] User enumeration, i.e. finding which accounts exist (same error message every time)
- [ ] Timing attacks (compare in constant time)
- [ ] Token in URL (use header or cookie)
- [ ] Logout that does nothing on the server (invalidate server-side)
- [ ] Privilege escalation (re-check after role change)

## Anti-patterns

- Writing your own crypto or auth (use libraries)
- Storing passwords reversibly
- JWT for sessions when you have one backend
- Long-lived JWT without rotation
- Authentication without authorization checks
- Trusting JWT claims as authorization source
- Logout that doesn't invalidate token server-side
- Allowing weak passwords for compliance "convenience"


## reference: api-auth-and-authorization.md

# API Authentication และ Authorization Patterns

How each type of API authentication works, principles for managing API keys, and examples of RBAC and ABAC

## Pattern 7: API Authentication

| Method | Use case | Token format |
|--------|----------|--------------|
| **API Keys** | Server-to-server, simple | `sk_live_xxx` |
| **OAuth 2.0 Client Credentials** | Service-to-service | JWT bearer |
| **mTLS** (both sides present certificates) | High-security, internal | X.509 certs |
| **HMAC signing** | Webhook verification | `HMAC-SHA256` |

### API Key best practices
- Prefix with environment: `sk_test_xxx`, `sk_live_xxx`
- Show the secret ONCE, when it is created
- Store it hashed (like a password)
- Allow scopes/permissions per key
- Allow expiry and replacement
- Show when each key was last used
- Let users revoke a key instantly

## Authorization Patterns (after authentication)

### RBAC (Role-Based Access Control)
```
User → Role → Permissions
e.g., user@example.com → admin → [users.read, users.write, billing.read]
```

### ABAC (Attribute-Based) — fine-grained
```
Allow if user.department === resource.department AND action === "read"
```


## reference: auth-flows.md

# ลำดับขั้นของแต่ละ flow

Step-by-step order for session, JWT, OAuth with PKCE and password reset. Use it when writing code, or when reviewing whether the code covers every step. The requirements and mistakes to avoid are in `SKILL.md`

## Pattern 1: Session-Based Auth — Flow

```
1. User submits credentials
2. Server validates, creates session ID
3. Server stores session in Redis/DB
4. Server sets HttpOnly Secure cookie
5. Client sends cookie on every request
6. Server looks up session, identifies user
```

## Pattern 2: JWT — Flow

```
1. User submits credentials
2. Server validates, signs JWT
3. Client stores JWT (in HttpOnly cookie preferred)
4. Client sends JWT on every request (Authorization header or cookie)
5. Server verifies signature, extracts claims
```

## Pattern 3: OAuth 2.0 / OIDC — Authorization Code Flow with PKCE

PKCE = Proof Key for Code Exchange. It stops a stolen code from being swapped for a token.

```
1. App → IdP: /authorize?code_challenge=...
2. User logs in at IdP
3. IdP → App: /callback?code=...
4. App → IdP: /token (with code_verifier)
5. IdP → App: access_token + id_token + refresh_token
```

## Pattern 5: Password reset flow

```
1. User requests reset (enter email)
2. Server: always show "if email exists, link sent" (don't leak)
3. Generate random token (≥ 256 bits), hash it, store with expiry (15 min)
4. Email link with raw token
5. User clicks → /reset?token=...
6. Server hashes input, compares, verifies expiry
7. User sets new password (apply policy)
8. Invalidate all existing sessions
9. Send confirmation email
```


## reference: libraries-and-code.md

# ไลบรารีและโค้ดตัวอย่าง

Sample code for storing passwords, rate-limiting tools, and recommended libraries by language

## Password storage — code

```typescript
// Good (using bcrypt)
const hash = await bcrypt.hash(password, 12);
const valid = await bcrypt.compare(password, storedHash);

// Bad
const hash = crypto.createHash('sha256').update(password).digest('hex');
```

## Rate limiting tools

Use existing tools:
- `express-rate-limit` (Node.js)
- `django-ratelimit` (Django)
- Cloudflare / AWS WAF (edge)

## Library Recommendations

| Stack | Library | Notes |
|-------|---------|-------|
| Node.js | `passport`, Auth.js, Better Auth | Lucia v3 is deprecated (lucia-auth.com, checked 22 Oct 2026) so do not start new work on it; Better Auth status (รอยืนยัน, check before use) |
| Python | `authlib`, `PyJWT` (or `joserfc`) | authlib for OAuth; python-jose is rarely maintained (รอยืนยัน) |
| Go | `oauth2`, `golang-jwt` | Standard |
| Rust | `axum-login`, `jsonwebtoken` | — |
| Any | Auth0, Clerk, Supabase Auth | Managed (faster) |


## reference: mfa.md

# Pattern 4: Multi-Factor Authentication (MFA)

Details of all 3 types of multi-factor authentication. Use it when choosing or building MFA

## TOTP (Google Authenticator, Authy)
**When:** standard two-factor login (2FA), easy for users. TOTP = time-based one-time password.

```
Setup:
1. Server generates random secret (160 bits)
2. Server shows QR code: otpauth://totp/...?secret=...
3. User scans with authenticator app
4. User confirms with first code
5. Server stores secret encrypted

Verify:
1. User enters 6-digit code
2. Server computes expected code(s) (±1 window for clock drift)
3. Match → grant access
```

## WebAuthn (Passkeys) — Future-proof
**When:** you want login that phishing can't beat, no SMS, hardware keys

- Use `@simplewebauthn` library
- Supports Touch ID, Face ID, YubiKey
- No shared secret, so nothing to phish
- Default for new apps in 2026+

## SMS / Email codes
**When:** there's no other option (users without smartphone apps)

- Note: SMS is **NOT secure** (SIM swap attacks)
- Use only as a last resort, never as the main method
- Use strict rate limits
- Codes: 6 digits, 5 min expiry
