---
name: defi-patterns
description: Use when implementing DeFi protocols — AMMs, lending, vaults, oracle integration, liquidations, rewards distribution, governance. Common patterns from Uniswap/Compound/Aave/Yearn.
---

# DeFi Implementation Patterns

## When to use this skill

- Building DeFi protocol
- Reviewing DeFi code
- Designing tokenomics integration
- Oracle integration
- Liquidation engine design

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
- Liquidity in price ranges
- Capital efficient
- Complex (use Uniswap V3 SDK)

### Stableswap (Curve)
- Optimized for stable pairs
- Lower slippage near peg
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

- ❌ Single oracle dependency
- ❌ Unprotected callback functions
- ❌ Same block flash loan + price manipulation
- ❌ Integer division before multiplication (loss of precision)
- ❌ Updates after external call (reentrancy)
- ❌ Missing slippage checks

## Reference

- [Aave V3 (lending)](https://github.com/aave/aave-v3-core)
- [Compound V3 (lending)](https://github.com/compound-finance/comet)
- [Uniswap V3 (AMM)](https://github.com/Uniswap/v3-core)
- [Yearn V3 (vaults)](https://github.com/yearn/yearn-vaults-v3)
- [OpenZeppelin Defender](https://docs.openzeppelin.com/defender/)
- [Curve (stableswap)](https://github.com/curvefi/curve-contract)
