# Testing contract · app-verifier-setup

verify must depend on things the app provides, not guess from text or CSS. Write this contract into the feature map in the script, and have the developer follow it from the first feature.

| What the app must have | What it is for | Rule |
|---|---|---|
| `data-testid="<page>-<thing>"` in kebab-case on every button, input, result, and error message | Find elements without tying to text or CSS, so checks do not break when language or design changes | For example `book-submit` · `summary-total` · `book-error` · no duplicates on one page · the full list of testids lives in the feature map |
| `<html data-ready="false">` → `"true"` when the page has finished loading data | Wait on a condition instead of a guessed `sleep` (step 5) | Set `true` after the last batch of data arrives, not when the component mounts |
| A reset endpoint such as `POST /api/test/reset` → clears and re-seeds within 5 seconds | Every check starts from a clean state (step 4) | Exists only when `ALLOW_TEST_RESET=1` is set · if not set, answer 404 · never enable in production |
| Clock lock: reset accepts `{"now":"<ISO + offset>"}` and every rule reads "today" from one module (`clock`) | Test date-dependent rules (expiry · cancel at least 24 hours ahead) with the same result every time | If `now` is not sent, use the start date written in the seed · flag off, use real time · never call `Date.now()` / `DateTime.Now` directly in a rule |

Non-web apps follow the same idea: Flutter → a `Key` / Semantics label with the same name · Android → `resource-id` · command line → a `--now` option or an `APP_NOW` variable · a reset on mobile can be enabled only in a debug build.
