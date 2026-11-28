# Screen layout diagram · web-app-design

Fallback structure, sidebar + top bar. Real sizes live in `theme.css`.

```
┌──────────┬─────────────────────────────────────────────────┐
│ 232px    │ topbar 56px · solid background · sticky          │
│ sidebar  ├─────────────────────────────────────────────────┤
│          │  Page title h1 22px  [secondary btn] [primary]   │
│ • menu   │  Description 12px, secondary color               │
│ • menu   │                                                 │
│          │  ┌─ stat-grid: number cards auto-fit 190px ────┐ │
│  ─────   │  └─────────────────────────────────────────────┘ │
│ Group 2  │  ┌─ card ────────────────┐ ┌─ card ──────────┐  │
│ • menu   │  │ table / form          │ │ activity/summary│  │
│          │  └───────────────────────┘ └─────────────────┘  │
│ ⚙ Settings│        ← content max 1160px, centered →         │
└──────────┴─────────────────────────────────────────────────┘
```
