# diagrams (Python) — node ที่ใช้บ่อย และกับดักที่เจอจริง

อ้างอิงของ skill `software-diagrams` ข้อ 3 · ทดสอบกับ **diagrams 0.25.1 + Graphviz 2.42**

---

## 1 · ผู้ให้บริการที่มีให้เลือก

`alibabacloud · aws · azure · c4 · custom · digitalocean · elastic · firebase · gcp ·
generic · gis · ibm · k8s · oci · onprem · openstack · outscale · programming · saas`

รายชื่อเต็มดูที่ [diagrams.mingrammer.com/docs/nodes](https://diagrams.mingrammer.com/docs/nodes/aws)
หรือถามตัวไลบรารีเองก็ได้:

```python
import importlib
m = importlib.import_module("diagrams.aws.database")
print([n for n in dir(m) if n[0].isupper()])
```

---

## 2 · node ที่ใช้บ่อยที่สุด

### AWS

| ใช้ทำอะไร | import |
|---|---|
| เครื่อง / คอนเทนเนอร์ | `from diagrams.aws.compute import EC2, ECS, EKS, Lambda, Fargate` |
| ฐานข้อมูล | `from diagrams.aws.database import RDS, Dynamodb, ElastiCache, Aurora` |
| เครือข่าย | `from diagrams.aws.network import ELB, ALB, Route53, CloudFront, VPC, APIGateway` |
| ที่เก็บไฟล์ | `from diagrams.aws.storage import S3, EFS` |
| คิว / เหตุการณ์ | `from diagrams.aws.integration import SQS, SNS, Eventbridge` |
| เฝ้าระวัง | `from diagrams.aws.management import Cloudwatch` |
| ตัวตน | `from diagrams.aws.security import IAM, Cognito, WAF` |

### Azure · Google Cloud Platform (GCP)

```python
from diagrams.azure.compute import AppServices, AKS, FunctionApps
from diagrams.azure.database import SQLDatabases, CosmosDb
from diagrams.azure.storage import BlobStorage
from diagrams.gcp.compute import GKE, Run, Functions
from diagrams.gcp.database import SQL, Firestore
from diagrams.gcp.storage import GCS
```

### Kubernetes

```python
from diagrams.k8s.compute import Pod, Deployment, StatefulSet, Job, Cronjob
from diagrams.k8s.network import Service, Ingress, NetworkPolicy
from diagrams.k8s.storage import PersistentVolume, PersistentVolumeClaim, StorageClass
```

### เครื่องของเราเอง (on-premises) — ใช้เมื่อไม่ได้อยู่บนคลาวด์

| ใช้ทำอะไร | import |
|---|---|
| ฐานข้อมูล | `from diagrams.onprem.database import PostgreSQL, MySQL, MSSQL, MongoDB` |
| แคช | `from diagrams.onprem.inmemory import Redis, Memcached` |
| คิว | `from diagrams.onprem.queue import RabbitMQ, Kafka, Celery` |
| คอนเทนเนอร์ | `from diagrams.onprem.container import Docker, K3S` |
| เครือข่าย | `from diagrams.onprem.network import Nginx, HAProxy, Internet, Consul` |
| เฝ้าระวัง | `from diagrams.onprem.monitoring import Grafana, Prometheus` |
| CI/CD | `from diagrams.onprem.ci import Jenkins, GithubActions, GitlabCI` |
| คน | `from diagrams.onprem.client import User, Users, Client` |

### ทั่วไป — เมื่อไม่มีโลโก้ที่ตรง

```python
from diagrams.generic.device import Mobile, Tablet
from diagrams.generic.network import Firewall, Router, Switch, VPN, Subnet
from diagrams.generic.os import Windows, Ubuntu, Android, IOS
from diagrams.generic.storage import Storage
```

### ไอคอนของเราเอง

```python
from diagrams.custom import Custom
sqt = Custom("Square Tech", "./icons/sqt-logo.png")   # ไฟล์ .png ขนาด ~256px
```

---

## 3 · ไวยากรณ์เชื่อมกล่อง

```python
a >> b                     # a ไป b
a << b                     # b ไป a
a - b                      # เส้นไม่มีหัวลูกศร
a >> Edge(label="SQL") >> b
a >> Edge(style="dashed", color="#C6CCD8") >> b
a >> [b, c, d]             # หนึ่งไปหลาย — ได้
```

```python
[a, b] >> [c, d]           # ❌ TypeError — list กับ list ต่อกันไม่ได้
for x in [a, b]:           # ✅ ถ้าจำเป็นต้องมีหลายกล่องจริง
    x >> c
```

> ทางที่ดีกว่าคือ**ยุบเป็นกล่องเดียวแล้วใส่จำนวนในป้าย** — `"Web Server x3"`
> กล่องเหมือนกันสามใบไม่ได้บอกอะไรเพิ่ม นอกจากทำให้เส้นพันกัน

---

## 4 · ตัวคุมหน้าตา

| ต้องการ | ใส่ตรงไหน |
|---|---|
| บนลงล่าง / ซ้ายไปขวา | `Diagram(..., direction="TB" หรือ "LR")` |
| ชื่อรูปอยู่บน | `graph_attr={"labelloc": "t"}` |
| ระยะห่างระหว่างชั้น | `graph_attr={"ranksep": "1.0"}` |
| ระยะห่างกล่องข้างกัน | `graph_attr={"nodesep": "0.6"}` |
| เส้นหักมุมฉาก | `graph_attr={"splines": "ortho"}` — สวยแต่ทับกล่องง่าย ลองทั้งสองแบบ |
| พื้นหลัง / เส้นขอบกลุ่ม | `Cluster(..., graph_attr={"bgcolor": ..., "pencolor": ...})` |
| ไฟล์ออกเป็น svg | `Diagram(..., outformat="svg")` |
| ไม่ให้เปิดไฟล์อัตโนมัติ | `Diagram(..., show=False)` |

---

## 5 · กับดัก

| อาการ | สาเหตุ · ทางแก้ |
|---|---|
| `TypeError: ... '>>': 'list' and 'list'` | ดูข้อ 3 |
| ภาษาไทยสระหาย วรรณยุกต์ผิดที่ | ฟอนต์ไม่รองรับไทย — ตั้ง `fontname` ทั้ง `graph_attr` `node_attr` `edge_attr` ให้ครบทั้งสามที่ |
| ตั้ง `fontname` แล้วยังไม่เปลี่ยน | ตั้งไม่ครบสามที่ · หรือฟอนต์ไม่มีในเครื่อง — `fc-list \| grep -i <ชื่อ>` |
| รันเงียบ ไม่มีไฟล์ | ไม่ได้ติดตั้ง Graphviz — `dot -V` |
| `ExecutableNotFound: dot` | เหมือนข้างบน · Windows ต้องเพิ่ม Graphviz ลงใน PATH ด้วย |
| รูปสูงยาวผิดปกติ | `direction="TB"` กับสายยาว — เปลี่ยนเป็น `"LR"` |
| ชื่อกลุ่มโดนเส้นทับ | เพิ่ม `ranksep` หรือสลับลำดับที่ประกาศกล่อง |
| กล่องอยู่ผิดกลุ่ม | กล่องอยู่ในกลุ่มที่ประกาศมันใน `with` เท่านั้น — ย้าย `with` ไม่ใช่ย้ายเส้น |
| ไฟล์ทับของเดิม | `filename=` ไม่ใส่นามสกุล และไฟล์เดิมจะถูกเขียนทับเงียบ ๆ |

---

## 6 · ตัวอย่างสั้น — ระบบบนเครื่องตัวเอง

```python
from diagrams import Diagram, Cluster, Edge
from diagrams.onprem.network import Nginx
from diagrams.onprem.container import Docker
from diagrams.onprem.database import PostgreSQL
from diagrams.onprem.inmemory import Redis
from diagrams.onprem.client import Users

with Diagram("ระบบหลังบ้าน", filename="onprem", show=False, direction="LR"):
    users = Users("พนักงาน")
    with Cluster("เครื่อง app-01"):
        web = Nginx("Nginx\nreverse proxy")
        api = Docker("API\n(container)")
    db = PostgreSQL("PostgreSQL 16")
    cache = Redis("Redis")

    users >> Edge(label="HTTPS") >> web >> Edge(label="proxy") >> api
    api >> Edge(label="SQL") >> db
    api >> Edge(label="session") >> cache
```

---

## ตัวย่อ

- **AWS** — Amazon Web Services
- **GCP** — Google Cloud Platform
- **CI/CD** — Continuous Integration / Continuous Delivery
- **PNG** — Portable Network Graphics
- **SVG** — Scalable Vector Graphics
