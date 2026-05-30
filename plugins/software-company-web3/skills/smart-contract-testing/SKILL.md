---
name: smart-contract-testing
description: Use when testing smart contracts — unit tests (Foundry/Hardhat), fuzz testing, invariant testing, mainnet forking, integration tests with other protocols.
---

# Smart Contract Testing

## When to use this skill

- Setting up testing for new contracts
- Pre-audit testing
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

> 💡 **2026 default: Foundry.** Hardhat for legacy / JS-heavy teams.

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

Invariants = properties that should ALWAYS hold.

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
- [ ] Gas snapshot stable
- [ ] All test runs reproducible (seeds)

## Common Mistakes

- ❌ Test only happy path
- ❌ Skip fuzz testing
- ❌ Mock dependencies in integration tests
- ❌ No invariant tests
- ❌ Test without forking real protocols
- ❌ Skip gas testing (regressions sneak in)

## Reference

- [Foundry Book](https://book.getfoundry.sh/)
- [Echidna Tutorial](https://github.com/crytic/building-secure-contracts/tree/master/program-analysis/echidna)
- [Trail of Bits Testing Guide](https://github.com/crytic/building-secure-contracts/tree/master/program-analysis)
- [Foundry Best Practices](https://book.getfoundry.sh/tutorials/best-practices)
- [Wake](https://ackeeblockchain.com/wake)
