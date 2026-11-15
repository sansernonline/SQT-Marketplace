"""
โครงผังโครงสร้างพื้นฐาน — diagrams + Graphviz
ติดตั้ง:  pip install diagrams   และ   graphviz (apt / choco / brew)
รัน:      python infra-diagram.py     →  ได้ infra-diagram.png ข้างไฟล์นี้
ทดสอบแล้วกับ diagrams 0.25.1 + Graphviz 2.42
"""
import subprocess
from diagrams import Diagram, Cluster, Edge
from diagrams.aws.compute import ECS
from diagrams.aws.database import RDS, ElastiCache
from diagrams.aws.network import ELB, Route53, CloudFront
from diagrams.aws.storage import S3
from diagrams.aws.management import Cloudwatch
from diagrams.onprem.client import Users


def pick_font(*names):
    """คืนฟอนต์ตัวแรกที่เครื่องนี้มีจริง — ฟอนต์ที่ไม่มีทำให้ภาษาไทยเพี้ยนแบบเงียบ ๆ"""
    try:
        have = subprocess.run(["fc-list", ":", "family"], capture_output=True,
                              text=True, timeout=10).stdout
    except Exception:
        return names[-1]
    for n in names:
        if n.lower() in have.lower():
            return n
    return names[-1]


# DejaVu Sans วางสระและวรรณยุกต์ไทยผิดตำแหน่ง — อย่าใช้กับข้อความไทย
FONT = pick_font("Noto Sans Thai", "TH Sarabun New", "Loma", "Tahoma", "DejaVu Sans")

# ธีมชุดเดียวกับ Mermaid ในข้อ 2 ของ SKILL.md
GRAPH = {"fontname": FONT, "fontsize": "16", "labelloc": "t", "bgcolor": "white",
         "pad": "0.5", "nodesep": "0.6", "ranksep": "1.0"}
NODE  = {"fontname": FONT, "fontsize": "11", "fontcolor": "#333B4A"}
EDGE  = {"fontname": FONT, "fontsize": "10", "color": "#8A93A3", "fontcolor": "#5C6675"}
BOX   = {"fontname": FONT, "fontsize": "11", "fontcolor": "#5C6675",
         "bgcolor": "#F8F9FC", "pencolor": "#C6CCD8", "style": "rounded", "margin": "18"}
FOCUS = dict(BOX, bgcolor="#EDF1FB", pencolor="#2A78D6")   # กลุ่มที่เอกสารนี้กำลังพูดถึง

with Diagram("Web Application on AWS", filename="infra-diagram", outformat="png",
             show=False, direction="LR",
             graph_attr=GRAPH, node_attr=NODE, edge_attr=EDGE):

    users = Users("ผู้ใช้ทั่วไป\nwww.yourApp.com")
    dns = Route53("Route 53")
    cdn = CloudFront("CloudFront\nmedia.yourApp.com")

    with Cluster("Region ap-southeast-1", graph_attr=BOX):
        lb = ELB("Application\nLoad Balancer")

        # หนึ่งกล่องต่อหนึ่งหน้าที่ จำนวนใส่ในป้าย — ไม่วาดกล่องเหมือนกันหลายใบ
        with Cluster("Auto Scaling Group  x2-6", graph_attr=FOCUS):
            web = ECS("Web / App\n(container)")

        with Cluster("Data tier", graph_attr=BOX):
            cache = ElastiCache("ElastiCache\nRedis")
            db = RDS("RDS PostgreSQL\nMulti-AZ")

        media = S3("S3\nstatic + uploads")
        logs = Cloudwatch("CloudWatch\nalarms")

    # ทุกเส้นมีป้าย และป้ายบอกว่าอะไรไหลผ่าน
    users >> Edge(label="HTTPS") >> dns >> lb >> web
    web >> Edge(label="session") >> cache
    web >> Edge(label="SQL") >> db
    web >> Edge(label="put object") >> media
    media >> Edge(label="origin") >> cdn
    db >> Edge(style="dashed", label="metric") >> logs
