---
name: data-analysis
description: Use when a CSV, Excel or SQL export must answer a question
---

# data-analysis · answer business questions from data with numbers you can trace back

> **The one rule:** every number in a finding must point back to one line in the script's output.
> A number worked out in your head or typed by hand cannot be re-checked, and cannot be repeated when next month's data arrives (evidence in the style of `principle-prove-it-works`).

## When to use this skill

- The owner sends a CSV or Excel file and asks "how are sales?" or "which customer group went missing?"
- You must make a monthly or quarterly numbers report that repeats every round.
- Nobody knows where the numbers in the old report came from.
- You must draw Thai-language charts for a report or slides.

## When to use another skill instead, or together

| Job | Use | |
|---|---|---|
| An Excel import or export screen inside a system | `data-import-export` | instead |
| Automated data pipeline · warehouse | agent `data-engineer` | instead |
| Domain-specific numbers (health · finance · insurance · Software as a Service: SaaS revenue) | agent `clinical-data-analyst` · `quant-analyst` · `insurance-analyst` · `revops-analyst` | instead |
| Business metrics watched live on the system's dashboard | `observability-basics` section 6 | instead |
| Write pandas correctly (Copy-on-Write · money in satang) | `stack-python` section 4 | together |
| Query from a database | `stack-sql` | together |
| Buddhist Era (B.E.) years · Thai sorting · number formats | `i18n-and-locale` | together |
| Personal data | `pdpa-compliance` section 5 | together |
| Deliver as .docx | `markdown-report-docx` | together |

---

## 1 · Start from the question: what decision will this number change?

Write these 4 lines at the top of the report before opening the data file. The sample below is in Thai because the report is for Thai readers. It reads: question · the decision that will change · what we need to know · we will change our mind when.

```text
คำถาม: ควรย้ายงบโฆษณาจากหน้าร้านไปออนไลน์ไหม
การตัดสินใจที่จะเปลี่ยน: แบ่งงบโฆษณาไตรมาสหน้า
ต้องรู้: สัดส่วนยอดออนไลน์ปีนี้เทียบปีก่อน · หน้าร้านลดลงเท่าไหร่ในเดือนที่เทียบกันได้
จะเปลี่ยนใจเมื่อ: ออนไลน์ต่ำกว่า 40% ของยอดรวม หรือหน้าร้านไม่ได้ลดลง
```

- If you cannot say what decision the number will change, ask the owner once at the start, as a multiple-choice question.
- For a broad request like "please analyse this", offer 2–3 questions that this data can really answer, and let them choose.
- Numbers that do not help answer the question stay out of the report, even if you already calculated them.

## 2 · Get the data

| Source | Method | Watch out for |
|---|---|---|
| CSV from a system, or Excel | Read every cell as text first (`dtype=str`), then convert column by column yourself | Encoding and Thai-style numbers (section 3) |
| Excel (.xlsx) | `pd.read_excel(path, sheet_name=..., dtype=str)` needs openpyxl | Merged cells · several tables on one sheet · a total row at the end of a table |
| SQL export | Keep the query as a `.sql` file beside the script · use a read-only account · pull only the columns you use | Date range and the server's time zone |

- Note the file's origin at the top of the report: who sent it · date received · source system · data period.
- Keep the original file in `data/raw/` and never edit it by hand. Every fix lives in the script.
- For Excel and CSV traps (leading 0 lost · 13-digit numbers shown as exponents · dates interpreted on their own) see `data-import-export` section 4.

## 3 · Clean up: what is specific to Thai files

