# Report template and severity · web-quality-audit

```markdown
# Web Quality Audit — <เว็บ> · <วันที่> · ผู้ตรวจ <ชื่อ>

ขอบเขต: <URL 5 หน้า> · mobile + desktop · เครื่องมือ: Lighthouse <รุ่น> · axe <รุ่น>

## ตัวเลขรวม (mobile · ค่ากลาง 3 รอบ)
| หน้า | Perf | A11y | LCP | CLS | TBT | axe error |
|---|---|---|---|---|---|---|

## สิ่งที่พบ
| # | ความรุนแรง | เกณฑ์ WCAG / ตัวชี้วัด | หน้า | สิ่งที่เจอ (selector หรือภาพ) | วิธีแก้ | เจ้าของ | สถานะ |
|---|---|---|---|---|---|---|---|
| 1 | Critical | 2.1.2 | /checkout | date picker ออกด้วยคีย์บอร์ดไม่ได้ | ใส่ Esc ปิด + โฟกัสกลับปุ่มเปิด | frontend | ค้างอยู่ |

## แก้เร็วได้ผลมาก (quick wins)
## ยังไม่ได้ตรวจ
```

| Severity | Meaning | Example |
|---|---|---|
| **Critical** | the main task cannot be done, or the page is unusable on mobile | keyboard trap · form with no label · LCP > 4 seconds · reflow at 320px broken |
| **High** | one group of users cannot succeed, or Core Web Vitals fail | contrast on body text · icon button with no name · CLS > 0.25 |
| **Medium** | doable but hard | focus hard to see · "คลิกที่นี่" ("click here") link · oversized image |
| **Low** | improves things, blocks nobody | `alt` on decorative images · incomplete `autocomplete` |

Status uses the same set as `superuser`: `เสร็จ` · `ทำอยู่` · `ติด` · `รออนุมัติ` · `ค้างอยู่`
