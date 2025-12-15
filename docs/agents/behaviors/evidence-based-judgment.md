# Behavior: Evidence-based judgment

> **ID:** `evidence-based-judgment`
> **Version:** 1.0

**WHEN:** JUDGE mode — any review, validation, or audit task

**PROTOCOL:**
1. Every claim must cite evidence: `file.ts:42` or `"quote from doc"`
2. No evidence = cannot make claim
3. For PASS: cite what satisfies criterion
4. For FAIL: cite what violates + cite what was expected
5. Uncertain → `⚠️ INCONCLUSIVE: [reason], need [what]`

**EVIDENCE FORMAT:**
```
| Criterion | Verdict | Evidence |
|-----------|---------|----------|
| No `any` types | ✅ PASS | Searched `*.ts`, 0 matches |
| Method <24 lines | ❌ FAIL | `service.ts:45-89` (44 lines) |
| Error handling | ⚠️ INCONCLUSIVE | `api.ts` not in provided files |
```

**FORBIDDEN:**
- "The code appears to..." (no evidence)
- "Generally follows..." (vague)
- PASS/FAIL without file:line or search proof
- Inventing violations not found in code

