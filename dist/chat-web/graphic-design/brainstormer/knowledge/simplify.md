# skill: simplify

Use to cut extras nobody needs yet. Not Claude Code simplify

# simplify — make it simple so a first-time reader can follow

> **One rule:** someone not on this work, opening it 6 months from now, must understand it and continue it without asking anyone.

## Use when
- Any work handed to people (code, documents, plans, designs, slides, tables, answers) may hold more than the task needs.
- Cutting a spec, plan or architecture to the fewest parts: also open [`references/architecture-and-anti-patterns.md`](references/architecture-and-anti-patterns.md).
- `human-writing` controls how it is written; this skill controls what the work contains.

Not for: Claude Code's own `/simplify` command · more detail on code (if installed) → `lazy-coding` · `readable-code` in plugin `software-development`.

## Steps
1. Climb the ladder and stop at the first step that works: (a) is this really needed? If not, do not do it and say in 1 line what you skipped; (b) is there an existing thing that works (file, template, function, tool, built-in feature)? Use it; (c) do the shortest version that is still complete and correct.
2. Do only what the task needs; cut before adding (if removing a part loses neither meaning nor function, cut it); plain things people know beat clever things that need decoding.
3. Apply by kind of work:
   - **Code:** names say what it is and carry units · 1 function does 1 thing · return early instead of nesting `if` · at most 3 levels of indentation · comments say why · follow the project's style. Avoid an abstraction with one user, clever hard-to-read shortcuts, one big file, a pile-up `utils/`, a new dependency for a few lines.
   - **Documents · reports:** conclusion first · 1 paragraph 1 topic · an example for abstract points · a table for compared data. Avoid repeats, empty headings, unknown terms.
   - **Plans · procedures:** 3–5 key items, each with an owner and a way to measure done · fewest steps that work. Avoid a 20-item list with no priority.
   - **Designs · slides · figures:** 1 page 1 point · shortest path to the user's goal · familiar patterns. Avoid cramming and decoration that does not help.
   - **Tables · data:** only columns used to decide · short formulas. Avoid columns that repeat a meaning and long nested formulas.
   - **Answers:** answer first, as long as the question needs.
4. **Simple is not sloppy:** never cut correctness, safety, validation of data from outside, error handling that prevents data loss, or what the user asked for explicitly. **Simple is not one big pile:** keep clear separation of duties, 1 part doing 1 thing.
5. When you take a deliberate shortcut, write how far it works and when it changes, for example `// simple: เก็บใน memory — ย้ายไป Redis เมื่อรันเกิน 1 process`, and put 1 line in the report: `ข้าม: X — เพิ่มเมื่อ Y`.

## Check before done
- [ ] An outsider can open it for the first time and understand within 30 seconds.
- [ ] No part, step or layer can be cut with no loss.
- [ ] Every added part has a reason it is needed now, not "just in case".
- [ ] Still complete on correctness, safety and what the user asked for.
- [ ] Duties still clearly separated, not squashed into one place to look short.

## References
- [`references/architecture-and-anti-patterns.md`](references/architecture-and-anti-patterns.md) — open for architecture, specs, plans or designs: architecture do and avoid, extra checks per output type, anti-patterns to reject (future-proofing · layer cake · resume-driven design), wrong and right examples


## reference: architecture-and-anti-patterns.md

# Architecture, specs and anti-patterns · simplify

Open this file for architecture, a spec, a plan or a design that keeps growing parts. It holds the rules not already in `SKILL.md`; each section ends with a line naming the rules `SKILL.md` covers.

## Extra checks before submitting

- **Simplest thing that works:** fewest moving parts, boring proven patterns. Add complexity only when something breaks.
- **Reads in one pass:** no jargon the audience lacks, and the whole thing fits in 2 sentences.
- Any "no" or "not sure" on these or on the `SKILL.md` checklist means: simplify before delivering.

Already in `SKILL.md`: a tired teammate gets it in 6 months (the One rule) · every new component, option or layer has evidence it is needed now (checklist) · nothing can be deleted without losing meaning, deleting beats adding (step 2 and checklist) · an example for every abstract claim (step 3, documents).

## Architecture

Do:
- Monolith first. Split only when a bottleneck is proven.
- A familiar stack and standard patterns: Representational State Transfer (REST), queues, caches.
- 1 source of truth per data type.

Avoid:
- Microservices for small teams · distributed-everything.
- Multi-master databases before you must.
- Event-driven by default. A synchronous call is simpler.

## Documents (BRD · SRS · FSD · ADR)

Business Requirements Document (BRD) · Software Requirements Specification (SRS) · Functional Specification Document (FSD) · Architecture Decision Record (ADR).

Do: sentences of at most 20 words · plain English.

Avoid: marketing-speak ("revolutionary", "best-in-class", "synergy") · walls of text · hedging ("might possibly potentially") · acronym soup.

Already in `SKILL.md`: 1 idea per paragraph · an example for every abstract point · tables for structured data · no undefined jargon (step 3, documents).

## Plans

Do: realistic timelines with buffer · cut scope to fit the time.

Avoid: vague goals ("improve quality") · aspirational dates with no buffer · plans without success metrics.

Already in `SKILL.md`: 3–5 priorities, a named owner per item, measurable success criteria · no 20- or 50-item list with no priority (step 3, plans).

## Designs (user experience (UX) · application programming interface (API))

Do: stay consistent across screens · defaults that work for 80% of users · progressive disclosure (show advanced options only when asked).

Avoid: a novel interaction where a standard one works · a 10-step flow when 3 steps work · required fields with no smart default · hidden features that need a tutorial.

Already in `SKILL.md`: fewest steps to the user's goal · reuse familiar patterns (step 3, designs).

## Anti-patterns to reject

- **Future-proofing:** abstractions for needs that never arrive.
- **"It might scale":** infrastructure for 1M users while you have 1k.
- **Layer cake:** 6 layers where 90% just pass the call through.
- **Resume-driven design:** fancy tech chosen to look sophisticated.
- **Buzzword stacking:** "cloud-native event-driven AI-powered".

## Wrong and right examples

**API description**

Wrong: "This sophisticated, enterprise-grade endpoint leverages state-of-the-art authentication to facilitate the seamless retrieval of user profile data."

Right: "`GET /users/{id}` returns a user profile. Requires a Bearer token. Use `?fields=name,email` to limit the response."

**Sprint goal**

Wrong: "Improve overall product quality and customer satisfaction through various initiatives."

Right: "Reduce login errors by 50% (8% → 4%): fix timeout bug (2d), retry on transient errors (1d), clearer error messages (1d)."

**Architecture for a new feature**

Wrong: "Event-sourced microservice with Command Query Responsibility Segregation (CQRS), Kafka ingestion, Redis cache, and a dedicated auth service."

Right: "Add an endpoint to the existing API. One Postgres table for state. Standard auth middleware. Log to the existing system."
