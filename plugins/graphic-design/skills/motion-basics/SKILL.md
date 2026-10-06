---
name: motion-basics
description: Use when a non-designer makes motion graphics, animated text, transitions or a moving logo that should not look amateur. Gives timing in milliseconds, named easing curves, the 12 animation principles condensed and how long on-screen text must stay.
---

# Motion Basics

Motion is emphasis. Everything else is decoration. Most amateur motion has three faults: linear easing, everything moving at once, and text that leaves before anyone could read it.

## Workflow

1. **Name the purpose** of each movement — reveal, connect, emphasise, transition. No purpose, no motion
2. **Pick one entrance and one exit style** for the whole piece (e.g. fade-up in, fade out)
3. **Set durations** from the timing table
4. **Set easing** from the easing table — never linear for objects
5. **Stagger** groups: 40–80 ms between items, not all at once
6. **Hold text** long enough to read (text timing below)
7. **Review** at 1× with sound off, then on a phone; cut anything that does not help the message

## Timing

| Movement | Duration |
|---|---|
| Small UI-like change (button, icon, highlight) | 100–200 ms |
| Element entering or leaving (text line, card, badge) | 200–300 ms |
| Large move across the frame, panel slide | 300–500 ms |
| Scene transition, logo reveal | 500–1000 ms, only for deliberate pacing |
| Stagger between items in a group | 40–80 ms |
| Hold before the next beat starts | ≥ 300 ms of stillness |

Exits are about 20–30% shorter than entrances — the viewer already knows what is leaving.

## Easing

| Name | Curve (CSS) | Use |
|---|---|---|
| linear | `linear` | Only colour fades, rotating loaders, scrolling tickers |
| ease | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Generic default, slightly better than linear |
| ease-in | `cubic-bezier(0.42, 0, 1, 1)` | **Exits** — starts slow, leaves fast |
| ease-out | `cubic-bezier(0, 0, 0.58, 1)` | **Entrances** — arrives fast, settles gently |
| ease-in-out | `cubic-bezier(0.42, 0, 0.58, 1)` | Moving from one place to another on screen |
| Material 3 "standard" | `cubic-bezier(0.2, 0, 0, 1)` (รอยืนยัน) | Crisp modern ease for most moves |
| Overshoot / back | e.g. `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful brands only; once per piece |

ตรวจล่าสุด 2026-10-06 · แหล่ง: CSS Easing Functions Level 1 https://www.w3.org/TR/css-easing-1/ · Material 3 https://m3.material.io/styles/motion/easing-and-duration (page not readable at check time)

In After Effects, CapCut, Canva or Premiere: "ease-out" = ease in on the *arriving* keyframe ("Easy Ease In" in After Effects); when unsure, use the app's "ease out" preset for entrances.

## The 12 principles, condensed for marketing motion

From Disney animators Frank Thomas and Ollie Johnston, *The Illusion of Life* (1981). Full table: [twelve-principles.md](references/twelve-principles.md).

| Use often | Use sometimes | Mostly for character animation |
|---|---|---|
| Slow in and slow out (easing) · Timing · Staging (one thing at a time) · Anticipation (small pull back before a move) · Follow-through (settle after stop) | Arcs · Secondary action · Exaggeration · Squash and stretch (for bouncy brands) | Straight-ahead vs pose-to-pose · Solid drawing · Appeal |

## On-screen text timing

| Text | Minimum on screen |
|---|---|
| Thai subtitles (Netflix rule) | Reading speed ≤ 17 characters per second for adults; event 5/6 s to 7 s |
| Short headline (≤ 5 words / ≤ 25 Thai characters) | 1.5–2 s after it finishes animating in |
| Offer or price | ≥ 2.5 s, and repeated at the end |
| Legal or terms line | ≥ 3 s, or put it in the caption |

Thai character counts exclude tone marks and above/below vowels (Netflix Thai guide). House rule for marketing text, which is read while also watching: seconds = characters ÷ 12, minimum 1.5 s.

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://partnerhelp.netflixstudios.com/hc/en-us/articles/220448308 · https://partnerhelp.netflixstudios.com/hc/en-us/articles/215758617

**Worked example:** "ซื้อ 1 แถม 1 ถึง 15 เม.ย." — 16 counted characters plus 6 spaces = 22 → 22 ÷ 12 ≈ 1.8 s → hold 2.5 s because it is the offer.

## Common fixes

| Amateur | Fix |
|---|---|
| Letters popping in one by one | Fade-up the whole line, 250 ms ease-out, 8–16 px rise |
| Every element bounces | One bounce for the hero item; the rest fade |
| Spinning or zooming logo | Hold the logo still 1.5 s; animate a mask or underline instead |
| Different transition between every scene | One cut style; save one special transition for the reveal |
| Text appears and leaves in 0.8 s | Use the text timing table |
| Motion over the platform UI area | Keep animated text inside the safe zone (`social-formats`) |

## Rules

- Motion must survive muting and 2× speed — if the meaning dies without it, it was decoration
- One primary mover per moment; others stay still or move less
- Fast flashing: avoid more than 3 flashes per second (WCAG 2.3.1) — it can trigger seizures
- When in doubt, cut the motion in half and make it a third shorter

## Related

- `video-script-to-clip` — beats and captions for whole clips
- `style-consistency` — one motion style across a campaign
