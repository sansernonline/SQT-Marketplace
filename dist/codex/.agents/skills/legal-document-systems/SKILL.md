---
name: legal-document-systems
description: Use when software handles legal documents — extracting clauses from contracts, document templates and automation, e-signature workflows and legal validity (eIDAS, ESIGN, Thai ETA), or legal-tech compliance.
---

# legal-document-systems

ซอฟต์แวร์ด้านเอกสารกฎหมาย — อ่านสัญญา · สร้างเอกสารอัตโนมัติ · ลายเซ็นอิเล็กทรอนิกส์

**เปิดเฉพาะไฟล์ที่ตรงกับงาน** — ไม่ต้องอ่านทั้งหมด แต่ละไฟล์เป็นคู่มือเต็มของเรื่องนั้น

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| extracting structure + clauses from contracts using NLP + ML. Patterns for clause identification, party extraction, date parsing, value extraction, and LLM-assisted analysis | [`references/contract-parsing-patterns.md`](references/contract-parsing-patterns.md) |
| building document automation — template languages, variable systems, conditional logic, intake forms, multi-format output (DOCX, PDF, HTML) | [`references/document-automation-patterns.md`](references/document-automation-patterns.md) |
| implementing electronic signatures with legal compliance — eIDAS, ESIGN, UETA, country-specific frameworks, signature levels (SES/AES/QES), authentication requirements | [`references/e-signature-compliance.md`](references/e-signature-compliance.md) |

## คู่มือบทบาท

agent ที่ถูกเรียกมาทำงานสายนี้ เปิดไฟล์บทบาทของตัวเองก่อนเริ่ม

| บทบาท | อ่าน | agent |
|---|---|---|
| building legal technology — contract management systems, document automation, e-signature platforms, legal workflow tools, or legal AI applications | [`references/agent-legaltech-engineer.md`](references/agent-legaltech-engineer.md) | `legaltech-engineer` |
| building contract analysis tools — clause extraction, risk identification, comparison, NLP for legal text, AI-assisted review | [`references/agent-contract-analyzer.md`](references/agent-contract-analyzer.md) | `legaltech-engineer` |
| building document automation systems — template engines, conditional logic, multi-language documents, version control for templates, integration with intake forms | [`references/agent-document-automation-engineer.md`](references/agent-document-automation-engineer.md) | `legaltech-engineer` |
| building e-signature platforms, integrating DocuSign/Adobe Sign, designing signing workflows, ensuring legal validity (eIDAS, ESIGN, local laws), or handling authentication for signing | [`references/agent-e-signature-specialist.md`](references/agent-e-signature-specialist.md) | `legaltech-engineer` |

## agent ของสายนี้

`legaltech-engineer` · `legal-compliance-officer`

## ที่มา

รวมจาก plugin `software-company-legaltech` (skill `contract-parsing-patterns` · `document-automation-patterns` · `e-signature-compliance`) เข้า `software-company` ใน v2.0.0 — เนื้อหาเดิมอยู่ครบใน `references/`
