# Bug fix: wrong date in the report header

Customer report: the report header (`src/report.js`) shows the wrong date
- A report for 19 Oct 2026 (B.E. 2569) at 10:00 Thai time shows "19 พ.ย. 2569"
- A report made at 01:30 Thai time on 1 Jan 2027 (B.E. 2570) shows a date in the previous year
- December reports show the month as "undefined"

Wanted: `formatThaiDate(date)` returns "day short-Thai-month Buddhist-year" in Thai time (UTC+7) in every case, regardless of the machine's timezone
Run the tests with `npm test`
