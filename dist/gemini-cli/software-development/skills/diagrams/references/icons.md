# Icon library — shared by the HTML skeleton and the SVG/Python engine

**205 icons are already provided in `assets/icons/`.** Nothing more to install.
They are PNG files with a transparent background at 160×160, official icons of providers and tools, split into 9 groups.

| Folder | Contents |
|---|---|
| `icons/aws/` | 39 — EC2 · RDS · S3 · Lambda · ELB · Route 53 · CloudFront · SQS · SNS · IAM · CloudWatch … |
| `icons/azure/` | 24 — VM · App Service · AKS · Cosmos DB · Blob Storage · Key Vault … |
| `icons/gcp/` | 21 — Compute Engine · GKE · Cloud Run · BigQuery · Pub/Sub · Firestore … |
| `icons/k8s/` | 16 — Pod · Deployment · Service · Ingress · ConfigMap · Secret · Node … |
| `icons/data/` | 17 — PostgreSQL · MySQL · MongoDB · Redis · Elasticsearch · ClickHouse … |
| `icons/queue/` | 6 — RabbitMQ · Kafka · Celery · NATS · ActiveMQ · EMQX |
| `icons/infra/` | 26 — Nginx · Docker · HAProxy · Traefik · Istio · firewall · router · Windows · Linux … |
| `icons/ops/` | 19 — Prometheus · Grafana · Jenkins · GitLab CI · GitHub Actions · Terraform · Vault … |
| `icons/app/` | 37 — Angular · React · .NET · Spring · Python · LINE · Slack · Stripe · user … |

The full list is in [`assets/icons/INDEX.md`](../assets/icons/INDEX.md). Open [`assets/icons/contact-sheet.html`](../assets/icons/contact-sheet.html) to see every icon on one page.

**If you need an icon that is not among these 205**, search the full library `assets/tech-icons.zip` (8,602 icons · 5 groups) with [`find-icon.py`](../assets/find-icon.py). It needs no installation and does not need the archive unpacked.

| Group | Contents |
|---|---|
| `cloud/` | 1,986 PNG · AWS · Azure · Google Cloud · IBM · Oracle · Alibaba · DigitalOcean · Firebase … |
| `platform/` | 471 PNG · databases · queues · CI/CD · monitoring · Kubernetes · programming languages · GIS |
| `brands/` | 3,461 single-colour SVG · brand logos + official colour codes in `colors.json` |
| `devtools/` | 572 coloured SVG · developer tool logos |
| `ui/` | 2,112 SVG general line icons (Lucide), not logos |

```bash
python assets/find-icon.py kafka redis                       # search by name
python assets/find-icon.py --group ui user                    # search one group only
python assets/find-icon.py --copy cloud/aws/compute/ec2.png brands/docker.svg --to docs/figures/icons
python assets/find-icon.py --colors docker                    # official logo colours
```

Pull out only the icons you use and put them next to the figure file. Do not unpack the whole library into the project. The library's licences are MIT · CC0 · ISC (see `--groups`), but logos remain trademarks of their owners.

> **About licences** — The architecture icon sets of AWS · Azure · Google Cloud
> are published specifically for drawing architecture diagrams, so they may be used in proposal documents.
> What you cannot do is use a logo in a way that suggests the provider endorses or partners with you,
> or use it as part of your own brand. If a tool has no official icon, draw a line icon yourself following [SKILL.md](diagram-figures.md) section 6.
