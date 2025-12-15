# test-case-design

**Agent:** Testing  
**V-Model:** 2.1 (CREATE), test review (JUDGE)

## Purpose

Systematically identify test cases that provide maximum coverage with minimum tests.

## Techniques

### 1. Equivalence Partitioning

Divide inputs into classes where all values should behave identically.

```
Input: age (number)
Partitions:
├── Invalid: negative (-1)
├── Child: 0-17
├── Adult: 18-64
└── Senior: 65+

Tests needed: 1 per partition (4 total), not 1 per value
```

### 2. Boundary Value Analysis

Test at edges of partitions (where bugs cluster).

```
For age partitions above:
├── -1 (invalid boundary)
├── 0 (child lower)
├── 17 (child upper)
├── 18 (adult lower)
├── 64 (adult upper)
├── 65 (senior lower)
└── MAX_INT (senior upper/invalid)
```

### 3. Decision Table

For complex business rules with multiple conditions.

```
Conditions:       | T1 | T2 | T3 | T4 |
------------------|----|----|----|----|
Has permission?   | Y  | Y  | N  | N  |
Account active?   | Y  | N  | Y  | N  |
------------------|----|----|----|----|
Expected result:  | OK | DENIED | DENIED | DENIED |
```

### 4. State Transition

For features with distinct states.

```
Payment States: DRAFT → PENDING → COMPLETED
                         ↓
                      FAILED → RETRY → PENDING
                         ↓
                      CANCELLED

Tests: Each valid transition + invalid transitions
```

## Edge Case Checklist

| Category | Cases to Test |
|----------|---------------|
| Empty | null, undefined, "", [], {} |
| Boundaries | 0, 1, -1, MAX, MIN |
| Size | Empty list, 1 item, max items |
| Format | Valid format, invalid format, special chars |
| Timing | Concurrent, timeout, slow response |
| State | Initial, mid-process, terminal |

## Coverage Strategy

| Layer | What to Cover | Target |
|-------|---------------|--------|
| Unit | Logic branches, error paths | 80%+ line coverage |
| Integration | Component interaction | Critical paths |
| E2E | User journeys | Happy paths |

## JUDGE Mode: Test Coverage

| Check | How to Verify |
|-------|---------------|
| Partitions covered | Each equivalence class has test |
| Boundaries tested | Edge values explicitly tested |
| Error cases exist | Failure scenarios covered |
| No redundant tests | Each test adds unique coverage |

