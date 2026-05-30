---
name: underwriting-models
description: Use when building underwriting models — risk scoring, rating algorithms, GLM/GBM pricing, eligibility logic, fairness testing, regulatory documentation.
---

# Underwriting Models

## When to use this skill

- Building risk scoring model
- Designing rating algorithm
- Eligibility rules engine
- Disparate impact testing
- Model validation + documentation

## Modeling Approaches

```
Traditional GLM
- Generalized Linear Model
- Tweedie distribution for pure premium
- Interpretable (regulator-friendly)
- Slightly less accurate

Modern GBM
- Gradient boosted trees
- Higher accuracy
- Black box (regulatory challenge)
- Need explainability layer

Hybrid (Recommended 2026)
- GLM as core (filed + approved)
- GBM as challenger model
- Use GBM signals to identify new factors for GLM
```

## GLM Pricing Model

```python
import statsmodels.api as sm
import pandas as pd

# Frequency model (Poisson)
freq_model = sm.GLM(
    claim_count,
    exog=features,
    family=sm.families.Poisson(),
    offset=np.log(exposure)
).fit()

# Severity model (Gamma)
severity_model = sm.GLM(
    claim_amount,
    exog=features_severity,
    family=sm.families.Gamma(),
    var_weights=claim_count
).fit()

# Combined pure premium (Tweedie compound)
pure_premium_model = sm.GLM(
    pure_premium,
    exog=features,
    family=sm.families.Tweedie(var_power=1.5),
    var_weights=exposure
).fit()

# Output: relativities
# Example: var_age:25-30 = 1.20 means 20% more than baseline
```

## GBM Pricing Model

```python
import xgboost as xgb

# Train with Tweedie objective
model = xgb.XGBRegressor(
    objective='reg:tweedie',
    tweedie_variance_power=1.5,
    n_estimators=500,
    max_depth=6,
    learning_rate=0.05,
)

model.fit(
    X_train, pure_premium,
    sample_weight=exposure,
    eval_set=[(X_val, pure_premium_val)],
    early_stopping_rounds=50,
)

# Feature importance
xgb.plot_importance(model, max_num_features=20)

# SHAP for explainability (regulatory requirement)
import shap
explainer = shap.TreeExplainer(model)
shap_values = explainer.shap_values(X_test)
```

## Eligibility Rules

```python
class EligibilityRule:
    name: str
    description: str
    check: callable      # returns True if eligible
    severity: 'hard' | 'soft'  # hard = auto-decline

ELIGIBILITY_RULES = [
    EligibilityRule(
        name='state_authorization',
        description='State must be in authorized list',
        check=lambda app: app.state in AUTHORIZED_STATES,
        severity='hard',
    ),
    EligibilityRule(
        name='applicant_age',
        description='Applicant must be 18+',
        check=lambda app: app.applicant.age >= 18,
        severity='hard',
    ),
    EligibilityRule(
        name='recent_dui',
        description='DUI within 5 years requires underwriter review',
        check=lambda app: not had_dui_within(app, years=5),
        severity='soft',  # refer, not auto-decline
    ),
    # ... more rules
]

def check_eligibility(application):
    failures = []
    for rule in ELIGIBILITY_RULES:
        if not rule.check(application):
            failures.append(rule)
    return failures
```

## Fairness Testing

```python
# Required: don't discriminate by protected class

def test_disparate_impact(model, test_data, protected_attribute='race'):
    """80% rule: approval rate for protected class
       should be ≥ 80% of approval rate for majority."""

    # Approval rates by group
    approval_by_group = {}
    for group in test_data[protected_attribute].unique():
        subset = test_data[test_data[protected_attribute] == group]
        predictions = model.predict(subset)
        approval_rate = (predictions < AUTO_APPROVE_THRESHOLD).mean()
        approval_by_group[group] = approval_rate

    # Disparate impact ratio
    majority_rate = max(approval_by_group.values())

    for group, rate in approval_by_group.items():
        ratio = rate / majority_rate
        if ratio < 0.8:
            print(f'⚠️ Disparate impact: {group} = {ratio:.2f}')

    return approval_by_group
```

### Protected attributes

Never use as features:
- Race
- Religion
- Sex
- National origin
- Marital status (varies)
- Age (varies; depends on regulator)

Proxies to watch:
- ZIP code (correlates with race)
- Names (proxy for ethnicity)
- Credit score (varies by jurisdiction)
- Driving school location

## Model Validation

```python
# Out-of-time validation
train_data = data[data.policy_year < 2024]
test_data = data[data.policy_year == 2024]

# Train on historical
model.fit(train_data)

# Test on out-of-time
predictions = model.predict(test_data)

# Metrics
gini = calculate_gini(predictions, test_data.actual_losses)
lift_curve = calculate_lift(predictions, test_data.actual_losses)
calibration = calibration_plot(predictions, test_data.actual_losses)
```

### Required documentation

```
For regulatory:
- Data sources + collection method
- Sample sizes + exclusions
- Feature engineering
- Model selection process
- Validation results
- Monitoring plan
- Update cadence
```

## Adverse Action Notices

```python
# Required when adverse decision based on consumer report

def generate_adverse_action_notice(decision):
    if decision.declined and used_consumer_report(decision):
        # Get top reasons (from model explanation)
        reasons = top_3_negative_factors(decision)

        notice = AdverseActionNotice(
            applicant=decision.applicant,
            action='declined',
            reasons=reasons,
            consumer_reporting_agency=consumer_agency_info,
            credit_score_used=decision.credit_score,
            score_range=credit_score_range,
            disclosure_rights=fcra_disclosure_rights(),
        )
        return notice
```

## Pricing Cap + Floor

```python
# Don't let model produce extreme premiums
def apply_pricing_constraints(model_premium, rule_book):
    minimum = rule_book.minimum_premium
    maximum = rule_book.maximum_premium

    # Per-state caps
    if state.has_rate_change_cap:
        previous = previous_quote_for(applicant).premium
        max_increase = previous * (1 + state.max_increase_pct)
        max_decrease = previous * (1 - state.max_decrease_pct)
        model_premium = clip(model_premium, max_decrease, max_increase)

    return clip(model_premium, minimum, maximum)
```

## Continuous Monitoring

```python
# Track model performance over time
monthly_metrics = {
    'gini': calculate_gini(recent_predictions, recent_actuals),
    'calibration_drift': psi(baseline_predictions, recent_predictions),
    'feature_drift': psi_per_feature(baseline_features, recent_features),
    'approval_rate_by_group': fairness_metrics(),
    'loss_ratio_by_tier': loss_ratio_analysis(),
}

# Alert on degradation
if monthly_metrics['gini'] < BASELINE * 0.9:
    alert('Model performance degraded')
```

## Common Pitfalls

- ❌ Black box models without explainability
- ❌ Using protected attributes (direct or proxy)
- ❌ Skipping fairness testing
- ❌ No model versioning (audit trail)
- ❌ Forgetting adverse action notices
- ❌ One-time validation (drift kills models)

## Reference

- [Casualty Actuarial Society (CAS)](https://www.casact.org/)
- [SOA Predictive Analytics](https://www.soa.org/)
- [Fair Credit Reporting Act (FCRA)](https://www.ftc.gov/legal-library/browse/statutes/fair-credit-reporting-act)
- [NAIC AI/ML Guidance](https://content.naic.org/)
- [Insurance Predictive Modeling (Friedland)](https://www.casact.org/)
