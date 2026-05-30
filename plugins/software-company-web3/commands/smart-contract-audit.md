---
description: Audit smart contracts using smart-contract-developer + defi-engineer agents.
argument-hint: <contract or repo to audit>
---

Use `smart-contract-developer` agent for: **$ARGUMENTS**

Workflow:
1. **Discovery:** contract scope, chain, value at stake, prior audits
2. **Apply `solidity-security` skill** systematically
3. **Apply `defi-patterns` skill** if DeFi protocol
4. **Static analysis:** Slither, Mythril
5. **Test review:** apply `smart-contract-testing` skill
6. **Manual review:** access control, reentrancy, oracle, math
7. **Composability:** interaction with other protocols
8. **Centralization:** admin functions, multi-sig, timelock
9. **Produce polished audit report** using `polished-document-style` (from software-company)
10. **Hand-off:** fixes → `smart-contract-developer`, architecture → `blockchain-architect`
