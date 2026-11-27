<!-- merged from skill `srs-writing` on 2026-11-27 · description was: Use when writing a Software Requirements Specification -->
# SRS Writing — a Software Requirements Specification where every requirement can be tested

> **One rule:** every requirement must let you write a **test case** from it right away. If you cannot, it is not a requirement, just a hope.

## Use when
- Writing a Software Requirements Specification (SRS)
- Reviewing an SRS someone else wrote, before sign-off
- Turning meeting notes into usable requirements
- Preparing documents for a tender or statement of work (SOW)

Not for: user stories → `user-story-writer.md` · why a technology was chosen → `architecture` · screen-level spec → `fsd-writing.md` · look of the Word file → `document-design`

## Steps
1. **Find an existing format first.** Look for the client's TOR (Terms of Reference), the scope in the contract, the agency's forms, and the earlier SRS of the same system in `docs/`. If none is in files, ask the user one question: does the client require a document format? If found, use its headings, order, field names and running numbers, and say which file it came from. If not found, use this skill's template and say no earlier format was found. In every format: a small internal system drops sections with nothing in them; a system with legal rules or an inspector uses everything the TOR orders; testable requirement IDs are always needed.
2. Collect before writing: who uses it · how work is done now · the problem · how success is measured · systems to connect · legal obligations.
3. Draft the outline from `assets/srs-outline.md` (headings only). Declare one line at the top saying which section is `เขียน` · `ข้าม (เหตุผล)` · `ตัดออก`. Do not fill a slot just because the template has it.
4. Write scope and stakeholders before requirements. Section 1.2 Scope must have both "in scope" and "out of scope".
5. Write each requirement by "Requirement rules" below and assign its ID at once.
6. Write non-functional requirements (NFRs) by "NFR rules" below.
7. Build the traceability tables. This is the step people skip most, and it is what gives value when a change request arrives.
8. Add figures. Figures in the SRS itself use `diagrams`; quick figures outside the SRS (README · PR) use `diagrams`. One colour theme per document, declared at the top per `design-gate/polished-document-style`.
9. Run the review, then send.

## Structure
Based on ISO/IEC/IEEE 29148. Sections: 1 Introduction · purpose · scope · definitions · 2 System overview · users · constraints · assumptions · 3 Functional requirements · 4 Interface requirements (skip only if it connects to nothing) · 5 Non-functional requirements · 6 Data and business rules · 7 Acceptance criteria · 8 Traceability matrix · 9 Appendices · revision history. All others cannot be skipped. A glossary goes in 1.3: Thai term · English term · meaning · name in the system.

## Requirement rules
- Mandatory words: **ต้อง** (shall) = mandatory, fails acceptance if missing · **ควร** (should) = may be absent if the reason is recorded · **อาจ** (may) = optional. Do not mix "ต้อง" and "จะ"; pick one for the whole document.
- Sentence form: `<รหัส> · <ผู้กระทำ> ต้อง <ทำอะไร> <เงื่อนไข/ขีดจำกัดที่วัดได้>`
  - ผิด: ระบบต้องค้นหาได้เร็ว
  - ถูก: FR-SRCH-010 · ระบบต้องคืนผลการค้นหาคำสั่งซื้อภายใน 2 วินาที เมื่อฐานข้อมูลมีคำสั่งซื้อไม่เกิน 500,000 รายการ
- 1 requirement per item. If you see "และ" (and), suspect it should be split.
- Always name the actor (ระบบ · ผู้อนุมัติ · งานตามเวลา). No sentence without a subject.
- Numbers instead of adjectives ("fast" "many" "easy" "stable" each become a number).
- State what must be obtained, not how (`ต้องเก็บใน Redis` is wrong · `ต้องคืนผลภายใน 200ms` is right).
- No "เป็นต้น" · "ฯลฯ" · "และ/หรือ".
- Every item must show at once how to prove it passes. After writing, look for items that contradict each other.

## IDs and traceability
- ID scheme: `FR-<โมดูล>-<3 หลัก>` (FR-ORD-010) · `NFR-<หมวด>-<3 หลัก>` (NFR-PERF-010) · `BR-<3 หลัก>` business rule (BR-020) · `IF-<ระบบปลายทาง>-<เลข>` interface (IF-LINE-010). Number in steps of 10.
- Never reuse an issued ID. Mark a cancelled item in place, such as `(ยกเลิก v1.3)`; do not delete it.
- Traceability table columns: รหัส · ที่มา · โมดูล · ความสำคัญ · ทดสอบด้วย · สถานะ (for example `FR-ORD-010 | ประชุม 12 ส.ค. ข้อ 3 | คำสั่งซื้อ | ต้องมี | TC-ORD-001..004 | ตกลงแล้ว`).
- Every requirement has a source (an item with none was made up by the team; go ask) and at least 1 test case.
- Priority is MoSCoW: ต้องมี · ควรมี · มีก็ดี · ไว้ทีหลัง. If "ต้องมี" exceeds 60% of the total, the items are not really prioritised.
- The BR table gets a column "boundary values to test": for a rule with a number, write 3 values (below · at · over the boundary), and put the boundary numbers into a story's acceptance criteria too (for example ฿9,999 and ฿10,000).
- Two-way traceability: at the end add a table story | FR | BR. Pass rule "nothing dropped": every story is backed by an FR or BR; mark and fix any that is not before sending.

## NFR rules
- Ask every category in [`nfr-categories.md`](nfr-categories.md); forgotten maintenance and backup hurt most.
- Every number comes from the customer, not the writer. If the customer does not know, propose a number and record it as an assumption in section 2.
- Never guess silently a fact the interviewee did not state (service time or price · whether discounts stack · travel cost per vehicle or per person). Flag the item "(รอยืนยัน)", write the assumption used with the source question number, and summarise at the end of the document in a table: question → assumption → business rule that uses it.
- Every NFR has a "how to measure" column (for example `scrollWidth ≤ 375` · requests sending images off the device = 0).

## Check before done
- Go through [`review-checklist.md`](review-checklist.md) in full before every send.
- Fresh-reader test: a new agent that gets only the SRS file answers 8–10 questions a developer and QA would ask. A wrong or "don't know" answer is a point to fix. If it has not passed, do not send to the customer (see `reader-test.md`).
- No "out of scope" list missing · not every item "Must" · no vague word left · IDs unique · version number and revision history present.

## References
- [`structure-options.md`](structure-options.md) — open when choosing sections by project type, writing 2.6 or 3.6 (AI/ML), adding figures, or writing a Thai/English document
- [`nfr-categories.md`](nfr-categories.md) — open when writing section 5 or converting a vague customer word into a number
- [`brd-template.md`](brd-template.md) — open when writing the Business Requirements Document before the SRS
- [`reader-test.md`](reader-test.md) — open when running the fresh-reader test
