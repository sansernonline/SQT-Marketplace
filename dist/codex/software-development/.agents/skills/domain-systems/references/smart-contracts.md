<!-- merged from skill `smart-contracts` on 2026-11-27 · description was: Use when building on a blockchain -->
# smart-contracts

Blockchain work — smart contracts · security · testing · DeFi · tokenomics

**Open only the files that match the job.** Do not read them all, because each file is the full guide to its topic.

## Topics

| Use when | Read |
|---|---|
| reviewing or writing Solidity smart contracts for security — reentrancy, access control, integer issues, oracle manipulation, upgradability, common vulnerabilities | [`solidity-security.md`](solidity-security.md) |
| testing smart contracts — unit tests (Foundry/Hardhat), fuzz testing, invariant testing, mainnet forking, integration tests with other protocols | [`smart-contract-testing.md`](smart-contract-testing.md) |
| implementing DeFi protocols — AMMs, lending, vaults, oracle integration, liquidations, rewards distribution, governance. Common patterns from Uniswap/Compound/Aave/Yearn | [`defi-patterns.md`](defi-patterns.md) |

## The 5-step security review order — follow it in order, never jump to step 5 first

| Step | What to do | Passes when |
|---|---|---|
| 1 What tools can find | Run Slither on the whole repo and go through every finding: fix it, or record it as a false alarm with the reason | The report is empty, or every finding has a verdict |
| 2 Only what the project has | Upgradeable contract → check storage layout and initializer risks · claims to be an ERC → check conformance to the standard · accepts external tokens → check that token's behavior (fee-on-transfer · rebasing · no bool return value) | Run only the items whose condition applies; write "not applicable" for the others |
| 3 See the big picture by eye | Draw 3 views from the Slither printers: inheritance (find shadowing) · function summary with visibility · who can write which state | Every important state can be written only by whoever is intended |
| 4 Write invariants and let the tool try to break them | Record the properties that must always hold (state machine · permissions · arithmetic and precision · external calls · standards), then write them as property tests for Echidna or Medusa (fuzz) — this step matters most | Every invariant has a test, and the fuzz run passes for the configured number of rounds (see `smart-contract-testing.md`) |
| 5 What tools cannot see | Read by hand for on-chain secrets (is commit-reveal needed?) · front-running and MEV (slippage · ordering) · randomness and signatures · oracles and flash loans | Every topic has a note saying whether it was found or does not apply |

The results of all 5 steps are the evidence for the "Static analysis" and "Manual review" steps in `/software-development:domain-systems smart-contract-audit`

## Role guides

An agent called in for this area opens its own role file before starting.

| Role | Read | Agent |
|---|---|---|
| designing blockchain systems — chain selection, L1/L2 strategy, on-chain/off-chain split, bridges, indexing infrastructure, multi-chain considerations | [`agent-blockchain-architect.md`](agent-blockchain-architect.md) | `blockchain-engineer` |
| developing smart contracts on EVM chains (Solidity), Solana (Rust/Anchor), or other blockchains. Covers contract design, security patterns, testing, gas optimization, upgradability | [`agent-smart-contract-developer.md`](agent-smart-contract-developer.md) | `blockchain-engineer` |
| building DeFi protocols — DEX/AMM, lending, staking, yield farming, derivatives, stablecoins. Covers economic mechanism design and implementation patterns | [`agent-defi-engineer.md`](agent-defi-engineer.md) | `blockchain-engineer` |
| designing token economics — supply curves, distribution, vesting, utility, governance, sustainable incentives. Covers fungible (ERC-20) and NFT tokenomics | [`agent-tokenomics-designer.md`](agent-tokenomics-designer.md) | `blockchain-engineer` |

## Design modes (called as a command)

`/software-development:domain-systems <smart-contract-audit | tokenomics-design> <details>`

Two modes. Read the first word of **the user's request**: if it names a mode, run that mode on the rest; otherwise pick the mode that fits the request and say which one you chose.

| Mode | What it does |
|---|---|
| `smart-contract-audit` | Audit smart contracts using the blockchain-engineer agent. |
| `tokenomics-design` | Design tokenomics using blockchain-engineer agent. |

The full steps of each mode → [references/design-modes.md](smart-contracts/design-modes.md)

## References

- [`sources.md`](sources.md) — open to see where the 5-step review order comes from
