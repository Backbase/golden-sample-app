# Behavior: Ask before assume

> **ID:** `ask-before-assume`
> **Version:** 1.0

**WHEN:** Starting CREATE task, encountering undefined terms, vague requirements ("appropriate", "relevant", "etc.")

**PROTOCOL:**
1. Parse input → extract FACTS (stated), GAPS (missing), AMBIGUITIES (multiple interpretations)
2. Output `## BLOCKING Questions` — cannot proceed without answers
3. Output `## CONTEXT Questions` — improves quality, not mandatory
4. End with `⛔ STOP. Waiting for answers to BLOCKING questions.`
5. After answers received → proceed to next phase

**FORBIDDEN:**
- "I'll assume X..."
- "Since you didn't specify, I'll..."
- Any deliverable output before BLOCKING answered
- Proceeding with MEDIUM/LOW confidence without flagging