# requirements-engineering

**Agent:** Product  
**V-Model:** 1.1-1.3 (CREATE), 3.4 (JUDGE)

## Purpose

Analyze user stories, surface ambiguities, match to ADRs, produce testable acceptance criteria.

## ADR Matching

| Story Contains | Likely ADRs |
|----------------|-------------|
| UI, form, user interaction | ADR-001 (a11y), ADR-003 (i18n), ADR-004 (responsive) |
| Data display, list, table | ADR-005 (performance), ADR-012 (state) |
| Security, auth, permissions | ADR-002 (security), ADR-011 (entitlements) |
| Configuration, customization | ADR-007 (journey config), ADR-009/010 (extensions) |
| API integration | ADR-000 (patterns), ADR-008 (docs) |
| New component | ADR-006 (design system), ADR-013 (testing) |

## Ambiguity Detection

| Smell | Example | Action |
|-------|---------|--------|
| Vague scope | "improve the form" | Ask: which form? what improvement? |
| Implicit actor | "can view payments" | Ask: which user role? |
| Missing state | "show error" | Ask: which errors? how displayed? |
| Undefined data | "display user info" | Ask: which fields exactly? |
| Assumed knowledge | "like the other screen" | Ask: which screen? link? |
| Hidden complexity | "simple export" | Ask: format? filters? size limits? |

## Testable AC Format

```
GIVEN [precondition/context]
WHEN [action/trigger]
THEN [observable outcome]
```

**❌ BAD:** "User can see payments" (not testable)  
**✅ GOOD:** "GIVEN user has PAYMENTS.VIEW permission, WHEN payments page loads, THEN payment list displays with columns: date, amount, status"

## JUDGE Mode: AC Validation

| Check | Pass Criteria |
|-------|---------------|
| Completeness | Every AC has evidence in code (`file:line`) |
| Testability | AC maps to at least one test case |
| NFR coverage | Each selected ADR has implementation evidence |

