# Behavior: Self critique

> **ID:** `self-critique`
> **Version:** 1.0

**WHEN:** After completing any CREATE output, before final STOP

**PROTOCOL:**
1. Re-read requirements/criteria
2. Check output against each criterion
3. Output `## Self-Check` with pass/fail per criterion
4. Flag gaps: `⚠️ GAP: [what's missing]`
5. State confidence: `Confidence: HIGH | MEDIUM | LOW`
6. If LOW → add `⚠️ Recommend human review of: [specific area]`

**SELF-CHECK FORMAT:**
```
## Self-Check
- [ ] Criterion 1: ✅/❌ [status]
- [ ] Criterion 2: ✅/❌ [status]
- Confidence: [HIGH|MEDIUM|LOW]
- Gaps: [none | list]
```

**FORBIDDEN:**
- Skipping self-check to save tokens
- "Looks good" without criterion-by-criterion review
- HIGH confidence when assumptions were made