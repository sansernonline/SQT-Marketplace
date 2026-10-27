---
name: salary-negotiation
description: Use when the user gets a job offer, is asked expected salary, wants a raise or compares offers.
---

# Salary Negotiation (Thailand)

Negotiate on **total compensation per year**, not base salary per month.

Not for: writing up what you achieved for a review → `performance-self-review`.

General information, not professional advice — for tax effects ask a นักบัญชี or check `tax-basics-th` in `trading-finance` (if installed); for contract disputes ask a labour lawyer.

## Step 1 — market data

| Source | What it gives | Notes |
|---|---|---|
| Robert Walters Thailand Salary Survey (robertwalters.co.th/salarysurvey) | Base ranges by role and seniority, Bangkok and Eastern Seaboard | Free download, yearly |
| Adecco Thailand Salary Guide (adecco.co.th) | Ranges by function and industry + mobility survey | Free download, yearly |
| Michael Page / PageGroup Thailand salary guide | Mid–senior ranges, multinational bias | Yearly (รอยืนยัน — edition availability) |
| JobsDB (th.jobsdb.com) | Salary ranges in live job posts; salary insights pages | Many posts hide salary — use the ones that show it |
| LinkedIn job posts and Salary insights | Ranges where disclosed | Thin data for Thailand |
| Peers, recruiters, alumni groups | Real offers | Ask for ranges, not exact salaries |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.robertwalters.co.th/salarysurvey.html · https://adecco.co.th/en/knowledge-center/detail/salary-guide/download-adecco-thailand-salary-guide-2025

Use 3 sources (name + year); write the range as low / mid / high with source and year. Fewer than 3 → mark the range `(รอยืนยัน)`. Salary surveys have no official source, so named recruiter guides count as the source for this case. Recruiter guides skew to multinationals — Thai SMEs often pay below the range.

## Step 2 — total compensation

| Component | How to value it per year |
|---|---|
| Base salary | monthly × 12 |
| Guaranteed 13th month | 1 × monthly (only if in the contract) |
| Performance bonus | monthly × expected months — ask "what was the average payout over the last 3 years?" Discount if not guaranteed |
| Allowances (transport, phone, position, shift) | monthly × 12 — check if counted in the salary base for overtime and severance |
| Provident fund (กองทุนสำรองเลี้ยงชีพ, PVD) employer match | base × match % × 12 — employee and employer each 2–15% of wage, the employer rate need not equal the employee's (SEC); check the **vesting** schedule |
| Social security (ประกันสังคม) | Not extra money — both sides pay 5% of wage capped at 17,500 baht (max 875/month each) from 1 Jan 2026; identical across offers |
| Group health / life insurance | Ask the out-patient (OPD) and in-patient (IPD) limits; value at what you would pay for similar individual cover |
| Annual leave, work-from-home (WFH) days | Not money, but price it: each extra leave day ≈ base ÷ 22 |
| Stock / restricted stock units (RSU) | Only count what vests within the period you will realistically stay |
| Sign-on bonus | One-off; check claw-back if you leave within 12 months |

ตรวจล่าสุด 22 ต.ค. 2569 · กองทุนสำรองเลี้ยงชีพ: https://www.sec.or.th/TH/Template3/Articles/2566/160566.pdf · ประกันสังคม: https://www.krungsri.com/th/krungsri-the-coach/life/good-life/sso-section-33-rate-increase · https://www.thansettakij.com/general-news/646834 (ข่าววันที่ 18 ธ.ค. 2568 รายงานว่ากฎกระทรวงลงราชกิจจานุเบกษาแล้ว ไม่ได้ระบุวันประกาศ) · https://www.bakermckenzie.com/en/insight/publications/alerts/2025/12/thailand-higher-wage-base-for-ssf-contributions

Social security ceiling steps under the ministerial regulation (B.E. 2568): 17,500 baht (2569–2571) → 20,000 baht (2572–2574) → 23,000 baht (2575 onward). Several independent sources agree on the numbers, but the Royal Gazette (ราชกิจจานุเบกษา) text itself has not been opened — `(รอยืนยัน)` until the official link is added.

## Worked example — two offers

| | Offer A | Offer B |
|---|---|---|
| Base | 60,000 × 12 = 720,000 | 66,000 × 12 = 792,000 |
| Bonus | 2 months avg = 120,000 | 1 month avg = 66,000 |
| Allowance | 3,000 × 12 = 36,000 | 0 |
| PVD employer match | 5% × 60,000 × 12 = 36,000 | none |
| **Total cash + PVD** | **912,000** | **858,000** |

Offer B's base is 10% higher but A is worth 54,000 more a year — before insurance. Show this table before any discussion of "which is better".

### Compare offers by numbers (`decision-scoring`, command `score`)

1. **Iron rule first (กฎเหล็ก):** total compensation per year below your walk-away (Step 3) is dropped, however good the rest looks. Put it in `must` as `min`. An offer with no written terms for base, bonus and PVD is not scored until it is in writing.
2. **Criteria (default weights, starting value, not yet measured — the user changes them):**

