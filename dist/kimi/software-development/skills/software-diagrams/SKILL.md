---
name: software-diagrams
description: Use when a README or PR needs a quick Mermaid diagram
---

# Software Diagrams

> **Language:** every line of wording follows `human-writing`. This skill gives the format and structure, while human-writing says how to write so a reader understands.

> **The one rule of this skill:** a diagram answers **one question**.
> If it answers 2 questions, draw 2 pictures.

> **The destination decides the tool:** this skill draws quick diagrams with Mermaid in the house theme, only for a README · Pull Request · note in code.
> For figures in project documents (BRD · SRS · FSD · ADR · ER · process maps), client proposals, slides and print work, go to `diagram-figures`. The full table for choosing is at the top of that skill.
>
> **Colour in a figure must carry meaning, not decorate.** If the source document already declares a `doc-theme`, use that value and do not pick new colours per figure (the default is the house set in `polished-document-style` · for the meaning of colours see `branded-document-design/references/tokens-and-type.md`):
> A quick diagram uses **one main colour** = "the thing we are talking about" · grey = external/closed systems · white with a grey line (`store`) = data stores · other boxes use the defaults (3 classes `focus` · `ext` · `store` in `assets/mermaid-theme.md`). If you need several colours to separate failure points, exceptions and successes, the figure answers several questions. Split it into new figures or use `diagram-figures`.

## When to use this skill

In a README · Pull Request · note in code:

- Explain the system architecture
- Explain the order of work across several parts
- Explain the states of data
- Design a database
- Say what runs on which machine
- Review a diagram someone else drew

## When **not** to use

| Job | Use this instead |
|---|---|
| Choose which kind of picture to use (SVG / ASCII / Mermaid) | `markdown-visuals` |
| Screenshots · wireframes | `ui-craft` + the platform skill |
| Data charts | `web-app-design` → `references/tokens.md` heading "สีข้อมูล (กราฟ)" (data colours, charts) |
| Choose an architecture | `architecture-patterns` |

## 1 · Which question, which diagram

**Start from the question, not from the diagram type.** People draw wrongly because they pick the type first and then stuff content into it.

| The question in the reader's head | Diagram |
|---|---|
| "Who outside does this system talk to?" | C4 level 1 — System Context |
| "What is inside the system? Do the parts run separately?" | C4 level 2 — Container |
| "How is this service divided inside?" | C4 level 3 — Component |
| "When I press this button, what happens, in order?" | Sequence |
| "How can this document change state?" | State |
| "Which table links to which table?" | Entity Relationship (ER) |
| "What machines does the real thing run on, and how many?" | Deployment |
| "Who approves after whom?" | Flowchart (work steps) |
| "A cloud diagram in the repo with real AWS / Azure logos" | Infrastructure — section 3 |
| "I want a nice picture for the client proposal" | Not the job of this skill — `diagram-figures` |

> The **C4 model** is a way to draw architecture in layers, like zooming a map:
> level 1 looks from outside the system · level 2 opens the lid and looks inside · level 3 zooms into a single box.
> **Always draw levels 1 and 2 in full first.** Draw level 3 only for the parts that are truly complex.

## 2 · Theme — one set for the whole project

Put the `%%{init: ...}%%` line on the **very first line** of every diagram, and use the one main colour with the 3 classes `focus` · `ext` · `store`. The main colour is reserved for "the thing we are talking about" only.
The theme line, colour stand-ins, classes and rendered examples are in [`assets/mermaid-theme.md`](assets/mermaid-theme.md). The table that matches kinds of work to colour tones is in `diagram-figures/references/colour-by-domain.md`.

> Warning: **`fontFamily` must sit outside `themeVariables`.** If you put it inside, it is silently ignored and Mermaid falls back to its default font.

**Check with a tool before every send.** This rule is forgotten most often (one test project had 63 of 66 figures with no theme line, and nobody noticed):

The scripts are in the `scripts/` folder of this skill. Run them with the script's full path and the `docs` folder of the project being checked (`<path ของ skill>` = the folder where this skill is installed):

```bash
node <path ของ skill>/scripts/check-mermaid-theme.mjs docs          # exit 1 with file:line of each block that lacks %%{init
node <path ของ skill>/scripts/check-mermaid-theme.mjs --self-test   # proves the checker still catches it
```

An agent with no shell cannot run it → the main agent runs it after taking the work back.

## 3 · Diagrams that need real logos (infrastructure)

If an infrastructure diagram that lives in the repo needs real Amazon Web Services (AWS) · Azure · Kubernetes icons, which Mermaid cannot draw, use the **`diagrams`** library (Python + Graphviz), starting from [`assets/infra-diagram.py`](assets/infra-diagram.py).
Install steps, the commonly used node rules and the traps are in [`assets/diagrams-python.md`](assets/diagrams-python.md). For cloud diagrams that a client or a slide will show, use `diagram-figures`.

## 4 · Rules that make it readable

**No more than 7 boxes.** Past that, readers stop reading (count real boxes, not subgraphs).

**Count boxes before drawing, not after.** If there are more than 7, **split the figure by the order of the story before drawing**. Note the split in `decision-log` and say so in the reply.
Never draw everything and then say so afterwards.

The sample reply to the Thai user (kept in Thai because it is the text the agent says):

```
เนื้อหาที่ให้มามี 20 กล่อง เกินเพดานสามเท่า ขอแยกเป็น 3 รูป:
  รูปที่ 1 — ตอนทดลอง: อะไรเข้า อะไรออก
  รูปที่ 2 — ตอนรันชุดการทดลอง
  รูปที่ 3 — ตอนออกรายงาน
อยากแบ่งแบบอื่น บอกได้ — แยกใหม่ได้
```

