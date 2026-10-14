# Clinical analytics — cohorts, measures, risk adjustment, report

คู่มือของ agent `clinical-data-analyst` — ย้ายมาจากตัว agent (2026-10-14) · SQL ทุกตัวเป็นตัวอย่าง ต้องปรับชื่อตารางและรหัสให้ตรงระบบจริง

**สารบัญ:**

- [Common Clinical Analyses](#common-clinical-analyses)
- [Clinical Codes](#clinical-codes)
- [Quality Measures](#quality-measures)
- [Risk Stratification](#risk-stratification)
- [Privacy + Ethics](#privacy--ethics)
- [Output: Clinical Analysis Report](#output-clinical-analysis-report)

## Common Clinical Analyses

### Cohort Building

```sql
-- Diabetes patients with poor control, 2024
WITH diabetes_patients AS (
  SELECT DISTINCT patient_id
  FROM conditions
  WHERE
    -- ICD-10 codes for diabetes
    (code LIKE 'E10%' OR code LIKE 'E11%')  -- brackets: AND binds before OR
    AND onset_date <= '2024-01-01'
    AND (resolved_date IS NULL OR resolved_date > '2024-12-31')
),
recent_a1c AS (
  -- Most recent HbA1c in 2024
  SELECT DISTINCT ON (patient_id)
    patient_id,
    value as a1c,
    measured_date
  FROM observations
  WHERE
    loinc_code = '4548-4'  -- HbA1c
    AND measured_date BETWEEN '2024-01-01' AND '2024-12-31'
  ORDER BY patient_id, measured_date DESC
)
SELECT
  dp.patient_id,
  ra.a1c,
  ra.measured_date
FROM diabetes_patients dp
LEFT JOIN recent_a1c ra USING (patient_id)
WHERE ra.a1c > 9.0;  -- Poor control threshold
```

### Outcome Measure: 30-Day Readmission

```sql
-- AMI (Acute MI) readmission rate
WITH index_admissions AS (
  SELECT
    patient_id,
    encounter_id as index_encounter,
    discharge_date
  FROM encounters
  WHERE
    primary_diagnosis_code LIKE 'I21%'  -- AMI
    AND discharge_date BETWEEN '2024-01-01' AND '2024-12-31'
    AND discharge_disposition NOT IN ('expired', 'hospice')
),
readmissions AS (
  SELECT
    i.patient_id,
    i.index_encounter,
    e.encounter_id as readmit_encounter
  FROM index_admissions i
  JOIN encounters e
    ON i.patient_id = e.patient_id
    AND e.admit_date > i.discharge_date
    AND e.admit_date <= i.discharge_date + INTERVAL '30 days'
    AND e.encounter_type = 'inpatient'
)
SELECT
  COUNT(DISTINCT index_encounter) as total_eligible,
  COUNT(DISTINCT CASE WHEN r.readmit_encounter IS NOT NULL
    THEN i.index_encounter END) as readmissions,
  -- numerator = the readmissions column above (index stays with ≥1 readmit)
  ROUND(100.0 * COUNT(DISTINCT CASE WHEN r.readmit_encounter IS NOT NULL
    THEN i.index_encounter END)
    / COUNT(DISTINCT i.index_encounter), 1) as rate_pct
FROM index_admissions i
LEFT JOIN readmissions r USING (index_encounter);
```

### Standardized Mortality Ratio (SMR)

```python
# Observed vs expected deaths
observed = actual_deaths_in_cohort

# Expected based on age/sex standardized rates
expected = sum(
    cohort_size_in_stratum[s] * standard_death_rate[s]
    for s in age_sex_strata
)

smr = observed / expected

# Confidence interval (assuming Poisson)
import scipy.stats as stats
ci_low = stats.chi2.ppf(0.025, 2*observed) / (2 * expected)
ci_high = stats.chi2.ppf(0.975, 2*(observed+1)) / (2 * expected)
```

## Clinical Codes

| System | Purpose |
|--------|---------|
| **ICD-10-CM** | Diagnoses |
| **ICD-10-PCS** | Procedures (inpatient US) |
| **CPT-4** | Procedures (outpatient US) |
| **LOINC** | Labs + observations |
| **SNOMED CT** | Clinical terminology (broad) |
| **RxNorm** | Medications (US) |
| **NDC** | National Drug Code |
| **HCPCS** | Healthcare procedures (US Medicare) |

> 💡 **Use code system + code** always (e.g., LOINC|4548-4) — codes alone are ambiguous.

## Quality Measures

### HEDIS (US managed care)
- Diabetes care (A1c, eye exam, kidney)
- Cancer screening (breast, cervical, colorectal)
- Childhood immunizations
- Medication adherence

### CMS Measures
- 30-day readmission rates
- Hospital-acquired conditions
- HCAHPS (patient satisfaction)
- Sepsis bundle compliance

### Implementation pattern

```sql
-- HEDIS measure: BCS (Breast Cancer Screening)
-- Women 50-74 who had mammogram in last 2 years

WITH denominator AS (
  SELECT patient_id
  FROM patients
  WHERE
    gender = 'female'
    AND DATE_PART('year', AGE('2024-12-31', birth_date)) BETWEEN 50 AND 74
    AND continuous_enrollment(patient_id, '2023-01-01', '2024-12-31')
),
numerator AS (
  SELECT DISTINCT patient_id
  FROM procedures
  WHERE
    cpt_code IN ('77067', '77065', '77066')  -- mammography codes
    AND service_date BETWEEN '2023-01-01' AND '2024-12-31'
)
SELECT
  COUNT(DISTINCT d.patient_id) as eligible,
  COUNT(DISTINCT n.patient_id) as screened,
  ROUND(100.0 * COUNT(DISTINCT n.patient_id) / COUNT(DISTINCT d.patient_id), 1) as rate
FROM denominator d
LEFT JOIN numerator n USING (patient_id);
```

## Risk Stratification

```python
# Charlson Comorbidity Index (CCI)
WEIGHTS = {
    'mi': 1, 'chf': 1, 'pvd': 1, 'cvd': 1, 'dementia': 1,
    'copd': 1, 'rheum': 1, 'pud': 1, 'mild_liver': 1, 'diabetes': 1,
    'diabetes_compl': 2, 'paraplegia': 2, 'renal': 2, 'cancer': 2,
    'severe_liver': 3, 'metastatic_cancer': 6, 'aids': 6,
}

def cci_score(conditions: set) -> int:
    return sum(WEIGHTS.get(c, 0) for c in conditions)

# 1-year mortality risk grows with CCI
# Use for cohort risk-adjustment
```

## Privacy + Ethics

### Small cell suppression
```python
# Don't report counts < 11 (typical threshold)
# Risk of re-identification

if count < 11:
    return "< 11"  # suppress exact number
```

### De-identification (HIPAA Safe Harbor)
- Remove 18 identifiers (see hipaa-officer)
- Or expert statistical determination
- Document method

### IRB / Ethics
- Research with humans → IRB approval
- QI projects → often exempt, but document
- "Just operations" → still respect patient privacy

## Output: Clinical Analysis Report

```markdown
# 📊 Clinical Analysis: <Title>

| | |
|--|--|
| **Analyst** | @clinical-data-analyst |
| **Date** | YYYY-MM-DD |
| **Status** | 🟡 Draft |
| **Reviewed by** | @clinical-lead |

## Clinical Question
What is X for population Y during period Z?

## Methods

### Cohort
- Inclusion: ...
- Exclusion: ...
- N = XXX patients

### Outcome
- Definition: ...
- Codes used: ICD-10 ..., LOINC ...

### Statistical Approach
- ...

## Results

[Tables, charts]

## Limitations

- ⚠️ Single institution data
- ⚠️ Possible misclassification of X
- ⚠️ Missing data on Y for Z% of cohort

## Clinical Implications
...

## References
- ...
```
