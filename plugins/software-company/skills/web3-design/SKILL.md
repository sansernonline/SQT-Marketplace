---
name: web3-design
description: Audit smart contracts or design tokenomics using the blockchain-engineer agent. Two modes — smart-contract-audit or tokenomics-design.
argument-hint: <smart-contract-audit | tokenomics-design> <details>
disable-model-invocation: true
---

Two modes. Read the first word of **$ARGUMENTS**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `smart-contract-audit` | Audit smart contracts using the blockchain-engineer agent. |
| `tokenomics-design` | Design tokenomics using blockchain-engineer agent. |

---

## Mode: `smart-contract-audit`

Use `blockchain-engineer` agent for: **$ARGUMENTS**

Workflow:
1. **Discovery:** contract scope, chain, value at stake, prior audits
2. **Apply `smart-contracts` skill** systematically
3. **Apply `smart-contracts` skill** if DeFi protocol
4. **Static analysis:** Slither, Mythril
5. **Test review:** apply `smart-contracts` skill
6. **Manual review:** access control, reentrancy, oracle, math
7. **Composability:** interaction with other protocols
8. **Centralization:** admin functions, multi-sig, timelock
9. **Produce polished audit report** using `polished-document-style` (from software-company)
10. **Hand-off:** fixes → `blockchain-engineer`, architecture → `blockchain-engineer`

---

## Mode: `tokenomics-design`

Use `blockchain-engineer` agent for: **$ARGUMENTS**

Workflow:
1. **Discovery:** token purpose, product context, jurisdiction
2. **Choose model:** supply, distribution, vesting
3. **Define utility:** beyond speculation (governance, fees, staking)
4. **Apply `smart-contracts` skill** if DeFi integration
5. **Design governance:** voting, delegation, quorum
6. **Plan launch phases:** community → token → governance handoff
7. **Regulatory review:** Howey test considerations
8. **Compare to references:** what similar projects did
9. **Produce polished tokenomics doc** using `polished-document-style` (from software-company)
10. **Hand-off:** implementation → `blockchain-engineer`, legal → external lawyers
