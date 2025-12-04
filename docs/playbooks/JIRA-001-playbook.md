# JIRA-001 Implementation Playbook

## View Transactions by Account - Step-by-Step Guide

This playbook guides you through implementing JIRA-001 using the V-model methodology.

---

## V-Model Overview

```
    Part 1: SPECS                              Part 3: VALIDATION
    (Left side)                                (Right side)
    
1.1 Select ADRs ──────────────────────────► 3.4 Product Review
       │                                           ▲
1.2 Select repo specs ────────────────────► 3.3 Architecture Review
       │                                           ▲
1.3 Disambiguate story ───────────────────► 3.2 Code Review
       │                                           ▲
1.4 Solution design ──────────────────────► 3.1 Run all tests
       │                                           ▲
       ▼                                           │
    ════════════════════════════════════════════════
                Part 2: CODING (Bottom)
                
                2.1 Generate tests (TDD)
                2.2 Generate code
                2.3 Run step tests + commit
                (repeat per step)
```

---

## What This POC Demonstrates

| V-Model Phase | What's Validated |
|---------------|------------------|
| **Part 1: Specs** | ADR selection, repo context, disambiguation, solution design |
| **Part 1 Sign-off** | Engineer commits artifacts, accountable for specs |
| **Part 2: Coding** | TDD, step-by-step implementation, trunk-based dev |
| **Part 3.1** | All tests (unit + e2e) pass |
| **Part 3.2** | Code Review - HOW (quality, patterns) |
| **Part 3.3** | Architecture Review - WHAT (ADRs, structure) |
| **Part 3.4** | Product Review - WHETHER (AC completeness) |

**Expected ROI Metrics:**
- Planning improves pass rates by 11-25%
- TDD improves accuracy by 12-38%
- Structured validation catches issues early

---

## How to Use This Playbook

1. **Create artifact folder**: `mkdir -p docs/specs/JIRA-001`
2. **Open Cursor Chat** (Cmd+L or Ctrl+L)
3. **Copy prompts** from this playbook into the chat
4. **Wait for responses** - never skip human gates (🚦)
5. **Apply generated code** - click "Apply" button
6. **Run terminal commands** in Cursor's integrated terminal

**Artifacts produced:**
- `docs/specs/JIRA-001/task.md` - Disambiguated user story
- `docs/specs/JIRA-001/solution-design.md` - Solution design with ADR compliance
- `docs/specs/JIRA-001/execution-plan.md` - Step-by-step breakdown

---

# Part 1: SPECS (V-model left side)

## Step 1.1: Select Relevant ADRs

Copy this prompt into Cursor Chat:

```
## TASK
I'm implementing JIRA-001: View Transactions by Account.
User story: @docs/JIRA-001.md

## SELECT RELEVANT ADRs
Review available ADRs and confirm which apply to this feature:

| ADR | Applies? | Reason |
|-----|----------|--------|
| @docs/architecture/001-ADR-accessibility-standards.md | Yes | UI component needs a11y |
| @docs/architecture/003-ADR-translation-internationalization-standards.md | Yes | User-facing text |
| @docs/architecture/006-ADR-design-system-component-standards.md | Yes | Account selector component |
| @docs/architecture/011-ADR-entitlements-access-control-standards.md | Yes | Route protection |
| @docs/architecture/013-ADR-unit-integration-testing-standards.md | Yes | Test coverage required |

Confirm this selection or suggest additions/removals.
```

---

## Step 1.2: Select Repo-Wide Specs

```
## REPO CONTEXT for JIRA-001

Review repo architecture and identify relevant conventions:

Target Files (to be modified):
- @libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.ts
- @libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.html
- @libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.module.ts
- @libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/transactions-view.component.spec.ts
- @libs/transactions-journey/src/lib/transactions-journey-shell.module.ts

Reference Files (existing patterns):
- @libs/transactions-journey/internal/data-access/src/lib/services/arrangements/arrangements.service.ts
- @libs/transactions-journey/e2e-tests/mocks/product-summary-arrangements.json

PROJECT CONVENTIONS:
- NgRx with actions/reducers/selectors pattern for state management
- Effects for side effects (API calls, navigation)
- Cross-module communication via NgRx store
- Journey feature modules are lazy-loaded and self-contained

Identify any existing patterns in this repo I should follow for this feature.
```

---

## Step 1.3: Disambiguate User Story

