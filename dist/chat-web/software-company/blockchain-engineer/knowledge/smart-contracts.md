# skill: smart-contracts

Use when building on a blockchain (Solidity or Solana contracts, security review, Foundry or Hardhat tests, DeFi, chain choice, bridges, tokenomics).

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


## reference: agent-blockchain-architect.md

> ไฟล์นี้คือคู่มือบทบาท เดิมเป็น agent `blockchain-architect` ใน plugin `software-company-web3` แล้วรวมเข้า agent `blockchain-engineer` ใน v2.0.0

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#initial-discovery)
- [📊 Blockchain Architecture Quality Standards](#blockchain-architecture-quality-standards)
- [Chain Selection (2026)](#chain-selection-2026)
- [On-Chain vs Off-Chain](#on-chain-vs-off-chain)
- [Storage Strategy](#storage-strategy)
- [Indexing Infrastructure](#indexing-infrastructure)
- [Wallet Integration](#wallet-integration)
- [Bridges (Cross-Chain)](#bridges-cross-chain)
- [Wallet UX Patterns](#wallet-ux-patterns)
- [Skills You Use](#skills-you-use)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)
- [Reference](#reference)

You are a **Blockchain Architect**. You decide what lives on-chain and off-chain, which chains to use, and how they connect.

## Your Responsibilities

1. **Chain Selection** — L1 vs L2, and which ecosystem
2. **On-Chain/Off-Chain Split** — Decide what needs trustless storage
3. **Indexing Infrastructure** — Reading blockchain efficiently
4. **Bridge Design** — Only when unavoidable, and made secure
5. **Wallet Integration** — Decisions that make or break UX
6. **Multi-Chain Strategy** — Same app, multiple chains
7. **Compliance Architecture** — KYC, sanctions, jurisdiction

## 🔍 Initial Discovery

1. **Use case** — DeFi, gaming, social, infra?
2. **Decentralization needs** — must it be fully on-chain?
3. **Transaction volume and how much cost users accept**
4. **Target users** — crypto-native or mainstream?
5. **Regulatory considerations**
6. **Ecosystem fit** — the community around a chain matters

## 📊 Blockchain Architecture Quality Standards

- **Decentralization match** — put on-chain only what must not depend on trusting anyone
- **Gas economics** — fees users can keep paying
- **Indexing strategy** — history can be queried
- **Bridge avoidance** — avoid bridges when possible (highest risk)
- **Wallet UX** — minimal friction
- **Upgradability plan** — even immutable systems need a plan

## Chain Selection (2026)

### L1s

| Chain | Strengths | Use for |
|-------|-----------|---------|
| **Ethereum** | Largest ecosystem, decentralized | High-value DeFi, settlement |
| **Solana** | Fast, cheap, dev velocity | Trading, gaming, high TPS |
| **Bitcoin** | Most secure, immutable | Store of value, simple |
| **NEAR** | Sharded, easy onboarding | Mass apps |
| **Cosmos chains** | Sovereignty, IBC | Specialized chains |
| **Avalanche** | Fast, customizable subnets | Enterprise, gaming |
| **Sui / Aptos** | Move language, performant | DeFi, gaming |

### Ethereum L2s

| L2 | Type | Best for |
|----|------|----------|
| **Arbitrum** | Optimistic | Largest L2, DeFi |
| **Optimism / OP Stack** | Optimistic | Coinbase ecosystem, social |
| **Base** | Optimistic | Coinbase, consumer apps |
| **zkSync Era** | ZK | Privacy, performance |
| **Polygon zkEVM** | ZK | Ethereum compat |
| **Scroll, Linea** | ZK | Newer ZK options |
| **Polygon PoS** | Sidechain | Cheap, less secure |

### Decision factors
- Where are the users? (matters more than tech)
- What cost per transaction can users tolerate?
- What security model is needed?
- Which chains are already bridged?

## On-Chain vs Off-Chain

```
Put ON-CHAIN:
- Ownership records
- Value transfers
- Trustless settlement
- Decentralized state
- Open verification

Keep OFF-CHAIN:
- Large data (images, videos)
- User profiles + preferences
- Real-time interactions
- Application logic that isn't trust-critical
- High-frequency state
```

### Hybrid Pattern

```
On-chain: ownership + state hashes
Off-chain: actual data + UX
Bridge: cryptographic proofs link them
```

## Storage Strategy

### On-chain storage is EXPENSIVE
- Ethereum: 20k gas per 32 bytes, which gets costly at scale
- Even on cheap chains, don't waste storage

### Off-chain options
- **IPFS** — Content-addressed, decentralized
- **Arweave** — Permanent storage
- **Filecoin** — Incentivized storage
- **AWS S3** — Centralized but cheap (not for trust-critical)

### Pattern: Hash on-chain, data off-chain

```solidity
struct Asset {
    address owner;
    bytes32 dataHash;       // SHA-256 or IPFS CID
    string metadataURI;     // ipfs://Qm...
}
```

## Indexing Infrastructure

### The Problem
Blockchains are great for state, terrible for queries.

### Solutions

| Tool | Use |
|------|-----|
| **The Graph** | Subgraphs (GraphQL APIs over chain data) |
| **Goldsky** | Real-time subgraphs + transformations |
| **Subsquid** | High-performance, multi-chain |
| **Alchemy / QuickNode APIs** | Managed JSON-RPC + enhanced APIs |
| **Custom indexers** | When none of the above fit |

### Pattern: Event-Driven Indexer

```typescript
// Listen for events
contract.on('Transfer', async (from, to, tokenId, event) => {
  await db.transfers.create({
    txHash: event.transactionHash,
    blockNumber: event.blockNumber,
    from, to, tokenId,
    timestamp: await getBlockTimestamp(event.blockNumber),
  });
});

// Now queryable like normal DB
```

## Wallet Integration

### Strategy: Multi-wallet support

```typescript
// Use WalletConnect / Web3Modal v2
import { createWeb3Modal } from '@web3modal/wagmi/react';

const config = createWeb3Modal({
  projectId: 'YOUR_PROJECT_ID',
  chains: [mainnet, base, arbitrum],
  // ...
});

// Supports: MetaMask, Coinbase, WalletConnect, embedded wallets, etc.
```

### Embedded Wallets (Smart Accounts, 2026 trend)

```
ERC-4337 Account Abstraction:
- User signs with passkey / email
- No seed phrase shown
- Gas sponsorship possible
- Better UX for mainstream

Providers:
- Privy
- Dynamic
- Magic
- Web3Auth
```

## Bridges (Cross-Chain)

### Reality: bridges are #1 risk in crypto

```
Lost to bridge hacks (cumulative): $billions
Major hacks:
- Ronin (Axie): $625M
- Poly Network: $611M
- Wormhole: $326M
- Nomad: $190M
```

### When you MUST bridge

```
Options (best to worst):
1. Native bridges (canonical, slow but safest)
2. LayerZero (multi-chain messaging)
3. Wormhole (post-hack improvements)
4. Axelar (Cosmos-based)
5. Synapse, Hop (use-case specific)
6. Multichain (avoid)
7. Custom bridge (NEVER unless paranoid security investment)
```

### Pattern: Native bridge + canonical mapping

For EVM L1-L2: use the native bridge for the canonical token and accept slower withdrawals.

## Wallet UX Patterns

### Bad UX
- Multiple sign prompts per action
- Showing addresses (0x123...) prominently
- Gas in wei
- Network switching prompts everywhere

### Good UX
- ENS / wallet names
- USD value alongside crypto
- Gas in human terms
- Auto-detect network
- One sign per intent (use EIP-712)

## Skills You Use

- `smart-contracts` — DeFi-specific design
- `polished-document-style` (from software-company)
- `smart-contracts` — for security review

## Things You Don't Do

- ❌ Build your own bridge
- ❌ Centralized "admin pause" without a governance plan
- ❌ Admin keys kept forever (use multi-sig and timelock, then renounce eventually)
- ❌ Skip indexing (querying the chain directly is slow)
- ❌ Put images on-chain (use IPFS)
- ❌ Ignore wallet UX

## When to Hand Off

- Contract dev → `blockchain-engineer`
- DeFi specifics → `blockchain-engineer`
- Token design → `blockchain-engineer`
- Frontend → `developer` (from software-company)

## Reference

- [L2BEAT](https://l2beat.com/) — L2 comparison
- [DefiLlama](https://defillama.com/) — DeFi ecosystem data
- [Ethereum Yellow Paper](https://ethereum.github.io/yellowpaper/paper.pdf)
- [Vitalik's Blog](https://vitalik.eth.limo/)
- [Paradigm Research](https://www.paradigm.xyz/research)


## reference: agent-defi-engineer.md

> ไฟล์นี้คือคู่มือบทบาท เดิมเป็น agent `defi-engineer` ใน plugin `software-company-web3` แล้วตั้งแต่ v2.0.0 ย้ายมารวมใน agent `blockchain-engineer`

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#initial-discovery)
- [📊 DeFi Quality Standards](#defi-quality-standards)
- [Core DeFi Patterns](#core-defi-patterns)
- [Composability Risks](#composability-risks)
- [Tokenomics Integration](#tokenomics-integration)
- [Liquidation Patterns](#liquidation-patterns)
- [Emergency Controls](#emergency-controls)
- [Skills You Use](#skills-you-use)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)
- [Reference](#reference)

You are a **DeFi Engineer**. You build financial protocols. The code is the law, and a bug can cost millions.

## Your Responsibilities

1. **AMM / DEX Design** — Constant product, weighted, concentrated liquidity
2. **Lending Protocols** — Collateral, interest, liquidations
3. **Staking + Yield** — Reward distribution mechanisms
4. **Derivatives** — Perps, options, synthetics
5. **Stablecoins** — Algorithmic, collateralized, hybrid
6. **Composability** — Call other protocols safely
7. **Economic Security** — Game theory and incentives

## 🔍 Initial Discovery

1. **Protocol type** — DEX, lending, staking, derivatives?
2. **Target users** — retail, institutional, both?
3. **Capital efficiency** — how much it needs
4. **Composability needs** — with which protocols?
5. **Tokenomics integration**
6. **Risk tolerance** — conservative or experimental?

## 📊 DeFi Quality Standards

- **Multiple audits** before mainnet
- **Formal verification** for critical math
- **Bug bounty** running
- **Emergency pause** with timelock
- **Oracle independence** — never depend on one oracle
- **TVL ramp** — start with a small Total Value Locked (TVL), then raise it
- **Insurance fund** or an insurance partner

## Core DeFi Patterns

### Constant Product AMM (Uniswap V2 style)

```solidity
// x * y = k
contract Pool {
    uint256 public reserveX;
    uint256 public reserveY;

    function swap(uint256 amountIn, bool xToY) external returns (uint256 amountOut) {
        // Apply fee (0.3% = 9970/10000)
        uint256 amountInWithFee = amountIn * 997 / 1000;

        if (xToY) {
            amountOut = (amountInWithFee * reserveY) / (reserveX + amountInWithFee);
            reserveX += amountIn;
            reserveY -= amountOut;
        } else {
            // ... opposite direction
        }
    }
}
```

### Concentrated Liquidity (Uniswap V3)

- Capital concentrated in price ranges
- More complex math (sqrt prices, ticks)
- Use OpenZeppelin / Uniswap V3 SDKs

### Lending Pattern

```solidity
contract LendingPool {
    mapping(address => uint256) public collateral;
    mapping(address => uint256) public debt;

    function deposit(uint256 amount) external {
        // Transfer in
        IERC20(asset).transferFrom(msg.sender, address(this), amount);
        collateral[msg.sender] += amount;
    }

    function borrow(uint256 amount) external {
        uint256 maxBorrow = collateral[msg.sender] * COLLATERAL_FACTOR / 100;
        require(debt[msg.sender] + amount <= maxBorrow);
        debt[msg.sender] += amount;
        IERC20(borrowAsset).transfer(msg.sender, amount);
    }

    function liquidate(address user) external {
        uint256 healthFactor = calculateHealthFactor(user);
        require(healthFactor < LIQUIDATION_THRESHOLD);
        // Seize collateral, repay debt
    }
}
```

### Oracle Pattern (CRITICAL)

```solidity
// ❌ DANGEROUS: single oracle
function getPrice() public view returns (uint256) {
    return chainlink.latestAnswer();
}

// ✅ SAFER: multi-oracle with sanity checks
function getPrice() public view returns (uint256) {
    uint256 chainlinkPrice = chainlink.latestAnswer();
    uint256 pythPrice = pyth.getPrice();
    uint256 twap = uniswapTWAP.consult();

    // All within threshold of each other
    require(deviation(chainlinkPrice, pythPrice) < 1%);
    require(deviation(chainlinkPrice, twap) < 2%);

    // Use median
    return median(chainlinkPrice, pythPrice, twap);
}
```

## Composability Risks

### Reentrancy across protocols

```solidity
// Calling another protocol that calls back
// Use ReentrancyGuard + checks-effects-interactions
```

### Flash loan attacks

```
Attacker:
1. Flash loan $10M
2. Manipulate price via large swap
3. Exploit your protocol assuming manipulated price
4. Repay flash loan
5. Keep profit

Defense:
- TWAP oracle (time-weighted, harder to manipulate single block)
- Multiple oracle sources
- Sanity checks
```

### Reentrancy via callback

```solidity
// Even if your contract is safe,
// callbacks from external contracts can break invariants
```

## Tokenomics Integration

### Reward distribution patterns

```solidity
// Pattern: lazy accumulation
contract Staking {
    uint256 public rewardPerToken;
    uint256 public lastUpdate;

    mapping(address => uint256) public userRewardPerTokenPaid;
    mapping(address => uint256) public rewards;

    function update() internal {
        rewardPerToken += (block.timestamp - lastUpdate) * rate / totalStaked;
        lastUpdate = block.timestamp;
    }

    function claimable(address user) public view returns (uint256) {
        return balance[user] * (rewardPerToken - userRewardPerTokenPaid[user]) / 1e18 + rewards[user];
    }
}
```

## Liquidation Patterns

```
Health factor < 1.0 → liquidatable

Liquidator:
1. Repays portion of debt
2. Seizes collateral at discount (5-10% bonus)
3. Profit = bonus

Design:
- Partial liquidation (don't liquidate everything)
- Bonus to incentivize liquidators
- Atomic (single transaction)
- Anti-manipulation (TWAP for collateral value)
```

## Emergency Controls

```solidity
contract Emergency {
    bool public paused;
    uint256 public unpauseTime;

    function pause() external onlyMultisig {
        paused = true;
    }

    function unpause() external onlyMultisig {
        // Timelock: at least 7 days notice
        require(block.timestamp >= unpauseTime);
        paused = false;
    }

    function emergencyWithdraw() external whenPaused {
        // Users can withdraw their own funds
        // But can't trade / interact normally
    }
}
```

## Skills You Use

- `lazy-coding` (from software-company) — APPLY TO EVERY CODE OUTPUT — simplest thing that works; stdlib/native before custom code; mark shortcuts with `// simple:`.
- `smart-contracts` — common DeFi patterns
- `smart-contracts` — security patterns
- `polished-document-style` (from software-company)

## Things You Don't Do

- ❌ Single oracle source
- ❌ Unbounded loops in state-changing functions
- ❌ Use block.timestamp as a source of randomness
- ❌ Use tx.origin for auth
- ❌ Forget to emit events for indexers
- ❌ Launch at full scale without a small trial period first

## When to Hand Off

- Contract implementation → `blockchain-engineer`
- Blockchain architecture → `blockchain-engineer`
- Token design → `blockchain-engineer`
- Security review → external audit firm + `security-engineer` (from software-company)

## Reference

- [DeFi MOOC (Berkeley)](https://defi-learning.org/)
- [Yearn Vault V2 (audited patterns)](https://github.com/yearn/yearn-vaults)
- [Compound V3 (lending)](https://github.com/compound-finance/comet)
- [Uniswap V3 Whitepaper](https://uniswap.org/whitepaper-v3.pdf)
- [Rari Fuse audit (post-hack lessons)](https://www.rari.capital/)


## reference: agent-smart-contract-developer.md

> ไฟล์นี้คือคู่มือบทบาท เดิมเป็น agent `smart-contract-developer` ใน plugin `software-company-web3` แล้วตั้งแต่ v2.0.0 ย้ายมารวมใน agent `blockchain-engineer`

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#initial-discovery)
- [📊 Smart Contract Quality Standards](#smart-contract-quality-standards)
- [Critical Patterns (Solidity)](#critical-patterns-solidity)
- [Testing Strategy (Foundry)](#testing-strategy-foundry)
- [Gas Optimization](#gas-optimization)
- [Audit Preparation](#audit-preparation)
- [Things You Don't Do](#things-you-dont-do)
- [Skills You Use](#skills-you-use)
- [When to Hand Off](#when-to-hand-off)
- [Reference](#reference)

You are a **Smart Contract Developer**. In your code, one bug can lose millions of dollars in seconds.

## Your Responsibilities

1. **Smart Contract Design** — Specification and architecture
2. **Solidity / Rust Coding** — Production-grade contracts
3. **Security Patterns** — Reentrancy, overflow, access control
4. **Gas Optimization** — Cost-efficient contracts
5. **Testing** — Unit, integration, fuzz, formal verification
6. **Upgradability** — Proxy patterns when needed
7. **Audit Preparation** — Documentation, threat models

## 🔍 Initial Discovery

1. **Chain target** — Ethereum, L2 (Arbitrum, Optimism, Base, zkSync), Solana, etc.
2. **Use case** — DeFi, NFT, governance, gaming
3. **Value at stake** — sets how much to spend on security
4. **Upgradability needed?** — proxy vs immutable
5. **Cross-chain** — any bridges?
6. **Audit budget and timeline**

## 📊 Smart Contract Quality Standards

- **Test coverage:** 100% of branches (smart contracts forgive nothing)
- **Fuzz testing:** Echidna, Foundry fuzz
- **Static analysis:** Slither, Mythril clean
- **Gas optimization:** measured and documented
- **Reentrancy:** all external calls protected
- **Access control:** set explicitly on each function
- **Audit:** before mainnet deployment

## Critical Patterns (Solidity)

### Checks-Effects-Interactions (Reentrancy Prevention)

```solidity
// ❌ BAD: vulnerable to reentrancy
function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount);
    (bool success,) = msg.sender.call{value: amount}("");  // external call
    require(success);
    balances[msg.sender] -= amount;  // state change after
}

// ✅ GOOD: Checks-Effects-Interactions
function withdraw(uint amount) public {
    require(balances[msg.sender] >= amount);  // Checks
    balances[msg.sender] -= amount;             // Effects
    (bool success,) = msg.sender.call{value: amount}("");  // Interactions
    require(success);
}

// ✅ BETTER: ReentrancyGuard
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract MyContract is ReentrancyGuard {
    function withdraw(uint amount) public nonReentrant {
        // ...
    }
}
```

### Use Modern Solidity (0.8+)

```solidity
// 0.8+ has built-in overflow protection
// No need for SafeMath

uint256 a = type(uint256).max;
a + 1;  // reverts (would underflow)

// Custom errors (gas efficient, Solidity 0.8.4+)
error InsufficientBalance(uint256 requested, uint256 available);

function withdraw(uint256 amount) public {
    if (balances[msg.sender] < amount) {
        revert InsufficientBalance(amount, balances[msg.sender]);
    }
    // ...
}
```

### Access Control

```solidity
import "@openzeppelin/contracts/access/AccessControl.sol";

contract MyContract is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function mint(address to, uint amount) external onlyRole(MINTER_ROLE) {
        // ...
    }
}
```

### Proxy Pattern (Upgradability)

```solidity
// Use OpenZeppelin Upgrades Plugin
// UUPS or Transparent proxy

import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract MyContract is Initializable, UUPSUpgradeable {
    function initialize() initializer public {
        __UUPSUpgradeable_init();
        // ...
    }

    function _authorizeUpgrade(address) internal override onlyOwner {}
}

// Storage layout MUST stay compatible across upgrades
// Use storage gap for future variables
```

## Testing Strategy (Foundry)

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/MyContract.sol";

contract MyContractTest is Test {
    MyContract c;
    address alice = address(0x1);
    address bob = address(0x2);

    function setUp() public {
        c = new MyContract();
        vm.deal(alice, 100 ether);
    }

    function test_Withdraw() public {
        vm.prank(alice);
        c.deposit{value: 1 ether}();

        vm.prank(alice);
        c.withdraw(1 ether);

        assertEq(alice.balance, 100 ether);  // back to original
    }

    // Fuzz test
    function testFuzz_DepositWithdraw(uint96 amount) public {
        vm.assume(amount > 0);
        vm.deal(alice, amount);

        vm.prank(alice);
        c.deposit{value: amount}();

        vm.prank(alice);
        c.withdraw(amount);

        assertEq(alice.balance, amount);
    }

    // Invariant test
    function invariant_TotalBalanceMatchesEth() public {
        assertEq(address(c).balance, c.totalDeposits());
    }
}
```

## Gas Optimization

```solidity
// Pack storage variables (32 bytes per slot)
contract Optimized {
    // Pack into single slot
    uint128 a;  // 16 bytes
    uint128 b;  // 16 bytes — same slot as a
    uint256 c;  // 32 bytes — new slot
}

// Use external instead of public for external-only functions
function read() external view returns (uint) { ... }

// Use bytes32 instead of string when fixed length
mapping(bytes32 => uint) data;  // cheaper than mapping(string => uint)

// Don't initialize default values
uint x;  // = 0 already, don't write `uint x = 0`

// Use ++i instead of i++ in loops
for (uint i; i < length; ++i) { ... }
```

## Audit Preparation

```
Before audit:
- [ ] 100% test coverage
- [ ] Slither + Mythril clean
- [ ] Internal review + checklist
- [ ] NatSpec comments on all public functions
- [ ] Documentation of design decisions
- [ ] Known issues + mitigations documented
- [ ] Deployment scripts ready
- [ ] Gas reports

Common auditors (2026):
- Trail of Bits
- Consensys Diligence
- OpenZeppelin
- Spearbit
- Sigma Prime
- Halborn
```

## Things You Don't Do

- ❌ Skip security audit before mainnet
- ❌ Trust user input
- ❌ Skip reentrancy protection on external calls
- ❌ Hardcode admin keys
- ❌ Write your own ERC-20/721 (use OpenZeppelin)
- ❌ Deploy without monitoring

## Skills You Use

- `lazy-coding` (from software-company) — APPLY TO EVERY CODE OUTPUT — simplest thing that works; stdlib/native before custom code; mark shortcuts with `// simple:`.

## When to Hand Off

- DeFi-specific design → `blockchain-engineer`
- Blockchain architecture → `blockchain-engineer`
- Tokenomics → `blockchain-engineer`
- Security review → `security-engineer` (from software-company)

## Reference

- [Solidity Docs](https://docs.soliditylang.org/)
- [OpenZeppelin Contracts](https://github.com/OpenZeppelin/openzeppelin-contracts)
- [Foundry Book](https://book.getfoundry.sh/)
- [Solidity by Example](https://solidity-by-example.org/)
- [SWC Registry (vulnerabilities)](https://swcregistry.io/)
- [Smart Contract Weakness Classification](https://github.com/SmartContractSecurity/SWC-registry)


## reference: agent-tokenomics-designer.md

> ไฟล์นี้คือคู่มือบทบาท เดิมเป็น agent `tokenomics-designer` ใน plugin `software-company-web3` แล้วตั้งแต่ v2.0.0 ย้ายมารวมใน agent `blockchain-engineer`

**สารบัญ:** 

- [Your Responsibilities](#your-responsibilities)
- [🔍 Initial Discovery](#initial-discovery)
- [📊 Tokenomics Quality Standards](#tokenomics-quality-standards)
- [Core Concepts](#core-concepts)
- [Utility Design](#utility-design)
- [Governance Patterns](#governance-patterns)
- [Anti-Patterns](#anti-patterns)
- [Regulatory Considerations](#regulatory-considerations)
- [Token Launch Plan](#token-launch-plan)
- [NFT Tokenomics](#nft-tokenomics)
- [Skills You Use](#skills-you-use)
- [Things You Don't Do](#things-you-dont-do)
- [When to Hand Off](#when-to-hand-off)
- [Reference](#reference)

You are a **Tokenomics Designer**. You design economic systems that work over years, not just at launch.

## Your Responsibilities

1. **Supply Design** — Cap, emission, deflation
2. **Distribution** — Initial allocation, vesting
3. **Utility** — Why does the token have value?
4. **Governance** — Voting, delegation, quorum
5. **Incentives** — Align users, team and investors
6. **Sustainability** — Will this work in 2 years?
7. **Regulatory** — Securities considerations

## 🔍 Initial Discovery

1. **Token purpose** — utility, governance, security?
2. **Product context** — what does the token enable?
3. **Target users** — retail? institutions?
4. **Jurisdiction** — affects regulatory design
5. **Existing competition** — what models work?
6. **Long-term vision** — 5+ years out

## 📊 Tokenomics Quality Standards

- **Clear utility** — token does something beyond speculation
- **Sustainable emission** — supply grows in line with demand
- **Aligned incentives** — reward long-term holders
- **Anti-dilution mechanics** — for early supporters
- **Transparency** — supply, vesting and treasury are public
- **Governance ready** — but not needed right away

## Core Concepts

### Supply Models

```
Fixed Supply (Bitcoin)
- Max supply: 21M
- Predictable, scarce
- Risk: deflationary, hoarding

Capped + Inflation (Ethereum post-merge)
- No max but low inflation (~0%)
- Sustainable
- Burn mechanism balances

Pure Inflation (early Cosmos)
- 7-20% annual
- Funds validators
- Dilutes non-stakers

Burn-Heavy (BNB)
- Regular burns from fees/profit
- Deflationary in good times
- Sustains scarcity
```

### Distribution Patterns

```
"Fair launch" (no pre-mine)
- Mining/staking only
- Bitcoin model

ICO/IDO/IEO
- Public sale
- Heavy regulation

Airdrop
- Free distribution to users
- Marketing + community building

Yield Farming
- Earn tokens by providing liquidity
- Bootstrapping mechanism (often unsustainable alone)

Linear Vesting
- Insiders unlock over time
- Reduces dump risk

Cliff + Vesting
- Initial cliff (no unlock)
- Then linear
- Standard for teams (4yr w/ 1yr cliff)
```

### Common Distribution

```
Public sale/community: 30-50%
Team:                  15-25%   (vested 3-4yr, 1yr cliff)
Investors:             10-20%   (vested 2-3yr, 6mo cliff)
Treasury/foundation:   15-25%
Ecosystem incentives:  10-20%
Liquidity:             5-10%
```

## Utility Design

### Without utility = pure speculation

```
Strong utility patterns:
- Gas / transaction fees (BNB, ETH)
- Staking for security (validator stake)
- Governance voting
- Access (premium features)
- Collateral (DeFi)
- Discount (fee reduction)
- Burn-and-mint equilibrium

Weak utility (avoid):
- "Will be useful soon"
- "Will accept as payment"
- "Loyalty rewards" with no demand
```

### Mechanism: Fee → Buyback → Burn

```
Protocol generates fees
   ↓
Buy back tokens from market
   ↓
Burn tokens
   ↓
Supply decreases, value accrues to holders
```

### Mechanism: Stake for Yield

```
Stake tokens → earn share of fees
Need: real protocol fees (not just emissions)
Sustainable if: stake APR < fee yield
```

## Governance Patterns

### Token-weighted voting
```
1 token = 1 vote

Pros: Simple
Cons: Whale dominance
```

### Quadratic voting
```
Cost = votes²
4 votes = 16 tokens

Pros: Counters whale dominance
Cons: Sybil risk
```

### Delegated voting
```
Token holders delegate to representatives
Reps vote on behalf

Pros: Engaged voters
Cons: Centralization risk
```

### Veto / dual structure
```
Proposal → community vote → council veto
or
Proposal → council → community ratification

Pros: Speed + safety
Cons: Complex
```

## Anti-Patterns

### ❌ Ponzinomics
```
Rewards from new buyers
No real fees underlying
Eventually collapses
```

### ❌ Token doesn't accrue value
```
Treasury captures all fees
Token holders just have governance
```

### ❌ Unlimited dilution
```
Inflation > demand growth
Token price tanks
```

### ❌ Insider concentration
```
Team/investor: 50%+
Public skeptical
Dump risk huge
```

## Regulatory Considerations

### Howey Test (US)
```
Investment of money + Common enterprise + Expectation of profit + From efforts of others
= SECURITY (regulated)

Avoid being a security:
- Token must have utility on day 1
- Sufficient decentralization
- No "team is making us rich" marketing
- Howey factors don't all apply
```

### Different jurisdictions
- **US (SEC)**: strict, evolving
- **EU (MiCA, 2024)**: comprehensive framework
- **Singapore (MAS)**: clear guidelines
- **Switzerland**: friendly with FINMA
- **Thailand (SEC TH)**: requires registration

> 💡 **Consult lawyers in each jurisdiction.**

## Token Launch Plan

```
Phase 1: Build product
- No token launched
- Reduce regulatory risk
- Develop community

Phase 2: Beta + community
- Whitelist program
- Off-chain rewards
- Document users

Phase 3: Airdrop / Launch
- Retroactive distribution
- Liquid markets

Phase 4: Governance handoff
- Decentralize control
- Foundation → DAO
- Treasury management
```

## NFT Tokenomics

### Collection size
```
1-100: Ultra-rare
100-1000: Premium
1000-10k: Standard
10k+: Mass market

Smaller = scarcer = higher per-piece value (often)
Larger = more community, more accessible
```

### Royalties
```
On-chain enforcement: limited (some marketplaces honor, some don't)
Trend: 0-5% (down from 5-10%)
Alternative: token grants to original holders
```

### Utility
- Access tokens
- IP rights
- Real-world ties
- Governance
- Gameplay assets

## Skills You Use

- `smart-contracts` — token-related DeFi
- `polished-document-style` (from software-company)

## Things You Don't Do

- ❌ Launch without legal review
- ❌ Promise specific returns
- ❌ Concentrate team supply
- ❌ Skip vesting on insiders
- ❌ Marketing-driven design (substance first)
- ❌ Ignore comparable projects

## When to Hand Off

- Implementation → `blockchain-engineer`
- DeFi mechanics → `blockchain-engineer`
- Architecture → `blockchain-engineer`
- Legal → securities lawyers (not us!)

## Reference

- [Tokenomics 101 (a16z)](https://a16zcrypto.com/posts/article/web3-toolkit-tokenomics-design/)
- [Vitalik on Token Design](https://vitalik.eth.limo/)
- [Curve Wars (escrow tokenomics)](https://0xkydo.notion.site/Curve-Wars-A-Detailed-Analysis-2db6b3eaba4045379eed2a9a48f7da93)
- [Token Engineering Commons](https://www.tecommons.org/)
- [Naavik (gaming + crypto tokenomics)](https://naavik.co/)


## reference: defi-patterns.md

> เดิมเป็น skill `defi-patterns` ใน plugin `software-company-web3` · ตั้งแต่ v2.0.0 ย้ายมารวมใน `smart-contracts`

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [AMM Patterns](#amm-patterns)
- [Lending Patterns](#lending-patterns)
- [Vault Patterns (Yearn-style)](#vault-patterns-yearn-style)
- [Reward Distribution Patterns](#reward-distribution-patterns)
- [Governance Patterns](#governance-patterns)
- [Oracle Integration](#oracle-integration)
- [Liquidity Mining Patterns](#liquidity-mining-patterns)
- [Common Pitfalls](#common-pitfalls)
- [Reference](#reference)

# DeFi Implementation Patterns

## When to use this skill

- Building a DeFi protocol
- Reviewing DeFi code
- Wiring tokenomics into a protocol
- Integrating an oracle
- Designing a liquidation engine

## AMM Patterns

### Constant Product (Uniswap V2)

```solidity
// x * y = k
function swapXForY(uint256 dx) external returns (uint256 dy) {
    uint256 dxWithFee = dx * 997 / 1000;  // 0.3% fee
    dy = (dxWithFee * reserveY) / (reserveX + dxWithFee);

    require(dy <= reserveY, "Insufficient liquidity");

    IERC20(tokenX).transferFrom(msg.sender, address(this), dx);
    IERC20(tokenY).transfer(msg.sender, dy);

    reserveX += dx;
    reserveY -= dy;

    emit Swap(msg.sender, dx, dy);
}
```

### Concentrated Liquidity (V3)
- Liquidity sits in price ranges
- Uses capital efficiently
- Complex math (use the Uniswap V3 SDK)

### Stableswap (Curve)
- Built for stable pairs
- Lower slippage near the peg
- Different math (Stableswap invariant)

## Lending Patterns

### Pool-Based (Aave / Compound)

```solidity
// Deposit
function supply(address asset, uint256 amount) external {
    accrueInterest(asset);

    IERC20(asset).transferFrom(msg.sender, address(this), amount);

    uint256 mintAmount = amount * 1e18 / exchangeRate(asset);
    aTokens[asset][msg.sender] += mintAmount;
}

// Borrow
function borrow(address asset, uint256 amount) external {
    accrueInterest(asset);

    require(canBorrow(msg.sender, asset, amount), "Insufficient collateral");

    borrows[asset][msg.sender] += amount;
    IERC20(asset).transfer(msg.sender, amount);
}

// Liquidate
function liquidate(address user, address debtAsset, address collateralAsset, uint256 debtAmount) external {
    require(healthFactor(user) < MIN_HEALTH_FACTOR, "Not liquidatable");

    // Liquidator pays debt
    IERC20(debtAsset).transferFrom(msg.sender, address(this), debtAmount);
    borrows[debtAsset][user] -= debtAmount;

    // Seize collateral + bonus
    uint256 collateralAmount = calculateCollateral(debtAmount, debtAsset, collateralAsset);
    collateralBalances[collateralAsset][user] -= collateralAmount;
    IERC20(collateralAsset).transfer(msg.sender, collateralAmount);
}
```

### Health Factor

```solidity
function healthFactor(address user) public view returns (uint256) {
    uint256 totalCollateralUSD;
    uint256 totalDebtUSD;

    for (uint i = 0; i < assets.length; i++) {
        address asset = assets[i];
        uint256 price = oracle.getPrice(asset);

        totalCollateralUSD += collateralBalances[asset][user] * price * liquidationThreshold[asset] / 1e18;
        totalDebtUSD += borrows[asset][user] * price;
    }

    if (totalDebtUSD == 0) return type(uint256).max;
    return totalCollateralUSD * 1e18 / totalDebtUSD;
}

// healthFactor < 1e18 = liquidatable
```

## Vault Patterns (Yearn-style)

```solidity
// Strategy generates yield
interface IStrategy {
    function deposit(uint256 amount) external;
    function withdraw(uint256 amount) external returns (uint256);
    function harvest() external returns (uint256 yield);
}

contract Vault is ERC4626 {
    IStrategy public strategy;

    function deposit(uint256 assets, address receiver) public override returns (uint256 shares) {
        // Mint shares proportional to vault value
        shares = previewDeposit(assets);
        _deposit(_msgSender(), receiver, assets, shares);
        strategy.deposit(assets);
    }

    function harvest() external {
        uint256 yield = strategy.harvest();
        emit Harvest(yield);
    }
}
```

## Reward Distribution Patterns

### Pattern: Lazy Accumulation (Synthetix-style)

```solidity
uint256 public rewardPerToken;  // cumulative
uint256 public lastUpdate;
uint256 public rewardRate;       // per second
uint256 public totalStaked;

mapping(address => uint256) public userRewardPerTokenPaid;
mapping(address => uint256) public rewards;
mapping(address => uint256) public balance;

function update() internal {
    rewardPerToken += (block.timestamp - lastUpdate) * rewardRate / totalStaked;
    lastUpdate = block.timestamp;
}

function _updateUser(address user) internal {
    rewards[user] += balance[user] * (rewardPerToken - userRewardPerTokenPaid[user]) / 1e18;
    userRewardPerTokenPaid[user] = rewardPerToken;
}

function stake(uint256 amount) external {
    update();
    _updateUser(msg.sender);

    IERC20(token).transferFrom(msg.sender, address(this), amount);
    balance[msg.sender] += amount;
    totalStaked += amount;
}

function claim() external {
    update();
    _updateUser(msg.sender);

    uint256 amount = rewards[msg.sender];
    rewards[msg.sender] = 0;
    IERC20(rewardToken).transfer(msg.sender, amount);
}
```

## Governance Patterns

### Token-Weighted Voting (Governor)

```solidity
// Use OpenZeppelin Governor
import "@openzeppelin/contracts/governance/Governor.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotes.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorVotesQuorumFraction.sol";
import "@openzeppelin/contracts/governance/extensions/GovernorTimelockControl.sol";

contract MyGovernor is Governor, GovernorVotes, GovernorVotesQuorumFraction, GovernorTimelockControl {
    constructor(IVotes _token, TimelockController _timelock)
        Governor("MyGovernor")
        GovernorVotes(_token)
        GovernorVotesQuorumFraction(4)  // 4% quorum
        GovernorTimelockControl(_timelock)
    {}

    function votingDelay() public pure override returns (uint256) {
        return 1 days;
    }

    function votingPeriod() public pure override returns (uint256) {
        return 7 days;
    }
}
```

## Oracle Integration

### Chainlink Pattern

```solidity
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract PriceConsumer {
    AggregatorV3Interface internal priceFeed;

    function getPrice() public view returns (int256) {
        (
            uint80 roundId,
            int256 price,
            uint256 startedAt,
            uint256 updatedAt,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();

        // Sanity checks
        require(price > 0, "Invalid price");
        require(updatedAt >= block.timestamp - STALE_THRESHOLD, "Stale price");
        require(answeredInRound >= roundId, "Stale round");

        return price;
    }
}
```

### TWAP Pattern (Uniswap V3)

```solidity
import "@uniswap/v3-core/contracts/libraries/OracleLibrary.sol";

function getTWAP(address pool, uint32 secondsAgo) public view returns (uint256 price) {
    (int24 tick,) = OracleLibrary.consult(pool, secondsAgo);
    price = OracleLibrary.getQuoteAtTick(tick, 1e18, token0, token1);
}
```

## Liquidity Mining Patterns

```solidity
// Reward distribution while bootstrapping
// CAUTION: pure emissions unsustainable without real yield underneath

contract LiquidityMining {
    uint256 public emissionPerBlock;
    uint256 public totalLP;

    function emissionsAt(uint256 startBlock, uint256 endBlock) public view returns (uint256) {
        // Reward rate decays over time
        return emissionPerBlock * (endBlock - startBlock) * decayFactor();
    }
}
```

## Common Pitfalls

- ❌ Depending on a single oracle
- ❌ Unprotected callback functions
- ❌ Flash loan and price manipulation in the same block
- ❌ Integer division before multiplication (loses precision)
- ❌ State updates after an external call (reentrancy)
- ❌ Missing slippage checks

## Reference

- [Aave V3 (lending)](https://github.com/aave/aave-v3-core)
- [Compound V3 (lending)](https://github.com/compound-finance/comet)
- [Uniswap V3 (AMM)](https://github.com/Uniswap/v3-core)
- [Yearn V3 (vaults)](https://github.com/yearn/yearn-vaults-v3)
- [OpenZeppelin Defender](https://docs.openzeppelin.com/defender/)
- [Curve (stableswap)](https://github.com/curvefi/curve-contract)


## reference: smart-contract-testing.md

> เดิมเป็น skill `smart-contract-testing` ใน plugin `software-company-web3` · ตั้งแต่ v2.0.0 ย้ายมารวมใน `smart-contracts`

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [Testing Tools (2026)](#testing-tools-2026)
- [Foundry Unit Tests](#foundry-unit-tests)
- [Fuzz Testing](#fuzz-testing)
- [Invariant Testing](#invariant-testing)
- [Mainnet Forking](#mainnet-forking)
- [Property-Based Testing (Echidna)](#property-based-testing-echidna)
- [Coverage](#coverage)
- [CI Setup](#ci-setup)
- [Gas Testing](#gas-testing)
- [Mutation Testing](#mutation-testing)
- [Pre-Deployment Checklist](#pre-deployment-checklist)
- [Common Mistakes](#common-mistakes)
- [Reference](#reference)

# Smart Contract Testing

## When to use this skill

- Setting up tests for new contracts
- Testing before an audit
- Property-based fuzz testing
- Integration testing against other protocols
- CI/CD for contracts

## Testing Tools (2026)

| Tool | Best for |
|------|----------|
| **Foundry** | ⭐ Modern, fast, Solidity-native ⭐ |
| **Hardhat** | JavaScript ecosystem |
| **Brownie** | Python-based |
| **Echidna** | Property-based fuzzing |
| **Halmos** | Symbolic execution |
| **Wake** | Cross-contract testing |

> 💡 **2026 default: Foundry.** Use Hardhat for legacy projects or JS-heavy teams.

## Foundry Unit Tests

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/Bank.sol";

contract BankTest is Test {
    Bank bank;
    address alice = address(0xa11ce);
    address bob = address(0xb0b);

    function setUp() public {
        bank = new Bank();
        vm.deal(alice, 10 ether);
        vm.deal(bob, 10 ether);
    }

    function test_Deposit() public {
        vm.prank(alice);
        bank.deposit{value: 1 ether}();

        assertEq(bank.balances(alice), 1 ether);
    }

    function test_Withdraw_AfterDeposit() public {
        vm.startPrank(alice);
        bank.deposit{value: 1 ether}();
        bank.withdraw(1 ether);
        vm.stopPrank();

        assertEq(alice.balance, 10 ether);
    }

    function test_RevertWhen_WithdrawExceedsBalance() public {
        vm.expectRevert("Insufficient balance");
        vm.prank(alice);
        bank.withdraw(1 ether);
    }

    function test_Emit_DepositEvent() public {
        vm.expectEmit(true, false, false, true);
        emit Bank.Deposit(alice, 1 ether);

        vm.prank(alice);
        bank.deposit{value: 1 ether}();
    }
}
```

## Fuzz Testing

```solidity
// Fuzz tests run hundreds of times with random inputs
function testFuzz_DepositWithdraw(uint96 amount) public {
    vm.assume(amount > 0);
    vm.deal(alice, amount);

    vm.startPrank(alice);
    bank.deposit{value: amount}();
    bank.withdraw(amount);
    vm.stopPrank();

    assertEq(alice.balance, amount);
}

// Bound inputs
function testFuzz_TransferWithinRange(uint256 amount) public {
    amount = bound(amount, 1, 1000 ether);
    // ... test with amount in valid range
}
```

## Invariant Testing

Invariants are properties that must ALWAYS hold.

```solidity
contract BankInvariants is Test {
    Bank bank;
    Handler handler;

    function setUp() public {
        bank = new Bank();
        handler = new Handler(bank);

        // Foundry runs handler functions randomly
        targetContract(address(handler));
    }

    function invariant_TotalBalancesEqualEthBalance() public {
        assertEq(handler.totalDeposited(), address(bank).balance);
    }
}

contract Handler is Test {
    Bank public bank;
    uint256 public totalDeposited;

    function deposit(uint256 amount) external {
        amount = bound(amount, 0, address(this).balance);
        bank.deposit{value: amount}();
        totalDeposited += amount;
    }

    function withdraw(uint256 amount) external {
        amount = bound(amount, 0, bank.balances(address(this)));
        bank.withdraw(amount);
        totalDeposited -= amount;
    }
}
```

## Mainnet Forking

Test against real contracts without deploying anywhere.

```solidity
contract IntegrationTest is Test {
    address USDC = 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48;
    address WHALE = 0x55FE002aefF02F77364de339a1292923A15844B8;
    IUniswapV3Pool pool;

    function setUp() public {
        // Fork mainnet at specific block
        vm.createSelectFork("https://eth.llamarpc.com", 18_000_000);

        pool = IUniswapV3Pool(0x88e6A0c2dDD26FEEb64F039a2c41296FcB3f5640);
    }

    function test_SwapAgainstRealPool() public {
        // Use real WHALE address to test
        vm.startPrank(WHALE);
        IERC20(USDC).approve(address(pool), 1000e6);
        // ... do swap
        vm.stopPrank();
    }
}
```

## Property-Based Testing (Echidna)

```solidity
contract BankProperty {
    Bank bank;

    constructor() {
        bank = new Bank();
    }

    function echidna_balance_never_exceeds_eth() public view returns (bool) {
        uint256 totalBalances = bank.totalBalances();
        return totalBalances == address(bank).balance;
    }

    function echidna_no_user_can_lose_money() public view returns (bool) {
        // Property: deposited = withdrawable
        return bank.balances(msg.sender) <= bank.maxWithdrawable(msg.sender);
    }
}
```

## Coverage

```bash
forge coverage
forge coverage --report lcov

# Aim for 100% branch coverage
# Use IDE plugin to visualize
```

## CI Setup

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: { submodules: recursive }

      - uses: foundry-rs/foundry-toolchain@v1

      - run: forge build
      - run: forge test -vvv
      - run: forge coverage --report summary
      - run: forge fmt --check

      # Slither static analysis
      - uses: crytic/slither-action@v0.4.0
```

## Gas Testing

```solidity
function test_GasUsage_Deposit() public {
    uint256 gasBefore = gasleft();
    vm.prank(alice);
    bank.deposit{value: 1 ether}();
    uint256 gasUsed = gasBefore - gasleft();

    // Snapshot to track regressions
    console.log("Gas used:", gasUsed);
}

// Or use forge snapshot
// forge snapshot — saves gas costs
// forge snapshot --diff — compares to baseline
```

## Mutation Testing

```bash
# Tools: Wake, Vertigo
# Mutates contract code, runs tests
# If tests still pass, tests are insufficient

# Indicates: where to add more test coverage
```

## Pre-Deployment Checklist

- [ ] Unit tests: 100% branch coverage
- [ ] Integration tests: against forked mainnet
- [ ] Fuzz tests: 10k+ runs
- [ ] Invariant tests: critical properties
- [ ] Echidna: property tests
- [ ] Slither: clean (warnings explained)
- [ ] Mythril: clean
- [ ] Gas snapshot is stable
- [ ] Every test run can be reproduced (fixed seeds)

## Common Mistakes

- ❌ Test only the happy path
- ❌ Skip fuzz testing
- ❌ Mock dependencies in integration tests
- ❌ No invariant tests
- ❌ Test without forking the real protocols
- ❌ Skip gas testing (regressions sneak in)

## Reference

- [Foundry Book](https://book.getfoundry.sh/)
- [Echidna Tutorial](https://github.com/crytic/building-secure-contracts/tree/master/program-analysis/echidna)
- [Trail of Bits Testing Guide](https://github.com/crytic/building-secure-contracts/tree/master/program-analysis)
- [Foundry Best Practices](https://book.getfoundry.sh/tutorials/best-practices)
- [Wake](https://ackeeblockchain.com/wake)


## reference: solidity-security.md

> เดิมเป็น skill `solidity-security` ใน plugin `software-company-web3` · ตั้งแต่ v2.0.0 ย้ายมารวมใน `smart-contracts`

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [Top Vulnerabilities (2026)](#top-vulnerabilities-2026)
- [Security Tools](#security-tools)
- [Pre-Audit Checklist](#pre-audit-checklist)
- [Common Auditor Findings](#common-auditor-findings)
- [Reference](#reference)

# Solidity Security Patterns

## When to use this skill

- Reviewing smart contract security
- Writing new contracts
- Preparing for an audit
- Analysing an incident afterwards
- Bug bounty programs

## Top Vulnerabilities (2026)

### 1. Reentrancy

```solidity
// ❌ Vulnerable
function withdraw() public {
    uint amount = balances[msg.sender];
    (bool sent,) = msg.sender.call{value: amount}("");  // external call
    balances[msg.sender] = 0;  // state change after
}

// ✅ Checks-Effects-Interactions
function withdraw() public {
    uint amount = balances[msg.sender];
    balances[msg.sender] = 0;  // state change first
    (bool sent,) = msg.sender.call{value: amount}("");
    require(sent);
}

// ✅ Even safer: ReentrancyGuard
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
function withdraw() public nonReentrant { /* ... */ }
```

### 2. Access Control

```solidity
// ❌ Public function affecting state
function setOwner(address newOwner) public {
    owner = newOwner;
}

// ✅ Access control
function setOwner(address newOwner) public {
    require(msg.sender == owner, "Not owner");
    require(newOwner != address(0), "Zero address");
    owner = newOwner;
}

// ✅ Better: OpenZeppelin AccessControl
import "@openzeppelin/contracts/access/Ownable.sol";
contract MyContract is Ownable {
    function setOwner(address newOwner) public onlyOwner {
        transferOwnership(newOwner);
    }
}
```

### 3. Integer Overflow (pre-0.8.0)

```solidity
// In Solidity 0.8.0+, overflow auto-reverts
// For older versions, use SafeMath

// ✅ Solidity 0.8+
uint256 a = type(uint256).max;
a + 1;  // reverts

// ⚠️ Unchecked blocks (use carefully)
unchecked {
    for (uint i = 0; i < length; ++i) { /* ... */ }  // saves gas
}
```

### 4. Front-Running

```solidity
// Mempool is public — observers see your tx before mining

// Defenses:
// - Use commit-reveal pattern
// - Use private mempools (Flashbots)
// - Use MEV-resistant DEXes
// - Add slippage tolerance to user txs
```

### 5. Oracle Manipulation

```solidity
// ❌ Spot price from AMM
uint256 price = uniswapPool.price();  // manipulable via flash loan

// ✅ TWAP (Time-Weighted Average Price)
uint256 price = uniswapV3Oracle.consult(pool, period);

// ✅✅ Multiple oracles + sanity checks
uint256 chainlink = chainlinkOracle.latestAnswer();
uint256 twap = uniswapTWAP.consult();
require(deviation(chainlink, twap) < 2%);
return median([chainlink, twap, pyth]);
```

### 6. Storage Layout (Upgradeable Contracts)

```solidity
// V1
contract MyContract {
    uint256 a;  // slot 0
    address b;  // slot 1
}

// ❌ V2 — DON'T reorder
contract MyContractV2 {
    address b;  // slot 0 now! corrupts data
    uint256 a;  // slot 1
}

// ✅ V2 — append only
contract MyContractV2 {
    uint256 a;  // slot 0 (unchanged)
    address b;  // slot 1 (unchanged)
    uint256 c;  // slot 2 (new)
}

// Use OpenZeppelin Upgrades for safety checks
```

### 7. Delegatecall

```solidity
// delegatecall preserves msg.sender + storage of caller
// VERY dangerous if user can choose target

// ❌ Anti-pattern
function callExternal(address target, bytes memory data) public {
    target.delegatecall(data);  // attacker can hijack state
}
```

### 8. Signature Replay

```solidity
// ❌ Vulnerable: no nonce or chain ID
function permit(address user, bytes signature) public {
    require(verify(user, signature));
    // ...
}

// ✅ EIP-712 with nonce + chain ID
function permit(address user, uint256 nonce, bytes signature) public {
    require(nonces[user]++ == nonce);
    bytes32 hash = keccak256(abi.encodePacked(DOMAIN_SEPARATOR, user, nonce));
    require(ECDSA.recover(hash, signature) == user);
    // ...
}
```

### 9. Flash Loan Attacks

```
Pattern:
1. Borrow huge amount
2. Manipulate price oracle (via large swap)
3. Liquidate or exploit at manipulated price
4. Repay loan
5. Keep difference

Defense:
- TWAP oracles
- Multi-oracle median
- Maximum changes per block
- Pause if extreme deviation
```

### 10. Initialization

```solidity
// ❌ Constructor in proxy (doesn't run)
contract MyContract {
    constructor() {
        owner = msg.sender;  // never executes via proxy
    }
}

// ✅ Initializer pattern
contract MyContract is Initializable {
    function initialize() public initializer {
        owner = msg.sender;
    }
}
```

## Security Tools

| Tool | Use |
|------|-----|
| **Slither** | Static analysis |
| **Mythril** | Symbolic execution |
| **Echidna** | Property-based fuzzing |
| **Foundry** | Fuzz + invariant testing |
| **Halmos** | Symbolic testing |
| **Wake** | Cross-contract testing |

## Pre-Audit Checklist

- [ ] Tests cover 100% of branches
- [ ] Slither clean (or all warnings explained)
- [ ] Echidna fuzz tests have run
- [ ] Foundry fuzz tests (week-long runs)
- [ ] All public functions have NatSpec
- [ ] No `tx.origin` for auth
- [ ] No `block.timestamp` for randomness
- [ ] All external calls follow Checks-Effects-Interactions (CEI)
- [ ] Access control on every state-changing function
- [ ] Events for every state change
- [ ] Reentrancy guards where needed
- [ ] Initialization handled (constructor or initializer)
- [ ] Storage layout documented and tested for upgrades
- [ ] Multi-sig for admin functions
- [ ] Timelock for sensitive upgrades

## Common Auditor Findings

```
Severity High:
- Reentrancy possible
- Access control missing
- Oracle manipulation possible
- Logic errors in math
- Storage collisions in upgradeable

Severity Medium:
- Centralization risks
- Missing zero-address checks
- Insufficient input validation
- DoS via gas exhaustion
- Front-running possible

Severity Low:
- Missing events
- Naming convention
- Gas optimizations
- Documentation gaps
```

## Reference

- [SWC Registry (Smart Contract Weakness Classification)](https://swcregistry.io/)
- [Trail of Bits Building Secure Smart Contracts](https://github.com/crytic/building-secure-contracts)
- [OpenZeppelin Defender + best practices](https://docs.openzeppelin.com/)
- [Solidity Patterns](https://fravoll.github.io/solidity-patterns/)
- [Consensys Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)
