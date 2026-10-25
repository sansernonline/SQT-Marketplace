# skill: tax-deduction-planner

Use when cutting Thai income tax before year end, checking deductions, or how much RMF or ThaiESG to buy.

# Tax Deduction Planner (วางแผนลดหย่อนภาษีปลายปี)

General information, not tax advice — for a real return or an unusual case ask a นักบัญชี / tax agent, or call RD 1161.

Current caps and the rate table: [references/deductions-2569.md](references/deductions-2569.md). Investment income rules (dividends, interest, crypto, foreign income): `tax-basics-th`.

## Workflow

1. **Fix the tax year.** Planning in October 2026 means tax year 2569, filed Jan–Mar 2570. Money must be paid by **31 December**.
2. **Collect income.** Salary + bonus (from the employer's ทวิ 50 estimate or payslips × 12), freelance 40(2), other income. Note the PVD rate and social security deducted.
3. **Compute tax now** — income − expense deduction (50%, max 100,000 for salary) − allowances already locked in (personal, family, social security, PVD, insurance already paid) = net income → apply the rate table.
4. **Find the marginal rate.** This is the value of every extra baht deducted. If net income is already in the 0% band, stop — further deductions save nothing.
5. **Walk the checklist** below; for each line, ask "already have it / can still add / not applicable".
6. **Size the funds last.** Check room left: RMF ≤ 30% of income, ThaiESG ≤ 30% and 300,000, and PVD + RMF + pension insurance + กอช. ≤ 500,000 combined.
7. **Recompute** and show before / after / saved, and the cash the plan locks up (RMF to age 55, ThaiESG 5 years).
8. **Paperwork list** for filing (see end).

## Year-end checklist

| # | Item | Cap (2569) | Question to ask |
|---|---|---|---|
| 1 | Personal | 60,000 | automatic |
| 2 | Spouse with no income | 60,000 | registered marriage? spouse earns nothing? |
| 3 | Children | 30,000 / 60,000 from 2nd child born 2018+ | ages, studying? |
| 4 | Parents 60+, income ≤ 30,000 | 30,000 each | sibling already claiming? |
| 5 | Disabled dependant | 60,000 | disability card |
| 6 | Pregnancy / birth | 60,000 | receipts this year |
| 7 | Social security | 10,500 | employee or ม.39? |
| 8 | PVD | 15% wage | can the rate be raised next January? |
| 9 | Life insurance | 100,000 (with health) | 10-year+ policy? |
| 10 | Own health insurance | 25,000 | — |
| 11 | Parents' health insurance | 15,000 | parents' income ≤ 30,000 |
| 12 | Pension insurance | 15% income, 200,000 | inside 500,000 cap |
| 13 | RMF | 30% income, 500,000 | inside 500,000 cap |
| 14 | ThaiESG | 30% income, 300,000 | outside 500,000 cap |
| 15 | SSF | none for new buys | old units still under 10-year hold? |
| 16 | Home loan interest | 100,000 | bank certificate |
| 17 | Donations ×2 (schools, state hospitals, sport) | within 10% of net | e-Donation recorded? |
| 18 | Donations ×1 | within 10% of net | e-Donation recorded? |
| 19 | Political party | 10,000 | — |
| 20 | Easy e-Receipt / ช้อปดีมีคืน | no 2569 round as of 2026-10-25 (news: Finance Ministry not continuing it) — plan without it (รอยืนยัน) | e-Tax Invoice in own name and ID |

## Rules

- **Insurance first only if needed for protection** — never buy insurance for the deduction alone; `insurance-review` decides cover.
- **Do not buy RMF/ThaiESG past the point where net income drops into a lower band** unless the user wants the saving anyway; each baht saves less there.
- **RMF and ThaiESG are investments that can lose money**; picking the fund is `mutual-fund-picker`, the long-term fit is `retirement-plan`.
- Do not count an amount the user has not paid yet; plan "buy by 20 December" to leave settlement days (fund cut-off before New Year holidays varies by AMC).
- Breaking an RMF / ThaiESG / old SSF condition means repaying all tax saved plus surcharge 1.5% per month — say so.
- Do not use 2568-only items (ThaiESGX May–June window, LTF switch, 9,000 SSO) for 2569.

## Worked example (tax year 2569)

Salary 60,000/month, no bonus = 720,000. PVD 5% = 36,000. Life premium 20,000, health premium 15,000. Single, no dependants.

| Line | Before | After plan |
|---|---|---|
| Income 40(1) | 720,000 | 720,000 |
| Expense deduction 50% (cap) | −100,000 | −100,000 |
| Personal | −60,000 | −60,000 |
| Social security | −10,500 | −10,500 |
| PVD | −36,000 | −36,000 |
| Life + health insurance | −35,000 | −35,000 |
| RMF | — | −50,000 |
| ThaiESG | — | −50,000 |
| **Net income** | **478,500** | **378,500** |
| Tax | 7,500 + 10% × 178,500 = **25,350** | 7,500 + 10% × 78,500 = **15,350** |
| **Saved** | | **10,000** |

Checks: RMF 50,000 ≤ 30% × 720,000 = 216,000; PVD 36,000 + RMF 50,000 = 86,000 ≤ 500,000; ThaiESG 50,000 ≤ 216,000 and ≤ 300,000. Net income stays in the 10% band, so every baht saved 10%. Cost: 50,000 locked to age 55, 50,000 locked 5 years.

## Output format

- Tax before / after / saved, marginal rate, the purchase list with amounts and deadlines
- "Room left" line: RMF, ThaiESG, 500,000 combined cap
- Documents to collect by January: 50 ทวิ, insurance premium certificates (ask the insurer to send data to RD), fund tax certificates (ask the AMC to send data), home loan interest certificate, e-Donation, ล.ย.03 for parents
- Any line marked (รอยืนยัน) stays marked

Filing itself (ภ.ง.ด.90/91, deadlines): `tax-basics-th`. Run from the command `/tax-plan`.


## reference: deductions-2569.md

# Thai personal income tax — deductions and rates, tax year 2569 (income Jan–Dec 2026, filed early 2027)

Contents
1. Progressive rate table
2. Expense deduction
3. Family allowances
4. Insurance and social security
5. Retirement and investment funds (and the 500,000 combined cap)
6. Home, donations, stimulus
7. What changed versus tax year 2568

## 1. Progressive rate table (อัตราภาษีเงินได้บุคคลธรรมดาแบบขั้นบันได)

| Net income (เงินได้สุทธิ), baht | Rate | Tax on the full band | Cumulative tax at top of band |
|---|---|---|---|
| 0 – 150,000 | exempt | 0 | 0 |
| 150,001 – 300,000 | 5% | 7,500 | 7,500 |
| 300,001 – 500,000 | 10% | 20,000 | 27,500 |
| 500,001 – 750,000 | 15% | 37,500 | 65,000 |
| 750,001 – 1,000,000 | 20% | 50,000 | 115,000 |
| 1,000,001 – 2,000,000 | 25% | 250,000 | 365,000 |
| 2,000,001 – 5,000,000 | 30% | 900,000 | 1,265,000 |
| over 5,000,000 | 35% | — | — |

Tax saved by a deduction = deduction × your marginal rate (the band your last baht of net income falls in), until the deduction pushes you into a lower band. A 10,000-baht deduction saves 0 / 500 / 1,000 / 1,500 / 2,000 / 2,500 / 3,000 / 3,500 baht in each band above.

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.rd.go.th/59670.html , https://www.kalberry.com/en/thailand/blog/tax-deductions-2026-complete-list/

## 2. Expense deduction (ค่าใช้จ่าย)

| Income type | Deduction |
|---|---|
| 40(1) salary + 40(2) fees/commission combined | 50%, max 100,000 |
| 40(8) business, online sellers | 60% flat for most trades, or actual expenses with records |

## 3. Family allowances (ค่าลดหย่อนส่วนตัวและครอบครัว)

| Item | Cap, baht | Condition |
|---|---|---|
| Personal (ส่วนตัว) | 60,000 | automatic |
| Spouse (คู่สมรส) | 60,000 | legally married, spouse has no income |
| Child (บุตร) | 30,000 each | under 20, or under 25 and studying |
| 2nd child onward born 2561 (2018) or later | 60,000 each | same |
| Parents (บิดามารดา) | 30,000 each | age 60+, own income not over 30,000/yr; one child claims per parent; ล.ย.03 form |
| Disabled dependant (ผู้พิการ/ทุพพลภาพ) | 60,000 each | disability card |
| Pregnancy and childbirth (ฝากครรภ์และคลอดบุตร) | 60,000 per pregnancy | actual cost |

## 4. Insurance and social security

| Item | Cap, baht | Condition |
|---|---|---|
| Social security (เงินสมทบประกันสังคม) | 10,500 | 2569 wage ceiling 17,500 × 5% = 875/month; was 9,000 in 2568 |
| Life insurance (เบี้ยประกันชีวิต) | 100,000 | term 10 years or more, Thai insurer |
| Own health insurance (เบี้ยประกันสุขภาพตนเอง) | 25,000 | life + health together max 100,000 |
| Parents' health insurance (เบี้ยประกันสุขภาพบิดามารดา) | 15,000 | parents' income not over 30,000 |
| Pension life insurance (ประกันชีวิตแบบบำนาญ) | 15% of income, max 200,000 | inside the 500,000 cap; unused normal life cap (100,000) can be used first |

## 5. Retirement and investment funds

| Item | Cap, baht | Holding rule |
|---|---|---|
| Provident fund (PVD, กองทุนสำรองเลี้ยงชีพ) employee contribution | 15% of wage, max 500,000 | first 10,000 is an exemption, the rest a deduction |
| Government Pension Fund (GPF, กบข.) / private teachers' fund | 15% of wage | — |
| Retirement Mutual Fund (RMF) | 30% of income, max 500,000 | hold 5 years and redeem at age 55+ |
| National Savings Fund (กอช.) | 30,000 | — |
| **Combined retirement cap** | **500,000** | PVD + GPF + teachers' fund + RMF + กอช. + pension insurance together |
| ThaiESG | 30% of income, max 300,000 | **outside** the 500,000 cap; for buys in 2567–2569 hold 5 full years; ThaiESGX new money merges into this 300,000 in 2569 |
| Super Savings Fund (SSF) | 0 for new buys | no deduction for purchases from 2568; units bought 2563–2567 must still be held 10 years or the tax saved is repaid |

ThaiESG after 2569: max 100,000 and 8-year hold for 2570–2575 per SEC Q&A (รอยืนยัน — check before advising for 2570).

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.sec.or.th/TH/Documents/Thai%20ESGX/QA-LTF-to-Thai%20ESGX-010468.pdf , https://www.thairath.co.th/money/economics/thai_economics/2899435

## 6. Home, donations, stimulus

| Item | Cap, baht | Condition |
|---|---|---|
| Home loan interest (ดอกเบี้ยกู้ซื้อที่อยู่อาศัย) | 100,000 | lender's interest certificate; co-borrowers split |
| Donations to schools/universities, state hospitals, listed sport bodies | 2 × amount | together with general donations, max 10% of income after other deductions; e-Donation receipt needed |
| General donations (temples, charities) | 1 × amount | max 10% of income after other deductions |
| Political party donation | 10,000 | — |
| Easy e-Receipt / ช้อปดีมีคืน | 2568: 50,000 (30,000 general VAT shops + 20,000 OTOP/community enterprise, e-Tax Invoice or e-Receipt only, 16 Jan–28 Feb 2568) | **no 2569 round** — news (Dec 2568, Feb 2569) reports the Finance Ministry will not continue it; no Cabinet approval or RD notice seen as of 2026-10-25; plan without it (รอยืนยัน: no official statement found) |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.thairath.co.th/money/economics/thai_economics/2832789 , https://www.bangkokbiznews.com/economics/1214725 · Easy e-Receipt 2569 ตรวจล่าสุด 2026-10-25 ไม่พบประกาศ (https://www.rd.go.th) · ข่าวว่าคลังไม่ต่อ: https://thethaiger.com/th/news/1509461/ , https://www.sanook.com/money/946276/ , https://www.bangkokbiznews.com/economics/1221930

## 7. What changed versus tax year 2568

- Social security cap up from 9,000 to 10,500
- ThaiESGX separate 300,000 (May–Jun 2568 window) and LTF switch up to 500,000 were 2568-only
- Easy e-Receipt: no 2569 round as of 2026-10-25; news reports the Finance Ministry will not continue it (last round 16 Jan–28 Feb 2568, cap 50,000)
- Proposed TISA savings account not law at check date — do not plan on it


---

# skill: scam-check

Use when about to send money to an investment or loan app, crypto scheme, LINE group or caller.

# Scam Check (เช็กก่อนโอน · โดนหลอกแล้วทำอะไรก่อน)

A calm second look before an irreversible transfer — and a first-hour plan if the money is already gone. General information, not legal advice; for a case in progress the police (1441, thaipoliceonline.go.th) and a ทนาย are the people to ask. Full checklist and evidence list: [references/red-flags-and-evidence.md](references/red-flags-and-evidence.md).

**First question: has money already left the account?** If yes, jump to "Already transferred — the first hour". If no, run the checklist.

## Before transfer — 6 checks

1. **The return** — if the return is guaranteed, fixed or "risk-free" and above bank deposit rates (e.g. 1–3% a week, 10% a month), stop. Real investments cannot guarantee returns.
2. **The licence**
   | Offer | Check at | Pass if |
   |---|---|---|
   | Stocks, funds, derivatives, broker app, investment adviser | SEC Thailand (ก.ล.ต.) — app **SEC Check First** or sec.or.th | The exact company **and** its app/website are on the licensed list |
   | Crypto exchange, broker, dealer, ICO portal, token | SEC Check First → digital-asset operators | Licensed by SEC; foreign exchanges serving Thais without a licence are not |
   | Anyone on the warning list | SEC **Investor Alert**: market.sec.or.th/public/idisc/th/InvestorAlert | Not on it (absence does not prove safety) |
   | Loan, credit card, loan app | Bank of Thailand (bot.or.th) list of licensed lenders (banks, personal-loan, nano-finance); pico-finance at 1359.go.th | Licensed **and** no upfront fee |
   | Insurance | คปภ. (oic.or.th) agent/company lookup | Licensed |
   Scammers clone real names — check the **website domain, app publisher and bank account name** match the licensed company. A licensed company never asks you to transfer to a personal account.
3. **Where the money goes** — transfer to a person's name, a different company, or a "partner" account = stop. Real brokers take deposits only into the customer's own segregated account in the company's name.
4. **Withdrawal proof** — independent reports of withdrawing, not just screenshots of balances. "Pay a fee / tax / deposit to unlock your withdrawal" = scam, every time.
5. **The conversation** — urgency ("today only"), secrecy ("don't tell your family/bank"), moving you to LINE/Telegram/WhatsApp, a "teacher" or "assistant" giving signals, a stranger turned friend or lover who talks investing.
6. **Search history** — company name + "หลอก", "แชร์ลูกโซ่", "ก.ล.ต. เตือน"; check news and the Investor Alert list. If unsure, call SEC hotline **1207** (หลอกลงทุน) before paying.

## Thai patterns to name out loud

| Pattern | What it looks like | Tell |
|---|---|---|
| แชร์ลูกโซ่ (Ponzi / pyramid) | High fixed returns, rewards for recruiting, "business opportunity" seminars | Returns paid from new members; illegal under the loan-fraud decree (พ.ร.ก.การกู้ยืมเงินที่เป็นการฉ้อโกงประชาชน พ.ศ. 2527) |
| Fake investment LINE group | Ads with celebrities or fake "SET / SEC" logos, then a LINE group with a "teacher"; members post profits (most are the scammers) | App not from the real broker; deposits to personal accounts |
| Fake broker app | Look-alike app or APK link, shows growing profits | Withdrawal blocked until you pay "tax" or "fees" |
| Romance-investment | Online friend/partner (often "overseas") introduces a platform after weeks of chatting | Never meets on video in person; pushes you to invest more |
| Crypto "pig butchering" | Long grooming, small early withdrawals allowed, then a big deposit is trapped | Unlicensed platform; "account frozen, pay to release" |
| Call-centre / impersonation | Caller says police, DSI, bank, Revenue Department, courier; "your account is involved in money laundering, move money to a safe account" | No Thai authority asks you to transfer money to verify |
| Loan-app scam | Approval needs an upfront fee, insurance or "credit score" payment | Licensed lenders deduct fees from the loan, never ask first |
| Recovery scam | After a loss, someone offers to get the money back for a fee — posing as lawyer, hacker, agency or "AOC" (Anti-Online Scam Operation Center) | Real police and AOC charge nothing; AOC has no LINE or Facebook channel |

## Already transferred — the first hour

1. **Call your bank's 24-hour hotline now** (number on the back of the card or in the app) and ask to **suspend the transaction** (ระงับธุรกรรม). Under the technology-crime decree (พ.ร.ก.มาตรการป้องกันและปราบปรามอาชญากรรมทางเทคโนโลยี พ.ศ. 2566, มาตรา 7) the bank must hold it temporarily — and you must then file a police report **within 72 hours** or the hold lapses.
2. **Call 1441** — the AOC, 24 hours. Give: receiving bank, account number, account name, amount, time of each transfer.
3. **Report online at www.thaipoliceonline.go.th** (or at any police station) — this is the police report the bank hold depends on. Keep the case number.
4. **Keep evidence** — do not delete chats or block yet: screenshots with dates of the chat, profile, group, website URL, app name; transfer slips; the receiving accounts; phone numbers. List in the reference file.
5. **Secure accounts** if you gave any code, password, ID card photo or installed an app: uninstall the app, change banking passwords from a clean device, ask the bank to block mobile banking if remote control is suspected. If you installed an app, follow `digital-hygiene` (personal-life ถ้าติดตั้ง) for the full account-takeover steps.
6. **Never pay a "recovery" service** — anyone asking for money to get money back is the second scam.
7. Investment scams also: report to SEC **1207**; Ponzi schemes: DSI (กรมสอบสวนคดีพิเศษ) **1202**.

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.thaipoliceonline.go.th (official online report, with 1441), https://www.infoquest.co.th/?p=378031 (AOC 1441 one channel only), https://www.bot.or.th/content/dam/bot/documents/th/news-and-media/media-gallery/infographic/2023_04_05_tech_crime_act.pdf (bank hold, 72 hours), https://market.sec.or.th/public/idisc/th/InvestorAlert (SEC Investor Alert, SEC Check First, 1207). DSI hotline 1202 (รอยืนยัน).

## Worked example

User: "A LINE group 'SET Insight VIP' showed me the teacher's picks. I made 4,000 on a 10,000 deposit and now I want to put in 200,000. They want it in an account named Mr. A."

Checks: app is not from a broker on SEC Check First (fail) · deposit to a personal account (fail) · profits shown only in-app, no withdrawal yet (fail) · group uses "SET" in the name — SET and SEC do not run stock-tip LINE groups (fail).

Bottom line: "This matches the pattern of a fake investment LINE group. Do not transfer. Try withdrawing the 14,000 — if they ask for a fee or tax to release it, that confirms it. Report the group to SEC 1207."

## Output

Red flags found (with source) · what could not be verified · blunt bottom line. When flags stack up, say "this matches the pattern of a scam" and recommend not transferring — better wrong once than broke once.

Related (same plugin): `debt-payoff` before paying anyone to "clear debt"; `insurance-review` before a policy sold as an investment.


## reference: red-flags-and-evidence.md

# Red flags and evidence checklist

## Before-transfer checklist (tick each)

**The offer**
- [ ] Return is guaranteed, fixed, or above bank rates by a wide margin
- [ ] "Risk-free", "capital protected" for a stock, forex, gold or crypto scheme
- [ ] Profit comes from recruiting others, or rewards grow with team size
- [ ] Trading signals from a "teacher", "analyst" or "assistant" in a chat group

**The seller**
- [ ] Company or app not found on SEC Check First / sec.or.th, or on the SEC Investor Alert list
- [ ] Domain, app publisher or LINE account does not match the licensed company exactly
- [ ] Uses SET, SEC, BOT, a bank or a celebrity logo in ads
- [ ] Lender asks for an upfront fee, deposit, insurance or "credit score" payment
- [ ] Contact came from a stranger, dating app, wrong-number message or social ad

**The payment**
- [ ] Transfer to a personal account or an unrelated company name
- [ ] Asked to pay in crypto, gift cards or via a third party
- [ ] Asked to borrow, sell assets or use a credit card to "invest more"
- [ ] Withdrawal requires paying tax, fee or deposit first

**The pressure**
- [ ] Deadline today / limited slots
- [ ] Told to keep it secret from family or the bank
- [ ] Told what to say if the bank asks why you are transferring
- [ ] Caller claims to be police, Department of Special Investigation (DSI), Anti-Money Laundering Office (AMLO), bank, Revenue Department or courier and demands a transfer

Two or more ticks = treat as a scam until proven otherwise. Any tick in "The payment" alone = do not transfer.

## Phone numbers and sites

| Need | Contact |
|---|---|
| Bank hold on a transfer | Your bank's 24-hour hotline (back of card / app) |
| Online scam report, 24 hours | **1441** AOC — phone only, no LINE/Facebook channel |
| Police report online | www.thaipoliceonline.go.th |
| Investment scam advice / licence check | SEC **1207**; app SEC Check First |
| Bank / lender complaint | BOT Contact Center 1213 (รอยืนยัน) |
| Ponzi / large-scale fraud | DSI 1202 (รอยืนยัน) |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.thaipoliceonline.go.th, https://market.sec.or.th/public/idisc/th/InvestorAlert

## Evidence to keep (do this before blocking anyone)

- [ ] Screenshots of the full chat with dates and times visible, including the scammer's profile page and ID
- [ ] Group name, member list screenshot, invite link
- [ ] Website URL and app name / publisher / APK file name
- [ ] Every transfer slip (e-slip) — date, time, amount, receiving bank, account number, account name
- [ ] Phone numbers, LINE IDs, email addresses, crypto wallet addresses and transaction hashes
- [ ] Any contract, "certificate" or ID card photo they sent
- [ ] A short timeline: first contact → each payment → when you realised
- [ ] Police case number and bank reference number once you have them

Keep originals; send copies. Do not edit screenshots.
