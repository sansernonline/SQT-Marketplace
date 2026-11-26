
# The shape of an answer — pick prose, table, list or figure from the content

> **One rule:** whatever structure the content has, the answer uses that shape. Comparison → table · connections → figure · one thing → sentences.

## Use when
- Deciding how to lay out an answer: prose, table, list or figure.
- The question compares options, asks what connects to what, or you are blocked and must ask for something.

## Steps
1. Pick the shape from the signal in the question (quoted signals are Thai phrasings; English in brackets):

   | Signal | Shape |
   |---|---|
   | "แบบไหนดีกว่า" · "ต่างกันยังไง" · "มีทางเลือกอะไรบ้าง" (which is better · how they differ · what options) | **Comparison table** |
   | "อะไรต่อกับอะไร" · "ข้อมูลไหลยังไง" · "ลำดับเป็นยังไง" (what connects to what · how data flows · the sequence) | **Figure** |
   | "มีอะไรบ้าง" (what are there) when the items are not compared | **Bullet list** |
   | "ทำไม" · "แปลว่าอะไร" (why · what does it mean) · one thing with no branches | **Plain sentences** |
   | Several numbers that must be seen together | **Table** |
   | Steps that must be done in order | **Numbered list** |
   | Cannot continue · must wait for something from the user | **Short list: what is blocking → what is needed** |

   Having 2 or more "things being compared" is the strongest signal for a table, because in a paragraph the reader must hold the first one in their head while reading the second.
2. **If you use a table:** the first column is the thing compared, the next columns the aspects · 3–5 columns, at most 8 rows in chat · every cell has content (no data → "ไม่มี"; a table where every cell says "it depends" has no content either) · at most 1 line per cell, longer goes below the table · rows ordered by weight (recommended or most used first, not alphabetical) · column headings are the reader's questions (`เร็วแค่ไหน` · `ต้องดูแลมากไหม`, not `ประสิทธิภาพ` · `ความซับซ้อน`) · always close with a 1-line conclusion.
3. **If the relationship is the answer** (what connects to what, what sits inside what, a sequence with forks or loops, one thing in several states), draw a figure. In chat a small ASCII figure or a short Mermaid is enough (`กล้อง ──DICOM──▶ Orthanc ──▶ API ──▶ รายงาน`). A figure that must be a real file for a document or slides uses that plugin's figure-drawing skill, if there is one.
4. **If the answer is shorter than 3 lines, is yes/no plus 1 sentence of reason, or the reason matters more than the options, use sentences.** A 1–2 row table, or a figure that draws what one sentence can say, is the wrong shape.
5. **If you cannot continue,** list only 2 things: what is blocking, and what you need from the user. 1 line per item, at most 4 items. Do not tell the cause at length, answer side topics or plan ahead. If the user must choose among paths, 1 item per path, easiest first. Example:
   ```
   ติดอยู่ 1 เรื่อง:
      - มองไม่เห็นไฟล์ — โฟลเดอร์ที่เชื่อมไว้ว่าง
      ต้องการ 1 อย่าง:
      - แนบ Mockup.html มา หรือบอก path ใหม่
   ```

## Check before done
- [ ] The shape matches the content's structure (not a table for one thing, not a paragraph for a comparison).
- [ ] Every table has content in every cell and ends with a 1-line conclusion.
- [ ] A blocked answer lists only what is blocking and what is needed.
