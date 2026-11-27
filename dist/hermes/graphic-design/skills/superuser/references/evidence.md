# Evidence — short labels and the full record

This file is identical in every plugin. The original lives in plugin `superuser`. Use it for any work that must claim what is true: while doing, while checking, and while learning.

## Short labels — for every claim

End a sentence with 1 of these 4 labels. Use the same set in every file.

| Label | Use when |
|---|---|
| `ตรวจจริง` (verified) | You ran, measured, or saw the result yourself this round (test result · command run · screen) |
| `จากแหล่ง` (from a source) | You read it from a file, document, or official web page but did not run or measure it yourself |
| `อนุมาน` (inferred) | Reasoned from other items, with nothing confirming it directly (includes what used to be called "guess": confidence `ต่ำ` (low); `กลาง` (medium) drops 1 level because it relies on an unconfirmed assumption) |
| `ยังไม่ได้ตรวจ` (not yet checked) | You have not looked · saying so plainly beats guessing and then telling it as if checked |

A claim repeated across many documents is not yet confirmed (copies citing copies). For an important claim, trace it back to the first source (original · result you ran · official announcement) and label it by that source.

`(รอยืนยัน …)` (awaiting confirmation) is not an evidence label. It marks an open item, and it **always names who it waits on and what they must do**. A bare `(รอยืนยัน)` is not allowed in new text. The owner was confused on 2026-11-27 about whether an item waited on them or on the agent: "รอยืนยัน นี่รอผมเหรอ … แยกได้ไหม ว่ารอใคร".

| Write | Waits on | When | Example |
|---|---|---|---|
| `(รอยืนยัน · ผู้ใช้: <ทำอะไร>)` | the user, and only the user can answer | their own data (budget · name · date · account) · a choice or approval · a file only they have | `(รอยืนยัน · ผู้ใช้: บอกงบต่อเดือน)` |
| `(รอยืนยัน · agent: <จะตรวจอะไร ที่ไหน>)` | the agent, as its own next step; the user does nothing | sources fewer than 3 or conflicting · an original not yet read · a render or test not yet re-run | `(รอยืนยัน · agent: อ่านต้นฉบับ d.school)` |
| `(รอยืนยัน · ภายนอก: <รอใคร เรื่องอะไร>)` | a third party; neither side can settle it now | a seller's quote · an agency's reply · a law not yet published | `(รอยืนยัน · ภายนอก: ใบเสนอราคาจาก PEAK)` |

Rules:
- For a public fact with fewer than 3 sources, or sources that conflict: use the value from the official source, label it `จากแหล่ง`, lower the confidence, and append `(รอยืนยัน · agent: …)`. Use `ผู้ใช้` instead only when the user is the one who knows.
- Every answer that holds a `ผู้ใช้` item ends with a section **ต้องให้คุณทำ**. Write one line per item, starting with a verb and saying where or how ("ตอบว่าเลือกแบบไหน" · "พิมพ์ `! gh auth login`" · "copy ไฟล์ X ไปไว้ที่ Y"). `agent` items go under **ยังไม่รู้** or **ค้าง** with the agent's next step. They never go under **ต้องให้คุณทำ**.
- Old text that still has a bare `(รอยืนยัน)` keeps it. Name the waiter when you next edit that line.

## Full record — claims that decide something important

Use it when the claim decides money, law, health, the chosen path, or work to be delivered.

| Field | What to put | Example |
|---|---|---|
| ดูอะไร (what was examined) | The thing checked + version · date · web address (URL) · for a file, put the Secure Hash Algorithm 256 (SHA-256) hash (a file's fingerprint: change even 1 character and the value changes) | `contract.pdf` sha256 `3fa1…` · ประกาศกรมสรรพากร ฉบับที่ … ลงวันที่ … |
| ใครตอบ · ทำยังไง (who answered · how) | The agent + the command or method | `reviewer` · เปิดเทียบยอดกับใบแจ้งหนี้ทีละใบ |
| ได้มายังไง (how it was obtained) | 1 of the 4 short labels | `ตรวจจริง` |
| มาจากข้อไหน (derived from which) | `อนุมาน` only: point to the base items | มาจากข้อ 2 และ 4 |
| มั่นใจแค่ไหน (how confident) | สูง · กลาง · ต่ำ (high · medium · low) per the rules below | กลาง (ลด 1: ข้อมูลปี 2568) |
| ยังมองไม่เห็นอะไร (what is still unseen) | The reason for doubt and what has not been looked at | ยังไม่ได้รันบน production |
| เจอที่ไหน (where found) | `path:line` · URL + date opened · page · figure number | `report.docx` หน้า 4 |

## How confident — start from the source, then lower for causes

1. **Starting point.** `ตรวจจริง` = สูง · `จากแหล่ง` = สูง if it is an official source or the original (code · bill · label · the real document), otherwise กลาง · `อนุมาน` = กลาง · `ยังไม่ได้ตรวจ` = no level given.
2. **Lower 1 level per cause** and write the cause in brackets: old data · little data or a single example · sources conflict · not an exact match for the question (different version, different country) · relies on an unconfirmed assumption.
3. **Never higher than the starting point.** Free-floating confidence with no cause does not count.

## Chance words — for forecasts only

Facts use "how confident". Things that have not happened (the result of a chosen path · whether a lesson will reduce mistakes) use this word set, kept separate from confidence.

| Word | About | ICD 203 ranges merged |
|---|---|---|
| แทบเป็นไปไม่ได้ (almost impossible) | 1–5% | almost no chance 1–5% |
| ไม่น่าจะ (unlikely) | 5–45% | very unlikely 5–20% · unlikely 20–45% |
| พอ ๆ กัน (even) | 45–55% | roughly even chance 45–55% |
| น่าจะ (likely) | 55–95% | likely 55–80% · very likely 80–95% |
| แทบแน่นอน (almost certain) | 95–99% | almost certain 95–99% |

The number ranges are condensed from ICD 203 (7 ranges merged into 5 · item D.6.e(2)(a), version signed 2 Jan 2015 · dni.gov · checked 22 Oct 2026). If you need more detail, use the original 7 ranges in the right column.

Sources: GRADE (Grading of Recommendations Assessment, Development and Evaluation — a method for rating medical evidence · gradeworkinggroup.org) · ICD 203 (Intelligence Community Directive 203, the US intelligence community's analytic standards · dni.gov) · World Wide Web Consortium (W3C) PROV (a standard for recording where data came from · w3.org/TR/prov-overview)
