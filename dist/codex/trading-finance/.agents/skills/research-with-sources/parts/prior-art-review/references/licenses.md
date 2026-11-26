# Licences and contract terms

Part of `research-with-sources/prior-art-review` step 3 · check before you start using something, not after.

**This hurts most when learned late**, because you have to tear things out close to delivery.

| Group | Examples | Can it go in something sold? |
|---|---|---|
| Permissive | MIT · Apache-2.0 · BSD | Yes, but Apache-2.0 adds patent conditions |
| Must open the code in turn | GPL-3.0 · AGPL-3.0 | Yes, but **you must open your own code**, and AGPL also counts offering the software as a service over a network |
| No commercial use | CC BY-NC · models marked research only | **Cannot be sold**, but fine for experiments and comparing results |
| Bought or rented (templates, images, fonts, services) | Read the actual contract | Check whether commercial use is allowed · whether you can take your data out · when the price can rise or the service can end |

**2 rules that people often get wrong**

1. **An AI model has a licence separate from its code.** The code may be MIT while the model weights are non-commercial.
2. **The licence passes down to models built on top.** For example, a model fine-tuned from a non-commercial model is still non-commercial.

For every item you will really use, **write the licence name into a file**. Do not rely on memory.

## Full names of the licences

- **MIT** — Massachusetts Institute of Technology License (a permissive licence)
- **GPL** — General Public License (usable, but derived code must be opened)
- **AGPL** — Affero General Public License (like GPL, and it also counts offering the software as a service over a network)
- **BSD** — Berkeley Software Distribution License
- **CC BY-NC** — Creative Commons Attribution-NonCommercial (no commercial use)
