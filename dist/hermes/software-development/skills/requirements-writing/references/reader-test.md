# Fresh-reader test — for SRS · FSD · BRD before sending to the customer

A checklist says the sections are all there. It does not say the reader understood what we meant. In this method, an agent that never saw the meeting reads the document and answers questions. A wrong answer, or an answer of "don't know", marks a gap in the document. (Adapted from Stage 3 Reader Testing of `doc-coauthoring` in anthropics/skills · viewed 2026-11-10 · not a literal translation)

## Steps

1. **Write 8–10 questions before showing the document to anyone** — questions a developer and QA would really ask, such as "what happens on a double booking of the same time" · "which statuses can be reversed" · "how is the amount rounded" · "who may cancel". Write down the correct answer to each first (from us).
2. **Send to a new agent that gets only the document file** — no chat history, no code, no other files (`handoff` · empty folder). It answers one question at a time and cites the section it used.
3. **Compare with the correct answers** — wrong · answered "don't know" · right but had to guess = 1 gap.
4. **Fix the document at that point, then ask the same question again to another new agent** — do not change the answer to match.
5. **If it fails, do not send to the customer** — it passes when every question is answered right without guessing.

## Thai-specific questions (add at least 2)

- Are years on screens and reports in Buddhist Era (พ.ศ.) or Common Era (ค.ศ.)? Which field is stored as which in the database?
- What format do document numbers (quotations · tax invoices) use, and when does the count restart?

## Bilingual documents

Have a different new agent read the Thai version and the English version, answer the same set of questions, then compare the answers. A difference = the 2 versions do not match.
