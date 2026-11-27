# Reading k6 results and writing the report

Extension of `test-automation` → `references/load-testing.md` section 5 · k6 facts checked 2026-10-28 from the pages linked at the end of the file · the interpretation is general practice, not yet tested against a real system this round

## 1 · Read in this order

| Order | What to look at | Interpretation |
|---|---|---|
| 1 | exit code | 0 = every threshold passed · not 0 = failed · a failed threshold usually gives 99 |
| 2 | the thresholds line at the end of the report | which thresholds passed, which failed, and the actual values |
| 3 | `http_req_failed` | if errors spike → a fast response time may only be because errors return fast, so do not celebrate the p95 yet |
| 4 | `http_req_duration` p95 and p99 | the range most users experience, and the tail a few users wait through · the average cannot be used to decide |
| 5 | `checks` | whether the answers are correct, not just a status 200 |
| 6 | warnings about not enough VUs, or rounds that did not start | the load generator could not keep up with the set rate; this run shows the limit of the generator, not the system (metric name of the dropped rounds `(ยังไม่ได้ตรวจ)` — not yet checked) |

## 2 · Find where it jams

Look at the system graphs for the same period as the run (`incidents-and-monitoring` → `references/observability-basics.md` section 2):

| Symptom in the graph | Suspect first |
|---|---|
| App CPU full, response time grows with it | Heavy code or too few machines · try adding machines and run again |
| App CPU idle, but response time grows | Waiting on something outside: database connection pool · table locks · an external API |
| Errors start at a certain load and then spike | Hit a ceiling (pool · open files · rate limit) · find the setting at that load |
| soak: memory keeps rising and never drops | Memory leak · connections not returned |
| Response time good at first, then worse as the data grows | Query without an index · table grown from data the run created |

## 3 · Re-run so results are comparable

- Same script, same starting data, same environment · clean up the data the previous run created
- Change one thing at a time (code, or a setting, or machine size) and run against the baseline
- The k6 docs advise running the same way at least 2 rounds before releasing a version, because each round's result varies

## 4 · One-page report format

```markdown
## ผล load test · <ระบบ> · <YYYY-MM-DD>

- environment: <staging-perf> · ผู้อนุมัติ: <ชื่อ> · ช่วงเวลา: <เริ่ม–จบ>
- แบบ: <smoke · load · spike> · ปริมาณสูงสุดที่ยิงจริง: <รอบต่อวินาที>
- k6 รุ่น: <v2.x.y> · exit code: <0 หรือ 99>

| เกณฑ์ | ตั้งไว้ | ได้จริง | ผล |
|---|---|---|---|
| http_req_duration p(95) | < 500 ms | <ค่า> | ผ่าน / ไม่ผ่าน |
| http_req_failed | < 1% | <ค่า> | ผ่าน / ไม่ผ่าน |

คอขวดที่เห็น: <กราฟไหน ที่ปริมาณเท่าไร>
ทำต่อ: <ข้อแก้ 1–3 ข้อ> · ยิงซ้ำหลังแก้: <วันที่>
```

Write results only as actually run · if you only ran 50 rounds per second → never write "can handle 1,000 users at once"

## Sources

- exit code https://grafana.com/docs/learning-paths/automate-k6-cicd/handle-exit-code/ (checked 2026-10-28)
- thresholds https://grafana.com/docs/k6/latest/using-k6/thresholds/ (checked 2026-10-28)
- run at least 2 rounds again https://grafana.com/docs/k6/latest/testing-guides/automated-performance-testing/ (checked 2026-10-28)
