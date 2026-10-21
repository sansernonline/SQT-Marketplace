# Quant Analyst — models, backtesting, model card, backtest report

คู่มือบทบาทของ agent `quant-analyst` — ย้ายมาจากตัว agent (2026-10-14) · โค้ดเป็นตัวอย่าง ต้องตรวจกับข้อมูลจริงก่อนใช้

**สารบัญ:**

- [Common Models](#common-models)
- [Backtesting Discipline](#backtesting-discipline)
- [Standard Outputs](#standard-outputs)

## Common Models

### Credit Scoring

```python
# Logistic regression baseline (interpretable, regulatory-friendly)
from sklearn.linear_model import LogisticRegression
import shap

model = LogisticRegression(class_weight='balanced')
model.fit(X_train, y_train)

# Explainability with SHAP
explainer = shap.LinearExplainer(model, X_train)
shap_values = explainer(X_test)

# For each decision, log:
# - Final probability
# - Top 3 contributing features
# - Model version
# Required for fair-lending audit
```

### Value at Risk (VaR)

```python
import numpy as np

def historical_var(returns: np.ndarray, confidence: float = 0.95) -> float:
    """1-day VaR at confidence level."""
    return -np.percentile(returns, (1 - confidence) * 100)

def parametric_var(mean: float, std: float, confidence: float = 0.95) -> float:
    """Assumes normal distribution — VALIDATE this assumption."""
    from scipy.stats import norm
    return -(mean + norm.ppf(1 - confidence) * std)

# Always compute BOTH and compare — divergence signals fat tails
```

### Fraud Detection (Anomaly)

```python
# Isolation Forest for unsupervised
from sklearn.ensemble import IsolationForest

model = IsolationForest(
    contamination=0.001,  # 0.1% fraud rate assumption
    random_state=42       # reproducibility!
)
model.fit(X_train)

# Score new transactions
scores = model.score_samples(X_new)
# Lower score = more anomalous
```

## Backtesting Discipline

```python
# ❌ Bad: look-ahead bias
features = compute_features(all_data)  # uses future data!
model.fit(features[:train_end], target[:train_end])

# ✅ Good: walk-forward
for date in test_dates:
    # Only data available at this date
    historical = data[data.date < date]
    features = compute_features(historical)
    model.fit(features, target[features.index])
    prediction = model.predict_one(today_features)
    log(date, prediction, actual=target.loc[date])
```

## Standard Outputs

### Model Documentation Card

```markdown
# Model: <Name>

| | |
|--|--|
| **Version** | 2.1 |
| **Purpose** | Credit default prediction |
| **Type** | Logistic regression (binary classification) |
| **Owner** | @quant-team |
| **Status** | Production |

## Business Purpose

Predict probability of loan default within 12 months.

## Performance

| Metric | Train | Test | Live |
|--------|------:|-----:|-----:|
| AUC | 0.78 | 0.74 | 0.72 |
| Gini | 0.56 | 0.48 | 0.44 |
| KS | 0.42 | 0.36 | 0.33 |

## Features

| Feature | Importance | Source | Refresh |
|---------|:----------:|--------|---------|
| credit_history_length | 0.18 | Bureau | Monthly |
| debt_to_income | 0.15 | Application | Real-time |
| ... | ... | ... | ... |

## Assumptions & Limitations

- Trained on 2020-2024 (includes COVID period)
- Population: Thai retail borrowers, age 20-60
- Income < 100k THB/month
- NOT validated for new-to-credit segment
- Performance degrades in interest rate > 5%

## Validation

- Out-of-time backtest: 6 months
- Backtest AUC: 0.74 (vs train 0.78 — acceptable degradation)
- Fair lending test: disparate impact ratio 0.85 (acceptable)
- Stress test: stable under 3x default rate scenario

## Monitoring

- Drift alerts: PSI > 0.25 on any feature
- Performance alerts: AUC drop > 5pp
- Volume alerts: > 50% deviation from baseline

## Change Log

| Version | Date | Change |
|---------|------|--------|
| 2.1 | 2025-Q3 | Added income_volatility feature |
| 2.0 | 2025-Q1 | Recalibrated post-COVID |
| 1.0 | 2023-Q4 | Initial production |
```

### Backtest Report Template

```markdown
# Backtest: <Strategy/Model Name>

## Configuration
- **Period:** YYYY-MM-DD to YYYY-MM-DD
- **Universe:** ...
- **Initial capital:** $XXX
- **Benchmark:** ...

## Results

| Metric | Strategy | Benchmark |
|--------|---------:|----------:|
| Total return | XX% | XX% |
| Annualized return | XX% | XX% |
| Sharpe ratio | X.XX | X.XX |
| Max drawdown | XX% | XX% |
| Win rate | XX% | — |

## Caveats

- Past performance ≠ future
- Transaction costs included: ✓/✗
- Slippage: ✓/✗
- Survivorship bias: ✓/✗
- Look-ahead bias: ✓/✗
- Tax treatment: gross/net

## Equity Curve

[Chart placeholder]

## Stress Scenarios

| Scenario | Strategy P&L | Benchmark P&L |
|----------|-------------:|--------------:|
| 2008 GFC | XX% | XX% |
| 2020 COVID | XX% | XX% |
| 2022 Rate hike | XX% | XX% |
```
