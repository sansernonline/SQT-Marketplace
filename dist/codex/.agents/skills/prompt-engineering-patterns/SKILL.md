---
name: prompt-engineering-patterns
description: Use when designing or optimizing prompts for LLMs, building prompt templates, implementing few-shot learning, chain-of-thought reasoning, structured output, or systematic prompt improvement. Covers production patterns with concrete examples.
---

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

**Why it works:** Sets expectations for output style, expertise level, communication.

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
- Recent examples bias more

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
client.messages.create(
    tools=[{
        "name": "save_user",
        "description": "Save extracted user information",
        "input_schema": {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "age": {"type": "integer", "minimum": 0, "maximum": 120},
                "email": {"type": "string", "format": "email"},
                "is_active": {"type": "boolean"}
            },
            "required": ["name", "email"]
        }
    }],
    tool_choice={"type": "tool", "name": "save_user"}
)

# response.content[0].input is GUARANTEED valid
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

**Why bad:** Doesn't help. Just write clear instructions.

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

| Temperature | Use case |
|:-----------:|----------|
| 0.0 | Deterministic, classification, extraction |
| 0.2-0.5 | Factual Q&A, summarization |
| 0.7-0.9 | Creative writing, brainstorming |
| 1.0+ | Highly creative (rarely needed) |

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
- Trim examples to most informative
- Compress with summarization

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
        "model": "claude-sonnet-4-5",
        "temperature": 0,
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
2. **Check if instructions are followed** — if not, instructions unclear or contradictory
3. **Add explicit examples** of similar inputs
4. **Increase temperature 0** if non-deterministic when shouldn't be
5. **Decrease temperature** if creative when shouldn't be
6. **Try CoT** for reasoning failures
7. **Try different model tier** (Sonnet → Opus, or down)

## Common Patterns for Common Tasks

### Classification
- Role + categories defined
- Few-shot with edge cases
- Tool use for structured output
- Temperature 0

### Extraction
- Schema definition (via tool use)
- "Extract only what's explicitly stated"
- Negative example: "If not present, return null"
- Temperature 0

### Summarization
- Style + length constraints
- Audience description
- Examples of good summaries
- Temperature 0.3-0.5

### Generation (creative)
- Persona / tone definition
- Constraints (length, format)
- Examples (3-5 diverse)
- Temperature 0.7+

### Q&A (with context)
- Citation requirement
- "Only based on provided context"
- Refusal pattern
- Temperature 0

## Reference

- [Anthropic Prompt Engineering Guide](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering)
- [OpenAI Cookbook](https://cookbook.openai.com/)
- [Prompting Guide](https://www.promptingguide.ai/)
- [Lilian Weng's Prompt Engineering Survey](https://lilianweng.github.io/posts/2023-03-15-prompt-engineering/)
