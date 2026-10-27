# Prometheus และ Grafana — ใช้ให้ถูก

อยู่ใน `observability-basics` · หลักคิดเรื่องอะไรควรวัดและควรเตือนอยู่ใน `SKILL.md` ข้อ 2 · 4 · 5 ไฟล์นี้บอกวิธีทำใน Prometheus และ Grafana · ชื่อ metric และตัวเลขที่ติดป้าย `ตัวอย่าง` เป็นข้อมูลสมมุติ ต้องปรับให้ตรงกับระบบจริง

## สารบัญ

- [1 · metric 4 ชนิด](#1--metric-4-ชนิด)
- [2 · ชื่อและหน่วย](#2--ชื่อและหน่วย)
- [3 · label และ cardinality](#3--label-และ-cardinality)
- [4 · PromQL ที่ใช้บ่อย](#4--promql-ที่ใช้บ่อย)
- [5 · กฎ alert](#5--กฎ-alert)
- [6 · Grafana](#6--grafana)
- [7 · ตัวอย่างระบบ voice agent](#7--ตัวอย่างระบบ-voice-agent)
- [8 · ตรวจก่อนส่ง](#8--ตรวจก่อนส่ง)
- [9 · ที่มา](#9--ที่มา)

## 1 · metric 4 ชนิด

| ชนิด | คืออะไร | ใช้เมื่อ | ตัวอย่าง |
|---|---|---|---|
| counter | ค่าสะสม เพิ่มอย่างเดียว กลับเป็น 0 เมื่อ process เริ่มใหม่ | นับเหตุการณ์ที่เกิดแล้ว (คำขอ · error · งานที่เสร็จ) · อ่านด้วย `rate()` ไม่อ่านค่าดิบ | `http_requests_total` |
| gauge | ค่า ณ ขณะนั้น ขึ้นลงได้ | ของที่นับค้างอยู่หรือวัดได้ตอนนี้ (สายที่กำลังคุย · ความยาวคิว · หน่วยความจำ) | `voice_calls_active` |
| histogram | นับค่าที่วัดได้ลงช่วง (bucket) พร้อมผลรวมและจำนวน | ระยะเวลาหรือขนาดที่ต้องหา p95 · p99 และรวมข้ามหลาย instance ได้ | `http_request_duration_seconds` |
| summary | คำนวณ quantile ที่ฝั่งแอป ในช่วงเวลาเลื่อน | ใช้เมื่อไม่ต้องรวมข้าม instance เท่านั้น · quantile และช่วงเวลาเลือกตอนเขียนโค้ด เปลี่ยนทีหลังไม่ได้ | หายาก ปกติเลือก histogram |

- ห้ามเอา quantile จาก summary หลาย instance มาเฉลี่ยกัน ผลที่ได้ไม่มีความหมายทางสถิติ (เอกสาร Prometheus ใช้คำนี้)
- เอกสาร Prometheus แนะนำ native histogram ก่อน แต่ library ที่รองรับยังจำกัด ถ้า library ไม่รองรับให้ใช้ classic histogram แล้ววาง bucket ให้มีขอบอยู่ตรงค่า SLO ไม่งั้น p95 ที่ประมาณได้จะคลาด (ตัวอย่างในเอกสาร: p95 จริงราว 320 ms ประมาณได้ 443 ms เพราะ bucket กว้างตั้งแต่ 300 ถึง 450 ms)

## 2 · ชื่อและหน่วย

| กฎ | ถูก | ผิด |
|---|---|---|
| ขึ้นต้นด้วยคำเดียวบอกระบบ | `voice_stage_duration_seconds` | `stage_duration` |
| ใช้หน่วยพื้นฐาน: วินาที · byte · ratio 0 ถึง 1 | `_seconds` · `_bytes` · `_ratio` | `_milliseconds` · `_megabytes` · `_percent` |
| หน่วยเป็นรูปพหูพจน์ต่อท้าย | `node_memory_usage_bytes` | `node_memory_usage_byte` |
| counter ลงท้าย `_total` (ถ้ามีหน่วย หน่วยมาก่อน) | `process_cpu_seconds_total` · `http_requests_total` | `http_requests_count` |
| 1 ชื่อ 1 หน่วย 1 ความหมาย | วินาทีทั้งชื่อ | ครึ่งหนึ่งวินาทีครึ่งหนึ่งมิลลิวินาที |
| ไม่ใส่ชื่อ label ซ้ำในชื่อ metric | `http_requests_total{route=…}` | `http_requests_by_route_total` |

## 3 · label และ cardinality

ทุกชุดค่า label ที่ไม่ซ้ำกันคือ time series ใหม่ 1 เส้น เอกสาร Prometheus เตือนให้เลี่ยง label ที่ค่าไม่จำกัด เช่น user id หรืออีเมล

| ห้ามเป็น label | ให้ใช้แทน |
|---|---|
| `user_id` · `customer_id` · เบอร์โทร · อีเมล | ไม่ใส่เลย · เก็บใน log หรือ trace · ถ้าต้องนับรายคน ใช้ฐานข้อมูล ไม่ใช่ metric |
| `call_id` · `session_id` · `request_id` · `trace_id` | log และ trace ที่ผูกกับ id เดียวกัน (`logging-standards`) |
| URL เต็มที่มี id หรือ query string | แม่แบบเส้นทาง เช่น `/orders/{id}` |
| ข้อความ error ที่มีค่าแปรผัน | รหัส error ที่มีจำนวนจำกัด เช่น `reason="timeout"` |

- label ที่ใช้ได้ต้องนับค่าที่เป็นไปได้ทั้งหมดได้ล่วงหน้า (stage = 3 ค่า · status = 5 กลุ่ม) · จำนวน series ของ metric หนึ่งใกล้เคียงผลคูณของจำนวนค่าในแต่ละ label · histogram คูณจำนวน bucket เข้าไปอีก
- ตรวจว่า metric ไหนทำ series ระเบิด: เปิดหน้า TSDB status ใน Prometheus UI · เครื่องมือ `tsdb_stats` ของ `prometheus-mcp` ให้ข้อมูลทำนองเดียวกัน (ดู `mcp-server` ข้อ 1.1)

## 4 · PromQL ที่ใช้บ่อย

| ต้องการ | คำสั่ง | หมายเหตุ |
|---|---|---|
| คำขอต่อวินาที | `sum by (route) (rate(http_requests_total[5m]))` | ช่วง `[5m]` ควรยาวหลายเท่าของระยะ scrape (ยังไม่ได้ตรวจตัวเลขกับเอกสาร) |
| อัตรา error | `sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))` | นับ 5xx (เราผิด) แยกจาก 4xx · ตอนไม่มีทราฟฟิกผลหารเป็น NaN กฎ alert จะไม่ fire ซึ่งอาจซ่อนระบบที่ไม่มีคำขอเข้าเลย ให้เตือนเรื่องไม่มีคำขอแยกอีกกฎ |
| p95 ของ latency (classic histogram) | `histogram_quantile(0.95, sum by (le) (rate(http_request_duration_seconds_bucket[5m])))` | ต้องคง `le` ไว้ใน `sum by` · แยกตาม route ให้เติม `route` ใน `by` |
| p95 (native histogram) | `histogram_quantile(0.95, sum(rate(http_request_duration_seconds[5m])))` | ใช้เมื่อ library และ Prometheus รองรับ |
| ค่าเฉลี่ย latency (ประกอบเท่านั้น ห้ามใช้ตัดสิน) | `rate(http_request_duration_seconds_sum[5m]) / rate(http_request_duration_seconds_count[5m])` | ดู `SKILL.md` ข้อ 2 |
| disk จะเต็มใน 4 ชั่วโมง | `predict_linear(node_filesystem_avail_bytes[1h], 4*3600) < 0` | ตัวอย่างของ saturation ที่เตือนล่วงหน้า (ยังไม่ได้ตรวจกับเอกสาร PromQL) |

## 5 · กฎ alert

หลักจากเอกสาร Prometheus: เตือนจากอาการที่ผู้ใช้รู้สึก (latency · error) ที่จุดสูงในสแตกเท่าที่ทำได้ · ปลุกคนเรื่อง latency ที่จุดเดียวของสแตก · สาเหตุ (CPU · GPU · lag ของ consumer) ใส่ในแดชบอร์ดไว้ไล่หา ไม่ปลุกคน · ยกเว้นเรื่องที่ต้องมีคนลงมือก่อนระบบล่ม เช่นความจุ

ทุกกฎต้องมี 4 อย่าง

| อย่าง | ใส่ที่ไหน | เหตุผล |
|---|---|---|
| `for:` | ในกฎ | ไม่เตือนทันทีที่ค่าพุ่งครั้งเดียว · ถ้าไม่ใส่ กฎจะ fire ตั้งแต่รอบประเมินแรก |
| ระดับความรุนแรง | label `severity` (ชื่อและค่าเป็นธรรมเนียมที่ทีมตั้ง ไม่ใช่ข้อบังคับของ Prometheus) | ให้ Alertmanager ส่งต่อถูกที่ · ใช้ 3 ระดับตาม `SKILL.md` ข้อ 4: ปลุกคน · ดูในเวลางาน · บันทึกไว้ |
| ลิงก์ runbook | annotation `runbook_url` (ชื่อ key เป็นธรรมเนียม เอกสารบอกแค่ว่า annotation ใส่ลิงก์ runbook ได้) | ให้คนรับเริ่มจากขั้นตอน ไม่ใช่เริ่มจากศูนย์ตอนตี 3 |
| `summary` บอกอาการและผู้ที่กระทบ | annotation | อ่านจากโทรศัพท์แล้วรู้ว่าต้องทำอะไร |

ตัวอย่าง (เกณฑ์สมมุติ ต้องตั้งจาก SLO จริง):

```yaml
groups:
  - name: voice-agent-symptoms
    rules:
      - alert: VoiceTurnLatencyHigh
        expr: |
          histogram_quantile(0.95,
            sum by (le) (rate(voice_turn_duration_seconds_bucket[5m]))) > 1.5
        for: 10m
        labels:
          severity: page
        annotations:
          summary: "ผู้โทรรอคำตอบเกิน 1.5 วินาที (p95) นาน 10 นาที"
          runbook_url: https://runbooks.example.com/voice/turn-latency
```

`keep_firing_for` กันเตือนเด้งไปมาเมื่อค่าแกว่งรอบเกณฑ์ · แจ้งเตือนแบบ burn rate ดู `SKILL.md` ข้อ 4.1

## 6 · Grafana

| เรื่อง | ทำอย่างไร |
|---|---|
| 1 dashboard ต่อ 1 service | service ที่รับคำขอใช้ RED: Rate · Errors · Duration · ทรัพยากร (CPU · GPU · disk · connection pool) ใช้ USE: Utilization · Saturation · Errors · เอกสาร Grafana ว่า RED เป็นตัวแทนประสบการณ์ผู้ใช้ จึงตั้ง alert จาก RED ส่วน USE ใช้ไล่หาสาเหตุ |
| เก็บเป็นโค้ด | JSON ของ dashboard อยู่ใน git · เอกสาร Grafana ถือว่าไม่เก็บ JSON ใน version control เป็นสัญญาณว่าระบบยังไม่เป็นระเบียบ · เมื่อมีหลาย dashboard หน้าตาเหมือนกัน สร้างด้วย grafonnet (Jsonnet) หรือ grafanalib (Python) |
| โหลดอัตโนมัติ | ไฟล์ provider YAML ใน `provisioning/dashboards/` ชี้ `options.path` ไปโฟลเดอร์ JSON |
| ไม่ให้แก้ในเบราว์เซอร์แล้วหาย | ตั้ง `allowUiUpdates: false` · ใครอยากแก้ให้แก้ JSON ใน git แล้วเปิด PR · การโหลดจากไฟล์เขียนทับฉบับในฐานข้อมูลเสมอ |
| ไม่ copy dashboard | ใช้ template variable (เลือก service · environment) บน dashboard แม่ · เอกสาร Grafana เตือนว่าการ copy ทำให้ไม่ได้การแก้จากต้นฉบับ |
| dashboard ชั่วคราว | ตั้งชื่อขึ้นต้น `TEST:` แล้วลบเมื่อเสร็จ |
| uid | ตั้ง `uid` คงที่ใน JSON ให้ลิงก์จาก alert ไม่พัง · `uid` และ `title` ต้องไม่ซ้ำกันในโฟลเดอร์เดียวกัน |

ตัวอย่าง provider (ตรวจกับเอกสาร Grafana 2026-10-27):

```yaml
apiVersion: 1
providers:
  - name: services
    type: file
    allowUiUpdates: false
    updateIntervalSeconds: 30
    options:
      path: /var/lib/grafana/dashboards
      foldersFromFilesStructure: true
```

## 7 · ตัวอย่างระบบ voice agent

ชื่อ metric ในหัวข้อนี้ทีมตั้งเองทั้งหมด (ตัวอย่าง) ยกเว้น `DCGM_FI_DEV_GPU_UTIL` และ `kafka_consumergroup_lag*` ที่มาจาก exporter

**latency แต่ละช่วงของสาย** · 1 histogram แยกช่วงด้วย label `stage` ที่มีค่าจำกัด

```
voice_stage_duration_seconds_bucket{stage="stt|llm|tts", le="…"}
voice_turn_duration_seconds_bucket{le="…"}   # จากผู้โทรพูดจบถึงเสียงตอบแรกออก
```

- วาง bucket ให้ถี่ช่วง 0.1 ถึง 3 วินาที เช่น `0.1, 0.2, 0.3, 0.5, 0.8, 1.2, 1.5, 2, 3, 5` โดยมีขอบตรงเกณฑ์ที่ตั้ง (1.5 วินาทีในตัวอย่างข้อ 5)
- p95 แยกช่วง: `histogram_quantile(0.95, sum by (le, stage) (rate(voice_stage_duration_seconds_bucket[5m])))` · วางเป็นกราฟเดียว 3 เส้น เห็นทันทีว่าช่วงไหนกินเวลา
- เตือนที่ `voice_turn_duration_seconds` (อาการที่ผู้โทรรู้สึก) ไม่เตือนทุก stage · stage ไว้ไล่หาสาเหตุ
- ห้ามใส่ `call_id` หรือเบอร์ผู้โทรเป็น label · call id ลง log และ trace

**consumer lag ของ Kafka** · เมื่อ pipeline ส่งเหตุการณ์ของสายผ่าน Kafka

- ค่า lag มาจาก exporter ของ Kafka · `kafka_exporter` (danielqsj · Apache-2.0 · ไม่ใช่โครงการทางการของ Apache · ตรวจ 2026-10-27) ให้ `kafka_consumergroup_lag{consumergroup,topic,partition}` และ `kafka_consumergroup_lag_sum{consumergroup,topic}` · ถ้าใช้ exporter ตัวอื่น ชื่ออาจต่าง
- ปลุกคนเมื่อ lag ของ consumer ที่ทำให้ผู้โทรรอ (เช่นตัวสรุปสายแบบทันที) สูงและไม่ลดนาน · ตัวอย่าง `sum by (consumergroup, topic) (kafka_consumergroup_lag_sum) > 1000` ด้วย `for: 10m` (เกณฑ์สมมุติ) · lag ของงานรายงานหลังจบสายส่งแชตทีมพอ
- label `partition` ใช้เฉพาะกราฟเจาะลึก ไม่ใส่ในกฎ alert

**GPU utilization** · exporter คือ NVIDIA `dcgm-exporter`

- `DCGM_FI_DEV_GPU_UTIL` เป็น gauge หน่วย % (ตรวจจาก `etc/default-counters.csv` ของ repo 2026-10-27) · ชื่อนี้ exporter ตั้งมาเอง ไม่ตามกฎข้อ 2 ให้ใช้ตามเดิม
- GPU เป็นสาเหตุ (USE) ไม่ใช่อาการ · ใส่ในแดชบอร์ดคู่กับ latency ของ stage ที่ใช้ GPU (STT · TTS) · utilization สูงพร้อม p95 ของ stage นั้นสูง แปลว่าเครื่องอิ่มตัว ต้องเพิ่มเครื่องหรือลดโหลด
- GPU สูงต่อเนื่องหลายชั่วโมงเตือนเป็นระดับดูในเวลางาน ไม่ปลุกคน

## 8 · ตรวจก่อนส่ง

- [ ] ทุก metric มีหน่วยและ `_total` ตามกฎ · ไม่มี label ที่ค่าไม่จำกัด (user · เบอร์ · call id)
- [ ] latency เป็น histogram ที่มีขอบ bucket ตรงเกณฑ์ SLO · ไม่ใช้ค่าเฉลี่ยตัดสิน
- [ ] ทุก alert มี `for:` · `severity` · `runbook_url` · `summary` · เตือนจากอาการ ไม่ใช่ CPU หรือ GPU
- [ ] dashboard เป็น JSON ใน git · provision ด้วยไฟล์ · `allowUiUpdates: false`
- [ ] มี dashboard RED ต่อ service และ USE ต่อทรัพยากร

## 9 · ที่มา (ตรวจ 2026-10-27)

| เรื่อง | ที่มา |
|---|---|
| ชนิด metric | prometheus.io/docs/concepts/metric_types/ |
| ชื่อ หน่วย label cardinality | prometheus.io/docs/practices/naming/ |
| histogram · summary · `histogram_quantile` · native histogram | prometheus.io/docs/practices/histograms/ |
| หลักการ alert จากอาการ | prometheus.io/docs/practices/alerting/ |
| ไวยากรณ์กฎ `for` · `keep_firing_for` · annotations | prometheus.io/docs/prometheus/latest/configuration/alerting_rules/ |
| RED · USE · dashboard as code · sprawl | grafana.com/docs/grafana/latest/dashboards/build-dashboards/best-practices/ |
| provisioning dashboard | grafana.com/docs/grafana/latest/administration/provisioning/ |
| `DCGM_FI_DEV_GPU_UTIL` | github.com/NVIDIA/dcgm-exporter → etc/default-counters.csv |
| `kafka_consumergroup_lag` | github.com/danielqsj/kafka_exporter (ไม่ใช่ทางการของ Kafka) |
| `predict_linear` · ช่วง `[5m]` เทียบระยะ scrape · พฤติกรรม NaN เมื่อหารด้วย 0 | ความรู้ทั่วไปของทีม (ยังไม่ได้ตรวจกับหน้า PromQL ทางการ) |
