---
name: llm-engineering
description: Use when a system calls a large language model (prompts, structured output, RAG with chunking, embeddings, vector search, re-ranking, evals, LLM-as-judge).
---

# llm-engineering

ทุกเรื่องของระบบที่เรียก Large Language Model (LLM): prompt · RAG (ค้นเอกสารมาประกอบคำตอบ) · การวัดคุณภาพ · บทบาทวิศวกร Machine Learning (ML) และ LLM

**เปิดเฉพาะไฟล์ที่ตรงกับงาน** ไม่ต้องอ่านทุกไฟล์ เพราะแต่ละไฟล์เป็นคู่มือเต็มของเรื่องนั้นอยู่แล้ว

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| designing or optimizing prompts for LLMs, building prompt templates, implementing few-shot learning, chain-of-thought reasoning, structured output, or improving prompts step by step. Production patterns with concrete examples | [`references/prompt-engineering-patterns.md`](references/prompt-engineering-patterns.md) |
| building LLM evaluation systems, designing eval sets, choosing eval metrics, implementing LLM-as-judge, running A/B tests, or measuring how LLM quality changes. Needed for any LLM app in production | [`references/llm-evaluation-patterns.md`](references/llm-evaluation-patterns.md) |
| designing Retrieval-Augmented Generation systems, choosing vector databases, designing chunking strategies, implementing hybrid search, evaluating retrieval quality, or scaling RAG. Production patterns from prototype to scale | [`references/rag-architecture.md`](references/rag-architecture.md) |

## คู่มือบทบาท

agent ที่ถูกเรียกมาทำงานสายนี้ให้เปิดไฟล์บทบาทของตัวเองก่อนเริ่ม

| บทบาท | อ่าน | agent |
|---|---|---|
| designing LLM-powered systems — choosing models, building RAG pipelines, designing agent systems, evaluation frameworks, multi-LLM routing, or large-scale LLM deployment. System design, not single prompts | [`references/agent-llm-architect.md`](references/agent-llm-architect.md) | `ai-engineer` |
| designing prompts for LLMs, optimizing existing prompts, building prompt chains, implementing structured output, designing evaluation suites, or improving LLM app quality step by step. Prompts for production use | [`references/agent-prompt-engineer.md`](references/agent-prompt-engineer.md) | `ai-engineer` |
| building machine learning models, training pipelines, feature engineering, model evaluation, hyperparameter tuning, or productionizing ML systems. Covers classical ML, deep learning, and the full model lifecycle | [`references/agent-ml-engineer.md`](references/agent-ml-engineer.md) | `ai-engineer` |
| productionizing ML models, building model serving infrastructure, implementing CI/CD for ML, setting up model monitoring, managing model registry, or scaling ML systems. Links ML engineering with production operations | [`references/agent-mlops-engineer.md`](references/agent-mlops-engineer.md) | `ai-engineer` |

## agent ของสายนี้

`ai-engineer` · `data-engineer`

## ที่มา

รวมจาก plugin `software-company-ai` (skill `prompt-engineering-patterns` · `llm-evaluation-patterns` · `rag-architecture`) เข้า `software-company` ใน v2.0.0 โดยเนื้อหาเดิมยังอยู่ครบใน `references/`
