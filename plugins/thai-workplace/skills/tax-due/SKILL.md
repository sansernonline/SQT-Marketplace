---
name: tax-due
description: Build the Thai filing calendar for a company or individual — which form, which month, what documents to prepare, verified against the Revenue Department for the current year.
argument-hint: '[company|personal] [--month <n>]'
disable-model-invocation: true
---

Run `tax-vat-th` with the `tax-helper` agent for: **$ARGUMENTS**

Verifies dates against current RD announcements rather than reusing last year's calendar, and ends with the accountant handoff checklist.