```
## ACTIVATE AGENT
@docs/agents/angular-typescript-agent.md
Act as the Senior Angular/TypeScript Agent.

## DISAMBIGUATE USER STORY
User story: @docs/JIRA-001.md
Selected ADRs: ADR-001, ADR-003, ADR-006, ADR-011, ADR-013

Before creating a solution design, clarify the requirements:

## BLOCKING Questions (cannot proceed without answers)
Identify ambiguities in the requirements:
1. Edge cases not specified
2. Error conditions to handle
3. Missing acceptance criteria details

## CONTEXT Requests (provide if available)
4. API contracts / OpenAPI specs for arrangements endpoint
5. UI mockups or wireframes
6. Existing types/interfaces to reuse

## Decomposition
Break this user story into discrete, testable parts:
| Part | Description | Acceptance Criteria |
|------|-------------|---------------------|
| P1   | ...         | AC: ...             |
| P2   | ...         | AC: ...             |

## Output
Save disambiguated task to: docs/specs/JIRA-001/task.md

STOP and wait for answers to BLOCKING questions.
```

### 🚦 HUMAN GATE - Answer Clarification Questions

**BLOCKING questions** - must answer before proceeding:
- "Should the account selector show all accounts or only active ones?"
- "What should happen when no account is selected?"

**CONTEXT REQUESTS** - provide if available, or state "not available":
- "Do you have OpenAPI specs for the arrangements endpoint?"
- "Are there UI mockups or wireframes?"

---

## Step 1.4: Create Solution Design

After answering all questions:

```
Based on the approved spec, create solution design.

## INPUTS
- Disambiguated task: @docs/specs/JIRA-001/task.md
- Selected ADRs: ADR-001, ADR-003, ADR-006, ADR-011, ADR-013
- Repo conventions: NgRx patterns, lazy-loaded journeys

## SOLUTION DESIGN

### Implementation Steps
For each step:
- Step ID (S1, S2, ...)
- Description
- Target file(s): exact paths
- Interfaces/types required
- Dependencies

### Validation Checklist
| Acceptance Criterion | Covered By Step |
|---------------------|-----------------|
| AC: Account selector displays | S1 |
| AC: Shows all accounts | S2 |
| ... | ... |

⚠️ **Gaps:** [List any AC not covered, or "All AC covered"]

### ADR Compliance
| ADR | How Addressed |
|-----|---------------|
| ADR-001 | Accessibility attributes on selector |
| ADR-003 | i18n for all labels |
| ADR-006 | Use bb-account-selector-ui |
| ADR-011 | EntitlementsGuard on route |
| ADR-013 | Unit tests for each step |

## Output
Save to: docs/specs/JIRA-001/solution-design.md and docs/specs/JIRA-001/execution-plan.md

Do NOT generate code. Wait for approval.
```

### 🚦 HUMAN GATE - Review Solution Design

Review the plan:

**Validation Checklist:**
- [ ] Does every AC map to at least one step?
- [ ] Are there orphan steps (scope creep)?
- [ ] Are file paths correct?

**ADR Compliance:**
- [ ] ADR-001: Accessibility approach defined?
- [ ] ADR-003: i18n approach defined?
- [ ] ADR-006: Uses `@backbase/ui-ang` components?
- [ ] ADR-011: EntitlementsGuard specified?
- [ ] ADR-013: Test coverage approach?

**If acceptable:** "Plan approved. Save to docs/specs/JIRA-001/solution-design.md and execution-plan.md"

---

## Step 1.5: 🚦 SIGN-OFF GATE

Commit all Part 1 artifacts:

```bash
git add docs/specs/JIRA-001/
git commit -m "specs(JIRA-001): approved spec and plan"
```

**This commit marks engineer sign-off.** Engineer is accountable for these specifications.

---

# Part 2: CODING (V-model bottom)

For **each step** in the solution design, follow this TDD cycle:

## Step 2.1: Generate Tests (TDD)

```
## AGENT
@docs/agents/angular-typescript-agent.md (or unit-tests-agent if available)

## GENERATE TESTS
Based on: @docs/specs/JIRA-001/execution-plan.md
Generate unit tests for Step [N]: [STEP NAME]

Requirements:
- Follow AAA pattern (Arrange-Act-Assert)
- Use naming: should_[expected]_when_[condition]
- Cover: happy path, error case, edge case
- Mock external dependencies (services, HTTP)
- One assertion per test

Reference: @docs/architecture/013-ADR-unit-integration-testing-standards.md

Do NOT implement the code. Output tests only.
Wait for my review before implementing.
```

### 🚦 HUMAN GATE - Review Tests

- [ ] Do tests cover the step's acceptance criteria?
- [ ] Are mocks appropriate?
- [ ] Are edge cases covered?

**If acceptable:** "Tests approved. Now implement the code."

---

## Step 2.2: Generate Code

```
## AGENT
@docs/agents/angular-typescript-agent.md

## IMPLEMENT STEP
Based on: @docs/specs/JIRA-001/execution-plan.md
Implement Step [N]: [STEP NAME]

Constraints:
- Must pass the tests generated above
- Maximum 24 lines per method
- Include JSDoc for public methods
- Use OnPush change detection
- Include i18n for user-facing text (ADR-003)
- Include accessibility attributes (ADR-001)

Add inline comments:
- RULE: for business rules
- ASSUMPTION: for assumptions made

Output the implementation code.
```

