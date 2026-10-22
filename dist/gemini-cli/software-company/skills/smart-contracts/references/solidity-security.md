> เดิมเป็น skill `solidity-security` ใน plugin `software-company-web3` · ตั้งแต่ v2.0.0 ย้ายมารวมใน `smart-contracts`

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [Top Vulnerabilities (2026)](#top-vulnerabilities-2026)
- [Security Tools](#security-tools)
- [Pre-Audit Checklist](#pre-audit-checklist)
- [Common Auditor Findings](#common-auditor-findings)
- [Reference](#reference)

# Solidity Security Patterns

> Code here targets Solidity 0.8.24+ and OpenZeppelin Contracts **5.x** (compile-checked with 5.6.1 · ตรวจ 22 ต.ค. 2569). In 5.x `security/` is gone (`ReentrancyGuard`, `Pausable` → `utils/`), `Ownable` takes an `initialOwner`, upgradeable contracts use ERC-7201 namespaced storage instead of `__gap` — ที่มา [OpenZeppelin Contracts 5.0 changelog](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/CHANGELOG.md#500-2023-10-05)

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

// ✅ Even safer: ReentrancyGuard (OpenZeppelin 5.x path)
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Bank is ReentrancyGuard {
    function withdraw() public nonReentrant { /* CEI as above */ }
}
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

// ✅ Better: OpenZeppelin Ownable (5.x needs the first owner in the constructor)
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
contract MyContract is Ownable {
    constructor(address initialOwner) Ownable(initialOwner) {}
    // transferOwnership(newOwner) is already public + onlyOwner + rejects address(0)
}
// Many roles → AccessControl · two-step hand-over → Ownable2Step
```

### 3. Integer Overflow (pre-0.8.0)

```solidity
// In Solidity 0.8.0+, overflow auto-reverts
// For older versions, use SafeMath

// ✅ Solidity 0.8+
uint256 a = type(uint256).max;
a + 1;  // reverts

// ⚠️ Unchecked blocks (use carefully) — wrap only the counter, never the loop body
for (uint256 i = 0; i < length;) {
    /* body stays checked */
    unchecked { ++i; }
}
// Solidity 0.8.22+ already skips the overflow check on `++i` in a simple
// `for (...; i < length; ++i)` loop, so on 0.8.22+ the plain form is enough
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
```

✅ Use the patterns in [`defi-patterns.md`](defi-patterns.md) · Oracle Integration (one copy, kept up to date):

- Chainlink `latestRoundData()` with `price > 0` and a staleness check on `updatedAt` — never `latestAnswer()` (deprecated, no timestamp)
- Time-Weighted Average Price (TWAP) from Uniswap V3 for a second opinion
- several sources → reject if they disagree by more than a set percentage → use the median

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

// Use OpenZeppelin Upgrades plugins for layout checks
// OpenZeppelin 5.x upgradeable contracts keep their state in ERC-7201
// namespaced storage, so your own variables don't collide with theirs
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

// ✅ EIP-712 typed data: domain (name, version, chainId, this contract)
//    + type hash + nonce + deadline, bound to the exact action
import {EIP712} from "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import {ECDSA} from "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import {Nonces} from "@openzeppelin/contracts/utils/Nonces.sol";

contract Vault is EIP712, Nonces {
    bytes32 private constant WITHDRAW_TYPEHASH = keccak256(
        "Withdraw(address user,address to,uint256 amount,uint256 nonce,uint256 deadline)"
    );

    error Expired();
    error BadSignature();

    constructor() EIP712("Vault", "1") {}

    function withdrawWithSig(
        address user, address to, uint256 amount, uint256 deadline, bytes calldata signature
    ) external {
        if (block.timestamp > deadline) revert Expired();
        bytes32 structHash = keccak256(
            abi.encode(WITHDRAW_TYPEHASH, user, to, amount, _useNonce(user), deadline)
        );
        // digest = keccak256("\x19\x01" ‖ domainSeparator ‖ structHash)
        bytes32 digest = _hashTypedDataV4(structHash);
        if (ECDSA.recover(digest, signature) != user) revert BadSignature();
        // ... withdraw `amount` of `user` to `to`
    }
}
// Smart-contract wallets (ERC-1271) → SignatureChecker.isValidSignatureNow instead of ECDSA.recover
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

// ✅ Initializer pattern (OpenZeppelin 5.x upgradeable)
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract MyContract is Initializable, OwnableUpgradeable {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();  // nobody can initialize the implementation itself
    }

    function initialize(address initialOwner) public initializer {
        __Ownable_init(initialOwner);  // pass the owner explicitly; deploy + initialize in one tx
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

- [EEA EthTrust Security Levels](https://entethalliance.org/specs/ethtrust-sl/) — maintained checklist (the old SWC Registry is no longer maintained; use it only for historic IDs)
- [Trail of Bits Building Secure Smart Contracts](https://github.com/crytic/building-secure-contracts)
- [OpenZeppelin Contracts docs](https://docs.openzeppelin.com/contracts/5.x/) (OpenZeppelin Defender was retired on 1 Jul 2026 — [sunset FAQ](https://www.openzeppelin.com/news/defender-sunset-faq))
- [Solidity Patterns](https://fravoll.github.io/solidity-patterns/)
- [Consensys Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/)
