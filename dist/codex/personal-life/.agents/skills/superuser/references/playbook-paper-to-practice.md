# playbook · paper-to-practice — from a paper or article to code that runs

Use when: the user wants to understand a paper · RFC · long article well enough to use it.
Main principles: [`life-principles`](../../life-principles/SKILL.md) · [`references/learning.md`](../../life-principles/references/learning.md)
Main skills: `learning-path` (`references/paper-to-practice.md`) · `thesis-writing` (`references/literature-matrix.md`) when the paper is for a thesis

## ขั้นตอน (Steps — copy into the todo as written)

1. Open the principle file [`references/learning.md`](../../life-principles/references/learning.md) first. Read the abstract · main proposal · experiment results, then write the main idea in plain language in 3 sentences · ใคร: `tech-mentor` ตัวใหม่
2. If there is a hard term or sentence, use `learning-path`. When reading an RFC, watch the difference between MUST · SHOULD · MAY · ใคร: `tech-mentor` ตัวใหม่
3. Write the smallest sample code that shows the main idea, using the standard library first · ใคร: `tech-mentor` ตัวใหม่
4. Run it for real, and try 1 case where the idea does not work, to see its limits · ใคร: `tech-mentor` ตัวใหม่ writes and runs the failing case · `reviewer` ตัวใหม่ reruns it and ตรวจ the result
5. Write a short note using the `learning-path` paper-to-practice template — when to use it, when not to (ตัดสินผลตาม [`references/learning.md`](../../life-principles/references/learning.md)) · ใคร: `tech-mentor` ตัวใหม่ · `reviewer` ตัวใหม่ checks it against the real run

## Done when

The sample code runs and passes with its output, and there is a 1-page note.
