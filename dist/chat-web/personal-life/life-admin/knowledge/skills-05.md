# skill: personal-kb

Use when the user cannot find a note they wrote, or wants a personal knowledge base or second brain.

# Personal KB (คลังความรู้ส่วนตัว)

A knowledge base works only if search finds the note in ten seconds. Plain Markdown files, so it survives any app change. When a notes plugin or app (Obsidian, Notion, Apple Notes) is installed, write there and keep this as the naming and tagging convention.

## Layout

```
kb/
  index.md            ← evergreen notes by category, refreshed monthly
  inbox/              ← quick captures, emptied weekly
  people/             ← one note per person (context, last talk, preferences)
  projects/           ← one folder per active project; archive when done
  reference/          ← how-tos, recipes, manuals, addresses, procedures
  journal/            ← dated notes, meeting notes, weekly reviews
  archive/
```

Two levels deep at most. A note's home is decided in two seconds: *is it about a person, a project, a reusable fact, or a day?*

## Naming

| Kind | Pattern | Example |
|---|---|---|
| Dated | `YYYY-MM-DD topic.md` | `2026-10-06 condo committee.md` |
| Evergreen | `topic.md` — noun first | `aircon service – Daikin bedroom.md` |
| Person | `firstname lastname.md` (plus Thai name in the note) | `ploy srisuk.md` |

## The Thai search problem

Thai has no spaces between words, so many tools match Thai words badly ("ภาษี" may not find "ภาษีเงินได้" in some apps, or finds too much). Fix:

- **File names in English or transliteration** (`tax 2569 deductions.md`), Thai content inside
- **Tags line at the top in both languages**: `tags: #tax #ภาษี #ลดหย่อน #deduction`
- **One spelling** — pick `Ploy` not `Ploi/พลอย/Ploy S.` and keep an alias line: `aliases: พลอย, Ploi`
- Dates always ค.ศ. `YYYY-MM-DD` in names — sorting and search break with mixed พ.ศ./ค.ศ.

## Note template

```markdown
# [Title]
tags: #area #คำไทย
aliases: [other names people use]
source: [link / book / person] · created YYYY-MM-DD

[One idea, in your own words. Max ~1 screen.]

Related: [[other note]]
```

## Workflow

1. **Capture (< 1 minute)** — drop into `kb/inbox/` with a dated name; formatting optional.
2. **Weekly sort (10 minutes, in `weekly-review`)** — for each inbox note: delete · merge into an existing note · file it with a proper name and tags.
3. **Split** notes over one screen into one-idea notes and link them.
4. **Index and lint monthly** — add new evergreen notes to `kb/index.md` under their category, then run the lint: notes with no `tags:` line (`grep -rL '^tags:' kb --include=*.md`) · inbox notes older than 14 days · two notes with the same title · `[[links]]` to notes that do not exist · people notes with no "last talk" date. Fix or delete each hit in the same sitting; a lint list that is carried over is a to-do list, not a knowledge base.
5. **Retrieval** — search by file name first, then tags, then full text. When a note was hard to find, rename it or add the alias you searched for — that is the maintenance loop.

## Worked example

User: "I wrote down how to reset the water pump last year." Search `pump` → nothing; full-text `ปั๊ม` → 14 hits in chat exports. Found it in `2025-05-11 notes.md`, mixed with a shopping list. Fix: move into `reference/water pump – reset and service.md`, tags `#home #ปั๊มน้ำ #pump`, alias "Mitsubishi pump", link from `index.md` under Home. Next search: 2 seconds.

## Rules

- Capture is fast; organisation happens weekly, not at capture time
- **Never store passwords, OTPs, recovery codes, full ID or card numbers** — they go to a password manager (`digital-hygiene`)
- Notes about other people: facts and preferences they shared with you, not gossip or health details they did not want written
- Back up the `kb/` folder with the rest of the user's files (3-2-1 rule in `digital-hygiene`)

Related: `meeting-summary` (files into `journal/`) · `important-docs` (documents, not notes) · `weekly-review`.


---

# skill: travel-prep

Use when a trip is one to two weeks away or a passport is near expiry. Visa, insurance, money, itinerary.

# Travel Prep (เตรียมเดินทาง)

One checklist, one itinerary file, no airport surprises. Written for Thai passport holders; works for anyone by swapping the entry-rule lookup.

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

## Worked example

Nok (Thai, 34) and her German husband, Tokyo 10–17 January 2027. Check on 2026-10-06:
- Nok's passport expires 2027-03-14 — Japan wants it valid for the stay, but the airline and future trips make 6 months the safe rule → book a 10-year passport now (1,500 บาท).
- Japan visa exemption for Thai ordinary passports: 15 days, temporary measure to 30 June 2027 → covers 7 days; recheck in December.
- Husband: German passport, Japan visa-free; returning to Bangkok he fills TDAC online before arrival.
- Insurance: annual Asia plan; Japan 100 V, plug A/B — Thai two-flat-pin chargers fit, check the device says 100–240 V.

## Output

Trip card · entry decision per traveller with source and date · checklist from the template · itinerary file `YYYY-MM-DD-destination-itinerary.md`.

Related: `important-docs` (passport expiry) · `polite-message-th-en` (hotel or airline requests) · `digital-hygiene` (public Wi-Fi, SIM swap).


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
