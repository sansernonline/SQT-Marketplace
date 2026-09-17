---
name: spell-out-abbreviations
description: Use in every piece of writing produced for a person — documents, code comments, commit messages, chat replies, user interface text, diagram labels. Requires each abbreviation, acronym or initialism to be written out in full the first time it appears, with the short form in brackets after it, for example Model Context Protocol (MCP), and the short form alone from then on. Load it whenever text is being written for someone else to read.
---

# Spell Out Abbreviations

> **กฎ:** ตัวย่อทุกตัว เขียนเต็มครั้งแรก แล้ววงเล็บตัวย่อไว้ — หลังจากนั้นใช้ตัวย่อได้

## รูปแบบ

```
✅ Model Context Protocol (MCP) ทำให้ Claude ต่อกับระบบอื่นได้ ... MCP รองรับ ...
❌ MCP ทำให้ Claude ต่อกับระบบอื่นได้
```

- **ครั้งแรกของแต่ละเอกสาร** เขียนเต็ม + วงเล็บ · ครั้งต่อไปใช้ตัวย่อล้วน
- เอกสารยาวที่แบ่งบท ให้เขียนเต็มใหม่**ครั้งแรกของแต่ละบท** เพราะคนมักอ่านทีละบท
- ตารางหรือหัวข้อที่ที่ไม่พอ ให้เขียนเต็มในบรรทัดแรกของส่วนนั้นแทน
- เอกสารที่มีตัวย่อตั้งแต่ 5 ตัวขึ้นไป ต้องมี **อภิธานศัพท์ (glossary)** ท้ายเอกสาร

## ยกเว้น — ไม่ต้องขยาย

คำที่คนทั่วไปรู้จักมากกว่าชื่อเต็ม: URL, PDF, HTML, CSS, JSON, USB, Wi-Fi, ID, OK
และนามสกุลไฟล์ (`.docx`, `.pptx`) · ถ้าไม่แน่ใจ **ให้ขยาย** เสียเปล่าดีกว่าคนอ่านไม่รู้เรื่อง

## ใช้กับอะไรบ้าง

เอกสารทุกชนิด · คอมเมนต์ในโค้ด · ข้อความ commit · ข้อความบนหน้าจอ · คำอธิบายไดอะแกรม ·
คำตอบในแชต — **ทุกอย่างที่มีคนอ่าน**

## ตัวอย่างที่เจอบ่อย

Model Context Protocol (MCP) · Application Programming Interface (API) ·
Service Level Agreement (SLA) · Role-Based Access Control (RBAC) ·
Software Development Life Cycle (SDLC) · Single Sign-On (SSO) ·
Continuous Integration / Continuous Deployment (CI/CD) ·
Software Requirements Specification (SRS) · Key Performance Indicator (KPI) ·
Personally Identifiable Information (PII) · Proof of Concept (POC) ·
Business Requirements Document (BRD) · Functional Specification Document (FSD) ·
Architecture Decision Record (ADR) · User Interface (UI) · User Experience (UX)

## Anti-patterns

- ❌ ขยายตัวย่อซ้ำทุกครั้งที่โผล่ — รกและกวนสายตา ครั้งแรกพอ
- ❌ วงเล็บกลับด้าน — `MCP (Model Context Protocol)` อ่านสะดุดกว่าเขียนเต็มขึ้นก่อน
- ❌ ขยายผิด — ถ้าไม่รู้ว่าย่อมาจากอะไร ให้ค้นก่อน อย่าเดา
