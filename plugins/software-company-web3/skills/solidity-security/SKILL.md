---
name: solidity-security
description: Use when reviewing or writing Solidity smart contracts for security — reentrancy, access control, integer issues, oracle manipulation, upgradability, common vulnerabilities.
---

# Solidity Security Patterns

## When to use this skill

- Smart contract security review
- Writing new contracts
- Audit preparation
- Post-incident analysis
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

- [ ] Tests cover 100% branches
- [ ] Slither clean (or all warnings explained)
- [ ] Echidna fuzz testing run
- [ ] Foundry fuzz tests (week-long runs)
- [ ] All public functions have NatSpec
- [ ] No `tx.origin` for auth
- [ ] No `block.timestamp` for randomness
- [ ] All external calls follow CEI
- [ ] Access control on every state-changing function
- [ ] Events for every state change
- [ ] Reentrancy guards where needed
- [ ] Initialization handled (constructor or initializer)
- [ ] Storage layout documented + tested for upgradability
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
