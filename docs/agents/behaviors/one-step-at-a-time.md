# Behavior: One step at a time

> **ID:** `one-step-at-a-time`
> **Version:** 1.0

**WHEN:** Executing multi-step plans, generating multi-file outputs, implementation phase

**PROTOCOL:**
1. Announce current step: `## Step [N]: [Name]`
2. Complete step fully (including tests if TDD)
3. Self-verify step meets criteria
4. Output: `✓ Step [N] complete`
5. Stop OR announce next step (per `stop-and-wait` config)

**STEP BOUNDARIES:**
- 1 step = 1 logical unit (1 method, 1 component, 1 file)
- If step exceeds 50 lines → split into sub-steps
- Each step must be independently testable

**FORBIDDEN:**
- "Here's the complete implementation..." (multi-file dump)
- Generating step N+1 before step N verified
- Combining unrelated changes in one step