> **"Separate files are fine" means you must split.** If the request leaves room to split and the content passes the cap,
> treat it as an order to split, not an option.

**These 3 things do not belong in a diagram.** They are manual content, not a picture, and they swell the boxes until the diagram warps.

| Do not put in | Where it goes |
|---|---|
| Command-line options `--all` `--resume` `--limit N` | `README` or `docs/cli.md` |
| Lists of inputs/outputs for several parts | **A table beside the figure** — columns: component · takes what · gives what · stored where |
| Every file name or path | The same table. Put in the figure only the ones that carry the point |

**A request like "show the input/output too" does not mean draw everything as boxes.**
A box is something that *does work*. What *flows through* is a label on the line. *Detail* goes in the table.

**One level of detail across the whole figure.** If `PostgreSQL` and `OrderRepository.cs` sit in the same figure,
that signals a mix of 2 levels.

**Every line needs a label,** and the label must say **what flows through**, not that they are connected.

```
Wrong: api --> db
Wrong: api -->|ใช้| db
Right: api -->|SQL · อ่าน-เขียนคำสั่งซื้อ| db
```

**One direction.** Top to bottom (`TB`) or left to right (`LR`). Choose one and let no line run backwards.
A backward line means the boxes are in the wrong order. It does not mean you need a double-headed arrow.

**Box name = what it does, not the technology.** Put the technology on a second line in small type.

```
Wrong: [Redis]
Right: ["ที่พักข้อมูลชั่วคราว<br><small>Redis</small>"]
```

**Add a legend when colour or shape carries meaning.**
If you cannot explain why this box has a different colour, that colour should not be there.

## 5 · Thai in diagrams

- **A Thai line label longer than 3 words overlaps the line.** Shorten it, or add `<br>` yourself.
- **Do not use `()` `[]` `{}` in text.** They clash with Mermaid syntax. Always wrap the text in `"..."`.
- **Tone marks float above the box** when `fontSize` is below 12px. Do not go lower.
- Table and field names in an ER diagram use English (matching the real database).
  Descriptions can use Thai.

## 6 · Render and look — never skip

A diagram that was never rendered is still only text, not a picture. Some syntax mistakes give no error in Mermaid,
and the result often does not match what you thought.

```bash
# not installed on the machine · pin the version the theme was tested on (11.17.0 · the latest 12.0.0 as of 2026-10-14 has not been tested with the theme)
npx -y @mermaid-js/mermaid-cli@11.17.0 -i diagram.mmd -o diagram.png -b white -s 2
```

Then **open the image file and look at it with your eyes**. Go through this list:

- [ ] Are there at most 7 boxes?
- [ ] Does every line have a label, and does the label say what flows through?
- [ ] Does any line run in the opposite direction?
- [ ] Does a label overlap a line or a box?
- [ ] Is the Thai text complete, with no missing vowels?
- [ ] Is the level of detail the same across the figure?
- [ ] Can someone who has never seen this system read it and answer the original question?

**Mermaid limits to know before you waste time:**

| Symptom | Cause |
|---|---|
| `direction LR` inside a subgraph does not work | It is ignored when the subgraph has a line linking out — order the boxes yourself |
| A box is abnormally wide | One long line of text — add `<br>` yourself, Mermaid does not wrap lines |
| Lines overlap in a mess | Too many boxes — Mermaid has no smart line routing, so cut boxes |
| The font does not change | `fontFamily` is in the wrong place (see section 2) |

If you truly cannot get the layout you want and the figure stays in a markdown document, draw an inline SVG per `markdown-visuals`. If the figure must look designed, go to `diagram-figures`.

## 7 · Anti-patterns

- **A 40-box architecture diagram** — nobody reads it. Split it into several C4 levels.
- **Drawing past the cap and then saying so** — split as soon as you count that it is over.
- **Stuffing command-line options into a box** — the box swells, the letters shrink, and the whole figure is unreadable.
- **A line with no label** — the reader guesses what flows through, and guesses wrong.
- **Mixing levels of detail** — `Kubernetes` sitting next to `UserService.validate()`.
- **Rainbow colours** — colour must carry meaning. Do not add it to avoid boredom.
- **Drawing every error case in one sequence** — draw the main path first, then split the special cases into separate figures.
- **An ER diagram with every table in the system** — split by domain.
- **A diagram with no date and no owner** — after a year nobody dares to edit it.
- **Sending a diagram that was never rendered**
- **A different theme in every figure of one document**

## 8 · Link to other skills

| Need | Use with |
|---|---|
| Choose the visual format in a markdown document | `markdown-visuals` |
| The document around the diagram | `polished-document-style` |
| Embed in a Word / PowerPoint file | `branded-document-design` |
| A diagram in an SRS document | `srs-writing` |
| Choose the architecture before drawing | `architecture-patterns` |
| A figure that must look designed or needs sign-off | `diagram-figures` |
| Record why this design was chosen | `adr-writer` |

## Do not look AI-made

Before sending, walk through item 3 of `no-ai-look`. For HTML work, run its script. Every job must also pass eye check 3.2 (web pages also answer items 10–14), because a script result of 0 items is not yet a pass. The bans in this file are specific to this kind of work. The full list for every medium is there.

## Abbreviations

Always spell an abbreviation out in full the first time, and put the abbreviation in brackets — for example Model Context Protocol (MCP).
After that you can use the abbreviation. For details see the skill `spell-out-abbreviations`.
