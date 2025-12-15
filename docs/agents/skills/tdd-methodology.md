# tdd-methodology

**Agent:** Testing  
**V-Model:** 2.1 (CREATE)

## Purpose

Write tests before code. Tests define behavior; code makes tests pass.

## TDD Cycle

```
RED    → Write failing test (defines expected behavior)
       → Run test, confirm it fails
       → Failure message should be clear

GREEN  → Write minimal code to pass test
       → No more than necessary
       → "Fake it till you make it" is OK

REFACTOR → Improve code quality
         → Tests still pass
         → Apply clean-code skill
```

## Test-First Thinking

| Instead of | Think |
|------------|-------|
| "How do I implement this?" | "How will I know it works?" |
| "What code do I need?" | "What behavior do I expect?" |
| "Let me build the service" | "Let me define the service contract via tests" |

## What to Test First

| Priority | What | Why |
|----------|------|-----|
| 1 | Happy path | Core functionality works |
| 2 | Input validation | Bad input handled gracefully |
| 3 | Error cases | Failures handled correctly |
| 4 | Edge cases | Boundaries behave correctly |
| 5 | Integration points | External deps handled |

## Test Naming

```
should_[expected behavior]_when_[condition]
```

**Examples:**
- `should_return_receipt_when_payment_succeeds`
- `should_throw_validation_error_when_amount_negative`
- `should_retry_three_times_when_api_returns_503`

## TDD Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| Test after | Tests verify implementation, not behavior | Write test first, always |
| Testing implementation | Brittle, breaks on refactor | Test public behavior only |
| Too many assertions | Hard to identify failure | One assertion per test |
| Skipping RED | Might pass for wrong reason | Always see test fail first |

## Relates to ADR-013

ADR-013 defines test structure and patterns. This skill defines the TDD process:
- ADR-013: HOW to write a test (AAA, naming, mocking)
- This skill: WHEN and WHY to write tests (before code)

