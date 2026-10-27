# MCP ทางการของเครื่องมือ DevOps และวิธีเปิดใช้อย่างปลอดภัย

อยู่ใน `mcp-server` ข้อ 1.1 · ตรวจ 2026-10-27 จากหน้า GitHub หรือเอกสารของผู้ทำเองทุกแถว ไม่ใช้เว็บรวบรวม · รุ่นที่เห็นเปลี่ยนเร็ว ก่อนล็อกรุ่นใน `.mcp.json` ให้เปิดหน้า releases ดูอีกครั้ง

## สารบัญ

- [1 · ตารางเต็ม](#1--ตารางเต็ม)
- [2 · รายละเอียดต่อตัว](#2--รายละเอียดต่อตัว)
- [3 · วิธีเปิดใช้ต่อโปรเจกต์](#3--วิธีเปิดใช้ต่อโปรเจกต์)
- [4 · ตัวอย่าง .mcp.json](#4--ตัวอย่าง-mcpjson)
- [5 · ตรวจก่อนเปิด](#5--ตรวจก่อนเปิด)
- [6 · ที่มา](#6--ที่มา)

## 1 · ตารางเต็ม

คำว่า "ทางการ" ในที่นี้คือ repo อยู่ใต้องค์กรของเจ้าของเครื่องมือ (หรือโครงการเอง) ไม่ได้แปลว่ารับประกัน · README ของ mcp-confluent ระบุว่า community-supported ตอบแบบ best effort ไม่มี SLA

| เครื่องมือ | MCP | ทำอะไรได้ | อ่านอย่างเดียวได้ไหม | รุ่นล่าสุดที่เห็น | ลิงก์ |
|---|---|---|---|---|---|
| Kafka | `@confluentinc/mcp-confluent` (confluentinc · MIT) | จัดการ topic · produce และ consume ข้อความ · ดู consumer group และ lag · Flink SQL · Schema Registry · Connectors (50+ tool) ใช้กับ Confluent Cloud · Confluent Platform · Kafka แบบ standalone | ไม่มีโหมด read-only ของตัวเอง · ใช้ `--allow-tools` เลือกเฉพาะ tool อ่าน (ข้อ 2) | v1.6.1 (2026-10-26) | github.com/confluentinc/mcp-confluent |
| Docker | Docker MCP Gateway ใน Docker MCP Toolkit (docker · MIT) | รัน MCP server ในคอนเทนเนอร์แยก ให้ client ต่อ endpoint เดียว · จัดกลุ่มเป็น profile · เก็บ secret ใน secrets store ของ Docker Desktop | ไม่มีโหมด read-only · ปิดเปิดรายตัวต่อ profile ด้วย `docker mcp profile tools <id> --enable/--disable <server>.<tool>` | tag v0.44.3 (repo ไม่มี GitHub Release) · Docker Desktop 4.62 ขึ้นไปตามเอกสาร (README ของ repo เขียน 4.59) | github.com/docker/mcp-gateway · docs.docker.com/ai/mcp-catalog-and-toolkit/toolkit/ |
| Jenkins | ปลั๊กอิน `mcp-server` (jenkinsci · MIT) | ดูและสั่ง job · build (trigger · cancel · rebuild · replay) · อ่าน build log · ผลทดสอบ · SCM · สถานะระบบ · สร้าง pipeline | ไม่มีโหมด read-only · มี tool เขียน (`triggerBuild` `cancelBuild` `replayBuild` `createPipeline` `updateBuild`) · คุมด้วยสิทธิ์ของ Jenkins user เจ้าของ API token (ยังไม่ได้ตรวจว่า tool ทุกตัวเช็คสิทธิ์) | 0.221.v42ee125fc488 (2026-10-26) | github.com/jenkinsci/mcp-server-plugin |
| Kubernetes + Helm | `containers/kubernetes-mcp-server` (Apache-2.0) | ทำกับ Kubernetes API ตรง ไม่ผ่าน kubectl · resource ทั่วไป · pod · log · event · Helm (`helm_install` `helm_list` `helm_uninstall`) อยู่ใน toolset `helm` ซึ่งปิดเป็นค่าเริ่มต้น | ได้ · `read_only = true` ในไฟล์ TOML เหลือเฉพาะ tool ที่มี `readOnlyHint` · `disable_destructive = true` ปิด tool ที่มี `destructiveHint` | v0.0.69 (2026-10-23) | github.com/containers/kubernetes-mcp-server |
| Prometheus | `prometheus/prometheus-mcp` (โครงการ Prometheus · Apache-2.0) | query แบบ instant และ range · metric · label · series · alert · rule · target · config · cardinality (`tsdb_stats`) · เอกสาร Prometheus · runbook ในตัว | tool ที่โหลดเป็นค่าเริ่มต้นเกือบทั้งหมดอ่านอย่างเดียว แต่มี `reload` และ `quit` (management API) · เลือกเฉพาะที่ต้องใช้ด้วย `--mcp.tools=<ชื่อ>` · tool ลบข้อมูล (`delete_series` `clean_tombstones` `snapshot`) ปิดอยู่ ต้องใส่ `--dangerous.enable-tsdb-admin-tools` จึงเปิด | v0.18.0 (2026-04-25) | github.com/prometheus/prometheus-mcp |
| Grafana (รวม Prometheus และ Loki ผ่าน Grafana) | `grafana/mcp-grafana` (Apache-2.0) | ค้นและสร้างและแก้ dashboard · query Prometheus (PromQL) และ Loki (LogQL) · alert rule · annotation · incident · OnCall | ได้ · `--disable-write` ตัด tool เขียน (tool SQL ดิบจะหายไปด้วย ต้องใส่ `--enable-query` ถ้าอยากเก็บ) | v2.1.1 (2026-10-20 · PyPI `mcp-grafana` 2.1.1) | github.com/grafana/mcp-grafana |

## 2 · รายละเอียดต่อตัว

**Kafka (`@confluentinc/mcp-confluent`)**
- ต้องใช้ Node.js 22.23.4 ขึ้นไป (ตามหน้า GitHub)
- tool อ่าน (ชื่อตามหน้า GitHub): `list-topics` · `get-topic-config` · `list-consumer-groups` · `describe-consumer-group` · `get-consumer-group-lag` · ตัวอย่าง `--allow-tools list-topics,get-topic-config,list-consumer-groups,describe-consumer-group,get-consumer-group-lag`
- `consume-messages` อ่านเนื้อข้อความจริง ซึ่งอาจมีข้อมูลส่วนบุคคล จึงไม่ใส่ในรายการเริ่มต้น · `produce-message` · `create-topics` · `delete-topics` · `alter-topic-config` เป็น tool เขียน ห้ามใส่
- `--allow-tools` ทำงานก่อน `--block-tools` · ถ้าไม่ใส่ทั้งคู่ tool ทุกตัวเปิด · `--list-tools` พิมพ์รายการที่เปิดแล้วออก ใช้ตรวจก่อนต่อ client
- ค่าลับ (API key ของ Kafka และ Schema Registry) อ้างด้วย `${KAFKA_API_KEY}` ในไฟล์ `config.yaml` · เส้นทางตั้งค่าด้วย environment variable ล้วนถูกประกาศว่า deprecated
- ถ้าใช้ HTTP หรือ SSE ห้ามใช้ `--disable-auth` นอกเครื่องพัฒนา และตั้ง `--allowed-hosts` กัน DNS rebinding

**Docker (MCP Gateway)**
- เป็นตัวกลางที่รัน MCP server อื่นในคอนเทนเนอร์ ไม่ใช่ MCP ที่จัดการ Docker engine โดยตรง · ถ้าอยากให้ agent สั่ง Docker ต้องเลือก server ตัวนั้นจาก Docker MCP Catalog เอง (ยังไม่ได้ตรวจว่ามี server ทางการสำหรับสั่ง Docker engine หรือไม่)
- คุมสิทธิ์: สร้าง profile เฉพาะงานแล้วเปิดเฉพาะ tool ที่ต้องใช้ ด้วย `docker mcp profile tools <profile-id> --enable <server>.<tool>` และ `--disable`
- เอกสาร Docker ว่าคำขอและคำตอบของ tool ที่มีข้อมูลลับ เช่น secret จะถูกบล็อก · server เริ่มต้นไม่เข้าถึงไฟล์ในเครื่อง เลือกเองว่า server ไหนได้ mount อะไร
- ใช้นอก Docker Desktop: ตั้ง `DOCKER_MCP_IN_CONTAINER=1` และ `docker mcp feature enable profiles` (ตามหน้า GitHub)
- secret เก็บใน secrets store ของ Docker Desktop (`docker mcp secret`) ไม่ใช่ environment variable

**Jenkins**
- endpoint หลังติดตั้งปลั๊กอิน: `<jenkins-url>/mcp-server/mcp` (Streamable HTTP · แนะนำ) · ยังมี `/sse` และ `/stateless`
- auth: HTTP Basic ด้วย API token ของผู้ใช้ Jenkins (Base64 ของ `username:token`) · ห้ามเขียนค่าที่เข้ารหัสแล้วลง `.mcp.json` ตรง ๆ ให้ใส่ผ่าน environment variable
- สร้าง user แยกสำหรับ agent ที่ได้สิทธิ์อ่านอย่างเดียวใน Jenkins ก่อนออก token · สิทธิ์ขั้นต่ำที่ tool แต่ละตัวต้องการยังไม่ได้ตรวจ ให้ทดลองกับ user นั้นว่า `triggerBuild` ถูกปฏิเสธจริง
- ตั้ง `proxy_read_timeout` ของ reverse proxy ให้พอสำหรับ tool ที่ใช้เวลานาน (README ยกตัวอย่าง `triggerBuild`)

**Kubernetes + Helm**
- `read_only` และ `disable_destructive` ตั้งในไฟล์ TOML (ส่งด้วย `--config <path>`) ไม่ใช่ flag ตรง ๆ · CLI ที่ README ระบุมี `--version` `--config` `--config-dir`
- toolset `helm` ปิดเป็นค่าเริ่มต้น · เปิดเฉพาะเมื่อมีเหตุผล และไม่ต่อกับ production โดยไม่มีคนอนุมัติ · `read_only = true` เหลือเฉพาะ tool ที่มี `readOnlyHint` ซึ่งตัด `helm_install` และ `helm_uninstall` (ยังไม่ได้ทดลองรันยืนยัน)
- README มีคู่มือสร้าง ServiceAccount แยกพร้อมสิทธิ์อ่านอย่างเดียว (`docs/getting-started-kubernetes.md`) · ใช้ kubeconfig ของ ServiceAccount นั้น ไม่ใช้ kubeconfig ส่วนตัวของ admin
- รองรับหลาย cluster ใน kubeconfig และ tool จะรับอาร์กิวเมนต์ `context` เมื่อเปิดหลาย cluster · ใส่เฉพาะ context ของ staging ใน kubeconfig ที่ให้ server

**Prometheus (`prometheus/prometheus-mcp`)**
- ชี้ไปที่ instance ด้วย environment variable `PROMETHEUS_MCP_PROMETHEUS_URL`
- ต่อ stdio เป็นค่าเริ่มต้น · HTTP ใช้ `--mcp.transport=http` ที่ path `/mcp`
- tool กลุ่ม core ที่โหลดเสมอ (`query` `range_query` `series` `label_names` `label_values` `metric_metadata` และเอกสารกับ runbook) อ่านอย่างเดียว · `reload` และ `quit` เรียก management API ของ Prometheus ซึ่งจะทำงานได้ก็ต่อเมื่อ Prometheus เปิด lifecycle API (ยังไม่ได้ตรวจ) · จึงให้โหลดเฉพาะที่ต้องใช้ด้วย `--mcp.tools`

**Grafana (`grafana/mcp-grafana`)**
- รัน: `uvx mcp-grafana` (แนะนำ) · Docker image `grafana/mcp-grafana` (ค่าเริ่มต้น SSE ใส่ `-t stdio` ถ้าต้องการ stdio) · binary
- auth: `GRAFANA_URL` กับ `GRAFANA_SERVICE_ACCOUNT_TOKEN` (หรือ `GRAFANA_SERVICE_ACCOUNT_TOKEN_FILE` ที่อ่านใหม่ทุกคำขอ) · `GRAFANA_API_KEY` ถูกประกาศ deprecated
- ให้ service account บทบาท Viewer ไม่ใช่ Editor · README บอกว่า Editor ให้สิทธิ์อ่านเขียนกว้าง ควรใช้เมื่อสะดวกมากกว่าความปลอดภัยเท่านั้น และ Viewer รวมสิทธิ์อ่านของ tool ปลั๊กอินอย่าง OnCall
- tool กลุ่ม Assistant เป็น tool เขียนและปิดเป็นค่าเริ่มต้น · `--disable-write` ข้ามให้อยู่แล้ว

## 3 · วิธีเปิดใช้ต่อโปรเจกต์

1. **ใส่ใน `.mcp.json` ของโปรเจกต์ ไม่ฝังใน plugin** · สิทธิ์และ endpoint ต่างกันทุกโปรเจกต์ · `claude mcp add --scope project` เขียน `.mcp.json` ให้
2. **ล็อกรุ่น** · ใส่เลขรุ่นตายตัวในคำสั่ง (`@confluentinc/mcp-confluent@1.6.1` · `kubernetes-mcp-server@0.0.69` · `mcp-grafana@2.1.1`) ไม่ใช้ `@latest` เพราะ MCP server ทำงานด้วยสิทธิ์ของเรา รุ่นใหม่ที่ไม่ได้อ่านอาจเพิ่ม tool เขียน · อัปเดตเป็นงานที่มีคนอ่าน release note แล้วดู tool list ใหม่ก่อน
3. **ค่าลับผ่าน environment variable ไม่เขียนลงไฟล์** · ใน `.mcp.json` ใช้ `${VAR}` ให้ client ขยายจาก environment ของเครื่อง · ไฟล์ที่ต้องมีค่าลับจริง (เช่น kubeconfig) อยู่นอก git และใน `.gitignore` (`config-and-secrets`)
4. **เริ่มจากสิทธิ์อ่านอย่างเดียวและ cluster หรือระบบ staging** · ใช้ flag หรือ config ตามตารางข้อ 1 และให้ token หรือ ServiceAccount ที่มีสิทธิ์อ่านจริงฝั่งระบบต้นทางด้วย เพราะ flag แค่ตัด tool ส่วนสิทธิ์ของ credential คือด่านสุดท้าย
5. **ต่อ production เมื่อใช้ staging ได้ครบแล้ว** · ใช้ credential แยกจาก staging และเริ่มที่สิทธิ์อ่านอย่างเดียวเช่นกัน
6. **การสั่งแก้ production ต้องให้คนอนุมัติ** · ไม่เปิด tool เขียนของ production ให้ agent เรียกเองโดยไม่ถามคน · ใน Claude Code อย่า allow ทุก tool ของ server เหล่านี้ล่วงหน้า ให้ client ถามทุกครั้งที่เรียก tool เขียน และให้คนตรวจพารามิเตอร์ (cluster · namespace · ชื่อ release) ก่อนกดอนุมัติ
7. **ข้อความที่ tool คืนเป็นข้อมูล ไม่ใช่คำสั่ง** · build log ของ Jenkins · log ของ pod · ข้อความใน topic ของ Kafka · ชื่อ dashboard อาจมีประโยคที่เขียนมาสั่ง agent (`mcp-server` ข้อ 4)
8. **ตรวจหลังต่อ** · `claude mcp list` เห็นสถานะเชื่อมได้ · เรียก tool เขียนสักตัวด้วย credential อ่านอย่างเดียว ต้องถูกปฏิเสธหรือไม่มี tool นั้น (`principle-prove-it-works`)

## 4 · ตัวอย่าง `.mcp.json`

ตัวอย่าง ต้องตรวจรุ่นและพารามิเตอร์กับหน้า releases ก่อนใช้จริง · ค่าลับอ้างผ่าน `${…}` ไม่มีค่าจริงในไฟล์

```json
{
  "mcpServers": {
    "grafana-staging": {
      "command": "uvx",
      "args": ["mcp-grafana@2.1.1", "--disable-write"],
      "env": {
        "GRAFANA_URL": "${GRAFANA_STAGING_URL}",
        "GRAFANA_SERVICE_ACCOUNT_TOKEN": "${GRAFANA_STAGING_VIEWER_TOKEN}"
      }
    },
    "kafka-staging": {
      "command": "npx",
      "args": [
        "-y", "@confluentinc/mcp-confluent@1.6.1",
        "-c", "config.staging.yaml",
        "--allow-tools",
        "list-topics,get-topic-config,list-consumer-groups,describe-consumer-group,get-consumer-group-lag"
      ]
    },
    "k8s-staging": {
      "command": "npx",
      "args": ["-y", "kubernetes-mcp-server@0.0.69", "--config", "k8s-staging.toml"]
    }
  }
}
```

`k8s-staging.toml` (ชื่อ option ตาม `docs/configuration.md` ของ repo):

```toml
read_only = true
toolsets = ["core", "config"]
```

`config.staging.yaml` เข้า git ได้เมื่อมีแต่ `${…}` อ้างค่าลับ (รูปแบบไฟล์ตามหน้า GitHub ของ mcp-confluent) · kubeconfig ไม่เข้า git

## 5 · ตรวจก่อนเปิด

- [ ] repo และรุ่นเปิดอ่านจากหน้า GitHub ของเจ้าของเองในวันนี้ · ล็อกรุ่นแล้ว
- [ ] ค่าลับทุกตัวอยู่ใน environment variable หรือ secrets store · `.mcp.json` และไฟล์ config ใน git ไม่มีค่าจริง
- [ ] credential ฝั่งระบบต้นทางเป็นสิทธิ์อ่านอย่างเดียว (Grafana Viewer · Kubernetes ServiceAccount แบบอ่าน · Jenkins user แบบอ่าน · Kafka ACL แบบอ่าน)
- [ ] เปิดเฉพาะ tool ที่ใช้ · ตรวจรายการ tool ที่โหลดจริงแล้ว
- [ ] เริ่มที่ staging · production ต้องให้คนอนุมัติทุกการสั่งแก้

## 6 · ที่มา (ตรวจ 2026-10-27)

| เรื่อง | ที่มา |
|---|---|
| mcp-confluent · flag · tool · รุ่น · MIT | github.com/confluentinc/mcp-confluent (README · releases) · `npm view @confluentinc/mcp-confluent version` ได้ 1.6.1 |
| Docker MCP Gateway · profile · เปิดปิด tool · secrets · MIT | github.com/docker/mcp-gateway (README · tags) · docs.docker.com/ai/mcp-catalog-and-toolkit/toolkit/ |
| Jenkins mcp-server · tool · endpoint · auth · รุ่น | github.com/jenkinsci/mcp-server-plugin (README · releases) |
| kubernetes-mcp-server · `read_only` · `disable_destructive` · toolset | github.com/containers/kubernetes-mcp-server (README · `docs/configuration.md` · releases) |
| prometheus-mcp · tool · `--mcp.tools` · `--dangerous.enable-tsdb-admin-tools` · รุ่น | github.com/prometheus/prometheus-mcp (README · releases) |
| mcp-grafana · `--disable-write` · auth · บทบาท service account · รุ่น | github.com/grafana/mcp-grafana (README · releases) · PyPI `mcp-grafana` 2.1.1 |
| ยังไม่ได้ตรวจ | สิทธิ์ Jenkins ขั้นต่ำของแต่ละ tool · มี MCP ทางการสำหรับสั่ง Docker engine หรือไม่ · Prometheus เปิด lifecycle API เองหรือไม่ · `read_only` ของ Kubernetes ตัด Helm จริงเมื่อรัน |
