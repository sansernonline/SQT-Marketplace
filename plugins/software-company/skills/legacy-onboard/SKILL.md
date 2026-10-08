---
name: legacy-onboard
description: Recover an as-is spec from a legacy system that has code but no documents, ready for change requests. Uses system-analyst with subagents per layer and the legacy-spec-recovery skill.
argument-hint: <path to legacy code> [module to go deep on | CR text]
disable-model-invocation: true
---

> **ทางลัดเข้า SuperUser:** เปิด skill `superuser` ด้วย playbook ที่ใกล้ที่สุด แล้วคัดลอกขั้นตอนด้านล่างลง todo ก่อน ขั้นตอนด้านล่างบอกรูปแบบงานและ output ของคำสั่งนี้ ให้ใช้คู่กับ playbook ไม่ได้ใช้แทน

Recover the as-is spec of the legacy system at:

**$ARGUMENTS**

Load the `legacy-spec-recovery` skill and `context-budget` first. Read only — never edit, build or run the legacy code.

1. **Inventory** — count files by type and by project, list generated folders to skip, find existing manuals, schema scripts, reports and ETL. Decide where output goes: `docs/as-is/` beside the code, outside the source projects. Write the coverage table into `docs/as-is/README.md`.

2. **System map, in parallel** — send one subagent per layer, each returning a table with `path:line` per row:
   - screens and endpoints with permissions (controllers, routes, menus)
   - data access: queries, stored procedures, status codes and the tables they touch
   - schema and data dictionary
   - integrations, jobs, reports, ETL, mobile or other clients
   - manuals and old documents: what they claim the system does

   Ask the user for a script-out of database objects and the menu/role tables at the same time — they are rarely in the repository.

   Then the `system-analyst` agent assembles `01`–`06` from those tables. `06-findings.md` holds defects and security weaknesses, for the system owner only.

3. **Deep dive** — if a module or a change request was given, document that module to screen level and list its characterization tests. If none was given, pick the module with the most business rules and say why.

4. **Change request** — if a CR was given, fill `assets/change-request.md` from the skill with before/after and full impact.

5. **Report** — coverage table (what is documented and how deep, what was not read), counts by confidence label, the top questions for the business, high-severity findings first, and the most surprising finding.
