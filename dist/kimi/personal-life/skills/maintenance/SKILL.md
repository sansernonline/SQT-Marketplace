---
name: "maintenance"
description: "Build the home maintenance schedule for the next 12 months, or compare contractor quotes."
disableModelInvocation: true
---

Run `home-maintenance` with the `home-manager` agent for: **$ARGUMENTS**

If vehicles are mentioned, add their tax, พระราชบัญญัติคุ้มครองผู้ประสบภัยจากรถ (พ.ร.บ.), สถานตรวจสภาพรถเอกชน (ตรอ.) and service dates from `vehicle-care`. Output a month-by-month table plus the jobs due in the next 90 days; quotes are compared with the contractor quote checklist.
