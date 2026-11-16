# Worked example · contrast matrix · brand-kit

### Worked example — contrast matrix

Palette for a Thai café: primary `#0F5C4D` (deep teal), accent `#F2A93B` (amber), text `#1F2328`, background `#FAF7F2`, muted text `#6B7280`.

| Text on background | Ratio | Body text (4.5) | Headline ≥ 18 pt (3.0) |
|---|---|---|---|
| `#1F2328` on `#FAF7F2` | 14.78 | Pass | Pass |
| `#0F5C4D` on `#FAF7F2` | 7.39 | Pass | Pass |
| `#FFFFFF` on `#0F5C4D` | 7.90 | Pass | Pass |
| `#6B7280` on `#FAF7F2` | 4.52 | Pass (just) | Pass |
| `#1F2328` on `#F2A93B` | 7.91 | Pass | Pass |
| `#FFFFFF` on `#F2A93B` | 2.00 | **Fail** | **Fail** |
| `#F2A93B` on `#FAF7F2` | 1.87 | **Fail** | **Fail** |

Ratios computed with the WCAG relative-luminance formula. Decision written into the kit: amber buttons carry **dark** text, never white; amber is never used for text on the light background.
