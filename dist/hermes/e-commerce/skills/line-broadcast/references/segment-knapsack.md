# Choose segments under the quota (ตัดสินด้วยตัวเลข)

Moved from `SKILL.md` section 2. Open when the quota cannot cover every segment.

Use `decision-scoring` command `knapsack` (`node decide.mjs knapsack <file.json>`).

| Part | Rule |
|---|---|
| Hard rules first | segment under the 50-recipient minimum is out · blocked friends are out · a segment already sent this week is out (frequency cap, SKILL.md section 3) |
| Budget | messages left this month = quota - messages already used (SKILL.md section 1) |
| Cost of a segment | messages = people x sends |
| Value of a segment | people x click rate x value per click (baht). Click rate from this OA's last broadcast to that segment; none yet → `(รอยืนยัน)` and use the lowest rate seen. Value per click = margin per order x orders per click |

Example: 15,000 messages left. Segment A 4,600 people, 3% click, ฿12 per click = ฿1,656 for 4,600 messages. Segment B 1,850 people, 8% click, ฿12 per click = ฿1,776 for 1,850 messages. B is worth more and costs less, so it goes first. The script finds the best set that fits the budget. Drop a segment when its extra message cost (SKILL.md section 1, extra rate) is above its value. The inputs are estimates: read the line "ชุดรองลงมา" in the result (shown only when there are 20 segments or fewer): if its gap from the best set is under 10% (starting value, not yet measured), the owner picks.