| You find | Do |
|---|---|
| encoding | Try `utf-8-sig` first (Excel's "CSV UTF-8" has a Byte Order Mark: BOM). If it will not read, try `cp874` (TIS-620 from old Thai programs). Never use `errors="ignore"`, because characters vanish silently. |
| B.E. year | Subtract 543 when converting to a date, then show it as B.E. again in a Thai report. In a mixed file, a year above 2400 is B.E. |
| Short month name "ม.ค." | Map the 12 names yourself. Do not rely on the machine's locale. |
| Thousands separator "1,295,500" | Remove `,` before converting. `pd.read_csv(..., thousands=",")` works when the whole column is Arabic digits. |
| Thai digits ๐–๙ | Convert with `str.maketrans` before converting to a number (code below). |
| Blank vs 0 | Blank = unknown (missing data) · `0` = known to be zero · `-` often comes from Excel's accounting number format that shows 0 as `-`, so ask the file owner before converting. Never `fillna(0)` on the whole table. |
| Total rows · duplicate rows | Drop them, and print how many rows were dropped. |

```python
THAI_DIGITS = str.maketrans("๐๑๒๓๔๕๖๗๘๙", "0123456789")

def to_number(text):
    """'๑,๒๓๔' → 1234.0 · '-' → 0.0 · blank → None (missing data, not 0)"""
    cleaned = text.translate(THAI_DIGITS).replace(",", "").strip()
    if cleaned == "":
        return None
    return 0.0 if cleaned == "-" else float(cleaned)
```

Every step that changes the data must also print how many rows it changed (`[ว่าง] 3 แถว` · `[ศูนย์] 1 แถว`), so the reader knows what the script did to the data. The encoding reader and the B.E. month converter are in `assets/analyse_sales.py`.

## 4 · Analyse with a script that re-runs

- One `.py` script sits beside the report. One command runs it and gives the same result every time. No notebook server is needed.
- Every result line starts with a code `[F1]` `[F2]` … and you save the output with `python analyse.py data.csv > output.txt`.
- Use pandas when you must group on several dimensions. For a small file or a machine where you cannot install anything, use `csv` and `statistics` from the stdlib.
- Pin versions in `requirements.txt` (`pandas` · `matplotlib>=3.11`). Any randomness needs a seed, and the seed is printed in the output.
- Compare fairly: the same month of the previous year · drop months when the shop was closed on both sides · the same denominator across the table.
- Recompute the 2–3 main numbers a second way (plain `csv`, or totals in Excel). They must match before you write the report.

```text
report-sales-2568/
├─ data/raw/sales.csv   # original, never edited, and kept out of git if it holds personal data
├─ analyse.py           # re-runnable
├─ output.txt           # the output the report cites [F1] [F2] …
├─ chart-f1.png
└─ report.md
```

## 5 · Charts: 1 figure, 1 message

- The chart title is a finding with a number, not a column name · the axis always states the unit (baht · million baht · % of total) · bar charts start the axis at 0.
- For months with incomplete data, leave a gap in the line and do not draw through it. Under the figure, say which month was skipped and why.
- Fonts: **Sarabun** has Thai, Latin and digits in one file · **Noto Sans Thai** has Thai letters only, so digits and Latin show as boxes unless you add a second font to catch them (both are under the SIL Open Font License: OFL). Put the font files beside the script and do not rely on fonts on the machine.
- **Use matplotlib 3.11 or later.** This version added complex text layout with libraqm. Earlier versions place tone marks on top of the upper vowels.

| matplotlib | Result on the words "เพิ่ม ที่ ปี่ ญี่ปุ่น" (ตรวจจริง 2026-10-23) |
|---|---|
| 3.10.6 | Sarabun · Noto Sans Thai · Tahoma · Leelawadee lose the tone mark when there is an upper vowel ("เพิ่ม" becomes "เพิม") · TH SarabunPSK shows correctly |
| 3.11.2 | All the fonts above show correctly |

```python
import matplotlib
matplotlib.use("Agg")                                   # no display needed
import matplotlib.pyplot as plt
from matplotlib import font_manager

FONT = "fonts/Sarabun-Regular.ttf"                      # font file sits beside the script, not on the machine
font_manager.fontManager.addfont(FONT)
plt.rcParams["font.family"] = [font_manager.FontProperties(fname=FONT).get_name(), "DejaVu Sans"]
plt.rcParams["pdf.fonttype"] = 42                       # PDF embeds the font as TrueType
fig, ax = plt.subplots(figsize=(8, 4.5))
ax.plot(months, share_pct, marker="o")
ax.set_title("สัดส่วนยอดขายออนไลน์เพิ่มจาก 36% (2567) เป็น 48% (2568)")   # title = the finding [F1]
ax.set_ylabel("สัดส่วนออนไลน์ (% ของยอดขายรวม)")          # the unit is on the axis
ax.set_ylim(0, 100)
fig.savefig("chart-f1.png", dpi=200, bbox_inches="tight")
```

The second font `"DejaVu Sans"` catches characters the first font lacks (needed when you use Noto Sans Thai). A PNG at 200 dpi is enough for Word. Always open the image and look at it before sending, and zoom in on words where a tone mark stacks on a vowel.

## 6 · Write findings with their limits

1 finding = 1 sentence of conclusion + the number + the line code + the limits of that finding. An interpretation that does not come straight from the numbers gets the label `อนุมาน` (inferred).

| Limit to state | Example |
|---|---|
| Sample size | 24 months from one shop · a group with fewer than 30 rows can swing a lot, say so |
| Missing data | LINE is blank for 3 months and was not filled in, so online sales for 2025 (B.E. 2568) are lower than the real figure |
| Correlation is not cause | Online rose while the shop fell, but the data has no customer ID, so it cannot say that the same customers moved channels |
| Season and special events | 11.11 · 12.12 · Songkran · months when the shop was closed |
| Rounding | Rounded percentages may not add up to 100 |

## 7 · Deliver

| Format | Use when | How |
|---|---|---|
| Markdown (`report.md`) | The team reads it in the repo or will convert it to .docx next | `markdown-report-docx` |
| .xlsx | The recipient wants to filter or calculate further | `df.to_excel()` (needs openpyxl) · format with `anthropic-skills:xlsx` · for export-file rules (escape formulas · file name · a header stating the filter conditions) see `data-import-export` sections 4–5 |
| Slides | A presentation to executives | `presentation-design` · 1 slide, 1 finding |

Attach `analyse.py` and `output.txt` to the report every time, so anyone who doubts a number can re-run it.

## 8 · Personal Data Protection Act (PDPA): analyse from aggregated or pseudonymised data

- Drop the columns you do not use (name · phone · email · ID card number) as you read the file.
- If you must count per person, replace the ID with a salted hash and keep the salt apart from the data. Pseudonymised data can still identify a person if someone holds the key, so control it like personal data.
- **Never paste personal data into an AI prompt or chat.** Give the agent only column names, sample rows that are already faked, or totals. Let a local script read the real file, and the agent does not `cat` or `head` a file that has people's names.
- In exported results, merge any group of fewer than 5 people into another group or hide it, so nobody can guess a person from a total (our own threshold).
- The report has no names · raw data files stay out of git · for the principle of keeping only what is needed see `pdpa-compliance` section 5.

## 9 · Real example: monthly sales (sample) → 3 findings

**Data:** `assets/sales-sample.csv` is sample data made by `assets/make_sample.py`, not real sales. It has 72 rows (24 months × 3 channels) and all the usual Thai-file problems: "ม.ค. 2567" · "1,295,500" · Thai digits in the LINE rows for 2025 (B.E. 2568) · 3 blank rows · 1 `-` row. Years in the sample are B.E.: 2567 = 2024 and 2568 = 2025.

**Question:** should ad budget move from the shop to online? (section 1)

**Run:** download `Sarabun-Regular.ttf` from google/fonts into `fonts/` first, then run `python assets/analyse_sales.py assets/sales-sample.csv --out _to_delete/sales --font fonts/Sarabun-Regular.ttf > output.txt`

```text
[ไฟล์] sales-sample.csv · utf-8-sig · 72 แถว · 3 ช่องทาง · 24 เดือน (ม.ค. 2567 – ธ.ค. 2568)
[ว่าง] 3 แถว ไม่นับเป็น 0: LINE มี.ค. 2568, LINE เม.ย. 2568, LINE พ.ค. 2568
[ศูนย์] 1 แถว ยอด 0 จริง: หน้าร้าน ส.ค. 2568
[F1] สัดส่วนออนไลน์ (Shopee + LINE) ของยอดรวม: 2567 = 36.3% · 2568 = 48.0%
[F2] หน้าร้าน 11 เดือนที่เปิดทั้ง 2 ปี: 2567 = 13,177,600 บาท · 2568 = 11,951,900 บาท · เปลี่ยน -9.3%
[F3] Shopee ปี 2568: พ.ย. + ธ.ค. = 2,514,900 บาท = 27.0% ของทั้งปี
[กราฟ] chart-f1-online-share.png · เว้นช่อง 4 เดือนที่ข้อมูลไม่ครบหรือร้านปิด
```

**Findings in the report**

1. Online sales rose from 36.3% to 48.0% of the total `[F1]`. The figure for 2025 (B.E. 2568) is still lower than real, because LINE has no sales for 3 months `[ว่าง]`.
2. The shop fell 9.3%, from 13,177,600 to 11,951,900 baht, comparing only the 11 months it was open in both years `[F2]`. In August 2025 the shop was closed, so that month is not counted `[ศูนย์]`.
3. Shopee got 27.0% of the whole year's sales from November and December `[F3]`. So the online ad budget should follow the campaign rounds, not be spread evenly over every month (`อนุมาน`).

**Limits:** 24 months of data from one shop, and no customer ID, so it cannot say that people who used to buy at the shop moved to buying online.

**Check:** a recount with plain `csv` gave 36.3 · 48.0 · −9.3 · 27.0, matching on every one. The same file saved as cp874 and re-run gave the same F1–F3 results. The chart was opened and "เพิ่ม" has all its tone marks on matplotlib 3.11.2 (ตรวจจริง 2026-10-23 · pandas 3.0.3 and 3.1.0).

## 10 · Check before sending

**8 traps where numbers go wrong without an error** (reworded from validate-data in knowledge-work-plugins · Apache-2.0 · seen 2026-11-10)

| Trap | Symptom | How to check | How to prevent |
|---|---|---|---|
| A join duplicates rows | The total after the join is higher than before | Count rows before and after the join · `df.merge(..., validate="m:1")` | Check that the keys on the side that should be 1 are unique before the join |
| Average of averages | The overall average does not match one computed from raw rows | Recompute from the raw rows | Weight by the real counts. Do not average per-shop or per-month averages |
| The denominator changed | The rate rose because the base shrank, not because the numerator grew | Compare the numerator and denominator separately over 2 periods | State the denominator every time you give a % |
| Counting rows instead of people | "Customers" is larger than the real number of people | `nunique` of the customer ID against `len` | Name the unit exactly (orders · customers · products) |
| Survivorship | Analysing only those still present makes results look too good | Ask who the missing rows are | Keep customers who quit, closed or returned goods in the base |
| Simpson's paradox | The overall trend runs against the trend of every subgroup | Break down by the main group (channel · branch) and compare | Look at both the total and the groups before concluding |
| Time zone | The last day of the month's sales vanish or shift a day | Check whether the time column is UTC or Asia/Bangkok (+7) and convert before cutting by day | Convert the time zone before `groupby` day |
| Unequal calendars | A month-to-month comparison is high or low because of the number of working days | Count working days and public holidays in each period | Compare per working day, or compare the same period of the previous year |

A date column that mixes B.E. and C.E. years is trap 9, specific to Thai files: a year above 2400 is B.E. (convert per `i18n-and-locale` section 3). The government fiscal year starts on 1 October, not 1 January.

**Sanity-check box.** Do it before putting a number into a finding.

1. **Scale:** is the number in a range you already know? (One day's sales larger than last year's total = wrong.)
2. **Recompute another way:** use plain `csv`, or a different SQL formula. Do you get the same number?
3. **The parts add up to the total:** do the sub-totals (channel · branch · month) equal the grand total? If not, find the rows that slipped out before you report.


- [ ] The report header has the question, the decision the numbers will change, and the file's origin
- [ ] Every number in a finding has a line code you can find in the latest `output.txt`
- [ ] Re-running the script from the original file gives the same `output.txt`
- [ ] The report says which encoding was used, and how many blank rows, zero rows and dropped rows there were
- [ ] Every chart has a finding as its title, a unit on the axis, and was opened to confirm the Thai text is not boxes and the tone marks are not lost
- [ ] The limits are complete: sample size, missing data, and correlation that is not cause
- [ ] No personal data in the report, in the prompt, or in git

## 11 · Anti-patterns

- **A number in the report with no output line behind it.** It cannot be traced back, and next month it cannot be repeated.
- **`fillna(0)` on the whole table.** Unknown cells become zero sales and the average drops silently.
- **A notebook that runs only in the order the author clicked.**
- **Reading CSV with `errors="ignore"`.** Thai characters vanish and nobody sees it.
- **One chart carrying several messages,** or a chart title that is a column name.
- **Sending a Thai chart with boxes or lost tone marks** because nobody opened it before sending.
- **Comparing a month when the shop was closed with a normal month** and concluding that sales fell.
- **Concluding that X caused Y** from 2 lines on a chart that rise and fall together.
- **Pasting a customer list into an AI chat** to get help analysing it.

## Link to other skills

| Need | Use |
|---|---|
| Excel and CSV file traps · export-file rules | `data-import-export` sections 4–5 |
| pandas · repeatable results · Thai CSV | `stack-python` section 4 |
| B.E. years · Thai-style numbers and money | `i18n-and-locale` sections 3 · 5 |
| Personal data · keep only what is needed | `pdpa-compliance` section 5 |
| .docx report from Markdown | `markdown-report-docx` |
| Evidence before saying it is done | `principle-prove-it-works` |
| Language in the report and chart titles | `human-writing` |

## Sources (checked 2026-10-23)

- knowledge-work-plugins `data/skills/validate-data` (Apache-2.0 · reworded, not translated directly · seen 2026-11-10): github.com/anthropics/knowledge-work-plugins

- matplotlib 3.11.0 (2026-06-11) section "Complex text layout with libraqm": matplotlib.org/stable/release/prev_whats_new/whats_new_3.11.0
- Tested ourselves on Windows 11 · Python 3.13.5: matplotlib 3.10.6 and 3.11.2 · pandas 3.0.3 and 3.1.0 · Sarabun and Noto Sans Thai fonts from google/fonts · TH SarabunPSK · Tahoma · Leelawadee
- Sarabun: github.com/google/fonts/tree/main/ofl/sarabun (OFL) · Noto Sans Thai: github.com/google/fonts/tree/main/ofl/notosansthai (OFL)
- The data in section 9 was made with `assets/make_sample.py` (seed 2568) and is all sample data.
