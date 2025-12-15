# clean-code

**Agent:** Implementation  
**V-Model:** 2.2 (CREATE), 3.2 (JUDGE)

## Purpose

Write readable, maintainable code. Complements Angular-specific ADR patterns.

## Naming

| Element | Convention | Example |
|---------|------------|---------|
| Boolean | is/has/can/should prefix | `isValid`, `hasPermission`, `canSubmit` |
| Function | verb + noun | `calculateTotal`, `fetchUser`, `validateForm` |
| Event handler | on + event | `onSubmit`, `onClick`, `onPaymentComplete` |
| Observable | $ suffix | `user$`, `payments$`, `loading$` |
| Constants | UPPER_SNAKE | `MAX_RETRY_COUNT`, `DEFAULT_PAGE_SIZE` |

## Method Design

| Constraint | Limit | Why |
|------------|-------|-----|
| Lines | ≤24 | Cognitive load, testability |
| Parameters | ≤4 | Beyond 4 → use options object |
| Nesting depth | ≤3 | Early return, extract method |
| Responsibilities | 1 | Single reason to change |

## Code Smells → Fixes

| Smell | Detection | Fix |
|-------|-----------|-----|
| Long method | >24 lines | Extract helper methods |
| Long parameter list | >4 params | Introduce parameter object |
| Nested conditionals | >3 levels | Early return, guard clauses |
| Duplicate code | Same logic 2+ places | Extract shared function |
| Magic numbers | Unexplained literals | Named constants |
| Dead code | Unused imports/methods | Delete |

## Comment Rules

| Comment Type | When to Use |
|--------------|-------------|
| `// RULE:` | Business logic explanation |
| `// ASSUMPTION:` | Assumption made, may need verification |
| `// TODO:` | Known incomplete, needs follow-up |
| `// ADR-XXX:` | Explains why pattern is used (links to ADR) |
| `/** JSDoc */` | Public method API documentation |

**Don't comment:** What code does (code should be self-explanatory)  
**Do comment:** Why code does it (intent, business rules)

## JUDGE Mode: Code Quality

| Check | How to Verify |
|-------|---------------|
| Method size | Count lines (≤24) |
| Naming | Follows conventions above |
| Single responsibility | One reason to change per unit |
| No dead code | All code reachable and used |
| Comments meaningful | Explain why, not what |

