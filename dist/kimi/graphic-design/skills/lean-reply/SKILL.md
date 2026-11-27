---
name: lean-reply
description: Use when replying in chat, to pick prose, table or diagram, short
---

# lean-reply — short chat answers in the right shape

> **The one rule:** the first line answers the question, in the shape the content has (comparison → table · connections → figure · one thing → sentences). Cut filler, never facts the reader needs.

## Hard rules
- answer-shape: whatever structure the content has, the answer uses that shape. Comparison → table · connections → figure · one thing → sentences.
- answer-shape: a table has content in every cell, 3–5 columns, at most 8 rows in chat. A 1–2 row table, or a figure that draws what one sentence can say, is the wrong shape.
- answer-shape: if you cannot continue, list only what is blocking and what you need from the user. 1 line per item, at most 4 items.
- open items: every open item names who it waits on, using `(รอยืนยัน · ผู้ใช้: …)` · `(รอยืนยัน · agent: …)` · `(รอยืนยัน · ภายนอก: …)` (superuser `references/evidence.md`). When the user has anything to do, end with **ต้องให้คุณทำ**: one line per item, starting with a verb, saying exactly what, where and how. Items the agent will do itself never go there. Owner 2026-11-27: "ระบุด้วยว่าอยากให้ user ทำอะไร บอกให้ชัดเจน".
- short-answers: ตอบคำถามก่อน แล้วค่อยอธิบาย และอธิบายเท่าที่เปลี่ยนการตัดสินใจของเขา. The first line is the answer, not a preamble and not the question repeated.
- short-answers: still say what went wrong, what you did not test, and where you disagree. Short does not mean cutting the truth; cut padding, not content the reader needs.
- caveman: terse mode is for chat only (replies · review notes · standup pings). Never use it in documents, specs, reports, READMEs, commit messages, PR descriptions, code, code comments, or anything a client or non-team reader will see.
- caveman: default level is lite. Switch with `caveman lite | full | ultra`; off on "stop caveman" or "normal mode". Keep technical terms exact, code blocks unchanged, error text quoted exact.
- caveman: go back to normal sentences for security warnings, confirming an irreversible action, multi-step instructions where order matters, or when the user asks for clarification.

## Parts
| When | Open |
|---|---|
| Choosing prose, table, list or figure; comparing options; blocked and must ask | [parts/answer-shape/guide.md](parts/answer-shape/guide.md) |
| User wants a terse chat style (caveman lite · full · ultra) | [parts/caveman/guide.md](parts/caveman/guide.md) |
| User asks a plain question and wants a short Thai answer | [parts/short-answers/guide.md](parts/short-answers/guide.md) |

## Check before done
- The first line answers the question.
- The shape matches the content, and every table cell has content.
- Mistakes, untested limits and disagreements are still stated.
- Caveman was not used in anything that leaves the team.
