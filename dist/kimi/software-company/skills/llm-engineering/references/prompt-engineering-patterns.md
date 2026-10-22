> เดิมชื่อ prompt-engineering-patterns (ไม่ใช่ skill แยกแล้ว เนื้อหาอยู่ที่ไฟล์นี้) ใน plugin `software-company-ai` — รวมเข้า `llm-engineering` ใน v2.0.0

**สารบัญ:** 

- [When to use this skill](#when-to-use-this-skill)
- [The 5 Pillars of Good Prompts](#the-5-pillars-of-good-prompts)
- [Pattern Library](#pattern-library)
- [Anti-patterns](#anti-patterns)
- [Optimization Process](#optimization-process)
- [Temperature Selection](#temperature-selection)
- [Token Budget Management](#token-budget-management)
- [Prompt Versioning](#prompt-versioning)
- [Debugging Prompts](#debugging-prompts)
- [Common Patterns for Common Tasks](#common-patterns-for-common-tasks)
- [Reference](#reference)

# Prompt Engineering Patterns

## When to use this skill

- Writing system prompts for LLM applications
- Designing few-shot examples
- Implementing structured output reliably
- Optimizing existing prompts
- Building prompt templates / libraries
- Debugging why an LLM gives bad output

## The 5 Pillars of Good Prompts

```
1. Role         — who is the LLM acting as?
2. Task         — what is the exact job?
3. Context      — what does it need to know?
4. Constraints  — what are the rules?
5. Format       — what does output look like?
```

## Pattern Library

### Pattern 1: Role + Persona

```
You are a senior software architect with 15 years of experience in distributed systems.
You're known for clear, opinionated recommendations with concrete trade-offs.
```

**Why it works:** It sets the expected style, expertise level and way of communicating.

### Pattern 2: Clear Task Definition

❌ Vague:
```
Help me with code review.
```

✅ Specific:
```
Review the provided TypeScript code for:
1. Type safety issues
2. Performance problems
3. Security vulnerabilities
4. Style violations against our team's eslint config

For each finding, provide:
- File and line number
- Severity (critical/high/medium/low)
- Concrete fix
```

### Pattern 3: Few-Shot Examples

```
Classify these support tickets:

Example 1:
Ticket: "I was charged twice for my subscription"
Category: billing
Urgency: high

Example 2:
Ticket: "The dashboard is loading slowly"
Category: performance
Urgency: medium

Example 3:
Ticket: "How do I change my email?"
Category: account
Urgency: low

Now classify:
Ticket: {USER_INPUT}
Category:
```

**Rules:**
- 3-5 examples (more usually adds noise)
- Cover edge cases (refusal, ambiguous)
- Same format throughout
- The last examples sway the model most

### Pattern 4: Chain-of-Thought (Explicit)

```
Solve this problem step by step. Show your work.

Problem: A train leaves Bangkok at 9am going 80 km/h toward Chiang Mai (700 km away).
Another train leaves Chiang Mai at 10am going 70 km/h toward Bangkok.
When do they meet?

Solution:
Step 1: ...
Step 2: ...
...
Final answer: ...
```

> 💡 **Modern models often CoT internally.** Test if explicit CoT helps your task before adding it.

### Pattern 5: Structured Output via Tool Use

❌ Asking for JSON in text (often invalid):
```
Output as JSON: {"name": ..., "age": ...}
```

✅ Use tool/function calling:
```python
response = client.messages.create(
    tools=[{
        "name": "save_user",
        "description": "Save extracted user information. age is 0-120.",
        "strict": True,  # strict tool use: input follows the schema exactly
        "input_schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "age": {"type": "integer"},  # strict mode does not support minimum/maximum
                "email": {"type": "string", "format": "email"},
                "is_active": {"type": "boolean"}
            },
            "required": ["name", "email"],
            "additionalProperties": False  # required for every object under strict
        }
    }],
    tool_choice={"type": "tool", "name": "save_user"}
)

# Pick the tool_use block by type — content[0] can be a text or thinking block
tool_input = next(b.input for b in response.content if b.type == "tool_use")
# strict=True guarantees types and required fields; still check ranges (age 0-120) in code.
# Without strict the model may send "2" for an integer or omit a required field,
# so validate with Pydantic / jsonschema before use.
# Source: platform.claude.com/docs strict-tool-use + structured-outputs (checked 2026-10-22)
```

### Pattern 6: Negative Constraints

```
Important rules:
- Do NOT use marketing language ("revolutionary", "game-changing")
- Do NOT make up statistics
- Do NOT include disclaimers like "I'm an AI"
- Do NOT exceed 200 words
```

### Pattern 7: Conditional Logic

```
If the question is about pricing:
  - Direct them to /pricing page
  - Don't try to give specific numbers

If the question is technical:
  - Provide detailed answer
  - Include code example if relevant

If the question is unrelated to our product:
  - Politely decline
  - Suggest they search elsewhere
```

### Pattern 8: Self-Reflection

```
First, answer the question.

Then, review your answer:
- Is it factually accurate?
- Did you address what was actually asked?
- Are there any caveats to mention?

If review reveals issues, revise.

Output only the FINAL, revised answer.
```

### Pattern 9: Persona + Format Stack

```
You are <ROLE>.

Task: <TASK>

Process:
1. <STEP 1>
2. <STEP 2>
3. <STEP 3>

Format:
- Output in <FORMAT>
- Length: <LIMIT>

Constraints:
- <RULE 1>
- <RULE 2>

Now perform the task on: {USER_INPUT}
```

### Pattern 10: Anthropic-Style XML Tags

```xml
<role>
You are a meticulous code reviewer.
</role>

<task>
Review this pull request for the issues listed below.
</task>

<focus_areas>
- Security vulnerabilities
- Performance issues
- Code style
</focus_areas>

<code>
{USER_CODE}
</code>

<output_format>
Provide findings as a numbered list with:
- File:line
- Issue type
- Severity
- Recommended fix
</output_format>
```

> 💡 Claude models particularly benefit from XML tag structure.

## Anti-patterns

### ❌ Anti-pattern 1: Begging for performance

```
PLEASE be careful! This is VERY IMPORTANT! Do your BEST!!!
```

**Why bad:** It doesn't help. Write clear instructions instead.

### ❌ Anti-pattern 2: Contradictory rules

```
Be concise. But also explain everything in detail. And use bullet points.
But also write in flowing prose.
```

### ❌ Anti-pattern 3: Vague metrics

```
Make sure the output is high quality.
```

→ What's "high quality"? Define it.

### ❌ Anti-pattern 4: Mixing concerns

```
You are a customer support agent who also writes code and does taxes.
```

→ One agent, one role.

### ❌ Anti-pattern 5: Examples that miss edge cases

```
Examples (all easy):
1. "Hello" → friendly
2. "How are you" → friendly
3. "Thanks" → friendly

(model fails on:)
"I want to murder my ex" → ???
```

→ Include edge + refusal examples.

## Optimization Process

```
1. Define eval set (50+ examples with ground truth)
   ↓
2. Establish baseline (current prompt or simple version)
   ↓
3. Score on eval
   ↓
4. Analyze failures (cluster by type)
   ↓
5. Hypothesize improvement
   ↓
6. Update prompt
   ↓
7. Re-score
   ↓
8. Compare to baseline (statistically significant?)
   ↓
9. A/B test in production
   ↓
10. Promote winner
```

## Temperature Selection

Sampling settings depend on the model. Check the model page (or the `claude-api` skill — bundled with Claude Code or installable from github.com/anthropics/skills; without it, see the models page at platform.claude.com/docs) before setting any of them (checked 2026-10-22):

- **Claude Opus 4.7 and Claude Opus 4.8 do not take `temperature`, `top_p` or `top_k`** — Anthropic's migration guide removes them. Newer models may follow; check before you send them. On these models, steer variation with the prompt ("answer with one label only", "give 5 different ideas") and the effort setting instead.
- **Models that still accept `temperature`:** Anthropic's range is 0.0–1.0 (there is no "1.0+"). Other providers have their own ranges.

| Task | Where `temperature` is supported | Where it is not |
|---|:-:|---|
| Classification, extraction | 0.0 | Strict tool use + one-label instructions |
| Factual Q&A, summarization | 0.2–0.5 | "Use only the given context", length limits |
| Creative writing, brainstorming | 0.7–1.0 | "Give N clearly different options" |

Low temperature is not a guarantee of identical output. For repeatable results, rely on a fixed prompt version, strict schemas and evals.

## Token Budget Management

### Input tokens (cost + context window)

| Component | Typical tokens |
|-----------|--------------:|
| System prompt | 500-2000 |
| Few-shot examples | 1000-5000 |
| Context (RAG) | 2000-8000 |
| User input | 50-2000 |

**Reduce input tokens:**
- Cache static portions (Anthropic prompt caching: 90% savings)
- Keep only the most useful examples
- Summarize long context

### Output tokens (cost + latency)

```python
# Set explicit max
response = await client.messages.create(
    max_tokens=300,  # don't pay for unwanted verbosity
    messages=[...]
)

# Or force conciseness in prompt:
# "Answer in 1-2 sentences."
# "Output only the JSON, no explanation."
```

## Prompt Versioning

```python
# Version prompts in code, not databases
PROMPTS = {
    "classifier_v3": {
        "model": "<model-id>",  # current id: see the claude-api skill
        "temperature": 0,  # only if the model accepts it — omit on Opus 4.7 / 4.8
        "system": "...",
        "examples": [...],
    },
}

# Each call references version explicitly
result = await call(prompt_key="classifier_v3", input=...)

# Logs include version → can analyze later
```

## Debugging Prompts

When output is wrong:

1. **Show input + output to a human** — is it actually wrong?
2. **Check if instructions are followed** — if not, they are unclear or contradict each other
3. **Add explicit examples** of similar inputs
4. **Tighten the output format** (strict tool use, fixed labels) if output varies when it shouldn't — lower `temperature` only on models that accept it
5. **Add constraints and examples** if output is creative when it shouldn't be
6. **Try CoT** for reasoning failures
7. **Try a different model tier** (Sonnet → Opus, or a smaller one)

## Common Patterns for Common Tasks

### Classification
- Role + categories defined
- Few-shot with edge cases
- Tool use for structured output
- Temperature 0 where the model supports it

### Extraction
- Schema definition (via tool use)
- "Extract only what's explicitly stated"
- Negative example: "If not present, return null"
- Temperature 0 where the model supports it

### Summarization
- Style + length constraints
- Audience description
- Examples of good summaries
- Temperature 0.3-0.5 where the model supports it

### Generation (creative)
- Persona / tone definition
- Constraints (length, format)
- Examples (3-5 diverse)
- Temperature 0.7-1.0 where the model supports it; otherwise ask for clearly different options

### Q&A (with context)
- Citation requirement
- "Only based on provided context"
- Refusal pattern
- Temperature 0 where the model supports it

## Reference

- [Anthropic Prompt Engineering Guide](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering)
- [OpenAI Cookbook](https://cookbook.openai.com/)
- [Prompting Guide](https://www.promptingguide.ai/)
- [Lilian Weng's Prompt Engineering Survey](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/)
