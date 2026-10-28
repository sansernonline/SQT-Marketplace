# skill: load-testing

Use when checking how a system holds many users at once (load, stress, spike, soak test, k6, ยิงโหลด, รับได้กี่คน). Page speed → web-quality-audit.

# load-testing — ยิงโหลดแบบมีเป้า มีเกณฑ์ผ่าน และได้รับอนุญาต

อยู่ใน plugin `software-company` · ถ้อยคำในไฟล์นี้เขียนตาม `human-writing` · ข้อเท็จจริงของเครื่องมือทุกข้อมีลิงก์และวันที่ตรวจ 2026-10-28 ในหัวข้อ "ที่มา" · สคริปต์ตัวอย่าง [`assets/load-test.js`](assets/load-test.js) · workflow ตัวอย่าง [`assets/k6-smoke.yml`](assets/k6-smoke.yml) · วิธีอ่านผล [`reading-results`](references/reading-results.md) · MCP ของ k6 [`mcp-k6`](references/mcp-k6.md)

> **กฎข้อเดียว:** ไม่มีเกณฑ์ผ่านที่เขียนไว้ก่อนยิง = ไม่มีผลทดสอบ มีแค่กราฟ · และไม่ยิงระบบที่ไม่ใช่ของเรา หรือ production โดยไม่มีชื่อคนอนุมัติเป็นลายลักษณ์อักษร

## ใช้เมื่อ

- ก่อนเปิดระบบหรือก่อนแคมเปญที่คนจะเข้าพร้อมกันเยอะ (ลดราคา · เปิดลงทะเบียน · ประกาศผล)
- ถามว่า "ระบบรับได้กี่คน" · "ตอนคนเยอะจะช้าไหม" · "เพิ่มเครื่องแล้วดีขึ้นจริงไหม"
- postmortem บอกว่าเหตุเกิดเพราะไม่เคยทดสอบโหลด (`postmortem-template` หัวข้อ 5)
- จะตั้ง smoke test ความเร็วใน CI ให้ล้มเมื่อช้ากว่าเกณฑ์
- ผู้ใช้พูดว่า load test · stress test · spike · soak · k6 · Locust · JMeter · p95 · ยิงโหลด · ทดสอบประสิทธิภาพ

ไม่ใช้เมื่อ: หน้าเว็บหน้าเดียวโหลดช้าในเบราว์เซอร์ (Lighthouse · Core Web Vitals) → [`web-quality-audit`](../web-quality-audit/SKILL.md) · ระบบจริงช้าอยู่ตอนนี้และต้องหาว่าช้าตรงไหน → [`observability-basics`](../observability-basics/SKILL.md) ก่อน · ทดสอบว่ากดปุ่มแล้วได้ผลถูก → [`e2e-testing-patterns`](../e2e-testing-patterns/SKILL.md)

## ใช้ตัวอื่นแทนหรือคู่กัน

| สถานการณ์ | ใช้ | เกี่ยวกับ skill นี้อย่างไร |
|---|---|---|
| ความเร็วฝั่งเบราว์เซอร์ของหน้าเดียว | [`web-quality-audit`](../web-quality-audit/SKILL.md) | skill นี้วัดฝั่ง server ตอนคนเยอะ ไม่ใช่เวลาวาดหน้า |
| ต้องเห็นว่าส่วนไหนของระบบตันระหว่างยิง | [`observability-basics`](../observability-basics/SKILL.md) | เปิดแดชบอร์ดของระบบคู่กับผล k6 (หัวข้อ 6) |
| ใส่ smoke test ลง pipeline | [`cicd-and-release`](../cicd-and-release/SKILL.md) · [`jenkins-pipeline`](../jenkins-pipeline/SKILL.md) | หัวข้อ 7 บอกว่าอะไรรันทุก PR อะไรรันตามรอบ |
| แผนทดสอบทั้งรุ่นที่มีทุกชนิด | [`test-case-template`](../test-case-template/SKILL.md) | ใส่ load test เป็นแถวหนึ่งในแผน พร้อมเกณฑ์จากหัวข้อ 1 |
| ยิงแล้วต้องเพิ่มเครื่องหรือ autoscale | [`kubernetes-helm`](../kubernetes-helm/SKILL.md) · [`infra-as-code`](../infra-as-code/SKILL.md) | ยิงซ้ำด้วยสคริปต์เดิมหลังปรับ เทียบกับผลก่อนปรับ |
| ข้อมูลทดสอบมีชื่อหรือเบอร์โทร | [`pdpa-compliance`](../pdpa-compliance/SKILL.md) | ใช้ข้อมูลปลอม ไม่ดึงข้อมูลลูกค้าจริงมายิง |

## 1 · เป้าและเกณฑ์ผ่าน — เขียนก่อนเปิดเครื่องมือ

ถามให้ได้ 4 ข้อ แล้วจดลงหัวไฟล์สคริปต์หรือแผนทดสอบ:

| ข้อ | ตัวอย่างคำตอบ | ถ้าไม่มีคำตอบ |
|---|---|---|
| ปริมาณที่คาด | ชั่วโมงเร่งด่วน 50 คำขอต่อวินาที ที่ path `/api/orders` | ดึงจาก log หรือ metric ของระบบจริง · ระบบใหม่ ใช้ประมาณการของเจ้าของงานแล้วติด `(รอยืนยัน)` |
| เส้นทางที่ยิง | ดูสินค้า 70% · ใส่ตะกร้า 20% · จ่ายเงิน 10% | ยิงเส้นทางที่ทำเงินหรือแพงที่สุดก่อน 1–3 เส้น |
| เกณฑ์ความเร็ว | `p(95)` ของเวลาตอบไม่เกินกี่มิลลิวินาที | ค่าตั้งต้น 500 ms สำหรับ API **ค่าตั้งต้น ยังไม่ได้วัด** · ปรับหลังมีผล baseline |
| เกณฑ์ error | `http_req_failed` ต่ำกว่ากี่เปอร์เซ็นต์ | ค่าตั้งต้น 1% **ค่าตั้งต้น ยังไม่ได้วัด** |

- วัดด้วย percentile ไม่ใช่ค่าเฉลี่ย: ค่าเฉลี่ยซ่อนคนส่วนน้อยที่รอนาน
- เกณฑ์ทุกข้อแปลงเป็น `thresholds` ในสคริปต์ (หัวข้อ 4) ไม่เก็บไว้ในหัวคนอ่านผล
- ถ้าไม่มีตัวเลขปริมาณเลย ให้ทำ smoke กับ baseline ได้ แต่ห้ามสรุปว่า "รับได้" เพราะไม่รู้ว่ารับได้เทียบกับอะไร

## 2 · ด่านอนุญาต — ก่อนยิงทุกครั้งที่เกิน smoke และทุกครั้งที่ยิง production

การยิงโหลดใส่ระบบที่ไม่ได้รับอนุญาตทำให้ระบบล่มได้จริงและอาจผิดกฎหมาย จึงหยุดรออนุมัติตรงนี้ ไม่ข้ามแม้ผู้ใช้เร่ง

1. **ระบบเป็นของใคร** · ของคนอื่น (API ของคู่ค้า · payment gateway · SaaS ภายนอก · เว็บคู่แข่ง) → ไม่ยิง · ใช้ mock หรือ sandbox ที่ผู้ให้บริการเปิดให้ทดสอบโหลด และอ่านเงื่อนไขของเขาก่อน
2. **environment** · ยิงที่ staging หรือ environment แยกสำหรับทดสอบโหลด · เอกสาร k6 บอกว่า QA ที่เครื่องไม่เท่า production ใช้ประเมินความสามารถรับโหลดไม่ได้ ใช้ได้แค่ smoke
3. **production** · ต้องมีชื่อคนอนุมัติ ช่วงเวลา ปริมาณสูงสุด และคนเฝ้าที่หยุดได้ทันที · เริ่มที่ smoke ปริมาณต่ำ (เอกสาร k6 ถือเป็นแนวปฏิบัติที่เสี่ยงต่ำ) · ห้ามสร้างคำสั่งซื้อ การจ่ายเงิน อีเมล หรือ SMS จริง
4. **ของที่ยิงแล้วเกิดผลข้างเคียง** · ตัด webhook ส่งเงิน ส่งข้อความ ออกจากเส้นทาง หรือชี้ไป mock · ผู้ให้บริการภายนอกที่คิดเงินต่อครั้ง ตั้งเพดานเงินก่อน
5. **บันทึก** ลงหัวสคริปต์หรือแผน: ระบบ · environment · ปริมาณสูงสุด · ช่วงเวลา · ผู้อนุมัติ · ช่องทางหยุด

สคริปต์ตัวอย่างบังคับด่านนี้ในโค้ด: ถ้าไม่มี `BASE_URL` หรือ `TARGET_ENV` สคริปต์จะหยุด · ถ้าเป็นแบบที่ไม่ใช่ smoke หรือ `TARGET_ENV=production` (รวม smoke) แต่ไม่มี `APPROVED_BY` สคริปต์ก็หยุด

## 3 · เลือกเครื่องมือ

| ถ้า | ใช้ | เหตุผล |
|---|---|---|
| เริ่มใหม่ · HTTP API หรือเว็บ · อยากให้เกณฑ์ผ่านล้ม CI ได้เลย | **k6** (ค่าหลัก) | เขียนเป็น JavaScript · `thresholds` ในสคริปต์ · ออก exit code ไม่ใช่ 0 เมื่อเกณฑ์ไม่ผ่าน · ใบอนุญาต AGPL-3.0 |
| ทีมถนัด Python · ต้องเขียนลำดับขั้นซับซ้อนหรือโปรโตคอลเอง | **Locust** | สถานการณ์ทดสอบเป็นโค้ด Python ธรรมดา · กระจายหลายเครื่องได้ · รันแบบ headless ใน CI ได้ · ใบอนุญาต MIT |
| องค์กรมีแผน `.jmx` อยู่แล้ว · ต้องยิง JDBC · JMS · LDAP · FTP · SOAP | **JMeter** | รองรับโปรโตคอลกว้าง · มี GUI บันทึกแผน · ยิงจริงใช้โหมด CLI (headless) |

