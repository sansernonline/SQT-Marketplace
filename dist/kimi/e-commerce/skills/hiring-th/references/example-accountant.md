# Example: hiring 1 accounting officer

Moved from `SKILL.md` section 9 · every name, number and date in this file is an **example** · the company has 25 employees and is hiring 1 accounting officer, salary budget 22,000–26,000 baht, 3 candidates in the final round (A · B · C)

**Screening sheet**

| Criterion | Weight | 1 = | 3 = | 5 = |
|---|---|---|---|---|
| Monthly close | 30 | can post daily entries but has never closed the books | can close with someone checking, can explain a bank reconciliation | closes on time alone 12 months in a row, can explain every month-end adjusting entry |
| Monthly withholding tax and VAT | 25 | cannot pick the right withholding rate | gets 4 of 5 test questions right | gets 5 of 5 right and can explain input tax that cannot be reclaimed |
| Excel | 15 | uses only add and subtract formulas | can use XLOOKUP and pivot tables | finishes a reconciliation file from bank data within the 30-minute test |
| Attention to detail (check 20 documents hiding 6 errors) | 20 | finds at most 2 | finds 4 | finds all 6 |
| Chasing documents from vendors and the team | 10 | cannot say how they would chase | tells of 1 time, with the result | tells of 2 or more times, with numbers, such as pending documents cut from 30 to 5 |

**Scores after the interview**

| Criterion | Weight | A | B | C |
|---|---|---|---|---|
| Monthly close | 30 | 4 | 5 | 3 |
| Withholding tax and VAT | 25 | 3 | 4 | 5 |
| Excel | 15 | 5 | 3 | 4 |
| Attention to detail | 20 | 4 | 3 | 5 |
| Chasing documents | 10 | 3 | 4 | 2 |
| Sum of weight × score | | 380 | 395 | 395 |
| **Total score (÷ 5)** | | **76.0** | **79.0** | **79.0** |

How B's score is worked out: 30×5 + 25×4 + 15×3 + 20×3 + 10×4 = 150 + 100 + 45 + 60 + 40 = 395, then ÷ 5 = 79.0

B and C tie, so run `node decide.mjs score templates/score-example.json` (actually run 2026-10-28 · the script rescales each criterion to 0–100 by the best and worst candidate, so the numbers differ from total score ÷ 5): B 52 · C 52 · A 45, and it prints

`ผล: ยังไม่นิ่ง อันดับ 1 เปลี่ยนเมื่อ ปิดงบรายเดือน ×0.8 → C · ภาษีหัก ณ ที่จ่ายและ VAT ×1.2 → C · …`

Rank 1 can flip, so the score cannot decide in place of people. The interview panel discussed that the first-year job needs monthly close (B scored 5, C scored 3) more than tax and attention to detail (where C is better), so they chose B and wrote this reason down · C is kept as the reserve for 6 months per section 6 · nobody scored 1 on any criterion, so nobody fails a minimum.

**Offer to B** Salary 25,000 baht, start 1 Dec 2569, probation 119 days (1 Dec 2569 to 29 Mar 2570) · if the company dismisses after 120 consecutive days of work and no exception in section 7 applies, severance equals 30 days of the last wage rate = 25,000 ÷ 30 × 30 = 25,000 baht, and the company must still give advance notice or pay wages in lieu of notice.
