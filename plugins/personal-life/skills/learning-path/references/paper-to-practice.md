# Paper to Practice

Open when the user brings a paper, RFC or article and wants to apply it. From "I read it" to "it runs on my machine". Used with the `tech-mentor` agent.

Not for: only understanding English wording in a paper or RFC → `english-tech-reading` · writing it up as a thesis or report → `thesis-writing`.

## Steps

1. **Brief** — the problem, the core idea in 1 paragraph, why it beats the alternative, and 1 line on limitations the authors admit
2. **Scope the example** — the smallest program that shows the core idea. Do not reproduce the whole paper
3. **Build it** — runnable code in the user's language of choice, standard library first, at most 1 dependency unless the idea needs more
4. **Run and verify** — actually run it. The output is part of the deliverable
5. **Note** — 1 page: the idea, the example, where it applies in the user's world, where it does not

Worked example — "bloom filters" from the original idea to running code (brief → scope → Python code → run → note): [bloom-filter-example.md](bloom-filter-example.md)

## Template

Use [practice-note-template.md](practice-note-template.md) for the one-page note.

## Rules

- The example runs, or the deliverable says why it could not and what was tried
- Turn math into code or concrete numbers. A formula nobody calculated teaches nothing
- Credit the source with title, authors, and date in the note
- Thai wording in the note passes the EN→TH checklist in `english-tech-reading` `references/decode-template.md` (`human-writing` `references/thai-grammar.md` section 7)
- If the core idea needs infrastructure the user lacks, use a simulation instead and say so
