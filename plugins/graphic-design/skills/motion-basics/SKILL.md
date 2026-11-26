---
name: motion-basics
description: Use when a non-designer makes motion graphics
---

# Motion Basics

> **Pre-work gate (every time):** read the content and write the `เนื้อหา:` brief → read the owner's theme → search live references → 3 genuinely different directions → run the `design-gate/no-ai-look` check before sending · follow the "ด่านก่อนลงมือ" (pre-work gate) section of `design-gate/design-references` (plugin `superuser`) even when a brand exists (the brand controls colour and fonts, while the search finds the structure of this piece) · close the work with a `ด่านก่อนลงมือ:` line

Motion is emphasis. Everything else is decoration. Most amateur motion has 3 faults: linear easing, everything moving at once, and text that leaves before anyone could read it.

## Workflow

0. **Search for references first:** take the project's keywords and search live per `design-gate/design-references` (plugin `superuser`) type `motion`, then pull colours from the chosen work · use the stored palette library when a live search is not possible
1. **Name the purpose** of each movement — reveal, connect, emphasise, transition. No purpose, no motion. A background must carry meaning too. A background that only decorates is cut
2. **Pick 1 entrance and 1 exit style** for the whole piece (e.g. fade-up in, fade out)
3. **Set durations** from the timing table
4. **Set easing** from the easing table — never linear for objects
5. **Stagger** groups: 40–80 ms between items, not all at once
6. **Hold text** long enough to read (text timing below)
7. **Review** at 1× with sound off, then on a phone. Cut anything that does not help the message

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
| Material 3 "standard" | `cubic-bezier(0.2, 0, 0, 1)` | Crisp modern ease for most moves |
| Overshoot / back | e.g. `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful brands only; once per piece |

Material 3 tokens (copy the values, keep the names) and the source line → [`references/material-3-tokens.md`](references/material-3-tokens.md). The standard curve above is the one to use for most moves.

In After Effects, CapCut, Canva or Premiere: "ease-out" = ease in on the *arriving* keyframe ("Easy Ease In" in After Effects); when unsure, use the app's "ease out" preset for entrances.

## The 12 principles, condensed for marketing motion

Full table: [twelve-principles.md](references/twelve-principles.md).

| Use often | Use sometimes | Mostly for character animation |
|---|---|---|
| Slow in and slow out (easing) · Timing · Staging (one thing at a time) · Anticipation (small pull back before a move) · Follow-through (settle after stop) | Arcs · Secondary action · Exaggeration · Squash and stretch (for bouncy brands) | Straight-ahead vs pose-to-pose · Solid drawing · Appeal |

## On-screen text timing

| Text | Minimum on screen |
|---|---|
| Thai subtitles (Netflix rule) | Reading speed ≤ 17 characters per second for adults; each subtitle stays 5/6 s to 7 s |
| Short headline (≤ 5 words / ≤ 25 Thai characters) | 1.5–2 s after it finishes animating in |
| Offer or price | ≥ 2.5 s, and repeated at the end |
| Legal or terms line | ≥ 3 s, or put it in the caption |

Thai character counts exclude tone marks and above/below vowels (Netflix Thai guide). House rule for marketing text, which is read while also watching: seconds = characters ÷ 12, minimum 1.5 s.

**Worked example:** "ซื้อ 1 แถม 1 ถึง 15 เม.ย." — 16 counted characters plus 6 spaces = 22 → 22 ÷ 12 ≈ 1.8 s → hold 2.5 s because it is the offer.

## Common fixes

| Amateur | Fix |
|---|---|
| Letters popping in one by one | Fade-up the whole line, 250 ms ease-out, 8–16 px rise |
| Every element bounces | 1 bounce for the hero item. The rest fade |
| Spinning or zooming logo | Hold the logo still 1.5 s; animate a mask or underline instead |
| Different transition between every scene | 1 cut style. Save 1 special transition for the reveal |
| Text appears and leaves in 0.8 s | Use the text timing table |
| Motion over the platform UI area | Keep animated text inside the safe zone (`social-formats`) |

## Export as a GIF or WebM

When the destination wants a small moving file (email, chat, a web page) instead of a video post, open [`references/export-gif-webm.md`](references/export-gif-webm.md) for the ffmpeg commands, size rules and the `scripts/gif_check.py` check. Never overwrite the source; name the output with the version (`name-v02.gif`). Size ceilings per destination are (รอยืนยัน) until you open the destination's own help page.

## Rules

- Motion must survive muting and 2× speed — if the meaning dies without it, it was decoration
- Only 1 main element moves at a time. Others stay still or move less
- Fast flashing: avoid more than 3 flashes per second (Web Content Accessibility Guidelines (WCAG) 2.3.1) — it can trigger seizures
- When in doubt, remove half the moving elements, and make the rest about a third shorter

## Not an AI look

Before handing over, run the check in `design-gate/no-ai-look` (section 3): its script on HTML/CSS, the eye check (3.2) on images and other files.

## References

- [`references/twelve-principles.md`](references/twelve-principles.md) — full table of the 12 principles
- [`references/material-3-tokens.md`](references/material-3-tokens.md) — open when you need Material 3 easing and duration tokens
- [`references/export-gif-webm.md`](references/export-gif-webm.md) — open when the destination wants a small moving file (GIF or WebM)
- [`references/sources.md`](references/sources.md) — sources and check dates
- Related: `video-script-to-clip` (beats and captions for whole clips) · `style-consistency` (1 motion style across a campaign)