> **Cursor Tip:** Click **"Apply"** button on code blocks to apply changes.

---

## Step 2.3: Run Step Tests + Commit

```bash
# Run tests for this step
nx test transactions-journey-internal-feature-transaction-view --watch=false
```

**If tests pass:**
```bash
git add .
git commit -m "feat(JIRA-001): step [N] - [description]"
```

**If tests fail:**
```
Test failed:

TEST: [test name]
ERROR: [error message]
STACK: [stack trace]

Rules:
1. Fix the IMPLEMENTATION, not the test
2. Only modify test if it has obvious bug
3. Explain what was wrong

Output corrected code.
```

---

## Repeat for Each Step

Repeat Steps 2.1-2.3 for each step in the solution design.

**Trunk-based development:** Each step = one commit. If step fails, revert and retry.

---

# Part 3: VALIDATION (V-model right side)

After all steps are implemented, run full validation.

## Step 3.1: Run All Tests

```bash
# Unit tests
nx test transactions-journey --watch=false
nx test transactions-journey-internal-feature-transaction-view --watch=false
nx test transactions-journey-internal-data-access --watch=false

# E2E tests (with real backend if available)
nx e2e transactions-journey-e2e
```

All tests must pass before proceeding.

---

## Step 3.2: LLM Code Review

**Focus:** HOW the code is written (quality, patterns, readability)

```
## CODE REVIEW
@docs/agents/code-review-agent.md (or angular-typescript-agent)

Review all code changes for JIRA-001:
@libs/transactions-journey/internal/feature-transaction-view/src/lib/components/transactions-view/

Check coding standards:
1. Null/undefined handling
2. Error handling completeness (catchError on Observables)
3. Observable subscription cleanup (takeUntilDestroyed)
4. Method size (<24 lines)
5. Single responsibility principle
6. Naming conventions
7. JSDoc on public methods
8. No `any` types

Output format:
[BLOCKER|WARNING|SUGGESTION]: description
- File: [path]
- Line: [number]
- Fix: [corrected code for blockers]

End with: "Approved" or "Changes required: X blockers"
```

### 🚦 HUMAN GATE - Fix Blockers

Apply fixes for any blockers, re-run tests.

---

## Step 3.3: LLM Architecture Review

**Focus:** WHAT was built (structure, ADR compliance, follows solution design)

```
## ARCHITECTURE REVIEW

Review implementation against:
- Solution design: @docs/specs/JIRA-001/solution-design.md
- Selected ADRs: ADR-001, ADR-003, ADR-006, ADR-011, ADR-013

Check architecture compliance:
1. Does implementation follow the approved plan structure?
2. ADR-001: Accessibility attributes present on all interactive elements?
3. ADR-003: All user-facing text has i18n markers?
4. ADR-006: Uses @backbase/ui-ang components (bb-account-selector-ui)?
5. ADR-011: EntitlementsGuard on route with correct triplet?
6. ADR-013: Unit tests exist for new code?
7. Layer violations? (Components importing HttpClient directly?)
8. Classes with >10 public methods?

Output format:
[BLOCKER|WARNING]: description
- ADR/Plan violation: [which rule]
- File: [path]
- Fix: [corrected code for blockers]

End with: "Architecture Compliant" or "Violations found: X blockers"
```

### 🚦 HUMAN GATE - Fix Architecture Violations

Apply fixes for any blockers, re-run tests.

---

## Step 3.4: LLM Product Review

**Focus:** WHETHER the right thing was built (AC completeness)

```
## PRODUCT REVIEW

User story: @docs/JIRA-001.md
Task spec: @docs/specs/JIRA-001/task.md

Validate each acceptance criterion is implemented:

| AC | Description | Status | Evidence |
|----|-------------|--------|----------|
| AC-1 | Account selector dropdown displays | ✅/❌ | [file:line] |
| AC-2 | Dropdown shows all accounts from API | ✅/❌ | [file:line] |
| AC-3 | Each account shows name and number | ✅/❌ | [file:line] |
| AC-4 | Selecting account updates display | ✅/❌ | [file:line] |
| AC-5 | Transaction list filters by account | ✅/❌ | [file:line] |
| AC-6 | Default account on page load | ✅/❌ | [file:line] |
| AC-7 | Transaction shows recipient, date, amount, account | ✅/❌ | [file:line] |

## NFR Compliance
| NFR | Status | Evidence |
|-----|--------|----------|
| ADR-001: Keyboard nav, ARIA, screen reader | ✅/❌ | [file:line] |
| ADR-003: All text translatable | ✅/❌ | [file:line] |
| ADR-006: Uses bb-account-selector-ui | ✅/❌ | [file:line] |
| ADR-011: EntitlementsGuard on route | ✅/❌ | [file:line] |
| ADR-013: ≥80% test coverage | ✅/❌ | [coverage report] |

## Summary
- Total AC: 7
- Implemented: [N]
- Missing: [N]

End with: "All AC Implemented" or "Missing: X acceptance criteria"
```

