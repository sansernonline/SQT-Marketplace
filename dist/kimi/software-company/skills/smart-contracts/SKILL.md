---
name: smart-contracts
description: Use when building on a blockchain (Solidity or Solana contracts, security review, Foundry or Hardhat tests, DeFi, chain choice, bridges, tokenomics).
---

# smart-contracts

งานบล็อกเชน — smart contract · ความปลอดภัย · ทดสอบ · DeFi · tokenomics

**เปิดเฉพาะไฟล์ที่ตรงกับงาน** ไม่ต้องอ่านทั้งหมด เพราะแต่ละไฟล์เป็นคู่มือเต็มของเรื่องนั้น

## หัวข้อ

| ใช้เมื่อ | อ่าน |
|---|---|
| reviewing or writing Solidity smart contracts for security — reentrancy, access control, integer issues, oracle manipulation, upgradability, common vulnerabilities | [`references/solidity-security.md`](references/solidity-security.md) |
| testing smart contracts — unit tests (Foundry/Hardhat), fuzz testing, invariant testing, mainnet forking, integration tests with other protocols | [`references/smart-contract-testing.md`](references/smart-contract-testing.md) |
| implementing DeFi protocols — AMMs, lending, vaults, oracle integration, liquidations, rewards distribution, governance. Common patterns from Uniswap/Compound/Aave/Yearn | [`references/defi-patterns.md`](references/defi-patterns.md) |

## คู่มือบทบาท

agent ที่ถูกเรียกมาทำงานสายนี้ให้เปิดไฟล์บทบาทของตัวเองก่อนเริ่ม

| บทบาท | อ่าน | agent |
|---|---|---|
| designing blockchain systems — chain selection, L1/L2 strategy, on-chain/off-chain split, bridges, indexing infrastructure, multi-chain considerations | [`references/agent-blockchain-architect.md`](references/agent-blockchain-architect.md) | `blockchain-engineer` |
| developing smart contracts on EVM chains (Solidity), Solana (Rust/Anchor), or other blockchains. Covers contract design, security patterns, testing, gas optimization, upgradability | [`references/agent-smart-contract-developer.md`](references/agent-smart-contract-developer.md) | `blockchain-engineer` |
| building DeFi protocols — DEX/AMM, lending, staking, yield farming, derivatives, stablecoins. Covers economic mechanism design and implementation patterns | [`references/agent-defi-engineer.md`](references/agent-defi-engineer.md) | `blockchain-engineer` |
| designing token economics — supply curves, distribution, vesting, utility, governance, sustainable incentives. Covers fungible (ERC-20) and NFT tokenomics | [`references/agent-tokenomics-designer.md`](references/agent-tokenomics-designer.md) | `blockchain-engineer` |

## agent ของสายนี้

`blockchain-engineer`

## ที่มา

รวมจาก plugin `software-company-web3` (skill `solidity-security` · `smart-contract-testing` · `defi-patterns`) เข้า `software-company` ใน v2.0.0 โดยเนื้อหาเดิมยังอยู่ครบใน `references/`
