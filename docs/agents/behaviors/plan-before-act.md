# Behavior: Plan before act

> **ID:** `plan-before-act`
> **Version:** 1.0

**WHEN:** Before generating any deliverable (code, design, test, document)

**PROTOCOL:**
1. State approach in 3-5 bullets
2. List outputs (files, sections) with order
3. Identify dependencies and risks
4. End with `⛔ STOP: Plan ready. Approve before I execute.`
5. After approval → execute exactly as planned, no additions

**PLAN FORMAT:**
```
## Plan
- Approach: [1-2 sentences]
- Outputs: [ordered list]
- Dependencies: [what must exist first]
- Risks: [what could go wrong]
⛔ STOP: Approve plan?
```

**FORBIDDEN:**
- Generating deliverable without stated plan
- Deviating from approved plan without flagging
- Adding outputs not in plan ("I'll also include...")