<!-- สร้างโดย scripts/diagrams/pages.py · แก้ที่สคริปต์ ไม่แก้ที่นี่ -->

# trading-finance

วางแผนเงิน ดูพอร์ต และเทรดอย่างมีวินัย ไม่ชี้นำ

agent 5 · skill 62 (ของ plugin 23 · ของกลางจาก superuser 39) · คำสั่ง 7 · playbook 10 · ส่งงานต่อให้ [`software-company`](../software-company/README.md) · [`e-commerce`](../e-commerce/README.md) · [`personal-life`](../personal-life/README.md)

[← ทุก plugin](../README.md) · ต้นฉบับ: [`plugins/trading-finance/`](../../../plugins/trading-finance/)

## แผนผัง plugin

เรื่องเข้ามาทางไหน ไปถึง agent ไหน ใช้ skill อะไร

![แผนผัง plugin](map.png)

## SuperUser ทำงานอย่างไร

หัวหน้าทีมรับงาน → จัดขนาด → แจกงาน → ตรวจซ้ำจนผ่าน → ส่งมอบ → เรียนรู้

![SuperUser ขั้น 1 intake](flow/1-intake.png)

![SuperUser ขั้น 2 size](flow/2-size.png)

![SuperUser ขั้น 3 loop](flow/3-loop.png)

![SuperUser ขั้น 4 decide](flow/4-decide.png)

![SuperUser ขั้น 5 learn](flow/5-learn.png)

![SuperUser ขั้น 6 modules](flow/6-modules.png)

## playbook ทั้งหมด

| playbook | ทำอะไร | ขั้น |
|---|---|---|
| `learn-from-session` | เรียนรู้จากงานที่ผ่านมา (เหมือนต้นฉบับกลาง ดูที่ [`superuser`](../superuser/README.md)) | 7 |
| [`money-plan`](#pb-money-plan) | วางแผนการเงินส่วนตัว | 5 |
| [`portfolio-check`](#pb-portfolio-check) | เช็กพอร์ตลงทุน | 5 |
| [`pre-trade`](#pb-pre-trade) | เตรียมก่อนเทรด | 6 |
| [`review`](#pb-review) | ตรวจงานก่อนส่ง | 6 |
| [`scam-check`](#pb-scam-check) | เช็กว่าโดนหลอกไหม | 4 |
| [`tax-season`](#pb-tax-season) | ภาษีประจำปี | 5 |
| `team-project` | งานใหญ่หลายวัน คนกับ agent ร่วมทีม (เหมือนต้นฉบับกลาง ดูที่ [`superuser`](../superuser/README.md)) | 9 |
| [`trade-review`](#pb-trade-review) | ทบทวนการเทรด | 5 |
| [`unattended-run`](#pb-unattended-run) | ให้ทำงานยาวเอง | 7 |

<a id="pb-money-plan"></a>

### วางแผนการเงินส่วนตัว · `money-plan`

![วางแผนการเงินส่วนตัว](playbooks/money-plan.png)

<a id="pb-portfolio-check"></a>

### เช็กพอร์ตลงทุน · `portfolio-check`

![เช็กพอร์ตลงทุน](playbooks/portfolio-check.png)

<a id="pb-pre-trade"></a>

### เตรียมก่อนเทรด · `pre-trade`

![เตรียมก่อนเทรด](playbooks/pre-trade.png)

<a id="pb-review"></a>

### ตรวจงานก่อนส่ง · `review`

![ตรวจงานก่อนส่ง](playbooks/review.png)

<a id="pb-scam-check"></a>

### เช็กว่าโดนหลอกไหม · `scam-check`

![เช็กว่าโดนหลอกไหม](playbooks/scam-check.png)

<a id="pb-tax-season"></a>

### ภาษีประจำปี · `tax-season`

![ภาษีประจำปี](playbooks/tax-season.png)

<a id="pb-trade-review"></a>

### ทบทวนการเทรด · `trade-review`

![ทบทวนการเทรด](playbooks/trade-review.png)

<a id="pb-unattended-run"></a>

### ให้ทำงานยาวเอง · `unattended-run`

![ให้ทำงานยาวเอง](playbooks/unattended-run.png)
