# skill: travel-prep

Use when a trip is near or a passport expires

# Travel Prep (เตรียมเดินทาง)

Entry rules, passport facts, plug table and the fill-in checklist: [references/travel-facts.md](references/travel-facts.md) · [references/checklist-template.md](references/checklist-template.md).

General information — entry rules are set by the destination and change often; confirm on the embassy or official e-visa site before booking.

## Workflow

1. **Trip card** — destination(s) incl. transit countries, dates, travellers (ages; children travelling with one parent?), purpose (tourism / business / study).
2. **Passport check (T − 4 months or earlier)** — expiry date vs return date + 6 months; blank pages (2+). Short → renew now (below).
3. **Entry rule lookup** — per destination, decide which row of the decision table applies; record the source URL and the date checked.
4. **Book in the right order** — visa-required trip: refundable flights/hotel first, then visa appointment, then pay the rest after approval.
5. **Insurance** — buy before departure; match the destination's minimum if any (Schengen €30,000 medical incl. repatriation).
6. **Money** — card with low foreign-exchange (FX) fee or a travel card, some cash in local currency, tell the bank / enable overseas use in the app, note the card-freeze hotline.
7. **Connectivity and power** — roaming pack or eSIM, offline maps, plug adapter from the plug table.
8. **Health** — enough prescription medicine for the trip + 3 days, in original packaging with the label; English medicine list (`medication-schedule` ใน plugin เดียวกัน).
9. **Itinerary file** — every booking with confirmation number, address in local script, check-in time, contact.
10. **Day-before pass** — passport, money/cards, phone + charger + adapter, medicine: four things, physically checked.

## Entry decision table

| Situation | What to do | Lead time |
|---|---|---|
| Visa-exempt (e.g. China 30 days, Korea 90 days, Japan 15 days) | Check stay limit and whether the exemption is temporary; check any pre-registration (Korea K-ETA) | 1–3 weeks |
| Electronic authorisation / e-visa | Apply only on the official government site — look-alike sites charge many times the fee | 1–4 weeks |
| Visa on arrival | Bring photo, cash in the required currency, return ticket, hotel proof | Day of travel |
| Embassy / Visa Facilitation Services (VFS) visa (Schengen, UK, US, Australia, etc.) | Appointment, bank statements, employer letter, insurance (Schengen), bookings | 4–12 weeks; US interviews can be longer |
| Transit through a third country | Check airside transit rules — some countries need a transit visa even airside | With booking |

Current visa-free list for Thai passports: [references/travel-facts.md](references/travel-facts.md).

## Thai passport renewal (summary)

- There is no "renewal" — a new book is issued; the old one is cancelled. Book a queue at **qpassport.in.th**.
- Age 20+: choose 10-year or 5-year book; fees and same-day express rates are in [travel-facts](references/travel-facts.md).
- Adult brings ID card + old passport. Under 20 brings birth certificate, ID card, parents' ID cards; parents' consent required.
- Standard delivery by post in about 2–5 working days — still allow 2+ weeks before a visa appointment that needs the new book.

## Rules

- Confirm **validity windows**, not just possession — "6 months beyond entry" or "beyond departure" is the classic failure
- Never pay for an e-visa or K-ETA through an agent site you found by search ads; type the official address
- Everything with a confirmation number lives in the itinerary file, nowhere else
- Passport photo page and visa page scanned into the important-docs folder (`important-docs`) and available offline
- Travelling with a foreign spouse or friend into Thailand: they fill the **TDAC** (Thailand Digital Arrival Card) online before arrival; Thai citizens do not

## Output

Trip card · entry decision per traveller with source and date · checklist from the template · itinerary file `YYYY-MM-DD-destination-itinerary.md`.

Related: `important-docs` (passport expiry) · `human-writing/polite-message-th-en` (hotel or airline requests) · `digital-hygiene` (public Wi-Fi, SIM swap).

## เรียกเป็นคำสั่ง

`/personal-life:travel-prep <destination> <dates> [travelers]`

Run the `travel-prep` skill for: **$ARGUMENTS**

## References

- [`references/worked-example.md`](references/worked-example.md) — open when you want a filled-in trip (Tokyo, Thai and German travellers)


## reference: checklist-template.md

# Travel checklist and itinerary template

## Trip card

```
Trip: ______  Dates: ______ to ______  Travellers: ______
Purpose: tourism / business / study      Transit: ______
Entry rule (per traveller): ______  Source + date checked: ______
```

## Checklist