### 🚦 HUMAN GATE - Address Missing AC

If any AC missing, loop back to Part 2 and implement.

---

## 🚦 FINAL GATE - Merge

All validation must pass:
- [ ] 3.1: All tests green (unit + e2e)
- [ ] 3.2: Code review approved (0 blockers)
- [ ] 3.3: Architecture review compliant (0 blockers)
- [ ] 3.4: Product review complete (all AC ✅)

```bash
git push origin feature/JIRA-001
# Create PR and merge to main
```

---

## Summary: Quick Reference

### Part 1: Specs (before coding)

| Step | What | Output | Gate |
|------|------|--------|------|
| 1.1 | Select ADRs | ADR list | — |
| 1.2 | Select repo specs | Repo context | — |
| 1.3 | Disambiguate story | `task.md` | Answer BLOCKING |
| 1.4 | Solution design | `solution-design.md`, `execution-plan.md` | Approve plan |
| 1.5 | **SIGN-OFF** | `git commit` | Engineer accountable |

### Part 2: Coding (per step)

| Step | What | Gate |
|------|------|------|
| 2.1 | Generate tests | Review tests |
| 2.2 | Generate code | — |
| 2.3 | Run tests + commit | Tests pass |

### Part 3: Validation (after all coding)

| Step | Focus | Gate |
|------|-------|------|
| 3.1 | Run all tests (unit + e2e) | All green |
| 3.2 | Code Review (HOW) | 0 blockers |
| 3.3 | Architecture Review (WHAT) | 0 blockers |
| 3.4 | Product Review (WHETHER) | All AC ✅ |
| **MERGE** | — | All pass |

**Artifacts:** `docs/specs/JIRA-001/`

**Agent Usage:**
- Part 1: `angular-typescript-agent`
- Part 2: `angular-typescript-agent` (tests + code)
- Part 3.2: `code-review-agent`
- Part 3.3-3.4: `angular-typescript-agent`

---

## Troubleshooting

### LLM generates code without waiting
Type in chat: "STOP. You skipped a human gate. Go back to [phase] and wait for my approval."

### LLM ignores ADR requirements
Type in chat: "Check ADR-[XXX] before proceeding. Specifically look at [section]. Update your response to comply."

### Code doesn't apply correctly
1. Click "Reject" on the code block
2. Ask the LLM to regenerate with more context
3. Or manually copy-paste the code

### Tests fail unexpectedly
1. Check if mocks are correctly set up
2. Verify imports are correct
3. Check for async issues (use fakeAsync/tick)

### Component doesn't render
1. Check module imports/exports
2. Verify selector matches template usage
3. Check for OnPush change detection issues with async data

### Context seems missing
If LLM doesn't seem to see a file, re-add it with `@filename` in your next message.

---

## Files Changed Summary

After completing this playbook, you should have modified:

```
MODIFIED:
├── libs/transactions-journey/src/lib/transactions-journey-shell.module.ts
│   └── Added EntitlementsGuard to route
│
└── libs/transactions-journey/internal/feature-transaction-view/src/lib/
    └── components/transactions-view/
        ├── transactions-view.component.ts    (account selector logic)
        ├── transactions-view.component.html  (account selector template)
        ├── transactions-view.component.scss  (styling if needed)
        ├── transactions-view.module.ts       (import AccountSelectorModule)
        └── transactions-view.component.spec.ts (new tests for account selector)
```

---

## Appendix: Key Code Patterns

### Account Selector Pattern (ADR-006)

```html
<bb-account-selector-ui
  [accounts]="accounts$ | async"
  [selectedAccount]="selectedAccount$ | async"
  (accountSelected)="onAccountSelected($event)"
  i18n-label="@@transactions.account-selector.label"
  label="Select Account"
></bb-account-selector-ui>
```

### Entitlements Guard Pattern (ADR-011)

```typescript
{
  path: '',
  component: TransactionsViewComponent,
  canActivate: [EntitlementsGuard],
  data: {
    entitlements: 'Transactions.Transactions.view',
    redirectTo: '/error/403'
  }
}
```

### OnPush with Observables Pattern

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionsViewComponent {
  accounts$ = this.arrangementsService.arrangements$;
  selectedAccount$ = this.route.queryParamMap.pipe(
    map(params => params.get('account'))
  );
}
```

### i18n Pattern (ADR-003)

```html
<label 
  i18n="Account selector label|Label for dropdown@@transactions.account-selector.label">
  Select Account
</label>
```

