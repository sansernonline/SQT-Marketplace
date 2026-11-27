# Worked example · load-testing

## One worked example

Label `ตัวอย่าง` (example): designed on paper, no real system has been loaded

**Problem:** An online shop will run a flash sale at noon on Friday. It went down before because the connection pool filled up. They want to know whether it survives this time.

| Step | What is done | Section |
|---|---|---|
| Goal | Volume from the previous campaign (รอยืนยัน) · path: browse products → add to cart → pay with a mock · p95 at most 500 ms · errors at most 1% (default, not measured) | 1 |
| Permission | Load staging at production size · payment points at a mock · approver and time window noted in the script header | 2 |
| Run | smoke → load (baseline) → spike | 4 |
| Monitor | Dashboards of connection pool and database CPU during the run | 6 |
| Result | Report which thresholds passed and failed at the volume really run, then add smoke to CI | 5 · 7 |