**T − 4 months**
- [ ] Passport valid ≥ 6 months after return, 2+ blank pages — every traveller
- [ ] Entry rule checked on the official site; visa appointment booked if needed

**T − 2 weeks**
- [ ] Visa / e-visa / K-ETA approved — printed and saved offline
- [ ] Travel insurance bought; policy no. and 24-hour hotline in the itinerary file
- [ ] Card overseas use on; card-freeze hotline saved; some cash in local currency
- [ ] Roaming / eSIM chosen; offline maps downloaded
- [ ] Plug adapter for the destination; chargers say 100–240 V
- [ ] Medicine for trip + 3 days, in labelled packs; English medicine list
- [ ] Home: bills paid or on auto-debit, mail held, plants/pets covered

**T − 1 day**
- [ ] Passport · money/cards · phone + charger + adapter · medicine — physically checked
- [ ] Online check-in done; boarding passes offline
- [ ] Arrival card / registration filled (destination's official app or site)

## Itinerary file (`YYYY-MM-DD-destination-itinerary.md`)

| Date | Time | What | Confirmation no. | Address (local script) | Contact | Notes |
|---|---|---|---|---|---|---|
| | | Flight TG___ BKK→___ | | | | check-in closes ___ |
| | | Hotel | | | | check-in from ___ |

Emergency block: insurer hotline · Thai embassy/consulate address and phone at the destination · card-freeze numbers · a contact at home.


## reference: travel-facts.md

# Travel facts for Thai passport holders

## Contents

- Visa-free destinations (Thai ordinary passport)
- Pre-registration and arrival cards
- Thai passport fees
- Travel insurance minimums
- Plugs and voltage

## Visa-free destinations (Thai ordinary passport)

Department of Consular Affairs list, July 2026 — 35 destinations. Recheck before every trip: the destination decides and temporary measures end.

| Stay | Destinations |
|---|---|
| 365 days | Georgia |
| 90 days | Republic of Korea (K-ETA see below), Argentina, Brazil, Chile, Ecuador, Haiti, Panama, Peru |
| 60 days | Cambodia (รอยืนยัน: some reports say 14 days under the bilateral deal, checked 2026-10-22), Samoa |
| 30 days | China (mutual agreement since 1 Mar 2024; max 90 days in 180), Hong Kong, Macau, Indonesia, Malaysia, Singapore, Vietnam, Laos, Philippines, Maldives, Mongolia, Kazakhstan, Kyrgyz Republic, Tajikistan, Russia, Türkiye, Seychelles, South Africa, Timor-Leste |
| 15 days | Japan — temporary, extended to 30 June 2027 |
| 14 days | Brunei, Oman, Myanmar (airport entry only); Taiwan — trial extended 1 Aug 2026 to 31 Jul 2027, no extension of stay (announced by the Taipei Economic and Cultural Office in Thailand 17 Jul 2026; ตรวจล่าสุด 2026-10-14 · แหล่ง: https://www.nationthailand.com/news/general/40068763 · https://www.dailynews.co.th/news/6035608/ — official page not found, รอยืนยัน) |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.nationthailand.com/news/40068149 · https://www.nationthailand.com/news/40068390 · https://english.beijing.gov.cn/latest/lawsandpolicies/202403/t20240301_3578010.html

If the country is not on the list, a visa is needed (Schengen countries, UK, US, Canada, Australia, New Zealand, India e-visa, etc.). Use the embassy or official e-visa site.

## Pre-registration and arrival cards

| Item | Who | Notes |
|---|---|---|
| K-ETA (Korea) | Thai passport holders — Thailand was not on the K-ETA exemption list (รอยืนยัน for travel after 31 Dec 2026) | Official site k-eta.go.kr or the K-ETA app only, fee 10,000 KRW; fake sites charge many times more |
| TDAC — Thailand Digital Arrival Card | Non-Thai nationals entering Thailand (since 1 May 2025); Thai citizens exempt | tdac.immigration.go.th — free; fill before arrival |
| Arrival cards abroad | Varies (Japan Visit Japan Web, Singapore SG Arrival Card, etc.) | Fill on the official site/app 1–3 days before |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.universalweather.com/blog/thailand-introduces-mandatory-digital-arrival-card-for-all-foreign-nationals-effective-may-1-2025/ · https://loyaltylobby.com/2026/01/02/south-korea-extends-k-eta-waiver-through-december-2026-for-select-nationals-of-22-countries/

## Thai passport fees

| Book | Standard | Express (same day) |
|---|---|---|
| 5 years | 1,000 บาท | 3,000 บาท |
| 10 years (age 20+) | 1,500 บาท | 3,500 บาท |

Queue: qpassport.in.th. Adults: ID card + old passport. Standard delivery by post 2–5 working days; postage fee (รอยืนยัน).

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.thaipbs.or.th/news/content/302339 · https://www.thairath.co.th/lifestyle/life/2859846

## Travel insurance minimums

| Destination | Requirement |
|---|---|
| Schengen visa | Medical incl. emergency treatment, hospitalisation and repatriation, minimum €30,000, valid in all Schengen states for the whole stay |
| Others | Usually not required for entry but strongly advised — check medical limit, repatriation, pre-existing conditions, flight delay, baggage, adventure-sport exclusions |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.axa-schengen.com/en/schengen-travel-insurance/30000-euro-coverage (EU Regulation 810/2009)

## Plugs and voltage

Thailand: A, B, C, O · 230 V · 50 Hz. Most phone/laptop chargers are 100–240 V — check the label; hair dryers and kettles often are not.

| Destination | Plug | Voltage |
|---|---|---|
| Japan | A, B | 100 V |
| Taiwan | A, B | 110 V |
| United States | A, B | 120 V |
| South Korea | C, F | 220–230 V (รอยืนยัน) |
| China | A, C, I | 220–230 V (รอยืนยัน) |
| Hong Kong, Singapore, Malaysia, United Kingdom | G | 230 V |
| Vietnam | A, B, C | 220–230 V (รอยืนยัน) |
| Germany | C, F | 230 V |
| France | C, E | 230 V |
| Italy | C, F, L | 230 V |
| Switzerland | C, J | 230 V |
| Australia | I | 230 V |

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.worldstandards.eu/electricity/plug-voltage-by-country/


## reference: worked-example.md

# Worked example · travel-prep

Nok (Thai, 34) and her German husband, Tokyo 10–17 January 2027. Check on 2026-10-06:
- Nok's passport expires 2027-03-14 — Japan wants it valid for the stay, but the airline and future trips make 6 months the safe rule → book a 10-year passport now (1,500 บาท).
- Japan visa exemption for Thai ordinary passports: 15 days, temporary measure to 30 June 2027 → covers 7 days; recheck in December.
- Husband: German passport, Japan visa-free; returning to Bangkok he fills TDAC online before arrival.
- Insurance: annual Asia plan; Japan 100 V, plug A/B — Thai two-flat-pin chargers fit, check the device says 100–240 V.


---

# skill: gift-idea-tracker

Use when a gift is needed for a birthday or holiday

# Gift Idea Tracker (ของขวัญและของฝาก)

Never the blank-page "what do I get them" again — and no repeats, no awkward over- or under-giving.

Registry template and occasion calendar: [references/gift-registry-template.md](references/gift-registry-template.md).

## Workflow

1. **Build the people list once** — family, close friends, boss/team, kids' teachers, helpers (แม่บ้าน, คนขับรถ, รปภ.). One block per person.
2. **Load the occasion calendar** — birthdays plus the Thai calendar below; set a reminder 14 days ahead (30 days if shipping from abroad or ordering custom).
3. **Capture year-round** — when someone says "อยากได้…" / "I wish I had…", add it to their wish list the same day with the date.
4. **Before an occasion** — read the person's block: last 2 years' gifts (avoid repeats), wishes, sizes, dislikes, budget.
5. **Shortlist 3 ideas** within budget — one from their wish list if any, one experience, one practical/consumable. Each with *why it fits this person*.
6. **Decide and buy** — note delivery time; for a group gift name who collects money and the per-person share.
7. **Log after giving** — what, cost, reaction (loved / fine / unused). The reaction is next year's data.

## Thai occasions and what is customary

| Occasion | Usual form | Notes |
|---|---|---|
| ปีใหม่ (New Year) | Gift basket (กระเช้า), snacks, small gift for helpers and teams | Order baskets by mid-December — prices and lead times rise |
| ตรุษจีน | อั่งเปา (red envelope) to children and elders, even amounts; fruit (ส้ม) when visiting | Avoid amounts with 4; new notes |
| สงกรานต์ | Visit elders, รดน้ำดำหัว with ผ้าขาวม้า/ผ้า, fragrant water, food | Plan travel weeks ahead |
| วันแม่ 12 ส.ค. · วันพ่อ 5 ธ.ค. | Meal together, flowers (มะลิ for mothers), health items | Booking restaurants fills early |
| Birthday | Personal gift; for elders, a merit-making outing (ทำบุญ) works well | |
| งานแต่ง | ซองช่วยงาน in the envelope from the invitation | Amount by closeness and venue — family norm, not a rule |
| งานบวช / ขึ้นบ้านใหม่ | ซองทำบุญ, or useful household item for a new home | |
| งานศพ | ซองทำบุญ at the funeral rites; flowers/wreath (พวงหรีด) | No "gift" — never give anything festive |
| Visit / back from a trip | ของฝาก — local snack or product | Team: one shareable box beats individual items |
| Teacher (วันครู 16 ม.ค., end of term) | Card made by the child, small useful item | Check school policy |

Amounts are family and social custom — there is no correct number; follow what the family did before and the user's budget.

## Rules

- **Budget is a hard ceiling**, set before looking at ideas
- Experiences beat objects for people who have everything — always include one experience option
- Kids: agree with the parents before anything big, noisy or screen-based
- **Gifts to government officials**: a state official may accept a customary gift only up to 3,000 บาท per giver per occasion (ระเบียบ ป.ป.ช.); many companies have stricter no-gift policies — for work contacts, check their policy first
- Track sizes with the date measured — children's sizes go stale in six months
- Never put the price tag or receipt in the box, but keep the receipt (exchange) in the registry note

## Output

Shortlist table (idea · price · where to buy · why it fits · lead time) · updated person block · next reminders.

Related: `human-writing/polite-message-th-en` (thank-you and declining messages) · `weekly-review` (upcoming occasions in the next 14 days).

## References

- [`references/worked-example.md`](references/worked-example.md) — open for a sample shortlist (birthday, budget 2,000 บาท)
- [`references/sources.md`](references/sources.md) — gift-limit sources (checked 2026-10-06)


## reference: gift-registry-template.md

# Gift registry template

One file `gift-tracker.md`. Keep people in alphabetical order; newest log line on top.

## Person block

```markdown
## [Name] — [relationship]
- Birthday: YYYY-MM-DD · Other dates: [wedding anniversary, วันเกิดลูก]
- Budget per occasion: ___ บาท
- Sizes (date measured): shirt ___ · shoes ___ · ring ___ · (YYYY-MM)
- Likes: ___ · Dislikes / allergies: ___ · Already owns plenty of: ___
- Coordinate with: [spouse, siblings — group gifts]

### Wish list (date heard · item · where)
- 2026-07-20 · walking shoes · said at the park

### Given
| Date | Occasion | Gift | Cost | Reaction (loved / fine / unused) |
|---|---|---|---|---|
| 2025-11-03 | Birthday | Blender | 1,650 | loved — uses daily |
```

## Occasion calendar (fill once a year)

| Month | Fixed occasions | People |
|---|---|---|
| Jan | ปีใหม่ · วันครู 16 ม.ค. | |
| Jan/Feb | ตรุษจีน (lunar date — check the year) | |
| Apr | สงกรานต์ 13–15 เม.ย. | |
| Aug | วันแม่ 12 ส.ค. | |
| Dec | วันพ่อ 5 ธ.ค. · Christmas / year-end team gifts | |
| Any | Birthdays, weddings, งานบวช, ขึ้นบ้านใหม่, new baby | |

## Group gift note

```
Gift: ___  Total: ___ บาท  People: ___  Each: ___ บาท
Collector: ___  PromptPay/account: ___  Paid by date: ___
Bought by: ___  Card signed by: ___
```


## reference: sources.md

# Sources · gift-idea-tracker

ตรวจล่าสุด 2026-10-06 · แหล่ง: https://www.sec.or.th/TH/Documents/AboutUs/SEC-NACC-Guidelines-On-Ethical-Gifts-2020.pdf · https://www.prachachat.net/?p=1112842


## reference: worked-example.md

# Worked example

Mother-in-law, 64, birthday 3 November, budget 2,000 บาท. Record: 2024 scarf (fine), 2025 blender (loved — uses daily); wish noted 2026-07-20: "เข่าไม่ค่อยดี อยากเดินสวนแต่ไม่มีรองเท้าดีๆ"; dislikes perfume.

Shortlist:
1. Walking shoes with good cushioning, size 38 (measured 2026-07) — 1,890 บาท — straight from her wish, practical.
2. Morning ทำบุญ at her favourite temple + breakfast together — about 1,200 บาท — experience she values.
3. Herbal compress set + Thai massage voucher — 1,500 บาท — supports the knee comment without being medical.

Chosen: 1 + a handwritten card. Log reaction after the day.
