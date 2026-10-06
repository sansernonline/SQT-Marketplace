---
name: maintenance
description: Build or update the home maintenance schedule for the next 12 months, or compare contractor quotes for one job.
argument-hint: <"schedule" | job to quote> [house type, aircon count, car details]
---

Run `home-maintenance` with the `home-manager` agent for: **$ARGUMENTS**

If vehicles are mentioned, add their tax, พ.ร.บ., ตรอ. and service dates from `vehicle-care`. Output a month-by-month table plus the jobs due in the next 90 days; quotes are compared with the contractor quote checklist.
