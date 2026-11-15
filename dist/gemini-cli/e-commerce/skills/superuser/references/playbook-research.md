# playbook · research — find information that can be confirmed

Use when: you must find an answer that needs evidence · compare options · "ช่วยหาข้อมูล" (help me find information) · numbers or rules that may have changed
Result: an answer with sources, the date checked, and labels per [`evidence`](evidence.md) (`ตรวจจริง` · `จากแหล่ง` · `อนุมาน` · `ยังไม่ได้ตรวจ`) · user data you do not know gets `(รอยืนยัน)`
Main patterns: Reranker · ReAct (`agent-patterns`)
Deep mode: 4 or more sub-questions · the user asks for "deep research" or "วิจัยละเอียด" (research in detail) · a report needing a citation in every paragraph → use [`deep-research`](deep-research.md) instead of the 7 steps below (file queue · workers search in parallel · every claim checked)

## ขั้นตอน — Steps (copy into the todo exactly)

Labels kept in Thai because the validator matches them: `ใคร:` = who · `หัวหน้าทีม` = the lead · `ตัวใหม่` = fresh (a new instance) · `ตัวเดิม (ถือ …)` = the same agent, holding something.

1. Write 1–3 clear questions, then state what the user will do with the answer and how much of an answer is enough · ใคร: หัวหน้าทีม
2. Gather widely, 10–30 sources: official sources first, then standards, then named tool maintainers or experts · ใคร: `general-purpose` ตัวใหม่ · return a table of source · link · conclusion of no more than about 40 lines; a long result is written to a file and the path is sent
3. Score each source 0–3 on 4 items: matches the question · credible · recent enough · complete. If there are many sources, have a small-tier subagent do the first cut · ใคร: `general-purpose` ตัวใหม่ (small tier)
4. Read in full only the 3–5 top-scoring sources, then record the answer with link and date · ใคร: `general-purpose` ตัวใหม่
5. Decide. If ≥ 3 independent sources agree, label it `จากแหล่ง` (high confidence when an official source is among them) · what you reasoned from a source gets `อนุมาน` · if fewer than 3 or they conflict, use the value from the official source, label it `จากแหล่ง`, lower the confidence 1 level, append `(รอยืนยัน)`, and say where they conflict · ใคร: หัวหน้าทีม
6. Check (ตรวจ): a fresh subagent spot-checks 3 important numbers against the real source · ใคร: `reviewer` ตัวใหม่
7. Report: answer first, the source scoring table at the end, and say plainly what is still unknown · ใคร: หัวหน้าทีม

## Done when

Every number and claim in the answer has a source, a date, and a label
