# JIRA-001 Implementation Playbook

## View Transactions by Account

---

## Setup

```bash
mkdir -p docs/specs/JIRA-001
```

**Artifacts:** (`docs/specs/JIRA-001/`)
- `task.md` - Selected ADRs + repo context + disambiguated story
- `solution-design.md` - Solution design with ADR compliance
- `execution-plan.md` - Step breakdown

---

# Part 1: SPECS

## Step 1.1: Select Relevant ADRs

**Prompt:** `select-adrs`

```
I'm implementing JIRA-001: View Transactions by Account.
User story: @docs/JIRA-001.md 

## SELECT RELEVANT ADRs
Review available ADRs in @architecture  folder and advise which apply to this feature.

The ones I found relevant are:
- @docs/architecture/001-ADR-accessibility-standards.md 
- @docs/architecture/003-ADR-translation-internationalization-standards.md 
- @docs/architecture/006-ADR-design-system-component-standards.md 
- @docs/architecture/011-ADR-entitlements-access-control-standards.md 
- @docs/architecture/013-ADR-unit-integration-testing-standards.md 

Confirm this selection or suggest additions/removals.
```

**After LLM response:** Save selected ADRs to `docs/specs/JIRA-001/task.md`:

```markdown
# JIRA-001: View Transactions by Account

## Selected ADRs
- ADR-001: Accessibility
- ADR-003: i18n
- ADR-004: Responsiveness
- ADR-005: Performance
- ADR-006: Design System
- ADR-011: Entitlements
- ADR-012: State Management
- ADR-013: Testing
```

## Step 1.2: Select Repo-Wide Specs

**Prompt:** `select-repo-specs`

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

Append repo context to: docs/specs/JIRA-001/task.md
```

---

## Step 1.3: Disambiguate User Story

**Prompt:** `disambiguate-story`

**Output:** Complete `docs/specs/JIRA-001/task.md`

```
## ACTIVATE AGENT
@docs/agents/angular-typescript-agent.md
Act as the Senior Angular/TypeScript Agent.

## DISAMBIGUATE USER STORY
User story: @docs/JIRA-001.md
Context: @docs/specs/JIRA-001/task.md (selected ADRs and repo context)

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
Append disambiguation and decomposition to: docs/specs/JIRA-001/task.md

STOP and wait for answers to BLOCKING questions.
```

### 🚦 Answer Clarification Questions

Answer all BLOCKING questions before proceeding. For CONTEXT REQUESTS, provide if available or state "not available".

---

## Step 1.4: Create Solution Design

**Prompt:** `create-solution-design`

**Output:** `docs/specs/JIRA-001/solution-design.md` and `docs/specs/JIRA-001/execution-plan.md`

After answering all questions:

```
Based on the approved spec, create solution design.

## INPUTS
- Task with selected ADRs: @docs/specs/JIRA-001/task.md
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
For each selected ADR, describe how it will be addressed:
| ADR | How Addressed |
|-----|---------------|
| ADR-XXX | ... |

## Output
Save to: docs/specs/JIRA-001/solution-design.md and docs/specs/JIRA-001/execution-plan.md

Do NOT generate code. Wait for approval.
```

### 🚦 Review Solution Design

- [ ] Every AC maps to at least one step
- [ ] No orphan steps (scope creep)
- [ ] File paths correct
- [ ] ADR compliance defined

**If OK:** "Plan approved. Save to docs/specs/JIRA-001/solution-design.md and execution-plan.md"

---

## Step 1.5: 🚦 SIGN-OFF

Commit all Part 1 artifacts:

```bash
git add docs/specs/JIRA-001/
git commit -m "specs(JIRA-001): approved spec and plan"
```

---

# Part 2: CODING

For **each step** in the execution plan, repeat this cycle:

## Step 2.1: Generate Tests

**Prompt:** `generate-tests`

```
## AGENT
@docs/agents/angular-typescript-agent.md

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

### 🚦 Review Tests

- [ ] Tests cover acceptance criteria
- [ ] Mocks appropriate
- [ ] Edge cases covered

**If OK:** "Tests approved. Now implement the code."

---

## Step 2.2: Generate Code

**Prompt:** `implement-step`

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

---

## Step 2.3: Run Step Tests

```bash
# Run tests for this step
nx test transactions-journey-internal-feature-transaction-view --watch=false
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

## Step 2.4: Commit Step

After tests pass, commit:

```bash
git add .
git commit -m "feat(JIRA-001): step [N] - [description]"
```

---

**Repeat Steps 2.1-2.4** for each step in the execution plan.

---

# Part 3: VALIDATION

After all steps are implemented:

## Step 3.1: Run All Tests

```bash
# Unit tests
nx test transactions-journey --watch=false
nx test transactions-journey-internal-feature-transaction-view --watch=false
nx test transactions-journey-internal-data-access --watch=false

# E2E tests (with real backend if available)
nx e2e transactions-journey-e2e
```

---

## Step 3.2: Code Review

**Prompt:** `code-review`

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

### 🚦 Fix Blockers

Fix blockers, re-run tests.

---

## Step 3.3: Architecture Review

**Prompt:** `architecture-review`

```
## ARCHITECTURE REVIEW

Review implementation against:
- Solution design: @docs/specs/JIRA-001/solution-design.md
- Task with selected ADRs: @docs/specs/JIRA-001/task.md

Check architecture compliance:
1. Does implementation follow the approved plan structure?
2. Are all selected ADR requirements met? (check each ADR from Step 1.1)
3. Layer violations? (Components importing HttpClient directly?)
4. Classes with >10 public methods?

Output format:
[BLOCKER|WARNING]: description
- ADR/Plan violation: [which rule]
- File: [path]
- Fix: [corrected code for blockers]

End with: "Architecture Compliant" or "Violations found: X blockers"
```

### 🚦 Fix Violations

Fix blockers, re-run tests.

---

## Step 3.4: Product Review

**Prompt:** `product-review`

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

## NFR Compliance (from selected ADRs)
| ADR | Status | Evidence |
|-----|--------|----------|
| [each selected ADR] | ✅/❌ | [file:line] |

## Summary
- Total AC: 7
- Implemented: [N]
- Missing: [N]

End with: "All AC Implemented" or "Missing: X acceptance criteria"
```

### 🚦 Address Missing AC

If any AC missing, loop back to Part 2.

---

## 🚦 MERGE

- [ ] All tests green
- [ ] Code review: 0 blockers
- [ ] Architecture review: 0 blockers
- [ ] Product review: all AC ✅

```bash
git push origin feature/JIRA-001
```

---

## Quick Reference

| Part 1: Specs | Output |
|---------------|--------|
| 1.1 `select-adrs` | ADR list |
| 1.2 `select-repo-specs` | Repo context |
| 1.3 `disambiguate-story` | `task.md` |
| 1.4 `create-solution-design` | `solution-design.md`, `execution-plan.md` |
| 1.5 **SIGN-OFF** | `git commit` |

| Part 2: Coding (per step) | Gate |
|---------------------------|------|
| 2.1 `generate-tests` | Review tests |
| 2.2 `implement-step` | — |
| 2.3 Run tests | Tests pass |
| 2.4 `git commit` | — |

| Part 3: Validation | Gate |
|--------------------|------|
| 3.1 Run all tests | All green |
| 3.2 `code-review` | 0 blockers |
| 3.3 `architecture-review` | 0 blockers |
| 3.4 `product-review` | All AC ✅ |
| **MERGE** | All pass |

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

## Expected File Changes

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

## Code Patterns Reference

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

