# Window frame and components in fluent.css: extension of `ui-craft`

Open when laying out a settings page/dashboard (item 3) or looking for ready-made classes (item 4) · for data-dense tool apps see `patterns.md`

## Window frame, settings page and dashboard (item 3)

```
┌──────────────────────────────────────────────── 48px title bar ─┐
│ ชื่อแอป (12px)                              ─  □  ✕  (46×48)    │
├──────────────┬──────────────────────────────────────────────────┤
│ ☰            │  ชื่อหน้า            Title 28/36                  │
│ 320px        │  คำอธิบายหนึ่งบรรทัด  Body 14/20 สีรอง             │
│              │                                                  │
│ ▍เมนูที่เลือก │  หัวข้อกลุ่ม         Subtitle 20/28    ┌─ rail ─┐ │
│  เมนูอื่น     │  เนื้อหา…                              │ ลิงก์   │ │
│              │  ← กว้างไม่เกิน 1064px →                │ ช่วยเหลือ│ │
│              │                                        └────────┘ │
│ ⚙ ตั้งค่า     │                                                  │
└──────────────┴──────────────────────────────────────────────────┘
   ↑ ล่างสุดเสมอ        ↑ ขอบซ้าย/ขวา 36px · ระยะระหว่าง section 40px
```

## Components already in fluent.css (item 4)

| Element | Class | Note |
|---|---|---|
| Title bar + window buttons | `.win-titlebar` | Electron: `-webkit-app-region: drag` is already included |
| NavigationView | `.win-nav` / `.nav-item.selected` | Collapses to icons automatically below 1008px |
| Card | `.win-card` | |
| Windows-style settings row | `.win-setting` | Icon + name + description + control on the right |
| InfoBar | `.win-infobar.success/caution/critical` | **Always use it instead of `alert()`** |
| Status pill | `.win-pill.success/caution/critical` | |
| KPI | `.win-kpis .kpi` | 3–5 slots · more than that and the numbers get too small to stand out |
| Toggle switch | `.win-toggle` | |
| Table | `.win-table` | |
| Link | `.win-link` | accent-text colour, not accent |
