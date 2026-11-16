# Material 3 motion tokens · motion-basics

### Material 3 tokens (copy the values, keep the names)

| Token | Value | Use |
|---|---|---|
| `easing-standard` | `cubic-bezier(0.2, 0, 0, 1)` | Most moves inside the frame |
| `easing-standard-decelerate` | `cubic-bezier(0, 0, 0, 1)` | Entrances |
| `easing-standard-accelerate` | `cubic-bezier(0.3, 0, 1, 1)` | Exits |
| `easing-emphasized-decelerate` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | Hero entrance, 1 per piece |
| `easing-emphasized-accelerate` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | Hero exit |
| `easing-emphasized` | `cubic-bezier(0.2, 0, 0, 1)` | Same curve as standard in the CSS token; the real emphasized curve is a 2-part path that CSS cannot express |

Durations: `short1–4` 50 · 100 · 150 · 200 ms · `medium1–4` 250 · 300 · 350 · 400 ms · `long1–4` 450 · 500 · 550 · 600 ms · `extra-long1–4` 700 · 800 · 900 · 1000 ms. Our timing table above sits inside these bands (small change = short, enter/leave = medium, transition = long or extra-long).

ตรวจล่าสุด 2026-10-23 · แหล่ง: material-web, file `tokens/versions/v0_192/_md-sys-motion.scss` (Apache-2.0, Google LLC) https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-motion.scss