| Criterion | `better` | Weight |
|---|---|---|
| Total compensation per year, baht (Step 2 total) | high | 0.40 |
| Commute, round trip minutes per day | low | 0.20 |
| Growth, 1–5 (user's score: scope, mentor, title path) | high | 0.25 |
| Annual leave days | high | 0.15 |

3. **Run:** `node decide.mjs score offers.json` (path of the script: see the `decision-scoring` skill). Input, using the table above plus a third offer that is under the walk-away:

```json
{"criteria":[{"name":"total per year","weight":0.4,"better":"high"},{"name":"commute min","weight":0.2,"better":"low"},{"name":"growth 1-5","weight":0.25,"better":"high"},{"name":"leave days","weight":0.15,"better":"high"}],
 "must":[{"criterion":"total per year","min":850000}],
 "options":[{"name":"A","values":{"total per year":912000,"commute min":90,"growth 1-5":3,"leave days":12}},
            {"name":"B","values":{"total per year":858000,"commute min":60,"growth 1-5":4,"leave days":15}},
            {"name":"C","values":{"total per year":800000,"commute min":30,"growth 1-5":5,"leave days":15}}]}
```

Result when run: C is dropped by the iron rule, B 60 and A 40, B stays first when each weight moves ±20%. With only 2 options every criterion becomes 0 or 100, so read the raw numbers in brackets too.
4. **Unstable or close** (`ยังไม่นิ่ง`, `สูสี`) → show the user the top two and the criterion that flips them; the user decides. Money and career: the score is supporting data, not advice.

## Step 3 — set three numbers

1. **Target** — what you actually want (market mid–high for your results).
2. **Anchor** — what you say first: target + 5–10%.
3. **Walk-away** — below this you decline. Decide it before the call, write it down as a number of total compensation per year: it becomes the `min` iron rule in the score above.

Rule of thumb when changing jobs in Thailand: a 10–20% base increase is commonly discussed; more for scarce skills, less in a slow market (รอยืนยัน — practitioner rule, not survey data; check the current Adecco / Robert Walters guide).

## Step 4 — scripts

Expected salary, early in the process:
- EN: "Based on the role's scope and market data for similar positions, I'm looking at a base of 70,000 to 78,000 baht, and I'm open to discussing the full package."
- TH: "จากขอบเขตงานและข้อมูลตลาดของตำแหน่งใกล้เคียง คาดหวังฐานเงินเดือนประมาณ 70,000–78,000 บาท และยินดีพูดคุยเรื่องสวัสดิการโดยรวมครับ/ค่ะ"

Responding to an offer below target:
- EN: "Thank you — I'm excited about the role. Looking at the total package, I was expecting closer to 75,000 base, given [one result with a number]. Is there flexibility on base, or on the bonus guarantee or start date allowance?"
- TH: "ขอบคุณมากครับ/ค่ะ สนใจตำแหน่งนี้มาก เมื่อดูแพ็กเกจโดยรวมแล้ว คาดหวังฐานเงินเดือนใกล้ 75,000 บาท เนื่องจาก [ผลงานพร้อมตัวเลข] พอจะปรับฐานเงินเดือน หรือส่วนอื่นเช่นโบนัสการันตีได้ไหมครับ/คะ"

Asking for a raise (internal):
- EN: "Over the last 12 months I [result 1] and [result 2]. The market range for this scope is [range, source]. I'd like to discuss moving my base to [number]."
- TH: "ในรอบ 12 เดือนที่ผ่านมา [ผลงาน 1] และ [ผลงาน 2] ข้อมูลตลาดของงานขอบเขตนี้อยู่ที่ [ช่วง, แหล่ง] จึงอยากขอให้พิจารณาปรับฐานเงินเดือนเป็น [ตัวเลข] ครับ/ค่ะ"

Then **stop talking** and wait.

ข้อความภาษาไทย → `human-writing` `references/thai-grammar.md` หัวข้อ 4 ระดับ สมัครงาน

## Step 5 — timeline after the offer and the levers besides base

| Day | Do |
|---|---|
| 0 — offer arrives | Thank them, ask for it in writing and for the reply deadline. Do not accept or counter on the call |
| 1–2 | Build the total-compensation table (Step 2) and the 3 numbers (Step 3); re-check market data |
| 2–3 | One counter with evidence (Step 4 script); name 1–2 levers below as alternatives if base is fixed |
| 3–5 | Their reply. At most 2 rounds — a third round costs goodwill you will need on day 1 of the job |
| 5–7 | Final offer letter with every agreed item written in; then accept, then resign (Counter-offer rules) |

Many Thai companies, and most large ones, have a salary band (กรอบเงินเดือน) per level that HR cannot move — when "the base is fixed", move to the levers: **sign-on bonus** (one-off, outside the band) · **guaranteed bonus for year 1** · **earlier review** (6 months instead of 12, criteria written) · **title or level** (changes the band) · **PVD match rate** · **extra annual leave days** · **work-from-home days** · **training or certification budget** · **start date** (finish your bonus period first) · **notice-period buyout** · **relocation or housing allowance** (for Eastern Seaboard or upcountry sites). Ask for the 2 that matter most to you, not the whole list.

## Counter-offer rules (current employer tries to keep you)

1. Ask why you wanted to leave — does the counter fix that reason, or only the money?
2. Is it a real base change in writing, or a promise ("next review")? Only written counts.
3. Will your manager trust you the same way after you nearly left?
4. Never use a fake offer to get a counter — it is easily called.
5. If you accept the new offer: resign in writing, give the contract notice, and keep it polite — `polite-message-th-en`.

## Rules

- Never inflate current salary — HR may ask for a payslip or 50 ทวิ.
- Get the final offer in writing (offer letter: base, bonus terms, allowances, PVD, probation length, notice period, start date) before resigning.
- Probation: under the Labour Protection Act §118, severance starts after 120 days of continuous work regardless of probation label — check the offer letter does not imply otherwise.
- Keep every offer letter in `important-docs`.

Related: `performance-self-review` (evidence for a raise) · `interview-prep` · `personal-budget` in `trading-finance` (what the raise does to the monthly budget).
