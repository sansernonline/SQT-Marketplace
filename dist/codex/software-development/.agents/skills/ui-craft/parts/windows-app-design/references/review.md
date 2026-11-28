# Review, critique, prohibitions and limits: extension of `ui-craft` part `windows-app-design`

Open when doing items 6 · 7 · 8 of `SKILL.md`

## Token checker command (item 6)

```bash
# ไฟล์ token แยก (web-wrapped · mockup ที่ยังวางคู่ fluent.css)
node ../web-app-design/scripts/check-design-tokens.mjs src/fluent.css src --ext html,css,ts,tsx \
  --marker "Type ramp" \
  --require "--win-bg,--win-layer,--win-card,--win-text,--win-text-secondary,--win-accent,--win-on-accent,--win-divider,--win-control-stroke,--win-radius,--win-radius-card,--win-font,--win-nav-w,--win-titlebar-h,--win-gutter"
# mockup ไฟล์เดียว: ใช้ไฟล์ mockup เป็นไฟล์ token เอง (token ฝังอยู่ใน <style>) · --require ชุดเดิม
node ../web-app-design/scripts/check-design-tokens.mjs mockup/<รหัส>-mockup.html mockup --ext html --marker "Type ramp" --require "…"
```

  If the app adds its own tokens (for example `--telex-…`) → append them to `--require` too · name the sections in the mockup page starting with `s-` (`#s-login`) so names like `#add` `#feed` are not read as colours

## Reviewer instruction message (item 6.1)

```
ดูภาพ <path dark/light> ของแอป Windows 11 (<ชนิดแอป>) เป้าคือดูเหมือน Windows Terminal / Settings / File Explorer
บอกปัญหาที่สำคัญที่สุด 2–3 ข้อต่อหน้า (ลำดับสายตา ระยะ แนว contrast ความหนาแน่น อะไรที่ดูเป็นเว็บ)
แต่ละข้อมีวิธีแก้ระดับ CSS (ขนาด px · องค์ประกอบไหน) · ไม่ต้องชม · ไม่เกิน 250 คำ
```

## Anti-patterns (item 7)

- **Filling the whole selected menu row with the accent colour.** Windows uses a small bar flush left
- **Tinting the window frame with the brand colour** (title bar · nav · rail · command bar · Mica/Acrylic · borders · menu icons). The frame is grey-black following the Windows theme · the accent lives in the selection bar, the primary button and the data · tint only when the user orders it
- **12–16px rounded corners.** That is the look of web/mobile; Windows uses 4px and 8px
- **Shadows under cards.** Windows 11 uses thin borders; shadows are reserved for flyouts/dialogs only
- **`alert()` / `confirm()`** in a web-wrapped app: use InfoBar or ContentDialog
- **Doing only dark mode because the reference image is dark.** Windows 11 defaults to light mode and users can choose either, so both must pass
- **Hard-coding the accent colour as blue.** To follow the colour the user has set, read it from the system
  (WinUI: do not override `AccentFillColorDefaultBrush` · web: CSS `AccentColor`)
- **A menu bar of arbitrary width.** Only 320px open / 48px collapsed
- **Sending a mockup that was never rendered and looked at.** See item 6
- **Solid accent-colour buttons on every table row.** Buttons in a row are icons that appear on hover; the primary button lives in the detail panel (patterns.md item 1)
- **Buttons and menus that are text only, with no icons.** They look like a wireframe
- **Content in the top half and the bottom half empty · a table stretched across the screen until columns are 400px apart.** Use list-detail (patterns.md item 2)
- **11px uppercase group headings · solid-colour badges in the status bar · coloured lines on tabs.** These are web styles
- **Several big cards in a row on the app's start page.** It looks like a SaaS dashboard; use a row of shortcut buttons instead (the first page of a mockup does not count, see `ui-craft`)
- **The mockup's control bar (Functional Requirement (FR) code · state switcher) left in the image sent for review.** Use `screenshot.py --hide`
- **Doing every page in one round with no main page as the model.** See item 1

## Limits to know (item 8)

- The `.xaml` / `.axaml` files here **have not been compile-tested.** The files hold only token values
  (Color / SolidColorBrush / x:Double / CornerRadius / Thickness) using standard syntax.
  On the first build, check whether any key collides with the framework's own
- WinUI must merge `FluentTokens.xaml` **after** `XamlControlsResources`, otherwise the values are overwritten
- Theme dictionary names differ: WinUI uses `Default`/`Light`/`HighContrast`
  while Avalonia uses `Default`/`Light`/`Dark`
- **High-contrast mode:** never put fixed colours; pull them from system colours (there is an example in the XAML files)
- Mica / Acrylic really work only in WinUI/Avalonia on Windows. For web-wrapped apps,
  use solid colours per the tokens instead. Do not imitate them with `backdrop-filter`, because the result is not the same
  and it is heavy on the machine
