# Common screen patterns: Windows apps

> Tokens and size rules are in `tokens.md` · this file answers the question **how to lay out a screen so it looks like a real app**
> Every pattern has a clickable example in `assets/tool-app-template.html` (tool apps) or `assets/mockup-template.html` (settings page/dashboard)

Background: screens that pass every item of the checklist (tokens right, sizes right, contrast passes) but still look like a wireframe
usually repeat the same 6 mistakes: solid buttons on every row · no icons · the bottom half of the screen empty · tiny uppercase group headings · web-style coloured badges · bordered boxes over the whole page.
The patterns in this file fix all 6.

**Contents**

- [0 · Choose the structure before drawing](#0--choose-the-structure-before-drawing)
- [1 · Lists with buttons in each row](#1--lists-with-buttons-in-each-row)
- [2 · List + detail panel (list-detail)](#2--list--detail-panel-list-detail)
- [3 · Command bar](#3--command-bar)
- [4 · Group headings in a list](#4--group-headings-in-a-list)
- [5 · Tabs in the title bar (Windows Terminal style)](#5--tabs-in-the-title-bar-windows-terminal-style)
- [6 · Icon rail](#6--icon-rail)
- [7 · Status bar](#7--status-bar)
- [8 · Start page (welcome / start)](#8--start-page-welcome--start)
- [9 · Icons: where they are required](#9--icons-where-they-are-required)
- [Check by eye: countable, no gut feeling](#check-by-eye-countable-no-gut-feeling)

---

## 0 · Choose the structure before drawing

| What kind of app | Structure | template |
|---|---|---|
| Settings · dashboard · an app opened only now and then | NavigationView 320px + content no wider than 1064px | `mockup-template.html` |
| Data-dense tool (terminal client · file manager · admin tool) | icon rail 48px + list + detail panel 360px | `tool-app-template.html` |
| Several documents open at once (editor · terminal · browser) | Tabs in the title bar, Windows Terminal style | `tool-app-template.html`, title bar part |

**Never use the settings-page template to make a tool app.** You get a screen where the content floats in the top half and the right side is empty

### 0.1 · Compare with real apps on Windows 11 and WinUI 3 controls

Adapted from microsoft/winappCli `winui-design` (MIT · LICENSE checked in the repo copy on 23 Oct 2026). Use it when choosing the structure, and when handing a mockup to the person writing XAML so they need not guess control names

**Choose a real-app model before laying out.** Whichever row is closest to the app you will make, follow that structure

| What kind of app | Main controls (WinUI 3) | Real app to look at as an example |
|---|---|---|
| Settings · config | `NavigationView` on the left + `SettingsCard` / `SettingsExpander` | Windows Settings |
| Editing documents or sessions | `TabView` + content filling the window, minimal chrome | Windows Terminal · Notepad · VS Code |
| Browsing a layered structure | `TreeView` + `ListView` + `BreadcrumbBar` | File Explorer · Outlook |
| Developer tools · dashboard | `NavigationView` + cards | Dev Home · GitHub Desktop |
| Single-purpose tool | Mode switcher + dense button grid | Calculator · Snipping Tool |
| Media · canvas · large images | `Grid` with a hero surface + floating buttons, **no** `NavigationView` | Photos · Clipchamp |

**Turn requirements into controls.** This guards against web instincts (`<select>` · `<input type=date>` · WPF's DataGrid)

| Need | Use |
|---|---|
| Navigate 2–7 categories | `NavigationView` · document tabs → `TabView` · path → `BreadcrumbBar` · 2–3 modes → `SelectorBar` |
| Vertical list · tile grid · tree | `ListView` · `GridView` or `ItemsRepeater` + `UniformGridLayout` · `TreeView` |
| Data table | `ListView` whose `ItemTemplate` is a `Grid`, + the table header as another `Grid`. WinUI 3 has no `DataGrid`, and the CommunityToolkit one cannot use `x:Bind` in columns |
| List + detail | `ListView` + a `Grid` on the detail side |
| Enter text · numbers · search · dates · on/off | `TextBox` · `NumberBox` · `AutoSuggestBox` · `CalendarDatePicker` · `ToggleSwitch` |
| Choose 1 of 2–3 · choose 1 of 4 or more | `RadioButtons` · `ComboBox` |
| Must decide before continuing · context menu · first-time tip | `ContentDialog` · `Flyout` / `MenuFlyout` · `TeachingTip` |
| In-page status · in progress | `InfoBar` (matches the rule InfoBar instead of `alert()` in item 4 of SKILL.md) · system notification → `AppNotification` |

**Initial window size.** WinUI 3 has no `SizeToContent`. If not set, you get about 1024×768, which is too big for most tools. Compute it in the `MainWindow` constructor

| Value | How to work it out |
|---|---|
| Width | The widest row + 48 (margins), then round up to a multiple of 20 |
| Height | 32 (title bar) + the height of every row + every gap + 48 (margins), then round up to a multiple of 20 |
| Which way to round | Always up: clipped content is worse than a slightly wide window |
| Ranges you usually get | Single-purpose tool 440–560 wide · single-page form 600–800 × 640–800 · nav + content 1100–1300 × 720–840 · media or document editor 1280+ wide |
| Trap | `AppWindow.Resize` takes **real pixels**, not DIPs; multiply by the screen's DPI scale (`GetDpiForWindow(hwnd) / 96.0`) · never set `Width`/`Height` on the root `Grid`, because that clips content and does not shrink the window |

So our HTML mockup should set `width`/`height` of `.window` per this rubric, not always fill the viewport

---

## 1 · Lists with buttons in each row

```
ผิด: ทุกแถวมี [Connect] สีทึบ + [Edit]       → ปุ่มทึบ 8 ปุ่มแย่งกันเด่น
ถูก: ชื่อ · ข้อมูล · เวลา         ▷ ✎ ⋯       → ไอคอนโผล่เมื่อชี้หรือเลือกแถว
   ปุ่มหลัก (สีทึบ) อยู่ที่แผงรายละเอียดของแถวที่เลือก · ดับเบิลคลิก = ทำงานหลัก
```

- Buttons in a row: `btn subtle icon` 32×32 · hide with `visibility: hidden` (not `display: none`, otherwise columns shift)
- The button column has a fixed width (about 112px for 3 buttons), otherwise the "Latest" column will not line up with the buttons
- Selected row: `--win-subtle-selected` fill + a 3px accent bar flush left

## 2 · List + detail panel (list-detail)

Use when the window is ≥ 1100px wide and the list has more data than a single row can show

- The right panel is 360px wide, `--win-card` fill · 24px padding · 24px gap between parts
- Top to bottom: 48px icon + 20px name → primary button (stretched full row) + secondary button → name/value pairs (label 112px) → history (32px rows with dividers) → notes
- When the window is narrower than 1100px, hide the panel and open it as a new page instead

**A screen more than half empty is the signal to use this pattern,** not a signal to stretch the table

## 3 · Command bar

```
[+ สร้างใหม่] [📁 กลุ่มใหม่] │ [⇥ นำเข้า] [↦ ส่งออก]          [ทั้งหมด|SSH|RDP]  [🔍 กรอง…]
```

- Every button is subtle + 16px icon + text · separate groups with a 1×20px vertical line
- No solid button in the command bar if the page has a detail panel (the primary button lives in the panel)
- The search box is flush right, 240–320px wide · has a magnifier icon in front

## 4 · Group headings in a list

```
ผิด: PRODUCTION · 3      (11px ตัวพิมพ์ใหญ่ สีจาง — แบบเว็บ)
ถูก: ⌄ Production  3     (14px semibold · ตัวเลขสีรอง · แถว 32–40px · กดพับได้)
```

## 5 · Tabs in the title bar (Windows Terminal style)

- Tabs are 32px tall, flush with the bottom of a 40px title bar · 8px top corners
- The selected tab = the same fill as the content below (so they look like one sheet) · other tabs have a transparent fill
- Status is shown with an 8px dot + text/tooltip, **never a coloured line on the tab** (it looks like an error)
- At the end of the tabs there are `+` and `⌄` (tab list)

## 6 · Icon rail

- 48px wide · 40×40 buttons · 18px icons · 4px apart
- Selected: `--win-subtle-selected` fill + a 3×16px accent bar flush left
- Settings always at the very bottom · every button has a `title` (tooltip) because there is no text

## 7 · Status bar

- 24px tall · 12px text in secondary colour · 16px apart
- Status uses a 6–8px dot + text, **never a solid-colour badge** (that is a web style) · the "colour power" axis of the `ui-craft` beauty gate already exempts this item for Windows (colour comes through the selection bar · the hero screen · the main Key Performance Indicator (KPI) numbers · the primary button)

## 8 · Start page (welcome / start)

> This item applies to the start page inside the app. The first page of a mockup (`#s-start`), which reviewers open as a table of contents, may use cards with thumbnails; see `ui-craft` → `references/mockup-start-page.md`

- Content no wider than 1064px, centred · at the top is a single search box that does both search and connect (do not split into 2 boxes)
- Shortcuts are 40px-tall button rows (icon + text + hotkey), **not 4 big cards**
- At most 2 bordered boxes (for example Recent · Favourites) · news is a 40px neutral-fill strip, not in the brand colour

## 9 · Icons: where they are required

| Where | Required | Size |
|---|---|---|
| Buttons in nav / rail | ✓ | 16 / 18px |
| Buttons in the command bar | ✓ together with text | 16px |
| Buttons in a row | ✓ icon only + tooltip | 16px |
| Item type (SSH · file · RDP) | ✓ in a 24px box with 4px corners | 14px |
| Detail panel header | ✓ 48px box with 8px corners | 24px |
| Primary button in a dialog | Not required | — |

Commonly used codes (Segoe Fluent Icons): add `E710` · search `E721` · settings `E713` · edit `E70F` · more `E712` · play/open `E768`
· folder `E8B7` · new group `E8F4` · import `E8B5` · export `EDE1` · terminal `E756` · screen `E7F4` · link `E71B` · key `E8D7`
· clipboard `E77F` · globe `E774` · history `E81C` · star `E734` / `E735` · home `E80F` · down arrow `E70D` · right arrow `E76C` · close `E8BB`

---

## Check by eye: countable, no gut feeling

| Item | Passes when |
|---|---|
| Solid accent-colour buttons | ≤ 1 per screen (`grep -c "btn primary"` per section) |
| Icons | Present everywhere in the table of item 9 |
| Empty space | Content uses ≥ 60% of the window height at 1440×900, or has a reason (a deliberately empty page) |
| Row height | Rows of the same kind have equal height on every card in the page |
| Bordered boxes | ≤ 3 boxes per page · no box inside a box |
| Mockup controls | Not in the image (`screenshot.py --hide`) |