- รุ่นที่เห็น 2026-10-28: k6 v2.3.0 (2026-09-21) และสาย 1.x ยังออกแพตช์ความปลอดภัย v1.8.2 (2026-10-12) · ล็อกรุ่นใน CI ไม่ใช้ `latest` · `setup-k6-action` ที่ไม่ใส่ `k6-version` จะได้รุ่นล่าสุดเสมอ ([README](https://github.com/grafana/setup-k6-action) ตรวจ 2026-10-28)
- Grafana Cloud k6 (ยิงจากคลาวด์ · เก็บผล) ราคาและโควตา `(ยังไม่ได้ตรวจ)` · เริ่มด้วย k6 บนเครื่องหรือ runner ของ CI ซึ่งฟรี
- เครื่องที่ยิงต้องไม่ใช่เครื่องเดียวกับระบบที่ถูกยิง ไม่งั้นแย่ง CPU กันเองแล้วผลเพี้ยน

## 4 · แบบทดสอบและสคริปต์

ลำดับตามเอกสาร k6: **smoke ก่อนเสมอ** → average-load → แบบอื่นตามความเสี่ยง · รูปโหลดเรียบ ๆ (ไต่ขึ้น · คงที่ · ลง) ไม่ทำโหลดขึ้นลงหลายรอบเพราะหาต้นเหตุยาก

| แบบ | ถามอะไร | ผู้ใช้เสมือน (VU) และเวลา ตามเอกสาร k6 | เมื่อไหร่ |
|---|---|---|---|
| smoke | สคริปต์ถูกไหม ระบบตอบได้ตอนคนน้อย | น้อย · วินาทีถึงไม่กี่นาที | ทุกครั้งก่อนแบบอื่น · ทุก PR ใน CI |
| load (average-load) | ปริมาณปกติผ่านเกณฑ์ไหม | เท่าค่าเฉลี่ยของ production · 5–60 นาที | ก่อนปล่อยรุ่น · เป็น baseline |
| stress | เกินปกติแล้วเป็นอย่างไร | สูงกว่าเฉลี่ย · 5–60 นาที | ระบบเสี่ยงช่วงใช้หนัก |
| spike | คนแห่เข้าทันทีแล้วรอดไหม | สูงมาก · ไม่กี่นาที | ก่อนแคมเปญ · flash sale |
| soak | ใช้นาน ๆ แล้วหน่วยความจำรั่ว connection ค้างไหม | เฉลี่ย · หลายชั่วโมง | ระบบที่เปิดยาว |
| breakpoint | เพดานอยู่ตรงไหน | ไต่ขึ้นจนพัง | ทำไม่กี่ครั้ง ต้องได้อนุมัติข้อ 2 เสมอ · สคริปต์ตัวอย่างไม่มีแบบนี้ ต้องเขียน stages เอง |

สคริปต์ [`assets/load-test.js`](assets/load-test.js) เลือกแบบด้วย `TEST_TYPE` ทุกแบบใช้ executor `ramping-arrival-rate` (กำหนดจำนวนรอบต่อหน่วยเวลา ระบบช้าลงก็ยังโดนยิงเท่าเดิม จึงเห็นอาการจริง) · หัวใจคือ thresholds:

```javascript
thresholds: {
  http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: true, delayAbortEval: '30s' }],
  http_req_duration: ['p(95)<500'],              // ค่าตั้งต้น ยังไม่ได้วัด
  'http_req_duration{type:API}': ['p(95)<500'],  // แยกเกณฑ์ตาม tag
},
```

- `abortOnFail` หยุดการยิงเมื่อเกณฑ์ไม่ผ่านระหว่างทาง ไม่ทุบระบบต่อจนจบ · `delayAbortEval` รอเก็บตัวอย่างก่อนตัดสิน
- ตัวเลขทุกตัวในสคริปต์ (rate · VU · stages) เป็น **ค่าตั้งต้น ยังไม่ได้วัด** ปรับตามหัวข้อ 1
- รัน: `k6 run -e TEST_TYPE=smoke -e TARGET_ENV=staging -e BASE_URL=https://staging.example.com assets/load-test.js`

## 5 · อ่านผล

รายละเอียดและตัวอย่างอ่านผลใน [`reading-results`](references/reading-results.md) · สั้น ๆ:

1. ดูบรรทัด thresholds ท้ายรายงานก่อน (ผ่าน/ไม่ผ่าน) แล้วดู exit code: 0 = ผ่านทุกเกณฑ์ · เกณฑ์ไม่ผ่านมักได้ 99
2. ดู `http_req_failed` ก่อน `http_req_duration` · error พุ่งแปลว่าเวลาตอบที่เห็นอาจเร็วเพราะตอบ error เร็ว
3. ดูเครื่องที่ยิงด้วย CPU เต็มหรือ VU ไม่พอ = ผลบอกขีดของเครื่องยิง ไม่ใช่ระบบ
4. เทียบกับ baseline รอบก่อนด้วยสคริปต์เดิม ข้อมูลเดิม environment เดิม · เปลี่ยนทีละอย่าง
5. รายงานบอกผล "ผ่าน/ไม่ผ่านเกณฑ์ข้อไหน ที่ปริมาณเท่าไร" ไม่ใช่ "ระบบรับได้ 10,000 คน" ถ้าไม่ได้ยิงแบบนั้นจริง

## 6 · ยิงคู่กับการเฝ้าระบบ

ผล k6 บอกว่าช้า แต่ไม่บอกว่าช้าเพราะอะไร · ระหว่างยิงเปิดแดชบอร์ดตาม `observability-basics` หัวข้อ 2 (latency · traffic · errors · saturation) ของ server ฐานข้อมูล คิว · จดเวลาเริ่มและจบการยิงเพื่อจับคู่กราฟ · คอขวดที่เจอบ่อย: connection pool ของฐานข้อมูล · query ไม่มี index · ไม่ได้คืน connection (ตัวอย่างใน `postmortem-template` หัวข้อ 5)

## 7 · ต่อเข้า CI

| รันเมื่อ | แบบ | ที่ไหน |
|---|---|---|
| ทุก PR หรือทุก push | smoke · ไม่กี่นาที | staging หรือ environment ของ PR |
| กลางคืนหรือตามรอบ | load · stress · spike | environment แยกสำหรับทดสอบโหลด |
| ก่อนปล่อยรุ่นใหญ่ | ครบชุดที่เลือกในหัวข้อ 4 · รันซ้ำอย่างน้อย 2 รอบ | environment ที่เท่า production |

- เอกสาร k6 เตือนว่า load test ใช้ 3–15 นาทีขึ้นไป จึงไม่ใส่ในทางที่ deploy อัตโนมัติ และอย่าเชื่อผลผ่าน/ไม่ผ่านอย่างเดียวจนกว่ากระบวนการจะนิ่ง
- GitHub Actions: `grafana/setup-k6-action@v1.2.2` (ใส่ `k6-version`) ติดตั้ง k6 แล้ว `grafana/run-k6-action@v1.5.0` รัน (รุ่นที่ล็อกไว้ ตรวจ 2026-10-28) · ตัวอย่างเต็มใน [`assets/k6-smoke.yml`](assets/k6-smoke.yml) · Jenkins หรือ CI อื่นเรียก `k6 run` ตรง ๆ
- อย่าห่อ `k6 run` ด้วยสคริปต์ที่กลืน exit code (เช่นมี `echo` ต่อท้าย) · ให้ `k6 run` เป็นคำสั่งสุดท้าย หรือเก็บ `$?` แล้ว `exit` ด้วยค่านั้น
- `BASE_URL` และ token มาจากตัวแปรลับของ CI (`config-and-secrets`) ไม่เขียนลงสคริปต์

## ตัวอย่างจริง 1 ชุด

ป้าย `ตัวอย่าง`: ออกแบบบนกระดาษ ยังไม่ได้ยิงระบบจริง

**โจทย์:** ร้านออนไลน์จะจัด flash sale เที่ยงวันศุกร์ เคยล่มเพราะ connection pool เต็ม อยากรู้ว่ารอบนี้รอดไหม

| ขั้น | ที่ทำ | หัวข้อ |
|---|---|---|
| เป้า | ปริมาณจากแคมเปญก่อน (รอยืนยัน) · เส้นทาง ดูสินค้า → ใส่ตะกร้า → จ่ายเงินด้วย mock · p95 ไม่เกิน 500 ms · error ไม่เกิน 1% (ค่าตั้งต้น ยังไม่ได้วัด) | 1 |
| อนุญาต | ยิงที่ staging ที่ขนาดเท่า production · payment ชี้ mock · ผู้อนุมัติ ช่วงเวลา จดในหัวสคริปต์ | 2 |
| ยิง | smoke → load (baseline) → spike | 4 |
| เฝ้า | แดชบอร์ด connection pool และ CPU ฐานข้อมูลระหว่างยิง | 6 |
| ผล | รายงานเกณฑ์ข้อที่ผ่านและไม่ผ่านที่ปริมาณที่ยิงจริง แล้วเพิ่ม smoke ลง CI | 5 · 7 |

## ตรวจก่อนส่ง

1. มีปริมาณที่คาด เส้นทาง และเกณฑ์ p95 กับอัตรา error ก่อนยิง · ค่าที่เดามีป้าย "ค่าตั้งต้น ยังไม่ได้วัด"
2. ระบบเป็นของเรา · environment ระบุชัด · เกิน smoke มีชื่อผู้อนุมัติ · production มีคนเฝ้าและช่องทางหยุด
3. ไม่มีเงิน อีเมล SMS หรือคำสั่งซื้อจริงเกิดจากการยิง
4. เกณฑ์อยู่ใน `thresholds` · มี `abortOnFail` ที่อัตรา error
5. smoke ผ่านก่อนแบบอื่น · เครื่องยิงไม่ใช่เครื่องเดียวกับระบบ
6. รายงานบอกผลเทียบเกณฑ์และ baseline ที่ปริมาณที่ยิงจริง ไม่สรุปเกินที่ยิง
7. CI ไม่กลืน exit code · ค่าลับมาจากตัวแปรลับ · ล็อกรุ่น k6

## ที่มา

ตรวจ 2026-10-28 (เปิดอ่านผ่านเครื่องมือดึงหน้าเว็บที่สรุปโดยโมเดลเล็ก ควรเปิดหน้าดิบซ้ำก่อนล็อกค่าใน production)

- thresholds · `abortOnFail` · `delayAbortEval` · เกณฑ์ตาม tag https://grafana.com/docs/k6/latest/using-k6/thresholds/
- ชื่อ executor ทั้ง 6 https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ · ตัวเลือกของ `ramping-arrival-rate` https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ramping-arrival-rate/
- แบบทดสอบและลำดับ https://grafana.com/docs/k6/latest/testing-guides/test-types/
- CI · environment · production https://grafana.com/docs/k6/latest/testing-guides/automated-performance-testing/
- exit code 0 และ 99 · สคริปต์กลืน exit code https://grafana.com/docs/learning-paths/automate-k6-cicd/handle-exit-code/
- GitHub Actions https://github.com/grafana/run-k6-action
- ใบอนุญาต k6 https://github.com/grafana/k6 · รุ่น https://api.github.com/repos/grafana/k6/releases
- Locust https://docs.locust.io/en/stable/what-is-locust.html · JMeter https://jmeter.apache.org/ (หน้าแรกลิงก์ไปใบอนุญาตของ Apache Software Foundation ไม่ได้ระบุรุ่นล่าสุด)
- ยังไม่ได้ตรวจ: ราคาและโควตา Grafana Cloud k6 · รุ่นล่าสุดของ Locust และ JMeter


## reference: mcp-k6.md

# MCP ของ k6 (grafana/mcp-k6)

ส่วนขยายของ `load-testing` · ตรวจ 2026-10-28 จาก https://github.com/grafana/mcp-k6 และ https://api.github.com/repos/grafana/mcp-k6/releases · ไม่ฝังใน plugin ผู้ใช้ติดตั้งเองถ้าต้องการ

## สถานะ

| เรื่อง | ที่เห็น |
|---|---|
| ผู้ดูแล | Grafana (repo `grafana/mcp-k6`) |
| สถานะ | README เขียนว่ายังเป็นของทดลอง (experimental) |
| รุ่นล่าสุด | v0.7.0 วันที่ 2026-10-05 |
| ใบอนุญาต | หน้า repo ไม่ตรงกัน: แถบข้างเขียน AGPL-3.0 แต่ README เขียน MIT · เปิดไฟล์ LICENSE ก่อนใช้ในงานลูกค้า |
| เครื่องมือ | `validate_script` (รัน 1 VU 1 รอบ) · `run_script` (รันจริง ไม่เกิน 5 นาที) · `list_sections` · `get_documentation` |

## ข้อควรระวัง

- `run_script` ยิงคำขอจริงไปยังปลายทางในสคริปต์ · `validate_script` ก็ยิง 1 รอบ · ด่านอนุญาตใน `load-testing` หัวข้อ 2 ใช้กับการเรียกผ่าน MCP ด้วย ไม่มีข้อยกเว้น
- เริ่มใช้แค่ `get_documentation` กับ `validate_script` ที่ชี้ staging · ให้ agent เรียก `run_script` เฉพาะเมื่อผู้ใช้อนุญาตในรอบนั้น
- โหมด HTTP ไม่มีระบบยืนยันตัวตนในตัว ใช้ในเครือข่ายที่เชื่อถือได้เท่านั้น · ใช้แบบ stdio บนเครื่องตัวเองดีกว่า

## ติดตั้ง (ผู้ใช้ทำเอง ล็อกรุ่น)

Claude Code ผ่าน Docker (รูปแบบคำสั่งตาม README):

```bash
claude mcp add --scope=user --transport=stdio k6 -- docker run --rm -i grafana/mcp-k6:<tag ของ v0.7.0>
```

ชื่อ tag ของ image บน Docker Hub ที่ตรงกับ v0.7.0 `(ยังไม่ได้ตรวจ)` · README ใช้ `latest` แต่ให้เปิดหน้า tag แล้วใส่รุ่นที่ล็อกได้แทน · ทางอื่น: Homebrew (`brew tap grafana/grafana` แล้ว `brew install mcp-k6`) หรือแพ็กเกจ `.deb` `.rpm` จากหน้า release ของ v0.7.0 · รันแบบ native ต้องมี k6 อยู่ใน PATH ด้วย

เอกสาร k6 ยังพูดถึงคำสั่ง `k6 x mcp` ที่ดึงรุ่นล่าสุดอัตโนมัติ · ต้องการล็อกรุ่นให้ใช้ตัวแยก `mcp-k6` แบบข้างบน (จากผลค้นหาที่อ้างหน้า https://grafana.com/docs/k6/v2.3.x/set-up/configure-ai-assistant/ ยังไม่ได้เปิดหน้านั้นเอง)


## reference: reading-results.md

# อ่านผล k6 แล้วเขียนรายงาน

ส่วนขยายของ `load-testing` หัวข้อ 5 · ข้อเท็จจริงของ k6 ตรวจ 2026-10-28 จากหน้าที่ลิงก์ไว้ท้ายไฟล์ · วิธีตีความเป็นแนวปฏิบัติทั่วไป ยังไม่ได้ทดสอบกับระบบจริงในรอบนี้

## 1 · อ่านตามลำดับนี้

| ลำดับ | ดูอะไร | ตีความ |
|---|---|---|
| 1 | exit code | 0 = ผ่านทุกเกณฑ์ · ไม่ใช่ 0 = ไม่ผ่าน · เกณฑ์ไม่ผ่านมักได้ 99 |
| 2 | บรรทัด thresholds ท้ายรายงาน | เกณฑ์ข้อไหนผ่าน ข้อไหนไม่ผ่าน และค่าจริงเท่าไร |
| 3 | `http_req_failed` | error พุ่ง → เวลาตอบที่เร็วอาจเป็นเพราะตอบ error เร็ว อย่าเพิ่งดีใจกับ p95 |
| 4 | `http_req_duration` p95 และ p99 | ช่วงที่ผู้ใช้ส่วนใหญ่เจอ และหางที่คนส่วนน้อยรอ · ค่าเฉลี่ยใช้ตัดสินไม่ได้ |
| 5 | `checks` | คำตอบถูกไหม ไม่ใช่แค่ได้ status 200 |
| 6 | คำเตือนเรื่อง VU ไม่พอ หรือรอบที่ไม่ได้เริ่ม | เครื่องยิงตามปริมาณที่ตั้งไม่ทัน ผลรอบนี้บอกขีดของเครื่องยิง ไม่ใช่ระบบ (ชื่อ metric ของรอบที่หลุด `(ยังไม่ได้ตรวจ)`) |

## 2 · หาว่าตันตรงไหน

ดูกราฟของระบบช่วงเวลาเดียวกับการยิง (`observability-basics` หัวข้อ 2):

| อาการในกราฟ | สงสัยอะไรก่อน |
|---|---|
| CPU ของแอปเต็ม เวลาตอบโตตาม | โค้ดหนักหรือเครื่องน้อยไป · ลองเพิ่มเครื่องแล้วยิงซ้ำ |
| CPU แอปว่าง แต่เวลาตอบโต | รอของข้างนอก: connection pool ฐานข้อมูล · ล็อกในตาราง · API ภายนอก |
| error เริ่มที่ปริมาณหนึ่งแล้วพุ่ง | ชนเพดาน (pool · ไฟล์ที่เปิดได้ · rate limit) · หาค่าตั้งที่ปริมาณนั้น |
| soak: หน่วยความจำขึ้นเรื่อย ๆ ไม่ลง | หน่วยความจำรั่ว · connection ไม่ถูกคืน |
| เวลาตอบดีตอนแรก แล้วแย่ลงพร้อมข้อมูลที่โต | query ไม่มี index · ตารางโตจากข้อมูลที่ยิงสร้าง |

## 3 · ยิงซ้ำให้เทียบได้

- สคริปต์เดิม ข้อมูลตั้งต้นเดิม environment เดิม · ล้างข้อมูลที่การยิงรอบก่อนสร้างไว้
- เปลี่ยนทีละอย่าง (โค้ด หรือ ค่าตั้ง หรือ ขนาดเครื่อง) แล้วยิงเทียบกับ baseline
- เอกสาร k6 แนะนำรันแบบเดียวกันอย่างน้อย 2 รอบก่อนปล่อยรุ่น เพราะผลแต่ละรอบแกว่ง

## 4 · แบบรายงาน 1 หน้า

```markdown
## ผล load test · <ระบบ> · <YYYY-MM-DD>

- environment: <staging-perf> · ผู้อนุมัติ: <ชื่อ> · ช่วงเวลา: <เริ่ม–จบ>
- แบบ: <smoke · load · spike> · ปริมาณสูงสุดที่ยิงจริง: <รอบต่อวินาที>
- k6 รุ่น: <v2.x.y> · exit code: <0 หรือ 99>

| เกณฑ์ | ตั้งไว้ | ได้จริง | ผล |
|---|---|---|---|
| http_req_duration p(95) | < 500 ms | <ค่า> | ผ่าน / ไม่ผ่าน |
| http_req_failed | < 1% | <ค่า> | ผ่าน / ไม่ผ่าน |

คอขวดที่เห็น: <กราฟไหน ที่ปริมาณเท่าไร>
ทำต่อ: <ข้อแก้ 1–3 ข้อ> · ยิงซ้ำหลังแก้: <วันที่>
```

เขียนผลตามที่ยิงจริงเท่านั้น · ยิงแค่ 50 รอบต่อวินาที → ห้ามเขียนว่า "รับได้ 1,000 คนพร้อมกัน"

## ที่มา

- exit code https://grafana.com/docs/learning-paths/automate-k6-cicd/handle-exit-code/ (ตรวจ 2026-10-28)
- thresholds https://grafana.com/docs/k6/latest/using-k6/thresholds/ (ตรวจ 2026-10-28)
- รันซ้ำอย่างน้อย 2 รอบ https://grafana.com/docs/k6/latest/testing-guides/automated-performance-testing/ (ตรวจ 2026-10-28)


---

# skill: fsd-writing

Use when writing or reviewing a Functional Specification Document (FSD) that screens are built from.

# เขียน Functional Specification Document (FSD)

> **ภาษา:** ถ้อยคำทุกบรรทัดเขียนตาม `human-writing` — skill นี้บอกรูปแบบและโครง ส่วน human-writing บอกวิธีเขียนให้คนอ่านรู้เรื่อง
> ข้อความภาษาไทย → `human-writing` `references/thai-grammar.md` หัวข้อ 4 ระดับ ธุรกิจ

> **กฎข้อเดียว:** FSD เสร็จเมื่อ developer เปิดอ่านแล้ว**เขียนโค้ดได้โดยไม่ต้องเดาและไม่ต้องถาม**
> ทุกจุดที่ต้องเดา คือจุดที่จะกลายเป็นงานแก้หลังส่งมอบ

## เมื่อไหร่ใช้ skill นี้

- เขียน FSD หรือ Functional Spec ของฟีเจอร์ โมดูล หรือทั้งระบบ
- แปลง Software Requirements Specification (SRS) หรือ Business Requirements Document (BRD) ให้ละเอียดพอลงมือทำ
- รีวิว FSD ของคนอื่น แล้วต้องบอกให้ได้ว่าขาดอะไร
- developer ถามคำถามเดิมซ้ำ ๆ ระหว่างทำ — แปลว่า FSD ยังไม่ครบ

## เมื่อไหร่ **ไม่** ใช้

| งาน | ใช้ตัวนี้แทน |
|---|---|
| ข้อกำหนดระดับที่ลูกค้าเซ็นรับ | `srs-writing` |
| user story สำหรับ sprint | `user-story-writer` |
| ออกแบบ endpoint ของฟีเจอร์หนึ่ง | command `/api-design` |
| ข้อตกลงกลางของ API ทั้งระบบ | `api-conventions` |
| ตาราง คอลัมน์ ความสัมพันธ์ | `database-design` |
| หน้าตาหน้าจอ ระยะห่าง สถานะ | `ui-craft` + skill แพลตฟอร์ม |
| รูปแบบ markdown และธีมเอกสาร | `polished-document-style` |
| หน้าตาไฟล์ .docx ที่ส่งออก | `branded-document-design` |

## อ่านเพิ่มเมื่อ

| ไฟล์ | เปิดเมื่อ |
|---|---|
| [references/worked-examples.md](references/worked-examples.md) | ถ้าจะเขียน use case หน้าจอ ตารางสถานะ หรือกฎทางธุรกิจตัวแรกของเอกสาร ให้เปิดดูตัวอย่างเต็มแล้วลอกรูปแบบไปใช้ |
| [references/edge-cases.md](references/edge-cases.md) | ตอนเขียนหัวข้อข้อผิดพลาดและกรณีขอบ และตอนรีวิวก่อนส่ง เพื่อไล่ให้ครบทุกกรณี |
| [references/fsd-vs-srs.md](references/fsd-vs-srs.md) | ถ้ายังไม่แน่ใจว่าเนื้อหาชิ้นหนึ่งควรอยู่ใน SRS หรือใน FSD ให้เปิดตารางเทียบนี้ |
| [references/stakeholder-doc-templates.md](references/stakeholder-doc-templates.md) | ถ้าเขียน FSD แบบอ่านง่ายสำหรับผู้มีส่วนได้เสีย (Mode B — 11 หัวข้อเดียวกับข้อ 3) หรือต้องการแม่แบบ use case, API endpoint, data model ฉบับคนตรวจอ่าน |
| [references/figures.md](references/figures.md) | ตอนวางแผนว่าหัวข้อไหนต้องมีรูปชนิดไหน |
| [references/outline-sections.md](references/outline-sections.md) | ถ้าต้องตัดสินว่าหัวข้อไหนข้ามได้ ให้เปิดตารางนี้ ส่วนโครงเต็มที่ลอกไปกรอกได้อยู่ใน [assets/fsd-outline.md](assets/fsd-outline.md) |
| [references/related-skills.md](references/related-skills.md) | ถ้างานต้องใช้ skill อื่นคู่กัน เช่น รูป ข้อตกลง API หรือ test case ให้เปิดดูว่าใช้ตัวไหน |

## 1 · FSD ต่างจาก SRS ยังไง — เส้นแบ่งที่ต้องชัด

เอกสารสองฉบับนี้ปนกันบ่อยที่สุด ผลคือ SRS ยาวจนลูกค้าไม่อ่าน และ FSD ตื้นจน developer ต้องถาม
SRS บอกว่าระบบ**ต้องทำอะไรได้** ส่วน FSD บอกว่าระบบ**ทำสิ่งนั้นอย่างไร** ตารางเทียบทีละมิติอยู่ใน [references/fsd-vs-srs.md](references/fsd-vs-srs.md)

> 🚨 **ห้าม FSD สร้างข้อกำหนดใหม่เอง** — เจออะไรที่ SRS ไม่ได้ครอบคลุม ให้**ลงรายการคำถามค้าง** ใส่ `(รอยืนยัน)` แล้วทำส่วนอื่นต่อ
> ข้อนั้นต้องเพิ่มใน SRS ก่อน ไม่ใช่เขียนลง FSD เงียบ ๆ
> ข้อที่โผล่มาใน FSD โดยไม่มีที่มา คือข้อที่ลูกค้าจะปฏิเสธจ่ายตอนตรวจรับ

## 2 · ลำดับการทำงาน

1. อ่าน SRS หรือ BRD ให้จบก่อน แล้ว**ทำรายการข้อที่ยังคลุมเครือ** ถามรวมครั้งเดียวตอนเริ่มแบบเลือกคำตอบ ทุกตัวเลือกมีหลักฐาน (skill `superuser` หัวข้อ 6) เฉพาะข้อที่ตีความต่างแล้วงานออกมาต่างกันทั้งชุด (ตัวเลือก = การตีความที่เป็นไปได้ อ้างข้อใน SRS/BRD) ที่เหลือใส่ `(รอยืนยัน)` แล้วทำต่อ
2. ยืนยันว่าเอกสารนี้เขียนให้ใครอ่าน — developer อย่างเดียว (**Mode A** ค่าเริ่มต้น) หรือมีลูกค้าอ่านเพื่อเซ็นรับด้วย (**Mode B** — 11 หัวข้อเดิม เรียงเหมือนเดิม แค่จัดหน้าให้คนตรวจอ่านง่าย ดู [references/stakeholder-doc-templates.md](references/stakeholder-doc-templates.md))
3. ไล่ทีละ use case ไม่ใช่ทีละหน้าจอ — หน้าจอเกิดจาก use case ไม่ใช่ทางกลับกัน
4. เขียนกฎทางธุรกิจแยกออกมาก่อน แล้วค่อยอ้างถึงจากขั้นตอน (ข้อ 7)
5. ทำตารางสอบย้อนกลับไปพร้อมกัน ไม่ใช่ทำตอนจบ
6. รีวิวตามข้อ 11 ก่อนส่ง

## 3 · โครงเอกสาร

มี 11 หัวข้อ เรียงตามนี้: บทนำ · ผู้ใช้และสิทธิ์ · ภาพรวมกระบวนการ · use case · ข้อกำหนดหน้าจอ · ผังสถานะ · กฎทางธุรกิจ · ข้อมูลและการเชื่อมต่อ · ข้อผิดพลาดและกรณีขอบ · ตารางสอบย้อนกลับ · ประวัติการแก้ไข
ข้ามได้แค่ข้อกำหนดหน้าจอถ้าไม่มีหน้าจอ และผังสถานะถ้าไม่มีสถานะ โครงเต็มอยู่ใน **[`assets/fsd-outline.md`](assets/fsd-outline.md)** ส่วนตารางที่บอกว่าแต่ละหัวข้อตอบคำถามอะไรอยู่ใน [references/outline-sections.md](references/outline-sections.md)

## 4 · use case — รูปแบบเดียวทั้งเอกสาร

ทุก use case มีหัวตาราง (มาจาก · ผู้ทำ · เงื่อนไขก่อนเริ่ม · ผลเมื่อสำเร็จ · ความถี่) ตามด้วยตารางขั้นตอนหลัก ทางเลือกอื่น และกรณีผิดพลาด ตัวอย่างเต็ม UC-ORD-010 อยู่ใน [references/worked-examples.md](references/worked-examples.md)

**กฎของ use case:**

- **หนึ่ง use case = หนึ่งเป้าหมายของผู้ใช้** ไม่ใช่หนึ่งหน้าจอ
- ทุก use case ต้องมี **ทางเลือกอื่น** และ **กรณีผิดพลาด** อย่างน้อยอย่างละหนึ่ง —
  use case ที่มีแต่ทางที่ทุกอย่างราบรื่น คือ use case ที่ยังเขียนไม่เสร็จ
- คอลัมน์ "ระบบทำอะไรต่อ" ห้ามว่าง — ถ้าว่างแปลว่ายังไม่ได้คิดว่าระบบตอบสนองยังไง
- **เงื่อนไขก่อนเริ่มต้องตรวจซ้ำที่ฝั่งเซิร์ฟเวอร์เสมอ** การซ่อนปุ่มไม่ใช่การควบคุมสิทธิ์
- เขียนเป็น "ผู้ใช้ทำ → ระบบตอบ" สลับกัน ไม่ใช่เล่าเป็นย่อหน้า

## 5 · ข้อกำหนดหน้าจอ

ตัวอย่างเต็ม SC-ORD-020 พร้อมตารางฟิลด์อยู่ใน [references/worked-examples.md](references/worked-examples.md)

**ทุกหน้าจอต้องระบุครบ 6 อย่าง:**

| ต้องมี | รายละเอียด |
|---|---|
| ตารางฟิลด์ | ชนิด · บังคับไหม · กฎตรวจ · **ข้อความ error ตามจริง** · ค่าเริ่มต้น |
| สิทธิ์ต่อบทบาท | บทบาทไหนเห็น · แก้ได้ · แค่อ่าน · ไม่เห็นเลย |
| ห้าสถานะของหน้าจอ | ว่าง · กำลังโหลด · ผิดพลาด · มีบางส่วน · สำเร็จ (ดู `ui-craft`) |
| การกระทำและผลลัพธ์ | ปุ่มไหนพาไปไหน · ปุ่มไหนเปิดกล่องยืนยัน |
| กฎการแสดงผล | รูปแบบวันที่ · ทศนิยมของเงิน · การปัดเศษ · เขตเวลา |
| ที่มาของข้อมูล | ฟิลด์นี้มาจาก endpoint ไหนหรือตารางไหน |

> **"ข้อความ error ตามจริง" คือคำที่ผู้ใช้จะเห็นจริง ๆ** ไม่ใช่ "แสดงข้อความแจ้งเตือน"
> ถ้าไม่เขียน developer จะแต่งเอง แล้วทั้งระบบจะมีสำนวนคนละแบบสิบแบบ
>
> **กฎการแสดงผลต้องเขียนไว้** — "ยอดรวม" ที่ไม่บอกว่าปัดเศษยังไง
> คือบั๊กที่จะเจอตอนกระทบยอดสิ้นเดือน

## 6 · ผังสถานะ — จุดที่ FSD ลืมบ่อยที่สุด

ของที่มี "สถานะ" (คำสั่งซื้อ ใบลา ตั๋วงาน เอกสาร) ต้องมีตารางที่มีคอลัมน์ จาก · ไป · ใครทำได้ · เงื่อนไข · ผลข้างเคียง และ**ห้ามมีแค่รูป** ตัวอย่างตารางอยู่ใน [references/worked-examples.md](references/worked-examples.md)

**กฎ:**

- **การเปลี่ยนที่ไม่อยู่ในตาราง คือการเปลี่ยนที่ต้องถูกปฏิเสธ** เขียนบรรทัด "ทำไม่ได้" ไว้ให้ชัด
  เพราะสิ่งที่ห้ามทำคือสิ่งที่ทดสอบได้ยากที่สุดถ้าไม่มีใครเขียนไว้
- ทุกสถานะต้องมีทางออก ยกเว้นสถานะปลายทางที่ตั้งใจให้จบ
- ผลข้างเคียงที่เกิดกับระบบอื่น (อีเมล สต็อก บัญชี) ต้องอยู่ในตารางนี้ ไม่ใช่ซ่อนอยู่ในขั้นตอน

## 7 · กฎทางธุรกิจแยกออกมาจากขั้นตอน

กฎแต่ละข้อมีรหัส ชื่อ เนื้อกฎ และที่มา ตัวอย่าง BR-030 อยู่ใน [references/worked-examples.md](references/worked-examples.md)

- **กฎหนึ่งข้อเขียนที่เดียว** แล้วอ้างด้วยรหัสจากทุกที่ที่ใช้ — ถ้าลอกไปวางสามที่ สักวันจะแก้ไม่ครบ
- ทุกกฎต้องมี**ที่มา** กฎที่ไม่มีที่มาคือกฎที่ทีมคิดเอง
- กฎที่เปลี่ยนตามเวลา (อัตราภาษี ค่าธรรมเนียม) ต้องระบุว่า**เก็บไว้ที่ไหน** —
  ในโค้ด ในตารางตั้งค่า หรือให้ผู้ดูแลระบบแก้ได้เอง

## 8 · ข้อผิดพลาดและกรณีขอบที่ต้องตอบให้ครบ

ตารางกรณีขอบคือสิ่งที่ทีมทดสอบจะใช้ และคือสิ่งที่ FSD ส่วนใหญ่ขาด ตั้งแต่ไม่มีข้อมูล กดปุ่มรัว ๆ สองคนแก้พร้อมกัน ไปจนถึงสิทธิ์ไม่พอ ให้ไล่ทุกแถวใน [references/edge-cases.md](references/edge-cases.md) แล้วตอบทุกแถวที่เกี่ยวกับฟีเจอร์

## 9 · รหัสและการสอบย้อนกลับ

```
UC-<โมดูล>-<เลข 3 หลัก>      use case              UC-ORD-010
SC-<โมดูล>-<เลข 3 หลัก>      ข้อกำหนดหน้าจอ         SC-ORD-020
BR-<เลข 3 หลัก>              กฎทางธุรกิจ            BR-030
```

ใช้ระบบเดียวกับ `srs-writing` — **เว้นเลขทีละ 10** และ **รหัสที่ออกไปแล้วห้ามใช้ซ้ำ**

| SRS | FSD | หน้าจอ | test case | สถานะ |
|---|---|---|---|---|
| FR-ORD-040 | UC-ORD-010 | SC-ORD-020 | TC-ORD-010..014 | ทำแล้ว |
| FR-ORD-040 | UC-ORD-010 · 010-E1 | SC-ORD-020 | TC-ORD-015 | ทำแล้ว |

- **ทุก use case ต้องชี้กลับไปที่ข้อกำหนดใน SRS ได้** — ถ้าชี้ไม่ได้ แปลว่ามีของแถมที่ไม่มีใครสั่ง
- **ทุกข้อกำหนดใน SRS ต้องมี use case อย่างน้อยหนึ่งตัว** — ถ้าไม่มี แปลว่าลืมทำ
- ทางเลือกอื่นและกรณีผิดพลาดต้องมี test case ของตัวเอง ห้ามนับรวมกับทางหลัก

## 10 · รูปในเอกสาร

ตารางว่าหัวข้อไหนควรมีรูปชนิดไหนอยู่ใน [references/figures.md](references/figures.md) ข้อที่ต้องจำคือ state diagram ใช้**คู่กับตาราง ไม่ใช่แทนตาราง**

รูปทุกรูปในเอกสาร FSD (ทั้ง Mode A และ Mode B ทั้ง markdown และไฟล์ที่ลูกค้าเซ็นรับ) ใช้ `diagram-figures` แบบ house style ชุดเดียว ส่วนภาพร่างหน้าจอใช้ `markdown-visuals`
Mermaid ผ่าน `software-diagrams` ใช้แค่ร่างคุยกันในแชต ไม่ใส่ในเอกสารที่ส่ง
**ทุกรูปในฉบับเดียวใช้ธีมสีชุดเดียวกัน** ตาม `doc-theme` (ดู `polished-document-style`)

## 11 · รีวิวความครบถ้วนก่อนส่ง

**ความครบ**

- [ ] ทุกข้อกำหนดใน SRS มี use case อย่างน้อยหนึ่งตัว
- [ ] ทุก use case มีทางเลือกอื่นและกรณีผิดพลาดอย่างน้อยอย่างละหนึ่ง
- [ ] ทุกหน้าจอมีตารางฟิลด์ครบ 5 คอลัมน์ และห้าสถานะ
- [ ] ทุกของที่มีสถานะ มีตารางการเปลี่ยนสถานะ รวมบรรทัดที่ "ทำไม่ได้"
- [ ] ตอบตารางกรณีขอบในข้อ 8 ครบทุกแถวที่เกี่ยวข้อง

**ความชัด**

- [ ] ไม่มีคำว่า "ตามความเหมาะสม" "โดยอัตโนมัติ" "ที่จำเป็น" โดยไม่บอกว่าคืออะไร
- [ ] ข้อความ error ทุกอันเขียนเป็นคำจริง ไม่ใช่ "แสดงข้อความแจ้งเตือน"
- [ ] ตัวเลขทุกตัวมีหน่วย และมีที่มา
- [ ] ชื่อฟิลด์ ชื่อสถานะ ชื่อ endpoint ใช้ภาษาอังกฤษตรงกับที่จะใช้ในโค้ดจริง

**ความสอดคล้อง**

- [ ] คำเดียวกันหมายถึงของเดียวกันทั้งเล่ม (มีอภิธานศัพท์)
- [ ] ชื่อสถานะในผัง ในตาราง และใน use case ตรงกันหมด
- [ ] ไม่มีข้อกำหนดใหม่ที่ไม่มีใน SRS

> **ทดสอบขั้นสุดท้าย:** ให้ developer ที่ไม่ได้อยู่ในที่ประชุมอ่านหนึ่งคน
> ทุกคำถามที่เขาถาม คือหนึ่งช่องว่างที่ต้องเติมก่อนส่ง

**เมื่อมีโค้ดแล้ว — เทียบ FSD กับโค้ดจริง** (ทำตอนรีวิว FSD รอบหลัง build หรือก่อนรับงานแก้ · แนวคิดจาก trailofbits/skills และ ECC intent-driven-development)

- ไล่ทีละรหัสในข้อ 9: ค้นรหัส use case และชื่อหน้าจอในโค้ดและ test (`rg -n "UC-0[0-9]+" --glob '!**/node_modules/**' | head -50`) · รหัสที่ไม่เจอในโค้ดหรือ test เลย = ช่องว่างที่ต้องตอบว่ายังไม่ทำหรือทำไว้ใต้ชื่ออื่น
- เทียบ 3 จุดที่ต่างกันบ่อยที่สุด: ตารางฟิลด์ (ข้อ 5) ↔ โค้ด validation · ตารางเปลี่ยนสถานะ (ข้อ 6) ↔ โค้ดที่เปลี่ยนสถานะ (รวมบรรทัด "ทำไม่ได้") · ข้อความ error (ข้อ 8) ↔ สตริงในโค้ด
- ต่างกันให้จดเป็นตาราง `| spec:บรรทัด | file:บรรทัด | ใครถูก |` แล้วให้คนตัดสิน ไม่แก้ FSD ให้ตรงโค้ดเอง และไม่แก้โค้ดให้ตรง FSD เองในรอบรีวิว

## 12 · Anti-patterns

- **คัดลอก SRS มาแล้วเติมคำว่า "ระบบจะ"** — ได้เอกสารสองฉบับที่พูดเรื่องเดียวกัน
- **use case ที่มีแต่ทางที่ราบรื่น** — ทางที่พังคือสิ่งที่ FSD มีไว้เพื่อบอก
- **"แสดงข้อความแจ้งเตือน"** โดยไม่บอกว่าข้อความว่าอะไร
- **"ระบบจะคำนวณโดยอัตโนมัติ"** โดยไม่บอกสูตรและการปัดเศษ
- **ผังสถานะเป็นรูปอย่างเดียว** — รูปบอกไม่ได้ว่าใครมีสิทธิ์และมีผลข้างเคียงอะไร
- **คุมสิทธิ์ด้วยการซ่อนปุ่ม** โดยไม่ระบุการตรวจฝั่งเซิร์ฟเวอร์
- **กฎทางธุรกิจกระจายอยู่ในขั้นตอน** — พอแก้ทีหลังก็ตกหล่น
- **หน้าจอที่ไม่บอกว่าข้อมูลมาจากไหน** — developer จะเดา endpoint เอง
- **เอา wireframe มาแทนข้อกำหนด** — รูปบอกไม่ได้ว่าอะไรบังคับ กฎตรวจคืออะไร
- **ไม่มีตารางสอบย้อนกลับ** — แล้วไม่มีใครรู้ว่าทำครบหรือยัง

## 13 · ตัวย่อ

- **FSD** — Functional Specification Document (เอกสารข้อกำหนดเชิงหน้าที่ ระดับที่ลงมือทำได้)
- **SRS** — Software Requirements Specification (เอกสารข้อกำหนดซอฟต์แวร์ ระดับที่ลูกค้าเซ็นรับ)
- **BRD** — Business Requirements Document (เอกสารความต้องการทางธุรกิจ)
- **use case** — กรณีการใช้งาน หนึ่งเป้าหมายของผู้ใช้ตั้งแต่เริ่มจนจบ
- **state machine** — ผังสถานะ บอกว่าของชิ้นหนึ่งเปลี่ยนจากสถานะไหนไปสถานะไหนได้บ้าง
- **ETag** — Entity Tag (รหัสระบุรุ่นของข้อมูล ใช้ตรวจว่ามีคนแก้ไปก่อนไหม)


## reference: edge-cases.md

# ข้อผิดพลาดและกรณีขอบที่ต้องตอบให้ครบ

ทีมทดสอบจะใช้ตารางนี้ และเป็นส่วนที่ FSD ส่วนใหญ่ขาด ให้ไล่ทุกแถวที่เกี่ยวกับฟีเจอร์ แล้วเขียนคำตอบลงหัวข้อ 9 ของเอกสาร

| กรณี | คำถามที่ต้องตอบ |
|---|---|
| ไม่มีข้อมูล | หน้าจอว่างเปล่าแสดงอะไร มีปุ่มพาไปทำอะไรต่อไหม |
| ข้อมูลเยอะมาก | กี่รายการต่อหน้า · เรียงยังไง · ค้นหาได้ไหม |
| กดปุ่มรัว ๆ | กันงานซ้ำยังไง (ดู idempotency key ใน `api-conventions`) |
| สองคนแก้พร้อมกัน | ใครชนะ · อีกคนเห็นอะไร (ดู ETag ใน `api-conventions`) |
| เน็ตหลุดกลางทาง | ข้อมูลที่กรอกหายไหม · ลองใหม่แล้วซ้ำไหม |
| หมดเวลา session | เด้งออกทันที หรือเก็บสิ่งที่กรอกไว้ |
| ค่าที่ขอบเขต | 0 · ค่าติดลบ · วันนี้ · วันสุดท้ายของเดือน · ปีอธิกสุรทิน |
| ข้อความยาวผิดปกติ | ชื่อ 200 ตัวอักษรทำให้เลย์เอาต์พังไหม |
| ภาษาไทยและอักขระพิเศษ | เรียงลำดับถูกไหม · ค้นหาเจอไหม · อีโมจิพังไหม |
| ระบบภายนอกไม่ตอบ | รอกี่วินาที · ลองใหม่กี่ครั้ง · ผู้ใช้เห็นอะไรระหว่างนั้น |
| สิทธิ์ไม่พอ | เห็นแต่กดไม่ได้ หรือไม่เห็นเลย — **ต้องเลือกให้ชัด** |


## reference: figures.md

# รูปในเอกสาร FSD

ตารางนี้บอกว่าหัวข้อไหนของ FSD ควรมีรูปชนิดไหน ส่วนเครื่องมือที่ใช้วาดและเรื่องธีมสีอยู่ใน `SKILL.md` ข้อ 10

| หัวข้อ | รูปที่ควรมี |
|---|---|
| 3 ภาพรวมกระบวนการ | ผังขั้นตอนงานตั้งแต่ต้นจนจบ |
| 4 use case ที่มีหลายฝ่าย | sequence diagram |
| 5 หน้าจอ | ภาพร่างหน้าจอ พร้อมหมายเลขชี้ไปที่ตารางฟิลด์ |
| 6 สถานะ | state diagram — **คู่กับตาราง ไม่ใช่แทนตาราง** |
| 8 ข้อมูล | ER diagram เฉพาะตารางที่เกี่ยวกับโมดูลนี้ |


## reference: fsd-vs-srs.md

# FSD ต่างจาก SRS ยังไง

ตารางเทียบเอกสารสองฉบับทีละมิติ ใช้ตอนต้องตัดสินว่าเนื้อหาชิ้นหนึ่งควรอยู่ใน SRS หรือใน FSD

| | SRS | FSD |
|---|---|---|
| ตอบคำถาม | ระบบ**ต้องทำอะไรได้** | ระบบ**ทำสิ่งนั้นอย่างไร** |
| คนอ่านหลัก | ลูกค้า · ผู้บริหาร · คนเซ็นรับ | developer · tester · ux |
| ระดับรายละเอียด | "ระบบต้องให้ผู้ใช้ยกเลิกคำสั่งซื้อได้" | ปุ่มอยู่ตรงไหน · ยกเลิกได้ในสถานะไหนบ้าง · ใครมีสิทธิ์ · ยืนยันด้วยอะไร · ข้อความตอนทำไม่ได้ว่าอะไร · ระบบทำอะไรต่อ |
| เปลี่ยนแปลง | ต้องผ่านการอนุมัติ มีผลต่อสัญญา | เปลี่ยนได้ในทีม ตราบใดที่ยังตอบ SRS ข้อเดิม |
| หน่วยเนื้อหา | ข้อกำหนด (`FR-…`) | use case (`UC-…`) + ข้อกำหนดหน้าจอ (`SC-…`) |
| ตัวเลข | มาจากลูกค้า | มาจาก SRS ห้ามคิดใหม่ |


## reference: outline-sections.md

# หัวข้อของ FSD และข้ามได้เมื่อไหร่

ตารางนี้สรุปว่าแต่ละหัวข้อของ FSD ตอบคำถามอะไร ส่วนโครงเต็มที่มีคำใบ้ให้กรอกอยู่ใน [`../assets/fsd-outline.md`](../assets/fsd-outline.md)

| # | หัวข้อ | ตอบคำถามว่า | ข้ามได้ไหม |
|---|---|---|---|
| 1 | บทนำ · ขอบเขต · เอกสารอ้างอิง | ฉบับนี้ครอบคลุมส่วนไหน อ้างอิง SRS ข้อไหน | ไม่ได้ |
| 2 | ผู้ใช้และสิทธิ์ | ใครทำอะไรได้บ้าง | ไม่ได้ |
| 3 | ภาพรวมกระบวนการ | งานไหลจากต้นจนจบยังไง | ไม่ได้ |
| 4 | use case รายตัว | แต่ละงานทำทีละขั้นยังไง | ไม่ได้ |
| 5 | ข้อกำหนดหน้าจอ | หน้าจอมีอะไร ฟิลด์ตรวจอะไร | ข้ามได้ถ้าไม่มีหน้าจอ |
| 6 | ผังสถานะ | ของชิ้นนี้เปลี่ยนสถานะไปไหนได้บ้าง | ข้ามได้ถ้าไม่มีสถานะ |
| 7 | กฎทางธุรกิจ | กฎอะไรบังคับอยู่ | ไม่ได้ |
| 8 | ข้อมูลและการเชื่อมต่อ | ใช้ข้อมูลอะไร ต่อกับระบบไหน | ไม่ได้ |
| 9 | ข้อผิดพลาดและกรณีขอบ | พังแบบไหนได้บ้าง แล้วผู้ใช้เห็นอะไร | ไม่ได้ |
| 10 | ตารางสอบย้อนกลับ | ข้อนี้มาจาก SRS ข้อไหน ทดสอบด้วยอะไร | ไม่ได้ |
| 11 | ประวัติการแก้ไข | ใครแก้อะไรเมื่อไหร่ | ไม่ได้ |


## reference: related-skills.md

# เชื่อมกับ skill อื่น

ถ้างานที่ทำอยู่ต้องใช้ความรู้นอกเหนือจาก FSD ให้เปิด skill ในคอลัมน์ขวาคู่กัน

| ต้องการ | ใช้คู่กับ |
|---|---|
| ระดับข้อกำหนดที่ลูกค้าเซ็นรับ | `srs-writing` |
| รูปแบบ markdown และธีมสีของเอกสาร | `polished-document-style` |
| หน้าตาไฟล์ .docx ที่ส่งออก | `branded-document-design` |
| รูปในเอกสาร | `diagram-figures` (ทุกรูปในเอกสารที่ส่ง) · `markdown-visuals` (ภาพร่างหน้าจอ) · `software-diagrams` (Mermaid ร่างคุยในแชตเท่านั้น) |
| ข้อตกลงของ API ที่ FSD อ้างถึง | `api-conventions` |
| แบบจำลองข้อมูลที่ FSD อ้างถึง | `database-design` |
| ห้าสถานะของหน้าจอ และกฎงานออกแบบ | `ui-craft` + skill แพลตฟอร์ม |
| แปลง use case เป็น test case | `test-case-template` |
| แตกเป็น user story ตอนเริ่ม sprint | `user-story-writer` |
| ตัดสิ่งที่ไม่จำเป็นออกจากเอกสาร | `simplicity-first` |

**โครงเอกสารที่คัดลอกไปกรอกต่อได้ทันที** → [`../assets/fsd-outline.md`](../assets/fsd-outline.md)


## reference: stakeholder-doc-templates.md

# Stakeholder document (Mode B) — style, diagrams, templates

**สารบัญ:** Document Structure · Formatting Rules (hierarchy · markers · callouts · tables · badges) · Diagrams · Templates: Use Case · API Endpoint · Data Model

Moved from the system-analyst agent. Read when writing a Mode B document. A Mode A use case follows `SKILL.md` §4 and [`worked-examples.md`](worked-examples.md); the templates below are the same content in reviewer-friendly form, never a different format.

Mode B is **the same FSD** as Mode A — the same 11 sections in the same order as `SKILL.md` §3 — styled for reviewers who sign off: a short summary up front, plain words, more tables, less code. It never adds or drops a section; only the style changes. Diagrams follow `SKILL.md` §10. IDs follow `SKILL.md` §9 (`UC-<module>-<3 digits>`, steps of 10).

## Document Structure

Every stakeholder doc MUST follow the 11 FSD sections (`SKILL.md` §3, full outline in [`assets/fsd-outline.md`](../assets/fsd-outline.md)):

````markdown
# <Document Title>

> **Version:** 1.0 · **Date:** YYYY-MM-DD · **Status:** Draft | Review | Approved
> **Authors:** ... · **Reviewers:** ...

---

## Table of Contents

1. [Introduction](#1-introduction) — starts with a one-paragraph summary for non-technical readers
2. [Users & Permissions](#2-users--permissions)
3. [Process Overview](#3-process-overview)
4. [Use Cases](#4-use-cases)
5. [Screen Specifications](#5-screen-specifications)
6. [State Machines](#6-state-machines)
7. [Business Rules](#7-business-rules)
8. [Data & Integrations](#8-data--integrations) — API endpoints and data model go here
9. [Errors & Edge Cases](#9-errors--edge-cases)
10. [Traceability](#10-traceability)
11. [Revision History](#11-revision-history)

---

## 1. Introduction

> **For non-technical readers** — 1 paragraph explaining what this feature does and why.

### Scope

**In scope**
- ...

**Out of scope**
- ...

### Glossary
- ...

[... continue all 11 sections; skip 5 only if there are no screens and 6 only if nothing has a status ...]
````

## Formatting Rules

### Hierarchy & Numbering
- H1 = document title (only ONE)
- H2 = numbered sections (1., 2., 3.)
- H3 = sub-sections (1.1, 1.2)
- Always add TOC for docs with 5+ sections
- Use anchor links in TOC

### Visual Markers

No emoji or icons in headings, body, tables, labels or callouts (`human-writing` · `polished-document-style`). Use words:

| Need | Write |
|--------|---------|
| Yes / no in a table | ✓ / ✗ |
| Status | Draft · Approved · Pending · In Progress |
| Severity or priority | Critical · High · Medium · Low |
| Tip, warning, critical, note | Bold callout label (below) |

### Callout Boxes (Blockquotes)

```markdown
> **Tip:** Brief insight here.

> **Warning:** Important caveat.

> **Critical:** Must read before proceeding.

> **Note:** Additional context.
```

### Tables

Prefer tables over bullet lists when data has 2+ attributes:

```markdown
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| email | string | ✓ | User's email |
| age | number | ✗ | Optional |
```

Align headers to data when helpful:
```markdown
| Field | Type | Required |
|:------|:-----|:--------:|
```

### Status Badges (in tables/inline)

```markdown
**Status:** Approved
**Priority:** High
**Risk:** Medium
```

---

# Diagrams

Follow `SKILL.md` §10. A Mode B document is delivered to people who sign it, so every figure is a house-style figure made with `diagram-figures` (same theme for every figure in one document, per `doc-theme`). Mermaid through `software-diagrams` is only for a quick sketch in chat, never for the delivered file. Screen sketches use `markdown-visuals`.

## When to use which diagram

| Diagram | Use for | FSD section |
|---------|---------|---|
| Flowchart | Business processes, decision trees | 3 Process Overview |
| Sequence diagram | Interactions between systems/actors over time | 4 Use Cases (multi-party) |
| State diagram | Object lifecycle, status transitions — **next to the table, not instead of it** | 6 State Machines |
| ER diagram | Tables of this module only | 8 Data & Integrations |
| Timeline (Gantt) | Schedule, if the document has one | appendix |

Embed each figure as an image with a numbered caption, for example `![Figure 4-1 Place order — sequence](figures/uc-ord-010-sequence.svg)`.

---

# Templates

## Use Case Template (Mode B)

````markdown
### UC-ORD-010: <Use Case Name>

| Field | Value |
|-------|-------|
| **ID** | UC-ORD-010 (next use case in this module: UC-ORD-020) |
| **From (SRS)** | FR-ORD-040 |
| **Actor** | Customer |
| **Priority** | High |
| **Status** | Approved |
| **Trigger** | User clicks "Place Order" |
| **Frequency** | ~200 per day `(รอยืนยัน)` |

#### Preconditions
- User is authenticated
- Cart contains at least 1 item

#### Postconditions
- Order created with status `pending`
- Inventory reserved
- Confirmation email sent

#### Main Flow

| Step | Actor | Action | System Response |
|:----:|:------|:-------|:----------------|
| 1 | User | Reviews cart and clicks "Place Order" | Shows order summary |
| 2 | User | Confirms payment method | Validates payment info |
| 3 | System | Submits payment to gateway | Receives auth code |
| 4 | System | Creates order record | Returns order #ORD-XXXX |
| 5 | System | Sends confirmation email | — |
| 6 | User | Sees confirmation page | — |

#### Alternative Flows

> **010-A1: Payment declined at step 3**
> 3a. Gateway returns decline
> 3b. System shows error, suggests alternate payment
> 3c. Returns to step 2

#### Exception Flows

> **010-E1: Gateway timeout at step 3**
> 3a. System waits 30s
> 3b. Logs incident, marks order as `payment_pending`
> 3c. Sends "We'll retry" email to user

#### Sequence Diagram

![Figure 4-1 UC-ORD-010 Place order — Customer, UI, API, Payment Gateway, Database](figures/uc-ord-010-sequence.svg)

> Drawn with `diagram-figures` (house style). Steps: Customer clicks "Place Order" → UI sends POST /orders → API charges the gateway → gateway returns auth code → API inserts the order → UI shows the confirmation page.
````

## API Endpoint Template (Mode B)

````markdown
### POST `/api/v1/orders`

> Create a new order from cart contents.

| Attribute | Value |
|-----------|-------|
| **Auth Required** | Yes (Bearer token) |
| **Rate Limit** | 10 req/min per user |
| **Idempotent** | Yes (use `Idempotency-Key` header) |

#### Request Headers

| Header | Required | Example |
|--------|:--------:|---------|
| `Authorization` | ✓ | `Bearer eyJ...` |
| `Idempotency-Key` | Recommended | `unique-request-id` |
| `Content-Type` | ✓ | `application/json` |

#### Request Body

```json
{
  "items": [
    { "product_id": "uuid", "quantity": 2 }
  ],
  "shipping_address_id": "uuid",
  "payment_method_id": "uuid"
}
```

#### Response: 201 Created

```json
{
  "data": {
    "id": "ORD-12345",
    "status": "pending",
    "total": 1250.00,
    "created_at": "2025-01-15T10:30:00Z"
  }
}
```

#### Error Responses

Every error body is `application/problem+json` (RFC 9457): `type` · `title` · `status` · `detail` · `requestId`, plus `errors[]` for validation. Shape and status rules: `web-service-essentials` §2.

| Code | When | `type` (suffix) |
|:----:|:-----|:-----|
| 401 | Missing/invalid token | `unauthorized` |
| 402 | Payment declined | `payment-declined` |
| 409 | Inventory unavailable | `out-of-stock` |
| 422 | Validation failed | `validation` + `errors[]` (`field` · `code` · `message`) |
| 429 | Rate limit exceeded | `rate-limited` + `Retry-After` header |
````

## Data Model Template (Mode B)

````markdown
## 8. Data & Integrations

### Entity Relationship Diagram

![Figure 8-1 Order module — USER places ORDER, ORDER contains ORDER_ITEM](figures/order-er.svg)

> Drawn with `diagram-figures` (house style), tables of this module only.

### Tables

#### `users`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Unique identifier |
| `email` | VARCHAR(255) | UNIQUE, NOT NULL | Login email |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation |

> **Security:** `email` is encrypted at rest using AES-256.
````

---


## reference: worked-examples.md

# ตัวอย่างเต็มของ use case หน้าจอ ผังสถานะ และกฎทางธุรกิจ

ตัวอย่างทั้งไฟล์ใช้เรื่องเดียวกัน คือการยกเลิกคำสั่งซื้อ ลอกรูปแบบไปใช้ได้ทันที ส่วนกฎของแต่ละแบบอยู่ใน `SKILL.md`

## use case (ข้อ 4)

```markdown
### UC-ORD-010 · ยกเลิกคำสั่งซื้อ

| | |
|---|---|
| **มาจาก** | FR-ORD-040 |
| **ผู้ทำ** | ลูกค้า · เจ้าหน้าที่ฝ่ายขาย |
| **เงื่อนไขก่อนเริ่ม** | เข้าสู่ระบบแล้ว · คำสั่งซื้ออยู่ในสถานะ `confirmed` |
| **ผลเมื่อสำเร็จ** | คำสั่งซื้อเป็น `cancelled` · คืนจำนวนสินค้าเข้าคลัง · ส่งอีเมลแจ้ง |
| **ความถี่** | ประมาณ 30 ครั้งต่อวัน |

**ขั้นตอนหลัก**

| # | ผู้ทำ | การกระทำ | ระบบทำอะไรต่อ |
|:--:|---|---|---|
| 1 | ลูกค้า | เปิดหน้ารายละเอียดคำสั่งซื้อ | แสดงปุ่ม "ยกเลิก" เฉพาะเมื่อ BR-030 ผ่าน |
| 2 | ลูกค้า | กด "ยกเลิก" | เปิดกล่องยืนยัน พร้อมช่องเหตุผล (บังคับ) |
| 3 | ลูกค้า | เลือกเหตุผล แล้วกดยืนยัน | ตรวจ BR-030 อีกครั้งที่ฝั่งเซิร์ฟเวอร์ |
| 4 | ระบบ | — | เปลี่ยนสถานะ · คืนสต็อก · บันทึกผู้ทำและเวลา · ส่งอีเมล |
| 5 | ระบบ | — | แสดงข้อความสำเร็จ และปุ่มยกเลิกหายไป |

**ทางเลือกอื่น**

| รหัส | แยกที่ขั้น | เงื่อนไข | ผลลัพธ์ |
|---|:--:|---|---|
| 010-A1 | 3 | ผู้ทำเป็นเจ้าหน้าที่ | ข้ามช่องเหตุผล แต่บังคับกรอกหมายเหตุภายใน |

**กรณีผิดพลาด**

| รหัส | เกิดที่ขั้น | สาเหตุ | ผู้ใช้เห็นอะไร | ระบบทำอะไร |
|---|:--:|---|---|---|
| 010-E1 | 3 | มีคนเปลี่ยนสถานะไปก่อนแล้ว | "คำสั่งซื้อนี้ถูกจัดส่งแล้ว ยกเลิกไม่ได้" | ไม่เปลี่ยนอะไร · โหลดหน้าใหม่ |
| 010-E2 | 4 | คืนสต็อกไม่สำเร็จ | "ระบบขัดข้อง กรุณาลองใหม่" + รหัสอ้างอิง | ย้อนกลับทั้งรายการ · บันทึก log ระดับ error |
```

## ข้อกำหนดหน้าจอ (ข้อ 5)

```markdown
### SC-ORD-020 · หน้ารายละเอียดคำสั่งซื้อ

**เส้นทาง:** `/orders/{id}` · **ใช้ใน:** UC-ORD-010, UC-ORD-020

| ฟิลด์ | ชนิด | บังคับ | กฎตรวจ | ข้อความเมื่อไม่ผ่าน | ค่าเริ่มต้น |
|---|---|:--:|---|---|---|
| เหตุผลที่ยกเลิก | เลือกจากรายการ | ลูกค้า ✓ · เจ้าหน้าที่ ✗ (010-A1) | ต้องเป็นค่าในรายการ BR-031 | "กรุณาเลือกเหตุผล" | — |
| หมายเหตุภายใน | ข้อความยาว | เจ้าหน้าที่ ✓ · ลูกค้าไม่เห็นช่องนี้ | ไม่เกิน 500 ตัวอักษร | "กรุณากรอกหมายเหตุ" · "หมายเหตุยาวเกิน 500 ตัวอักษร" | ว่าง |
```

## ตารางการเปลี่ยนสถานะ (ข้อ 6)

| จาก | ไป | ใครทำได้ | เงื่อนไข | ผลข้างเคียง |
|---|---|---|---|---|
| `draft` | `confirmed` | ลูกค้า | มีสินค้าอย่างน้อย 1 รายการ · ที่อยู่ครบ | ตัดสต็อก · ส่งอีเมล |
| `confirmed` | `cancelled` | ลูกค้า · เจ้าหน้าที่ | BR-030 | คืนสต็อก · ส่งอีเมล |
| `confirmed` | `shipped` | เจ้าหน้าที่คลัง | มีเลขพัสดุ | ส่ง SMS |
| `shipped` | `cancelled` | — | **ทำไม่ได้** | — |

## กฎทางธุรกิจ (ข้อ 7)

```markdown
**BR-030 · ยกเลิกคำสั่งซื้อได้เมื่อไหร่**
ยกเลิกได้เมื่อสถานะเป็น `confirmed` และยังไม่เกิน 24 ชั่วโมงนับจากเวลายืนยัน
เจ้าหน้าที่ระดับหัวหน้าขึ้นไปยกเลิกได้โดยไม่จำกัดเวลา แต่ต้องกรอกหมายเหตุ
**ที่มา:** นโยบายคืนเงิน ฉบับ 2026-03 ข้อ 4.2

**BR-031 · เหตุผลที่ลูกค้าเลือกได้ตอนยกเลิก**
สั่งผิดรายการ · ได้ราคาที่ถูกกว่า · รอนานเกินไป · ไม่ต้องการแล้ว · อื่น ๆ
ผู้ดูแลระบบแก้รายการนี้ได้ในหน้าตั้งค่า โดยไม่ต้องแก้โค้ด
**ที่มา:** นโยบายคืนเงิน ฉบับ 2026-03 ข้อ 4.3 `(รอยืนยัน)`
```


---

# skill: simplify

Use when a deliverable has steps, layers or options nobody needs yet, or a newcomer must follow it. Not Claude Code /simplify.

# simplify — ทำให้ง่าย คนอ่านครั้งแรกก็ตามได้

ใช้กับทุกงานที่ส่งให้คน ทั้งโค้ด เอกสาร แผน ดีไซน์ สไลด์ ตาราง และคำตอบ · `human-writing` คุมว่า**เขียนอย่างไร** ส่วน skill นี้คุมว่า**ตัวงานมีอะไรบ้าง** · อยู่ใน plugin `superuser` ที่เดียว plugin อื่นใช้ร่วมผ่าน `dependencies`

## 1 · หลักใหญ่

- **บททดสอบ:** คนที่ไม่ได้อยู่ในงานนี้ เปิดดูอีก 6 เดือนข้างหน้า ต้องเข้าใจและแก้ต่อได้โดยไม่ต้องถามใคร
- ทำเท่าที่โจทย์ต้องการ ไม่เผื่ออนาคตที่ยังไม่มีใครขอ
- ตัดก่อนเพิ่ม · ถ้าตัดส่วนไหนออกแล้วความหมายหรือการทำงานไม่เสีย ให้ตัด
- ของธรรมดาที่คนรู้จักดีกว่าของฉลาดที่ต้องถอดรหัส
- **ง่ายไม่ใช่มักง่าย** — ห้ามตัดความถูกต้อง ความปลอดภัย การตรวจข้อมูลที่รับจากภายนอก การจัดการ error ที่กันข้อมูลหาย และสิ่งที่ผู้ใช้ขอไว้ชัด ๆ
- **ง่ายไม่ใช่กองรวม** — ลดจำนวนของ แต่ยังแยกหน้าที่ชัด 1 ส่วนทำ 1 เรื่อง เหมือนงานของมืออาชีพ

## 2 · บันไดก่อนลงมือ — หยุดที่ขั้นแรกที่ใช้ได้

1. ต้องมีสิ่งนี้จริงไหม · ไม่จำเป็น → ไม่ทำ แล้วบอก 1 บรรทัดว่าข้ามอะไร
2. มีของเดิมที่ใช้ได้แล้วไหม (ไฟล์ แม่แบบ ฟังก์ชัน เครื่องมือ ฟีเจอร์ที่ติดมากับระบบ) · มี → ใช้ของเดิม
3. ทำแบบสั้นที่สุดที่ยังครบและถูก

## 3 · ตามชนิดงาน

| งาน | ทำ | เลี่ยง |
|---|---|---|
| **โค้ด** | ชื่อบอกว่าคืออะไรและมีหน่วย · 1 ฟังก์ชันทำ 1 เรื่อง · คืนค่าออกเร็วแทนการซ้อน `if` · เยื้องไม่เกิน 3 ชั้น · คอมเมนต์บอก "ทำไม" · ตามสไตล์ของโปรเจกต์ | abstraction ที่มีตัวใช้ตัวเดียว · ทางลัดที่ฉลาดแต่อ่านยาก · ไฟล์ก้อนเดียวทำทุกอย่าง · โฟลเดอร์ `utils/` กองรวม · dependency ใหม่เพื่องานไม่กี่บรรทัด |
| **เอกสาร · รายงาน** | ข้อสรุปขึ้นก่อน · 1 ย่อหน้า 1 เรื่อง · ตัวอย่างประกอบข้อที่เป็นนามธรรม · ตารางสำหรับข้อมูลที่เทียบกัน | ทวนสิ่งที่พูดไปแล้ว · หัวข้อที่ไม่มีเนื้อ · ศัพท์ที่คนอ่านไม่รู้ |
| **แผน · ขั้นตอน** | 3–5 ข้อสำคัญ · ทุกข้อมีเจ้าของและวัดได้ว่าเสร็จ · ขั้นน้อยที่สุดที่ได้ผล | รายการ 20 ข้อที่ไม่มีลำดับความสำคัญ · ขั้นที่มีไว้ "เผื่อ" |
| **ดีไซน์ · สไลด์ · รูป** | 1 หน้า 1 ใจความ · ทางสั้นสุดไปถึงเป้าของผู้ใช้ · ใช้แบบที่คนคุ้นเคย | อัดข้อมูลจนต้องเพ่ง · ของตกแต่งที่ไม่ช่วยให้เข้าใจ |
| **ตาราง · ข้อมูล** | คอลัมน์เท่าที่ใช้ตัดสินใจ · สูตรสั้นที่ตามได้ | คอลัมน์ซ้ำความหมาย · สูตรซ้อนยาวบรรทัดเดียว |
| **คำตอบ** | ตอบก่อน · ยาวเท่าที่คำถามต้องการ | อธิบายยาวกว่าตัวงาน |

plugin `software-company` มีรายละเอียดของโค้ดและสถาปัตยกรรมเพิ่ม: `lazy-coding` (เขียนให้น้อย) · `readable-code` (ชื่อ รูปร่างฟังก์ชัน โครงไฟล์) · `simplicity-first` (เอกสาร แผน สถาปัตยกรรม) · ถ้าติดตั้งอยู่ให้เปิดคู่กัน

## 4 · บอกว่าตั้งใจทำให้ง่าย

ทางลัดที่ตั้งใจ ให้เขียนไว้ว่าใช้ได้ถึงแค่ไหนและเปลี่ยนเมื่อไร จะได้ไม่ดูเหมือนลืม เช่น `// simple: เก็บใน memory — ย้ายไป Redis เมื่อรันเกิน 1 process` · ในรายงานใส่ 1 บรรทัด `ข้าม: X — เพิ่มเมื่อ Y`

## 5 · ตรวจก่อนส่ง 5 ข้อ

1. คนนอกเปิดดูครั้งแรกแล้วเข้าใจภายใน 30 วินาทีไหม
2. มีส่วนไหน ขั้นไหน หรือชั้นไหนตัดออกได้โดยไม่เสียอะไรไหม ถ้ามีให้ตัด
3. ทุกส่วนที่เพิ่มมา มีเหตุผลว่าต้องใช้ตอนนี้ ไม่ใช่ "เผื่อ" ใช่ไหม
4. ยังครบเรื่องความถูกต้อง ความปลอดภัย และสิ่งที่ผู้ใช้ขอไหม
5. ยังแยกหน้าที่ชัด ไม่ได้ยุบหลายเรื่องไว้ที่เดียวเพื่อให้ดูสั้นใช่ไหม


---

# skill: stack-dotnet

Use when writing, reviewing or fixing C# and .NET (ASP.NET Core, MVC 5, EF Core).

# stack-dotnet — เขียน C# ให้ build สะอาด test ผ่าน ไม่มีกับดักเดิม

ใช้เมื่องานแตะโค้ด C# ทุกแบบ: ASP.NET Core (Web API · Model-View-Controller (MVC) · minimal API) · Entity Framework (EF) Core · ASP.NET MVC 5 บน .NET Framework 4.x ที่ยังดูแลอยู่

ไฟล์นี้มีแค่เรื่องเฉพาะ .NET ส่วนหลักทั่วไปอยู่ที่ `lazy-coding` · `readable-code` · `testing-standards` · `logging-standards` · `error-handling-patterns` · `database-design` · `principle-secure-by-default`

---

## 1 · เริ่มงาน: อ่านเวอร์ชันก่อน แล้วรันคำสั่งชุดเดียวกันทุกครั้ง

- เวอร์ชัน Software Development Kit (SDK) ดูที่ `global.json` ส่วนเวอร์ชันที่ target ดูที่ `<TargetFramework>` ใน `*.csproj` หรือ `Directory.Build.props`
- เวอร์ชัน (ตรวจล่าสุด 2026-10-14 · แหล่ง: https://dotnet.microsoft.com/platform/support/policy/dotnet-core): `net10.0` คือ Long Term Support (LTS) ล่าสุด รองรับถึง 2028-11-14 · `net8.0` (LTS) และ `net9.0` (Standard Term Support, STS) อยู่ช่วงท้าย รองรับถึง 2026-11-10 · ถ้าเจอ 2 ตัวนี้ให้แจ้งเจ้าของ ไม่อัปเกรดเองกลางงาน · ก่อนใช้ให้ตรวจหน้านี้ซ้ำ
- ถ้าเจอ `net48` หรือ `v4.x` ใน `<TargetFrameworkVersion>` แปลว่าเป็น .NET Framework ให้ใช้ชุดคำสั่ง legacy ด้านล่าง

| ขั้น | .NET (Core) 8+ | .NET Framework 4.x (Windows) |
|---|---|---|
| ดึงแพ็กเกจ | `dotnet restore` | `msbuild App.sln -t:restore` หรือ `nuget restore App.sln` |
| build | `dotnet build -warnaserror` (หรือตามนโยบาย repo) | `msbuild App.sln -p:Configuration=Release` |
| test ทั้งหมด | `dotnet test` | `vstest.console.exe Tests/bin/Release/App.Tests.dll` |
| จัดรูปแบบ | `dotnet format --verify-no-changes` | ตาม `.editorconfig` ใน Visual Studio |

รัน test ตัวเดียว:

```bash
dotnet test --filter "FullyQualifiedName~OrderServiceTests.Cancel"   # VSTest (ค่าเริ่ม)
dotnet test --filter-method "*Cancel_*"                               # xUnit v3 บน Microsoft Testing Platform (MTP)
vstest.console.exe App.Tests.dll /TestCaseFilter:"FullyQualifiedName~Cancel"   # .NET Framework
```

- test ทั้งชุดพ่นผลยาว ให้ต่อท้าย `2>&1 | tail -40` ดูแค่สรุปและ test ที่ล้ม
- ถ้า repo ตั้ง MTP ไว้ใน `global.json` (`"test": { "runner": "Microsoft.Testing.Platform" }`) ให้ใช้ `--filter-*` แบบบรรทัดที่ 2
- `msbuild` และ `vstest.console.exe` อยู่ใน Visual Studio หรือ Build Tools ให้เปิดผ่าน Developer PowerShell ส่วนเครื่อง Linux build .NET Framework web project ไม่ได้ จึงต้องบอกตรง ๆ ว่ายังไม่ได้ build

## 2 · โครงและแบบแผน

ตั้งค่าครั้งเดียวที่ `Directory.Build.props` ให้ทุกโปรเจกต์ใน solution:

```xml
<PropertyGroup>
  <Nullable>enable</Nullable>
  <ImplicitUsings>enable</ImplicitUsings>
  <TreatWarningsAsErrors>true</TreatWarningsAsErrors>
  <AnalysisLevel>latest-recommended</AnalysisLevel>
  <EnforceCodeStyleInBuild>true</EnforceCodeStyleInBuild>
</PropertyGroup>
```

- ถ้า repo เก่ามี warning เป็นร้อย อย่าเปิด `TreatWarningsAsErrors` ทั้ง solution ในงานเดียว ให้เปิดเฉพาะโปรเจกต์ใหม่ และไม่เพิ่ม warning ใหม่
- จัดโฟลเดอร์ตาม feature (`Features/Orders/...`) ตาม `readable-code` แต่ถ้า repo ใช้ `Controllers/ Services/` อยู่แล้ว ให้ตามของเดิม
- ใช้ file-scoped namespace (`namespace App.Orders;`) ให้ Data Transfer Object (DTO) เป็น `record` และห้ามคืน entity ของ EF ออก API ตรง ๆ
- async ตลอดสาย: method ที่รอ I/O รับ `CancellationToken ct` แล้วส่งต่อทุกชั้นจนถึง EF และ `HttpClient`
- จะใช้ minimal API หรือ controller ให้ตามแบบที่ repo ใช้อยู่ ไม่ผสมใน feature เดียวกัน

อายุของ service ใน Dependency Injection (DI):

| lifetime | ใช้กับ | ห้าม |
|---|---|---|
| Singleton | ของไม่มี state · cache · `TimeProvider` | รับ Scoped ใน constructor (`DbContext` จะค้างข้าม request) |
| Scoped | `DbContext` · service ที่ใช้ข้อมูลของ request | เรียกจาก `BackgroundService` ตรง ๆ (ให้ใช้ `IServiceScopeFactory.CreateScope()` แทน) |
| Transient | ของเบา ไม่มี state | ถือ resource ที่ต้อง dispose แล้วฝากไว้ใน singleton |

ค่า config ใช้ options pattern และตรวจตอนเริ่มแอป:

```csharp
builder.Services.AddOptions<SmtpOptions>()
    .BindConfiguration("Smtp")
    .ValidateDataAnnotations()
    .ValidateOnStart();
```

ผลที่ "ไม่สำเร็จแต่คาดได้" (ไม่พบ · ซ้ำ · สต็อกไม่พอ) คืนเป็นค่า ไม่โยน exception — exception เก็บไว้สำหรับสิ่งที่โค้ดไม่คาด (ปรับจาก wshobson `dotnet-backend-patterns` · MIT):

```csharp
public sealed record Result<T>(bool IsSuccess, T? Value, string? Error, string? Code)
{
    public static Result<T> Ok(T value) => new(true, value, null, null);
    public static Result<T> Fail(string error, string? code = null) => new(false, default, error, code);
}

// service
return stock < qty ? Result<Order>.Fail("สต็อกไม่พอ", "OUT_OF_STOCK") : Result<Order>.Ok(order);

// endpoint — code → status เดียวกันทั้งระบบ แล้วออกเป็น ProblemDetails
return r.IsSuccess ? Results.Ok(r.Value) : Results.Problem(r.Error, statusCode: r.Code switch { "NOT_FOUND" => 404, "OUT_OF_STOCK" => 409, _ => 400 });
```

repo ที่มี `FluentResults` หรือ `ErrorOr` อยู่แล้วให้ใช้ตัวนั้น ไม่เพิ่ม record ใหม่ซ้อน

## 3 · EF Core

| เรื่อง | ทำแบบนี้ |
|---|---|
| อ่านอย่างเดียว | `AsNoTracking()` · ดึงเฉพาะคอลัมน์ที่ใช้ด้วย `Select(o => new OrderDto(...))` |
| N+1 | ห้ามวนลูปแล้ว query ในลูป ให้ใช้ `Include` หรือ projection ถ้า `Include` หลาย collection ให้เติม `AsSplitQuery()` |
| แก้หรือลบหลายแถว | ใช้ `ExecuteUpdateAsync` / `ExecuteDeleteAsync` ไม่โหลดมาแก้ทีละตัว แต่คำสั่งนี้ข้าม change tracker |
| migration | อ่าน SQL ทุกครั้ง: `dotnet ef migrations script --idempotent -o migrate.sql` |
| production | ห้าม `EnsureCreated()` และห้าม `Database.Migrate()` ตอนแอปเริ่มหลาย instance พร้อมกัน ให้รันสคริปต์ตอน deploy แทน |
| แก้พร้อมกัน | ใช้ `[Timestamp] byte[] RowVersion` (SQL Server) หรือ `IsConcurrencyToken()` แล้วจับ `DbUpdateConcurrencyException` เพื่อบอกผู้ใช้ |
| เวลา | เก็บ UTC เสมอ และ PostgreSQL (Npgsql) บังคับ `DateTimeKind.Utc` สำหรับ `timestamptz` |

ดู SQL ที่ EF สร้างจริงก่อนส่งงาน:

```csharp
var sql = db.Orders.Where(o => o.Status == Status.Open).ToQueryString();
// หรือใน Development
options.LogTo(Console.WriteLine, LogLevel.Information).EnableSensitiveDataLogging();
```

`EnableSensitiveDataLogging` ใช้ในเครื่อง dev เท่านั้น ส่วน schema และ index ให้ทำตาม `database-design`

## 4 · กับดักที่เจอบ่อย

| กับดัก | ผลที่เกิด | ทำแบบนี้แทน |
|---|---|---|
| `async void` | exception ทำ process ล่ม จับไม่ได้ | ใช้ `async Task` ยกเว้น event handler ของ UI |
| `.Result` · `.Wait()` · `GetAwaiter().GetResult()` | MVC 5 ค้างตาย (deadlock) · Core กิน thread จนแอปช้า | ใช้ `async Task<ActionResult>` ตลอดสาย ส่วน library ใช้ `ConfigureAwait(false)` |
| `new HttpClient()` ทุกครั้ง | socket หมด และ DNS ไม่อัปเดต | ใช้ `IHttpClientFactory` หรือ typed client ส่วน .NET Framework ใช้ `static readonly HttpClient` |
| ลืม dispose | connection และไฟล์ค้าง | `using var` · `await using` สำหรับ `IAsyncDisposable` |
| ต่อ string เป็น SQL | SQL injection | LINQ · `FromSql($"...{id}")` (ใส่พารามิเตอร์ให้) · Dapper ส่ง `new { id }` · ห้าม `FromSqlRaw` กับข้อความที่ต่อเอง |
| parse หรือ format ด้วย culture ของเครื่อง | เครื่อง `th-TH` ใช้ปฏิทินพุทธ ปีจึงออกมาเป็น 2569 และ parse "2026-01-05" แล้วได้ปีผิด 543 ปี | เก็บและ parse ด้วย `CultureInfo.InvariantCulture` · แสดงผลพุทธศักราชเฉพาะตอนแสดงผล ตาม `i18n-and-locale` |
| เงินเป็น `double` | 0.1 + 0.2 ≠ 0.3 | ใช้ `decimal` และระบุคอลัมน์เป็น `decimal(18,2)` ให้ชัด |
| `DateTime.Now` | test ไม่ได้ และเวลาเพี้ยนตาม server | ใช้ `TimeProvider` ผ่าน DI และ `FakeTimeProvider` ใน test |
| เวลาไทย | server อยู่ UTC | `TimeZoneInfo.FindSystemTimeZoneById("Asia/Bangkok")` ส่วน .NET Framework บน Windows ใช้ `"SE Asia Standard Time"` |
| array หรือ string ใหญ่ ≥ 85,000 bytes | ลง Large Object Heap (LOH) ทำให้ตัวเก็บขยะหน่วยความจำ (Garbage Collector — GC) หนัก | stream ข้อมูล · `ArrayPool<T>` · `IAsyncEnumerable<T>` สำหรับรายการยาว |
| `$"..."` ใน log | ค้นตาม field ไม่ได้ และสร้าง string แม้ระดับ log ปิด | message template: `log.LogInformation("Order {OrderId} paid", id)` ส่วน format อื่นดู `logging-standards` |

จะจับ exception ที่ไหนและ retry อย่างไร ดู `error-handling-patterns` ส่วน ASP.NET Core ใช้ `IExceptionHandler` + `AddProblemDetails()` ที่จุดเดียว

## 5 · test

- ใช้ framework ที่ repo มีอยู่ ถ้าเป็นโปรเจกต์ใหม่ให้ใช้ xUnit (v3 สำหรับ .NET 8+) ตาม `testing-standards`
- FluentAssertions ตั้งแต่ v8 ต้องซื้อ license ถ้าใช้เชิงพาณิชย์ ส่วน v7 ยังฟรี (Apache 2.0) โปรเจกต์ใหม่ให้ใช้ assert ของ xUnit หรือ AwesomeAssertions (fork ฟรี) ถ้า repo ใช้ v8 อยู่แล้วให้ถามเจ้าของเรื่อง license
- ชื่อ test: `Method_Condition_Result` เช่น `Cancel_WhenAlreadyShipped_Throws`
- ถ้าเป็น logic ใหม่หรือ bug ให้เขียน test ที่แดงก่อน แล้วค่อยแก้ให้เขียว และ bug ต้องมี test ที่จำลองอาการจริง
- test API ทั้งเส้นใช้ `WebApplicationFactory<Program>` ถ้า test มองไม่เห็น `Program` ให้เพิ่ม `public partial class Program;`
- ฐานข้อมูลจริงใช้ Testcontainers (`Testcontainers.MsSql` · `Testcontainers.PostgreSql`) ห้ามใช้ EF InMemory แทนฐานจริง เพราะไม่ตรวจ constraint และแปล SQL ต่างกัน

ตั้งค่า xUnit และตัวอย่าง `WebApplicationFactory` เต็ม ดู [`testing-standards/references/per-stack.md`](../testing-standards/references/per-stack.md#net--xunit)

## 6 · ความปลอดภัยเฉพาะ .NET

| เรื่อง | ASP.NET Core | MVC 5 (.NET Framework) |
|---|---|---|
| Cross-Site Request Forgery (CSRF) | MVC ใส่ `AutoValidateAntiforgeryToken` เป็น global filter ส่วน Razor Pages ตรวจให้เอง | `@Html.AntiForgeryToken()` + `[ValidateAntiForgeryToken]` ทุก POST |
| ต้อง login เป็นค่าเริ่ม | ตั้ง `FallbackPolicy` เป็น `RequireAuthenticatedUser()` แล้วใส่ `[AllowAnonymous]` ทีละจุดในหน้าที่เปิดให้ทุกคน | `GlobalFilters.Filters.Add(new AuthorizeAttribute())` |
| ส่งฟิลด์เกิน (over-posting) | bind เข้า DTO ที่มีเฉพาะฟิลด์ที่แก้ได้ | ใช้ view model แยก ไม่ bind entity ตรง ๆ |
| แสดงผล | Razor encode ให้ แต่ห้ามใช้ `Html.Raw` กับข้อมูลผู้ใช้ | เหมือนกัน และระวัง `MvcHtmlString` |
| Data Protection keys | ถ้ามีหลาย instance หรือ container ให้เก็บ key ไว้ที่เดียวกัน (`PersistKeysToDbContext` หรือ file share) ไม่งั้น cookie หลุดทุกครั้งที่ restart | `machineKey` ใน `web.config` เหมือนกันทุกเครื่อง |
| secret | dev: `dotnet user-secrets set "Db:Password" "..."` · prod: environment variable หรือ secret store | แยก transform ของ `web.config` และไม่ commit ค่าจริง |

- `appsettings.json` และ `web.config` ที่ commit ห้ามมีรหัสผ่าน connection string จริง หรือ API key ส่วนเรื่องการเก็บ secret ดู `config-and-secrets`
- เรื่องตรวจ input · upload · การเข้ารหัส ดู `principle-secure-by-default`

## 7 · ตรวจก่อนส่ง

- [ ] `dotnet build -warnaserror` ได้ 0 warning (หรือไม่เพิ่ม warning จากเดิมใน repo เก่า)
- [ ] `dotnet test` ผ่านหมด และรายงานว่าผ่านกี่ตัวจากกี่ตัว
- [ ] `dotnet format --verify-no-changes` ไม่มีอะไรต้องแก้
- [ ] พฤติกรรมใหม่มี test ที่เคยแดงก่อนแก้
- [ ] ไม่มี `.Result` · `.Wait()` · `async void` ใหม่: `grep -rnE "\.Result\b|\.Wait\(\)|async void" --include=*.cs`
- [ ] query ที่แก้ ดู SQL จริงแล้ว ไม่มี N+1
- [ ] migration มีสคริปต์ `--idempotent` และอ่านแล้ว ไม่มี `DROP` ที่ไม่ได้ตั้งใจ
- [ ] ถ้า build .NET Framework บนเครื่องไม่ได้ ให้เขียนในรายงานว่ายังไม่ได้ build ไม่บอกว่าผ่าน

## 8 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้ |
|---|---|
| ทำให้น้อยที่สุดที่ยังใช้ได้ | `lazy-coding` |
| ชื่อ · โครงไฟล์ · comment | `readable-code` |
| ระดับ test · coverage · test ที่แดงสลับเขียว | `testing-standards` |
| รูปแบบ log · Serilog | `logging-standards` |
| จับ exception · retry · timeout | `error-handling-patterns` |
| ตาราง · index · migration แบบ expand-and-contract | `database-design` |
| ค่าเริ่มที่ปลอดภัย | `principle-secure-by-default` |
| connection string · secret store | `config-and-secrets` |
| วันที่ไทย · พุทธศักราช · เรียงภาษาไทย | `i18n-and-locale` |
| URL · error format ของ API | `api-conventions` |
| พิสูจน์ว่าใช้ได้จริงก่อนบอกว่าเสร็จ | `principle-prove-it-works` |


---

# skill: stack-typescript

Use when writing or reviewing TypeScript in Node (Express, Fastify, NestJS), Angular, React or Vite.

# stack-typescript — TypeScript ที่ทีมอ่านง่าย และพังยาก

> **กฎข้อเดียว:** ให้ compiler จับ bug แทนคน `tsc` ผ่าน 0 error ไม่ได้แปลว่าเสร็จ แต่ไม่ผ่านแปลว่ายังไม่เริ่ม

ไฟล์นี้มีแค่เรื่องเฉพาะ TypeScript · Node · Angular ส่วนหลักทั่วไปอยู่ใน `lazy-coding` · `readable-code` · `principle-data-shape-first` · `principle-secure-by-default`

## 1 · เริ่มงาน — ดู repo ก่อนพิมพ์คำสั่งแรก

| ดูไฟล์ | บอกอะไร | ทำ |
|---|---|---|
| `package-lock.json` · `pnpm-lock.yaml` · `yarn.lock` | package manager | ใช้ตัวนั้นตัวเดียว ห้ามมี lockfile 2 ตัว |
| `.nvmrc` · `engines` ใน `package.json` | Node version | ใช้ตามนั้น ถ้าไม่มีให้ใช้ Long Term Support (LTS) ล่าสุด — ตรวจล่าสุด 2026-10-14 · แหล่ง: https://nodejs.org/en/about/previous-releases : LTS คือ 24 และ 22 · 26 ยังเป็น Current ไม่ใช้ใน production จนกว่าหน้านี้จะขึ้นว่า LTS · ตัวถัดไปที่หมดอายุคือ 22 (2027-04-30 (รอยืนยัน)) · ก่อนใช้ให้ตรวจหน้านี้ซ้ำ · Node 26 น่าจะขึ้น LTS ช่วงปลาย ต.ค. 2569 (รอยืนยัน) ให้ตรวจบรรทัดนี้ใหม่ทันทีหลังวันนั้น |
| `"type"` ใน `package.json` · `tsconfig` `module` | ECMAScript Modules (ESM) หรือ CommonJS (CJS) | ตามของเดิม ห้ามผสม |
| `scripts` ใน `package.json` | คำสั่งจริงของ repo | ใช้ script ที่มีอยู่ก่อนจะเดาคำสั่งเอง |

```bash
npm ci                      # pnpm install --frozen-lockfile · yarn install --immutable
npx tsc --noEmit            # ตรวจ type ทั้งโปรเจกต์
npm run lint && npm test && npm run build 2>&1 | tail -40   # ดูแค่ท้ายผล
npx vitest run src/order/order.service.test.ts -t "คืนเงินเกินยอด"   # รัน test เดียว
```

- Angular ใช้ `ng test --include=src/app/order/**` และดูขนาด bundle ท้าย output ของ `ng build`
- `npm install <pkg>` จะเปลี่ยน lockfile จึงต้อง commit lockfile ในรอบเดียวกัน

## 2 · TypeScript แบบเข้ม

| ห้าม | ใช้แทน | เหตุผล |
|---|---|---|
| `any` | `unknown` แล้ว narrow ด้วย `typeof` · `in` · type guard | `any` ปิด compiler ทั้งสาย |
| `value!` เพื่อให้ error เงียบ | เช็ก `if (!value) throw …` หรือแก้ type ต้นทาง | `!` คือการโกหก compiler |
| `as Order` กับข้อมูลจากข้างนอก | parse ด้วย zod (หรือ library ที่ repo ใช้) | cast ไม่ได้ตรวจอะไรเลย |
| boolean หลายตัวบอกสถานะ | discriminated union | สถานะที่เป็นไปไม่ได้จะเขียนไม่ได้ |
| `const x: Config = {...}` จนเสีย literal | `satisfies Config` | ได้ทั้งตรวจ shape และ type แคบ |

- `tsconfig`: `"strict": true` · `noUncheckedIndexedAccess` · `noImplicitOverride` ถ้า repo เก่าปิด strict อยู่ ให้เปิดทีละ folder ไม่เปิดทั้ง repo ในงานเดียว
- จะใช้ `enum` หรือ union ของ string ให้ตามที่ repo ใช้ ส่วน repo ใหม่ใช้ `as const` + union (ไม่สร้าง code ตอน runtime)
- type ของ API ที่ frontend กับ backend ใช้ร่วมกันให้เก็บไว้ที่เดียว (shared package หรือ generate จาก OpenAPI)

```ts
const Order = z.object({ id: z.uuid(), totalSatang: z.number().int().nonnegative() });
type Order = z.infer<typeof Order>;

type PayResult =
  | { status: 'paid'; receiptId: string }
  | { status: 'failed'; reason: 'declined' | 'timeout' };
// switch (r.status) ครบทุกกรณี · default: const _never: never = r;
```

## 3 · Node backend (Express · Fastify · NestJS)

- **promise ห้ามลอย** ให้เปิด `@typescript-eslint/no-floating-promises` และ `no-misused-promises` แล้วทุก `async` ต้องถูก `await` หรือ `.catch` ที่ทำอะไรได้จริง
- Express 4 ไม่ส่ง error จาก `async` handler ต่อเอง จึงต้องใช้ Express 5 หรือห่อ handler ส่วน Fastify และ NestJS จัดการให้แล้ว
- **config ตรวจตอนเริ่ม** ให้ parse `process.env` ด้วย schema ครั้งเดียว ถ้าขาดหรือผิดก็ไม่ยอม start (รายละเอียดใน `config-and-secrets`)
- **ปิด server ให้เรียบร้อย**: รับ `SIGTERM` → หยุดรับ request ใหม่ → รอ request ที่ค้าง → ปิด DB pool และตั้งเวลาบังคับปิดไว้
- ไฟล์ใหญ่ให้ใช้ `stream.pipeline` จาก `node:stream/promises` ห้าม `readFile` ทั้งไฟล์เข้า memory
- ห้าม `fs.*Sync` · `crypto.*Sync` ที่หนัก · loop ใหญ่ ใน path ของ request เพราะ event loop จะค้างทั้ง server
- DB ต้อง query แบบ parameter (`$1` · `?`) หรือผ่าน ORM เสมอ ห้ามต่อ string เข้า SQL
- log แบบมีโครง (pino ใน Fastify · logger ที่ repo มี) ตาม `logging-standards` ไม่ใช้ `console.log` ใน server

```ts
const server = app.listen(port);
process.on('SIGTERM', () => {
  server.close(async () => { await db.end(); process.exit(0); });
  setTimeout(() => process.exit(1), 10_000).unref();
});
```

## 4 · Angular

ตัวล่าสุดคือ v22 (ออก 3 มิ.ย. 2026 · แหล่ง: https://angular.dev/reference/releases · ตรวจ 22 ต.ค. 2569): app ใหม่เป็น zoneless และ `OnPush` เป็นค่าเริ่มต้น ส่วน Signal Forms ใช้ใน production ได้แล้ว (3 ข้อหลังนี้ (รอยืนยัน) — หน้าแหล่งไม่ได้ระบุ ให้ตรวจ release notes ของ v22 ก่อนอ้าง)

| เรื่อง | ทำแบบนี้ | ไม่ทำ |
|---|---|---|
| component | standalone · `inject()` | สร้าง NgModule ใหม่ |
| state | `signal` · `computed` · `input()` · `output()` | `BehaviorSubject` สำหรับ state ใน component |
| change detection | `OnPush` (v22 เป็นค่าเริ่มต้น) | `Default`/`Eager` โดยไม่มีเหตุผล |
| template | `@if` · `@for (x of xs; track x.id)` · `@switch` | `*ngIf` · `*ngFor` (deprecated ตั้งแต่ v20) |
| form | Signal Forms (v22) ส่วน repo เดิมใช้ typed reactive forms | `UntypedFormGroup` |
| HTTP | `HttpClient` + functional interceptor (`withInterceptors`) | ใส่ header token ทีละที่ |
| subscription | `async` pipe · `toSignal` · `takeUntilDestroyed()` | `subscribe` แล้วไม่ยกเลิก |
| route | `loadComponent` · `loadChildren` แบบ lazy | import ทุกหน้าใน route หลัก |

- logic ใน template ให้ย้ายไป `computed` ให้ template มีแค่การแสดงผล และห้ามเรียก function หนักใน binding
- `DomSanitizer.bypassSecurityTrust*` ห้ามใช้กับข้อมูลที่ผู้ใช้ส่งมา ถ้าต้องใช้จริงให้คอมเมนต์ว่าทำไมปลอดภัย
- **repo เก่า (v14–19)** ให้เขียนตามแบบที่ repo ใช้อยู่ ใช้ของใหม่ได้เฉพาะที่ version นั้นรองรับ และไม่ migrate ทั้ง repo ในงาน feature ถ้าอยาก migrate ให้เสนอแยกงาน แล้วใช้ `ng generate @angular/core:control-flow` และ schematic อื่นของ Angular
- React หรือ Vite: เก็บ state ใน component ก่อน `useEffect` ต้องมี cleanup key ใน list เป็น id ไม่ใช่ index และ env ฝั่ง client ใช้ได้เฉพาะ `VITE_*` และถือว่าทุกคนเห็น
- repo React หรือ Next.js ที่ต้องไล่เรื่องความเร็ว (render ซ้ำ · bundle · data fetching แบบ waterfall) ให้ดึงกฎจาก Vercel `react-best-practices` มาอ่านสด ๆ ตอนทำ: https://github.com/vercel-labs/agent-skills/tree/main/skills/react-best-practices — เป็นลิงก์อย่างเดียว ไม่คัดกฎมาใส่ที่นี่ เพราะยังไม่ได้ตรวจ licence ของ repo นั้น (ตรวจ 23 ต.ค. 2569) · กฎที่ขัดกับข้อ 2 ของ skill นี้ (strict TS) ให้ยึดของเรา

```ts
export class OrderList {
  private orders = toSignal(inject(OrderApi).list(), { initialValue: [] });
  readonly unpaid = computed(() => this.orders().filter(o => o.status === 'unpaid'));
}
// <ul>@for (o of unpaid(); track o.id) { <li>{{ o.id }}</li> } @empty { <li>ไม่มีรายการค้างจ่าย</li> }</ul>
```

## 5 · กับดักที่เจอบ่อย

| กับดัก | อาการ | ทำแบบนี้ |
|---|---|---|
| เวลาและ time zone | วันที่ถอยไป 1 วัน ช่วง 00:00–06:59 เวลาไทย | เก็บและส่ง ISO 8601 แบบ UTC แล้วแสดงด้วย `Intl.DateTimeFormat('th-TH', { timeZone: 'Asia/Bangkok' })` ส่วนปี พ.ศ. ดู `i18n-and-locale` |
| เงิน | `0.1 + 0.2 !== 0.3` | เก็บเป็นสตางค์ (integer) ถ้าคิดภาษีหรือแปลงสกุลให้ใช้ decimal library ที่ repo ใช้ |
| `==` | `'0' == false` เป็นจริง | ใช้ `===` เสมอ และเปิด eslint `eqeqeq` |
| แก้ object ที่แชร์กัน | ค่าเปลี่ยนเองข้ามหน้า | สร้างใหม่ด้วย spread · `structuredClone` · `readonly` ใน type |
| memory leak | RAM โตเรื่อย ๆ | ยกเลิก subscription · `removeEventListener` · `clearInterval` และ cache ต้องมีเพดาน |
| import ก้อนใหญ่ | bundle บวมหลายร้อย KB | `import { debounce } from 'lodash-es'` ไม่ใช่ทั้ง lodash แล้วดู bundle หลัง build |
| เรียงชื่อไทย | สระหน้าเรียงผิด | ใช้ `new Intl.Collator('th').compare` ไม่ใช้ `localeCompare` เปล่า ๆ |
| `JSON.parse` ไม่มีตรวจ | crash ลึกในโค้ด | parse ด้วย schema ที่ขอบระบบ (ข้อ 2) |

## 6 · test

ใช้ framework ที่ repo มี · ตั้งค่า Vitest และ Angular พร้อมตัวอย่าง ดู [`testing-standards/references/per-stack.md`](../testing-standards/references/per-stack.md#node--typescript--vitest) ส่วนเบราว์เซอร์ดู `e2e-testing-patterns`

- HTTP API: `supertest` (Express · NestJS) · `fastify.inject()` (Fastify) ไม่ต้องเปิดพอร์ตจริง
- Angular ตั้งแต่ v21 CLI ใช้ Vitest เป็นค่าเริ่มต้น ไม่ใช่ Karma

- logic ใหม่หรือแก้ bug ให้เขียน test ที่แดงก่อน แล้วค่อยแก้ให้เขียว
- snapshot อย่างเดียวไม่นับเป็น test ต้องมี assert ค่าที่สำคัญ
- signal ใน test ให้อ่านค่าตรง ๆ `component.unpaid()` ไม่ต้องรอ `fakeAsync` ถ้าไม่มี async จริง

## 7 · ความปลอดภัยเฉพาะ stack

- **แพ็กเกจใหม่** ต้องตรวจก่อนลง: ชื่อสะกดถูก (typosquat) · ยอดดาวน์โหลด · ผู้ดูแล · วันที่ออกล่าสุด ส่วนชื่อ scope ภายในองค์กรต้องตั้ง registry ใน `.npmrc` กัน dependency confusion
- รัน `npm audit --omit=dev` ก่อนส่ง lockfile ต้อง commit และ CI ใช้ `npm ci`
- Cross-Site Scripting (XSS): ห้ามใช้ `innerHTML` · `[innerHTML]` · `dangerouslySetInnerHTML` กับข้อมูลผู้ใช้ ส่วน Angular escape ให้เองถ้าไม่ bypass
- login ด้วย cookie ต้องตั้ง cookie `HttpOnly` · `Secure` · `SameSite` + กัน Cross-Site Request Forgery (CSRF) (token หรือ `withXsrfConfiguration` ของ Angular)
- Cross-Origin Resource Sharing (CORS): ระบุ origin ทีละตัว ห้ามใช้ `*` คู่กับ `credentials`
- secret ห้ามอยู่ใน frontend เพราะทุกอย่างใน `environment.ts` และ `VITE_*` ถูก build เข้า bundle ให้ทุกคนอ่าน
- header ความปลอดภัยใช้ `helmet` (Express) · `@fastify/helmet` · NestJS ใช้ `helmet` ใน `main.ts`

## 8 · รายการตรวจก่อนส่ง

- [ ] `tsc --noEmit` 0 error
- [ ] lint 0 warning ในไฟล์ที่แก้
- [ ] test ทั้งชุดผ่าน และพฤติกรรมใหม่มี test ที่เคยแดงก่อนแก้
- [ ] ไม่มี `any` · `as` กับข้อมูลภายนอก · `!` ใหม่ใน diff
- [ ] ไม่มี promise ลอย และไม่มี subscription ที่ไม่ยกเลิก
- [ ] งาน frontend เทียบขนาด bundle ก่อนและหลังแล้ว ถ้าโตเกิน 20 KB (gzip) ให้บอกเหตุผลในรายงาน
- [ ] ถ้า lockfile เปลี่ยน ได้ตรวจแพ็กเกจใหม่ตามข้อ 7 แล้ว

## 9 · เชื่อมกับ skill อื่น

| ต้องการ | ใช้คู่กับ |
|---|---|
| โค้ดน้อยที่สุดที่ใช้ได้ | `lazy-coding` |
| ชื่อ · โครงไฟล์ · คอมเมนต์ | `readable-code` |
| ออกแบบ type และรูปข้อมูลก่อนเขียน | `principle-data-shape-first` |
| จับ error ที่ไหน · retry · timeout | `error-handling-patterns` |
| รูปแบบ log และ correlation id | `logging-standards` |
| สัดส่วนและการตั้งชื่อ test | `testing-standards` |
| test ผ่านเบราว์เซอร์ | `e2e-testing-patterns` |
| หน้าจอ · token สี · layout | `web-app-design` |
| ข้อบังคับความปลอดภัยทุก diff | `principle-secure-by-default` |
| env และ secret | `config-and-secrets` |
| วันที่ไทย · พ.ศ. · เรียงคำไทย | `i18n-and-locale` |
