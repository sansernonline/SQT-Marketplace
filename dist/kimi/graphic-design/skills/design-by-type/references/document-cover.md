# Word/PDF cover and inner pages

Building the real .docx (tokens, `anchor_picture()`, tables, the cover vote) lives in `software-development:document-design`, with its own cover rules in `cover-design.md` and `anti-patterns.md`. This file adds only what the 2026-11-19 test found that those files do not say yet. Tested on a fictional Thai private-hospital appointment-system SRS (cover + 1 inner page, A4); the test images are kept in `scripts/evals/beauty/baseline/2026-11-19/`.

## Where to look

| Source | What it gives | Popularity shown |
|---|---|---|
| Dribbble search `annual report cover` · `healthcare report` | covers and spreads | likes · views (e.g. "2022 Reputation Healthcare Report": 56 likes · 16k views, 2026-11-19) |
| 100 Archive and similar curated award archives | covers that passed a jury | inclusion is the signal; no counts |
| Real reports from the client's industry (Thai hospitals publish annual, CG and TCFD reports as PDF) | the local standard to beat | the organisation itself |
| Thai government annual reports | the floating-earth, glowing-icon covers to avoid | none |
| Behance · Freepik · Venngage | more covers | blocked to scripts 2026-11-19 |

## Rules not yet in branded-document-design

1. Confetti and small shapes must mean something from the system (released booking slots, appointments per half hour). Random confetti reads as AI.
2. With no logo or real screenshot, build the art from the system's own unit of data (time slots, a clinic clock face, a queue) instead of drawing a fake screen.
3. The system name is the single largest line; the document type (SRS) is the second line. A long type name first wrapped and ran into the meta row in the test.
4. Thai headings at 84–92 px on A4 at 150 dpi: measure the width first, then `nowrap` or reduce; two drafts failed this.
5. A gradient ribbon uses 2–3 stops of one hue, a lighter edge on the lit side, and a shadow in the same direction as everything else (source: Rotunda Hospital Annual Report 2024 on 100 Archive).
6. Chapter openers use one solid chapter number in the main colour; outline or blurred numbers read as AI (eye check 2026-11-19).
7. Cover and inner page share one element (a ribbon piece, a dark band), but the cover art is never repeated small inside.
8. A light cover lets colour flow into the lower half (a soft tint or the ribbon's tail at the bottom edge), or it reads as the empty white cover the owner disliked (taste log 2026-11-18).
9. Priority labels in requirement tables use words (ต้องมี / ควรมี), not colours alone.

## Stiff or AI-looking in the first drafts (2026-11-19) and the fix

- A 7×9 grid of identical slots looked generated → 5×6 with bigger slots and one lifted "booking now" slot.
- Concentric rings with dots looked like radar or space → a clinic clock face with a slot label.
- A blurred gradient number clipped by its filter box (a glow blob) → solid number, no shadow.
- Thai headings breaking mid-phrase ("เลขประจำ/ตัวผู้ป่วย") → shorter headings, breaks at phrase ends.

## Check before sending
- Run the check list in `document-design`, then:
- [ ] The cover art comes from the system's own data
- [ ] System name is the largest line and fits on one line
- [ ] Lower half of a light cover carries colour
- [ ] Each direction says how it is built in real Word (background PNG anchored, text as Word text)
