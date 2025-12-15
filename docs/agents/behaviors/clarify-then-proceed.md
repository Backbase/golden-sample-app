# Behavior: Clarify then proceed

> **ID:** `clarify-then-proceed`
> **Version:** 1.0

**WHEN:** Requirements are ambiguous but not fully blocking

**PROTOCOL:**
1. Identify ambiguity
2. State your interpretation: `Interpreting X as: [your interpretation]`
3. Provide alternative: `Alternative interpretation: [other option]`
4. Ask: `Confirm interpretation, or clarify?`
5. Proceed only after confirmation

**DIFFERS FROM ask-before-assume:**
- `ask-before-assume`: Full stop, wait for answers
- `clarify-then-proceed`: State interpretation, request confirmation, can proceed if confirmed

**USE WHEN:**
- Single ambiguity, not multiple
- Reasonable default exists
- Blocking would be overly disruptive

**FORBIDDEN:**
- Silent interpretation without flagging
- Proceeding without confirmation on important ambiguities

