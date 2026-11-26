---
name: readable-code
description: Use when writing or reviewing code for readability
---

# readable-code — names, functions, comments and file layout that people can read

> **One rule:** a name you must open up to understand is a badly chosen name

## Use when

- Writing new code · naming variables, functions, files, or folders
- Reviewing code that feels "correct but hard to read"
- A newcomer joins the project and cannot find files
- The `utils/` folder is starting to become a junk drawer

Not for: writing **less** code → `lazy-coding` · repo-level folder structure, README, linter → `project-bootstrap` · correctness, security, testing → `code-review-checklist` · documentation file names → `workspace-rules/document-naming` · product or brand names → `product-naming`

## Steps

1. **Name it so it answers what it is · what unit · when it can be used.** A number with a unit has the unit in its name, always (`timeoutMs` · `priceSatang` · `Seconds` · `Bytes` · `Percent` · `Ratio`). Examples → [`references/examples.md`](references/examples.md).
2. **Use one word for one meaning across the whole project.** Function prefixes (10 groups: what each promises, can it fail, side effects; for example `get` never hits the network, `validate` throws, `ensure` can be called repeatedly) are in [`assets/naming-reference.md`](assets/naming-reference.md) step 2.
3. **Apply the naming rules:**
   - Never name a boolean in the negative (`isNotReady` gives `if (!isNotReady)`). A boolean starts with `is` `has` `should` `can`.
   - A collection is plural and says the type inside (`userIds`, not `users`, if it holds numbers).
   - A function name containing `and` is 2 functions: split it.
   - Constants use upper case only for values truly set once; a value read from config is not a constant.
   - Order function names verb → big context → small context (`getUserMessages` · `shouldDisplayBanner`).
   - Do not repeat context the surrounding name gives (`user.userName` → `user.name`).
4. **Set the name length by distance from declaration to last use.** 5 lines or fewer (a loop counter): 1 character is enough. Within one function: 1–2 words. Whole class or file: 2–3 words. Exported outside the file: full words, no abbreviations.
5. **Do not use `data` `info` `manager` `helper` `util` `do` `temp` or self-invented abbreviations** in names you choose yourself. Replacement words → [`assets/naming-reference.md`](assets/naming-reference.md) step 4. Exceptions: abbreviations the whole field uses (`id` · `url` · `http` · `db` · `api` · `ui`) and names a platform or framework already set (`SensorManager` · Android `Service` · `ChangeNotifier`).
6. **Shape the function:**
   - One level of abstraction per function.
   - At most 3 parameters; beyond that, take an object with named fields.
   - No boolean parameter (`render(true)` hides what `true` is): split into `renderDraft()` and `renderFinal()`, or take `{ mode: "draft" }`. A named parameter whose call site shows the name (`TextField(obscureText: true)` · `enabled: true`) is fine.
   - Return early rather than nest `else`.
   - If indentation goes past 3 levels, split the function.
7. **Write comments for "why", not "what".** A comment that explains what the code does means the name is wrong: fix the name and delete the comment. Keep a comment only for: an external constraint (API · law · hardware) · a deliberate decision that looks odd · a formula or business rule with its source (cite the clause number) · a `TODO(owner)` with a condition. If you change code, change its comment in the same round.
8. **Before review, sort every comment the diff adds or edits:** delete (translates code · outdated · commented-out code) · rename then delete (explains what a name is) · turn into a type, assert, test or lint then delete (states a constraint; `learn-loop/repeated-mistakes-to-checks`) · keep (the 4 kinds in step 7). If the diff is large, have a mid-level subagent read only and make the list, while the main agent decides. Report counts: deleted · renamed · became checks · kept.
9. **Lay out files by feature, not by file type.** The test: a newcomer gets "the save-invoice button does not work" and must guess the right folder within 30 seconds. Layout example → `references/examples.md`.
   - A file name is the name of what it mainly exports (`InvoiceRenderer` in `invoice-renderer.ts`); letter case follows the language (Dart/Python snake_case, .NET `InvoiceRenderer.cs`).
   - A test file sits beside the file it tests, except where tooling forces a test folder (Flutter `test/` · .NET `tests/`; table in `project-bootstrap` step 1), where `test/` mirrors `lib/` exactly.
   - No single `utils/` lump: `shared/` is fine only if split by topic. A folder with a single file should not exist yet.
   - An `index` that re-exports a whole folder breaks "go to definition": use it only where truly needed.
10. **Order inside a file:** import → constants → types → what is exported → private helpers. A called function sits below its caller, so it reads top to bottom. A file over about 300 lines is a signal, not a rule.
11. **Language in code:** names of variables, functions, classes, files, folders, tables and columns are always English. Comments may be Thai if the team reads Thai. User-facing text is Thai but not embedded in code (`i18n-and-locale`). Never mix half-words (`checkบัตร`). For a Thai term with no English word, look for the closest English word first (`taxId` · `withholdingTax`); otherwise transliterate in full words and explain it in `DATA-DICTIONARY.md`.

## Check before done

- Use the 12-item checklist in [`assets/naming-reference.md`](assets/naming-reference.md) step 5; fix any failed item by the matching step above.
- No rename of a whole file in the same commit as a logic change (split the commits).
- No `utils.ts` with unrelated functions · no commented-out code · no `@author` `@version` header · no name by pattern instead of role (`InvoiceFactoryStrategyImpl`) · no change of naming style midway · no name cut short because the line is long (wrap the line).

## References

- [`references/examples.md`](references/examples.md) — open for name, comment and folder-layout examples, and for related skills
- [`assets/naming-reference.md`](assets/naming-reference.md) — open for prefix groups, forbidden-word replacements and the 12-item checklist
