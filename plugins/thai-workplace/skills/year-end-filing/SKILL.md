---
name: year-end-filing
description: Build the year-end filing timeline for a Thai company — AGM, บอจ.5, statements via DBD e-Filing, ภ.ง.ด.50.
argument-hint: '[company|partnership] [--year-end <date>]'
disable-model-invocation: true
---

Run `dbd-annual-filing` with the `tax-helper` agent for: **$ARGUMENTS**

Shifts dates for weekends and holidays with `thai-holidays`, lists the documents per step, flags late-filing fines, and ends with the auditor and accountant handoff checklist.
