# Tax script input and output · tax-deduction-planner

Open when writing the input file for `scripts/tax.mjs` or reading its output.

Input: `{ "salary": 720000, "deductions": { "socialSecurity": 10500, "pvd": 36000, "lifeInsurance": 20000, "ownHealth": 15000 }, "buy": { "rmf": 50000, "thaiesg": 50000 }, "dividends": { "amount": 40000 } }`. `salary` = 40(1) + 40(2) for the year; other income goes in `otherIncome` with its own expense in `otherExpense` (reference section 2 of `deductions-2569.md`). The personal 60,000 and the expense deduction are added by the script. Keys with a cap check: `socialSecurity` `lifeInsurance` `ownHealth` `parentsHealth` `pensionInsurance` `pvd` `gpf` `rmf` `nsf` `thaiesg` `homeLoanInterest` `politicalParty` `donation` `donationDouble`; any other key (spouse, child, parents) is counted as entered and listed as not checked.

Output: net income, tax before / after / saved, marginal rate, room left (RMF, ThaiESG, pension insurance, 500,000 combined cap), knapsack `value` per 50,000 block, and with `dividends` the cost of keeping the 10% as final versus including with the credit (formula from `tax-basics-th`). The 30% caps use income without dividends.

Rates and caps live in `scripts/rates-2569.json` (`checked` date, `source` line in the reference file); a new tax year needs a new file from a checked reference, never edited from memory.
