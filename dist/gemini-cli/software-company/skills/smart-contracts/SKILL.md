---
name: smart-contracts
description: Use when building on a blockchain (Solidity or Solana contracts, audits, Foundry, DeFi, tokenomics).
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

## ลำดับตรวจความปลอดภัย 5 ขั้น — ทำตามลำดับ ไม่ข้ามไปขั้น 5 ก่อน

แนวคิดจาก Trail of Bits `secure-workflow-guide` (CC-BY-SA 4.0 — เขียนใหม่ด้วยคำเรา ไม่คัดข้อความ รายละเอียดคำสั่งดูที่ github.com/trailofbits/skills)

| ขั้น | ทำอะไร | ผ่านเมื่อ |
|---|---|---|
| 1 ของที่เครื่องหาเจอ | รัน Slither ทั้ง repo แล้วไล่ทุกข้อ: แก้ · หรือจดว่าแจ้งผิดพร้อมเหตุผล | รายงานว่าง หรือทุกข้อมีคำตัดสิน |
| 2 เฉพาะที่โปรเจกต์มี | สัญญาอัปเกรดได้ → ตรวจความเสี่ยง storage layout และ initializer · อ้างว่าเป็น ERC → ตรวจความตรงมาตรฐาน · รับ token ภายนอก → ตรวจพฤติกรรม token นั้น (fee-on-transfer · rebasing · ไม่คืนค่า bool) | รันเฉพาะข้อที่เข้าเงื่อนไข ข้ออื่นเขียนว่าไม่เกี่ยว |
| 3 ดูภาพรวมด้วยตา | วาด 3 ภาพจาก Slither printers: inheritance (หา shadowing) · สรุปฟังก์ชันกับ visibility · ใครเขียน state ตัวไหนได้ | ทุก state ที่สำคัญมีคนเขียนได้ตามที่ตั้งใจเท่านั้น |
| 4 เขียน invariant แล้วให้เครื่องพยายามทำลาย | จดคุณสมบัติที่ต้องจริงเสมอ (state machine · สิทธิ์ · เลขคณิตและความละเอียด · การเรียกออกนอก · มาตรฐาน) แล้วเขียนเป็น property test ให้ Echidna หรือ Medusa (fuzz) — ขั้นนี้สำคัญที่สุด | ทุก invariant มี test และ fuzz รันผ่านตามรอบที่กำหนด (ดู `references/smart-contract-testing.md`) |
| 5 สิ่งที่เครื่องมอไม่เห็น | อ่านเองเรื่อง ความลับบน chain (ต้อง commit-reveal ไหม) · front-running และ MEV (slippage · ลำดับ) · การสุ่มและลายเซ็น · oracle และ flash loan | ทุกหัวข้อมีบันทึกว่าเจอหรือไม่เกี่ยว |

ผลทั้ง 5 ขั้นเป็นหลักฐานของขั้น "Static analysis" และ "Manual review" ใน `/software-company:web3-design smart-contract-audit`

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

รวมจาก plugin `software-company-web3` (เดิมชื่อ solidity-security → `references/solidity-security.md` · smart-contract-testing → `references/smart-contract-testing.md` · defi-patterns → `references/defi-patterns.md` ไม่ใช่ skill แยกแล้ว) เข้า `software-company` ใน v2.0.0 โดยเนื้อหาเดิมยังอยู่ครบใน `references/`
