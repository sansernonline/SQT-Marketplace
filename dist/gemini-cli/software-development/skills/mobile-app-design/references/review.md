# Review, anti-patterns and limits — extension of `mobile-app-design`

Open this when doing items 7 · 8 · 9 of `SKILL.md`.

## Review commands and checklist (item 7)

```bash
# 1. หน้าตาถูกทุกขนาดจอไหม
python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/ --width 390 --height 844   # iPhone
python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/ --width 360 --height 800   # Android เล็ก
python scripts/screenshot.py mockup/<รหัส>-mockup.html _to_delete/screenshots/ --width 430 --height 932   # Pro Max

# 2. ระบบดีไซน์ยังสะอาดอยู่ไหม (ใช้ตัวตรวจของ web-app-design ได้เลย
#    แต่ต้องส่ง --require เป็น token ชุดของระบบนี้ ไม่ใช่ชุดของเว็บ)
# คัดลอก check-design-tokens.mjs จาก plugin software-development (skills/web-app-design/scripts/) ไปไว้ที่ tools/ ในโปรเจกต์ก่อน แล้วรัน:
node tools/check-design-tokens.mjs src/theme.css src/app \
  --require "--bg,--surface,--ink,--soft,--faint,--line,--signal,--repair,--hint,--ui,--dis,--text,--mono,--r-tile,--r-card,--app-max,--gutter"
```

> The only exception where a raw color is allowed: `<meta name="theme-color">` in `index.html` —
> the browser reads meta before CSS loads, so `var()` cannot be used.

Open the screenshots and check by eye:

- [ ] Top/bottom bars are not covered by the notch or home indicator
- [ ] When scrolling, top/bottom bars stay fixed and do not scroll with the content
- [ ] At 360px (small Android) tab labels do not break mid-word and tiles do not overflow
- [ ] Every button is really tappable: ≥ 44×44 pt (iOS) · 48×48 dp (Android)
- [ ] Thai text does not overflow buttons, and tone marks do not collide with vowels
- [ ] Contrast ≥ 4.5:1 (`--faint` on white is the closest call — use it for supporting text only)
- [ ] An empty state (`.blank`) exists wherever a list can be empty
- [ ] Switch every theme the app has (e.g. light/dark · plain/gradient) and no text blends into the background
- [ ] Every input channel that depends on hardware has a fallback (e.g. a speaking app has a "พิมพ์แทนพูด" ("type instead of speaking") path; an app that uses a sensor lets the user use the camera or enter data by hand)
- [ ] A denied permission and missing hardware each have a screen that says so and offers a way forward

## Anti-patterns (item 8)

- **`100vh`** — use `100dvh`
- **Forgetting `env(safe-area-inset-*)`** or forgetting `viewport-fit=cover`
- **Cramming 6+ tabs into the bottom bar** — 3–5 is enough; put the rest on a "เพิ่มเติม" ("More") page
- **A small modal for a long task** — use the full-screen `.overlay`
- **Collapsing to one font family in an app that has content to read** — users can no longer tell content from chrome (the app's bars, buttons, menus)
- **A gradient behind long text** — gradients go on chrome and primary buttons only
- **Relying on color alone to carry meaning** — `del`/`ins` already have their own strike/underline styles
- **No `:active` feedback** — mobile has no hover; if nothing moves on press, users press again
- **Handing over a mockup that was never rendered at real size**

## Limits to know (item 9)

- All values were **verified on HTML/CSS** — the React Native table in `references/tokens.md`
  **has not been built and tested**. Flutter has been used with the item 4.1 approach on 1 real app (Lumio).
  The values transfer directly, but check the real screen on a device once more.
- Fonts load from Google Fonts in the mockup — a real app should bundle the font files.
  Otherwise on first launch with a slow network the user sees the system font first, then a visible jump.
- `assets/speakgo.css` has **light mode only** — dark mode needs a complete new set of every token
  (the `--bg`/`--surface` backgrounds swap order and `--ink` must not be pure white), then check AA contrast on every pair.
