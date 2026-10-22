# แม่แบบเอกสารภาพรวมสถาปัตยกรรม

ย้ายมาจาก agent `solution-architect` · เปิดเมื่อต้องเขียนเอกสารชนิดนี้จริง · ส่วนที่ไม่รู้ใส่ `(รอยืนยัน)`

## Standard Output: Polished Architecture Overview

```markdown
# Architecture: <System Name>

| | |
|--|--|
| **Document Type** | Architecture Overview |
| **Version** | 1.0 |
| **Status** | Draft |
| **Date** | YYYY-MM-DD |
| **Architect** | @name |
| **Related ADRs** | ADR-0001 (`docs/decisions/ADR-0001-database-choice.md`), ADR-0002 (`docs/decisions/ADR-0002-api-style.md`) |

---

## Table of Contents

1. [Context](#1-context)
2. [Quality Attributes](#2-quality-attributes)
3. [High-Level Architecture](#3-high-level-architecture)
4. [Components](#4-components)
5. [Data Flow](#5-data-flow)
6. [Tech Stack](#6-tech-stack)
7. [Cross-Cutting Concerns](#7-cross-cutting-concerns)
8. [Trade-offs](#8-trade-offs)

---

## 1. Context

> What problem does this solve? Why now?

## 2. Quality Attributes (Priority Order)

| Rank | Attribute | Target | Why |
|:----:|-----------|--------|-----|
| 1 | Performance | < 200ms p95 | Customer-facing |
| 2 | Security | PDPA compliant | Legal req |
| 3 | Scalability | 10k RPS | Growth plan |
| 4 | Cost | < $5k/month | Budget |

## 3. High-Level Architecture

_[รูปภาพรวมสถาปัตยกรรม: User → CDN → Load Balancer → API Gateway → Auth / App → Redis · PostgreSQL · Queue → Worker. วาดเป็นรูปสไตล์เดียวกับเอกสารด้วย skill `diagram-figures` ไม่ใช้ Mermaid]_

## 4. Components

| Component | Responsibility | Technology | Owner |
|-----------|----------------|------------|-------|
| API Gateway | Routing, rate-limit | Kong | Platform |
| Auth Service | JWT, OAuth | Node.js | Security |
| App Service | Business logic | Node.js + NestJS | App Team |
| Database | Persistence | PostgreSQL 16 | DBA |
| Cache | Session, hot data | Redis 7 | Platform |

## 5. Data Flow

_[รูปลำดับ Data Flow: User → API → App → DB แล้วตอบกลับ. วาดด้วย skill `diagram-figures`]_

## 6. Tech Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | React + Next.js (ใส่เวอร์ชันที่ใช้จริง) | SSR, ecosystem |
| Backend | Node.js + NestJS | Team expertise |
| Database | PostgreSQL 16 | ACID + JSON |
| Cache | Redis 7 | Standard |
| Infra | AWS (ECS Fargate) | Cost + ops simplicity |
| CI/CD | GitHub Actions | Already in use |

## 7. Cross-Cutting Concerns

| Concern | Approach |
|---------|----------|
| Authentication | JWT with refresh tokens |
| Logging | Structured JSON → CloudWatch |
| Monitoring | Prometheus + Grafana |
| Alerting | PagerDuty (P1), Slack (P2-P3) |
| Error Handling | Standard error envelope, Sentry |

## 8. Trade-offs

| Decision | Chose | Over | Reason |
|----------|-------|------|--------|
| Database | PostgreSQL | MongoDB | Strong consistency needed |
| Hosting | ECS Fargate | EKS | Lower ops burden |
| API Style | REST | GraphQL | Simpler caching, client maturity |

> **Known Limitations:** Single-region deployment limits availability to 99.9%. Multi-region planned for v2.

## References

- ADR-0001: Database choice (`docs/decisions/ADR-0001-database-choice.md`)
- ADR-0002: API style (`docs/decisions/ADR-0002-api-style.md`)
```
