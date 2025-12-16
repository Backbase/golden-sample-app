# ADR-[NNN]: [Title]

## 1. Summary

<!-- LLM: Always load this section first -->

### TL;DR

> [2-3 sentences. The essential takeaway.]

### Rules

**MUST DO ✅**

1. [Rule 1]
2. [Rule 2]
3. [Rule 3]
4. [Rule 4]
5. [Rule 5]

**MUST NOT ❌**

1. [Anti-pattern 1]
2. [Anti-pattern 2]
3. [Anti-pattern 3]
4. [Anti-pattern 4]
5. [Anti-pattern 5]

---

## 2. Patterns

<!-- LLM: Load for code generation tasks -->

### Pattern Index

| Keywords | Pattern |
|----------|---------|
| [keyword1, keyword2] | [Pattern 1](#pattern-1-name) |
| [keyword3, keyword4] | [Pattern 2](#pattern-2-name) |
| [keyword5, keyword6] | [Pattern 3](#pattern-3-name) |

<!-- 
PATTERN AUTHORING GUIDELINES:

1. BREVITY: Show only the key lines that demonstrate the pattern.
   - Good: 10-20 lines focusing on the essential concept
   - Bad: 50+ lines of complete class with boilerplate
   - Use comments like `// ... setup ...` to abbreviate non-essential code

2. NO DUPLICATION: Before adding a pattern, check if it exists elsewhere:
   - Common patterns (subscriptions, OnPush, type safety, DOM, HTTP testing) → Reference ADR-000
   - Example: "For subscription cleanup, see ADR-000 Pattern 1"
   
3. ONE CONCEPT PER PATTERN: Each pattern should teach ONE thing.
   - Good: "Pattern 1: Form Validation" (focused)
   - Bad: "Pattern 1: Forms, Validation, and Error Handling" (too broad)

4. CONTEXT COMMENTS: Start code with comments explaining scenario and rule:
   // CONTEXT: [what scenario this addresses]
   // RULE: [what principle this demonstrates]
-->

---

### Pattern 1: [Name]

**Use when:** [conditions]

**Don't use when:** [counter-conditions]

✅ **Good**

```typescript
// CONTEXT: [scenario]
// RULE: [what this demonstrates]

[code example - 10-20 lines max, focus on key concept]
```

❌ **Bad**

```typescript
// PROBLEM: [what's wrong]

[anti-pattern code - brief, showing the mistake]
```

**Why it's wrong:** [1-2 sentences explaining the issue]

**Verify:**
- [ ] [check 1]
- [ ] [check 2]

---

### Pattern 2: [Name]

**Use when:** [conditions]

**Don't use when:** [counter-conditions]

✅ **Good**

```typescript
// CONTEXT: [scenario]
// RULE: [what this demonstrates]

[code example]
```

❌ **Bad**

```typescript
// PROBLEM: [what's wrong]

[anti-pattern code]
```

**Why it's wrong:** [explanation]

**Verify:**
- [ ] [check 1]
- [ ] [check 2]

---

### Pattern 3: [Name]

**Use when:** [conditions]

**Don't use when:** [counter-conditions]

✅ **Good**

```typescript
// CONTEXT: [scenario]
// RULE: [what this demonstrates]

[code example]
```

❌ **Bad**

```typescript
// PROBLEM: [what's wrong]

[anti-pattern code]
```

**Why it's wrong:** [explanation]

**Verify:**
- [ ] [check 1]
- [ ] [check 2]

---

## 3. Validation

<!-- LLM: Load for code review tasks -->

<!--
VALIDATION AUTHORING GUIDELINES:

1. CHECK FOR EXISTING IDs: Before creating new check IDs, verify the check doesn't exist in:
   - ADR-000 (common patterns): COMMON-001 through COMMON-006
   - Other ADRs in this folder
   
2. REFERENCE COMMON CHECKS: If a check applies to a common pattern, reference it:
   - Instead of: "SEC-001: Subscription cleanup" 
   - Use: "See COMMON-001 in ADR-000"

3. CONSISTENT SEVERITY: Use these definitions:
   - 🔴 BLOCKER: Security risk, memory leak, breaking functionality, accessibility failure
   - 🟡 WARNING: Best practice violation, maintainability concern, performance impact

4. UNIQUE TO THIS ADR: Only include checks specific to this ADR's domain.
-->

### Automated Checks

| ID | Check | Severity | How to Detect |
|----|-------|----------|---------------|
| `[PREFIX]-001` | [description] | 🔴 BLOCKER | `[grep pattern or tool]` |
| `[PREFIX]-002` | [description] | 🔴 BLOCKER | `[grep pattern or tool]` |
| `[PREFIX]-003` | [description] | 🟡 WARNING | `[grep pattern or tool]` |

### Review Checklist

| ID | Check | Severity |
|----|-------|----------|
| `[PREFIX]-R01` | [description] | 🔴 BLOCKER |
| `[PREFIX]-R02` | [description] | 🔴 BLOCKER |
| `[PREFIX]-R03` | [description] | 🟡 WARNING |

### Required Tests

| Scenario | Type | Required |
|----------|------|----------|
| [scenario 1] | Unit | ✅ Yes |
| [scenario 2] | Integration | ✅ Yes |
| [scenario 3] | E2E | ⚪ Optional |

---

## 4. Context

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding the historical context.
Keep to 5-10 lines maximum.
-->

### Problem

[2-3 sentences: What problem does this ADR solve?]

### Business Drivers

- [Driver 1]
- [Driver 2]
- [Driver 3]

### Technical Constraints

- [Constraint 1]
- [Constraint 2]

---

## 5. Decision

<!--
LLM: SKIP this section unless user asks about rationale or alternatives.
This section documents WHY the decision was made for human readers.
Keep to 10-15 lines maximum.
-->

### What We Decided

[2-3 sentences: Clear statement of the decision.]

### Rationale

1. **[Reason 1]**: [1 sentence]
2. **[Reason 2]**: [1 sentence]
3. **[Reason 3]**: [1 sentence]

### Alternatives Considered

| Alternative | Verdict |
|-------------|---------|
| [Option 1] | Rejected: [1 sentence why] |
| [Option 2] | Rejected: [1 sentence why] |

---

## 6. Implementation

<!--
LLM: Load selectively - "Affected Components" useful for scoping, rest is reference.
-->

### Affected Components

| Component | Impact | Files |
|-----------|--------|-------|
| [type] | CREATE / MODIFY | `[pattern]` |
| [type] | MODIFY | `[pattern]` |

### Related ADRs

| ADR | Relationship |
|-----|--------------|
| [ADR-000: Common Angular Patterns] | Reference: [which patterns] |
| [ADR-NNN] | [Depends on / Extends / Related to] |

### Migration Notes

[If changing existing behavior, 2-3 bullet points on how to migrate. Otherwise: "N/A - new standard"]

---

## 7. Examples

<!--
EXAMPLE AUTHORING GUIDELINES:

1. DIFFERENT SCENARIO: The complete example MUST use a different domain/entity than the patterns.
   - If patterns use PaymentService → example should use AccountService or TransactionService
   - This tests understanding, not copy-paste ability

2. REALISTIC BUT BRIEF: 40-60 lines maximum showing a complete, working scenario.
   - Include imports and class structure
   - Show how multiple patterns from this ADR work together
   - Use comments to abbreviate non-essential parts: // ... validation logic ...

3. COMMON MISTAKES: Show 2-3 brief mistakes (5-10 lines each) that are:
   - Different from the ❌ Bad examples in patterns
   - Common errors developers actually make
   - Quick to understand with 1-line fix
-->

### Complete Example

**Scenario:** [realistic scenario - MUST BE DIFFERENT domain than patterns above]

```typescript
// File: [path]

[complete working code, 40-60 lines, demonstrating multiple patterns together]
```

### Common Mistakes

**Mistake 1: [name]**

```typescript
// ❌ Wrong
[brief code - 3-5 lines]

// ✅ Fix
[brief code - 3-5 lines]
```

**Mistake 2: [name]**

```typescript
// ❌ Wrong
[brief code]

// ✅ Fix
[brief code]
```

---

## 8. References

<!--
REFERENCE GUIDELINES:
- Prefer versioned links (e.g., angular.io/guide/... for v17)
- External standards (WCAG, OWASP) are stable
- Internal wiki links may not be accessible to LLMs - include summary if critical
-->

- [Related doc 1](path)
- [Related doc 2](path)
- [Reference 3](url) — [brief description]
- [Reference 4](url) — [brief description]

---

