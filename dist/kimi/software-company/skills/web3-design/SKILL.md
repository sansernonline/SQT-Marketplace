---
name: "web3-design"
description: "Use when the user asks to audit smart contracts or design tokenomics (user command). Runs the blockchain-engineer agent."
disableModelInvocation: true
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
2. **Apply `smart-contracts` skill** across the contracts, DeFi parts (if any) and the test suite
3. **Static analysis:** Slither, Mythril — run as steps 1–3 of the 5-step order in `smart-contracts` SKILL.md (known issues → feature-specific checks → inheritance, visibility and who-writes-state graphs); every finding gets a verdict, not just a count
4. **Manual review:** access control, reentrancy, oracle, math — steps 4–5 of the same order: write the invariants first and let Echidna or Medusa try to break them, then read for what tools miss (on-chain secrets, front-running and MEV, randomness and signatures, oracle and flash-loan assumptions)
5. **Composability:** interaction with other protocols
6. **Centralization:** admin functions, multi-sig, timelock
7. **Produce polished audit report** using `polished-document-style` (from superuser)
8. **Hand-off:** fixes and architecture changes → `blockchain-engineer`

---

## Mode: `tokenomics-design`

Use `blockchain-engineer` agent for: **$ARGUMENTS**

Workflow:
1. **Discovery:** token purpose, product context, jurisdiction (where the issuer is, where buyers are) — it decides step 7
2. **Choose model:** supply, distribution, vesting
3. **Define utility:** beyond speculation (governance, fees, staking)
4. **Apply `smart-contracts` skill** if DeFi integration
5. **Design governance:** voting, delegation, quorum
6. **Plan launch phases:** community → token → governance handoff
7. **Regulatory review — per jurisdiction** (checked 22 Oct 2026 · confirm current rules on the regulator's site before launch):
   - **Thailand** → Securities and Exchange Commission, Thailand (SEC Thailand) rules under the Emergency Decree on Digital Asset Businesses B.E. 2561 (2018): offering a digital token to the public needs SEC approval and goes through an SEC-approved Initial Coin Offering (ICO) portal (sec.or.th → Digital Asset)
   - **United States** → Howey test (SEC v. W.J. Howey Co., 1946): is the token an investment contract, so a security?
   - **European Union** → Markets in Crypto-Assets Regulation (MiCA, Regulation (EU) 2023/1114): white paper and issuer rules
   - Other countries → note "not checked" and send to legal; never guess
8. **Compare to references:** what similar projects did
9. **Produce polished tokenomics doc** using `polished-document-style` (from superuser)
10. **Hand-off:** implementation → `blockchain-engineer`, legal → external lawyers
