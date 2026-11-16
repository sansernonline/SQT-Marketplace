# Selling on the MQL5 Market and self-sale · stack-mql

Open when the EA will be sold, or when it needs a license lock.

## MQL5 Market

Last checked 2026-10-20 · source: https://www.metatrader5.com/en/terminal/help/market/market_sell · the rules can change; re-check before submitting

- Submit a single compiled file (`.ex5` / `.ex4`) · indicators · sounds · images embedded as resources · **no Dynamic Link Library (DLL)**
- **Do not restrict by account number or account type** · the Market locks machines and the number of activations itself · our license system below is for self-sale channels only.
- The automatic check runs the EA in the tester on several symbols and timeframes · the EA must really send orders in every one of those conditions (sending none = fail) · having every item of the pre-send checker is what makes it pass.
- Do not promise profit in the description · the product name in Latin letters is at most 50 characters with no version number · state it if it works only with hedging or netting.

## Self-sale (not through the Market)

- Lock the license with the account number (`ACCOUNT_LOGIN`) + an expiry date, checked in `OnInit`.
- Do not give the customer the `.mq4` / `.mq5` · `.ex4` / `.ex5` files can be partly decompiled, so do not put secret rules only inside the EA.
