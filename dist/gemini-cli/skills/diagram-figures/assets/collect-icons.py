"""
คัดลอกไอคอนผู้ให้บริการของจริงมาไว้ข้างไฟล์ HTML — ของ skill `diagram-figures`

ไอคอนมาจากแพ็กเกจ `diagrams` ซึ่งรวมชุดไอคอนทางการของ AWS · Azure · Google Cloud ·
Kubernetes และเครื่องมือโอเพนซอร์สไว้แล้วกว่า 2,400 ไฟล์ (PNG 300x300 พื้นโปร่ง)

ติดตั้งครั้งเดียว:  pip install diagrams          (ไม่ต้องมี Graphviz ถ้าใช้แค่ไอคอน)
ใช้:               python collect-icons.py       แล้วดูโฟลเดอร์ icons/

เพิ่มไอคอนที่ต้องการในรายการ WANT ข้างล่าง — ชื่อซ้ายคือชื่อไฟล์ที่จะได้
ค้นหาไอคอนที่มี:   python collect-icons.py --find redis
"""
import os, shutil, sys, glob

WANT = {
    "route53":     "aws/network/route-53.png",
    "elb":         "aws/network/elastic-load-balancing.png",
    "cloudfront":  "aws/network/cloudfront.png",
    "ec2":         "aws/compute/ec2.png",
    "rds":         "aws/database/rds.png",
    "elasticache": "aws/database/elasticache.png",
    "dynamodb":    "aws/database/dynamodb.png",
    "s3":          "aws/storage/simple-storage-service-s3.png",
    "cloudwatch":  "aws/management/cloudwatch.png",
    "sns":         "aws/integration/simple-notification-service-sns.png",
    "ses":         "aws/engagement/simple-email-service-ses.png",
    "users":       "onprem/client/users.png",
}


def resources_dir():
    import diagrams
    here = os.path.dirname(diagrams.__file__)
    for cand in (os.path.join(here, "resources"),
                 os.path.join(os.path.dirname(here), "resources")):
        if os.path.isdir(cand):
            return cand
    raise SystemExit("หาโฟลเดอร์ resources ของ diagrams ไม่เจอ — ติดตั้ง `pip install diagrams` ก่อน")


def main():
    root = resources_dir()
    if "--find" in sys.argv:
        term = sys.argv[sys.argv.index("--find") + 1].lower()
        hits = [p[len(root) + 1:] for p in glob.glob(root + "/**/*.png", recursive=True)
                if term in os.path.basename(p).lower()]
        print("\n".join(sorted(hits)) or "ไม่พบ")
        return

    os.makedirs("icons", exist_ok=True)
    missing = []
    for name, rel in WANT.items():
        src = os.path.join(root, rel)
        if not os.path.exists(src):
            missing.append((name, rel)); continue
        shutil.copyfile(src, os.path.join("icons", name + ".png"))
    print(f"คัดลอกแล้ว {len(WANT) - len(missing)} ไอคอน ไปที่ icons/")
    for name, rel in missing:
        print(f"  ไม่พบ {name} ({rel}) — ใช้ --find หาชื่อที่ถูกต้อง")


main()
