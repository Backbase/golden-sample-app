# Behavior: Stop and Wait

> **ID:** `stop-and-wait`  
> **Version:** 1.0


**WHEN:** After questions, after plan, after each file (multi-file), after artifact complete, after finding BLOCKER

**PROTOCOL:**
1. Complete current phase fully
2. Output stop signal: `⛔ STOP: [reason]`
3. State what you're waiting for
4. Provide options: `✅ Approve | 🔄 Revise | ❌ Reject`
5. Do NOT continue until explicit approval

**STOP POINTS:**
- Questions → Plan: `⛔ STOP: Questions pending`
- Plan → Execute: `⛔ STOP: Plan ready for approval`
- File N → File N+1: `⛔ STOP: [file] complete. Continue?`
- BLOCKER found: Continue review, then `⛔ STOP: [N] blockers require fixes`

**FORBIDDEN:**
- "Now I'll proceed to..."
- "Next, let me also..."
- Any continuation without explicit "proceed", "continue", "approved", "lgtm"