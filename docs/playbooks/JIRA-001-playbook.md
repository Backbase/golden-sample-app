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
Act as the Product Agent from @docs/agents/product-agent.md in CREATE mode.

## TASK: Select ADRs for JIRA-001

**User Story:** @docs/JIRA-001.md
**Available ADRs:** @docs/architecture/

Execute PHASE 1: SELECT ADRs from your response protocol.

Output format:
| ADR | Applies | Rationale |
|-----|---------|-----------|
| ADR-XXX | Yes/No | [1 line why] |

⛔ STOP after outputting ADR selection. Wait for confirmation from the user.

After user response save selected ADRs in docs/specs/JIRA-001/task.md
```

## Step 1.2: Select Repo-Wide Specs

**Prompt:** `select-repo-specs`

```
Act as the Product Agent from @docs/agents/product-agent.md in CREATE mode.

## TASK: Gather Repo Context for JIRA-001

**Context:** @docs/specs/JIRA-001/task.md (ADRs selected in previous step)

Execute PHASE 2: REPO CONTEXT from your response protocol.

Identify repo-specific conventions that sit ON TOP OF ADRs. Do NOT solution — only gather context.

Output format:
### 1. Similar Implementations to Reference
`[Feature name]: [file path]` — do NOT copy code, just paths

### 2. API Contracts
Which endpoints are relevant? List paths only.

### 3. Existing Types/Interfaces to Reuse
List interfaces or types with file paths.

⚠️ DO NOT include:
- Files to create or modify
- Implementation decisions
- Code snippets

⛔ STOP after outputting repo context. Wait for confirmation before disambiguation.
```

---

## Step 1.3: Disambiguate User Story

**Prompt:** `disambiguate-story`

**Output:** Append to `docs/specs/JIRA-001/task.md`

```
Act as the Product Agent from @docs/agents/product-agent.md in CREATE mode.

## TASK: Disambiguate User Story for JIRA-001

**User Story:** @docs/JIRA-001.md
**Context:** @docs/specs/JIRA-001/task.md (selected ADRs and repo context)

Execute PHASE 3: DISAMBIGUATION from your response protocol.

For each ambiguity in the acceptance criteria:
- Reference the specific AC
- Ask a clear question
- Provide 2-4 options if applicable

Output format:
### BLOCKING Questions
**Q1: [Topic]**
> AC: "[quote ambiguous part]"
[Question + options]

---

### CONTEXT Questions
**Q[N]: [Topic]**
[Question about missing context]

---

⛔ STOP after outputting questions. Wait for human answers before doing anything else.
```

---

## Step 1.4: Create Solution Design

**Prompt:** `create-solution-design`

**Output:** `docs/specs/JIRA-001/solution-design.md`

After answering all questions:

```
Act as the Architect Agent from @docs/agents/architect-agent.md in CREATE mode.

## TASK: Create Solution Design for JIRA-001

**Input:** @docs/specs/JIRA-001/task.md (approved with answered questions)

Execute your full response protocol:
1. PHASE 1: UNDERSTAND — Confirm context loaded, flag any remaining questions
2. PHASE 2: APPROACH SELECTION — Present 2-3 options with trade-offs, recommend one
3. PHASE 3: SOLUTION DESIGN — Full design per your template

⛔ STOP after PHASE 2 (approach selection). Wait for explicit approach approval before detailed design.

Output artifact: `docs/specs/JIRA-001/solution-design.md`

Include your Self-Check section:
- [ ] All selected ADRs addressed
- [ ] No scope creep beyond ticket
- [ ] Edge cases documented
- [ ] Changes list complete

```

### Review Solution Design

- [ ] Every AC maps to a change
- [ ] No orphan changes (scope creep)
- [ ] Edge cases addressed
- [ ] Out of scope is clear

**If OK:** "Approved. Proceed to execution plan."

---

## Step 1.5: Create Execution Plan

**Prompt:** `create-execution-plan`

**Output:** `docs/specs/JIRA-001/execution-plan.md`

```
Act as the Architect Agent from @docs/agents/architect-agent.md in CREATE mode.

## TASK: Create Execution Plan for JIRA-001

**Input:** @docs/specs/JIRA-001/solution-design.md (APPROVED)

Execute PHASE 4: EXECUTION PLAN from your response protocol.

Format per your template:
### Steps
Each step follows TDD: tests (2.1) → code (2.2) → run tests (2.3) → commit (2.4)

### Step [N]: [Name]
- **Description:** [1 line]
- **Files:** `path/to/file.ts`
- **Tests:** [key scenarios to cover]
- **Depends:** [prior steps]

### Execution Order
[Diagram showing dependencies]

### Commit Strategy
Each step = 1 commit: `feat(JIRA-001): step [N] - [description]`

⛔ STOP: Execution plan complete. Ready for SIGN-OFF gate.

Output artifact: `docs/specs/JIRA-001/execution-plan.md`

```

---

## Step 1.6: SIGN-OFF

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
Act as the Implementation Agent from @docs/agents/implementation-agent.md in CREATE mode.

## TASK: Generate Tests for Step [N]: [STEP NAME]

**Inputs:**
- @docs/specs/JIRA-001/execution-plan.md
- @docs/specs/JIRA-001/solution-design.md

**Target file:** [path to *.spec.ts from execution plan]

Apply your TDD methodology skill. Generate tests BEFORE implementation.

### Tests for Step [N]: [Name]
**Target:** `path/to/file.spec.ts`
**Scenarios from plan:** [list]

Requirements:
- AAA pattern (Arrange-Act-Assert)
- Naming: `should_[expected]_when_[condition]`
- Grouping: `describe('S[N]: [Step Name]', ...)`
- 1 assertion per test
- Cover: happy path, error case, edge cases
- Mock external dependencies only

### Coverage Check
- [ ] Happy path: [scenario]
- [ ] Error case: [scenario]
- [ ] Edge cases: [list]
- [ ] Mocks: [external deps only]

### Run Command
npx nx test [project] --testFile=[spec-file] --testNamePattern="S[N]"WRITE tests directly to target spec file.

⛔ STOP: Tests ready. Approve before implementation.
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
Act as the Implementation Agent from @docs/agents/implementation-agent.md in CREATE mode.

## TASK: Implement Step [N]: [STEP NAME]

**Inputs:**
- @docs/specs/JIRA-001/execution-plan.md
- @docs/specs/JIRA-001/solution-design.md
- Tests from Step 2.1 (must pass)

Execute your response protocol:

## Step [N]: [Name]
**Target:** `path/to/file.ts`
**Must pass:** [test scenarios from Testing Agent]

### Implementation
[Code with inline RULE:/ASSUMPTION:/ADR-XXX: comments]

### Self-Check
- [ ] Tests pass
- [ ] ≤24 lines per method
- [ ] No `any`
- [ ] JSDoc on public methods
- [ ] Subscription cleanup (takeUntilDestroyed)
- [ ] OnPush (if component)
- [ ] catchError (if Observable)

✓ Step [N] complete.

⛔ STOP: Ask human if you can continue to Tests (2.1) with step [N+1] from the execution plan?
```

---

## Step 2.3: Run Step Tests

```bash
# Run tests for this step
nx test transactions-journey-internal-feature-transaction-view --watch=false
```

**If tests fail:**
```
Act as the Implementation Agent from @docs/agents/implementation-agent.md in CREATE mode.

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

**Output:** `docs/validation/JIRA-001-code-review.md`

```
## CODE REVIEW for JIRA-001

Review all code changes:
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
9. i18n markers on user-facing text

WRITE a report to `docs/validation/JIRA-001-code-review.md` with this format:

# JIRA-001: Code Review Summary

**Date:** [today]  
**Reviewer:** AI Code Review Agent  
**Status:** ✅ APPROVED | ❌ CHANGES REQUIRED

## Files Reviewed
- [list files with step numbers]

## Results

| Check | Status |
|-------|--------|
| Null/undefined handling | ✅/❌ |
| Observable cleanup | ✅/❌ |
| Method size (<24 lines) | ✅/❌ |
| Single responsibility | ✅/❌ |
| Naming conventions | ✅/❌ |
| No `any` types | ✅/❌ |
| JSDoc on new methods | ✅/❌ |
| i18n markers | ✅/❌ |

## Blockers (if any)
[BLOCKER]: description
- File: [path]
- Line: [number]
- Fix: [corrected code]

## Notes
[Any observations, acceptable exceptions, test counts]

## Verdict
**[X blockers].** [Summary statement]
```

### 🚦 Fix Blockers

Fix blockers, re-run tests.

---

## Step 3.3: Architecture Review

**Prompt:** `architecture-review`

**Output:** `docs/validation/JIRA-001-architecture-review.md`

```
## ARCHITECTURE REVIEW for JIRA-001

Review implementation against:
- Solution design: @docs/specs/JIRA-001/solution-design.md
- Task with selected ADRs: @docs/specs/JIRA-001/task.md

Check architecture compliance:
1. Does implementation follow the approved plan structure?
2. Are all selected ADR requirements met? (check each ADR from Step 1.1)
3. Layer violations? (Components importing HttpClient directly?)
4. Classes with >10 public methods?
5. Edge cases from solution-design.md section 6 handled?

For any violations found:
[BLOCKER|WARNING]: description
- ADR/Plan violation: [which rule]
- File: [path]
- Fix: [corrected code for blockers]

End with: "Architecture Compliant" or "Violations found: X blockers"

After review, WRITE summary report to `docs/validation/JIRA-001-architecture-review.md`
```

### 🚦 Fix Violations

Fix blockers, re-run tests.

---

## Step 3.4: Product Review

**Prompt:** `product-review`

**Output:** `docs/validation/JIRA-001-product-review.md`

```
## PRODUCT REVIEW for JIRA-001

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

NFR Compliance (from selected ADRs):
| ADR | Status | Evidence |
|-----|--------|----------|
| [each selected ADR] | ✅/❌ | [file:line] |

Summary:
- Total AC: 7
- Implemented: [N]
- Missing: [N]

End with: "All AC Implemented" or "Missing: X acceptance criteria"

After review, WRITE summary report to `docs/validation/JIRA-001-product-review.md`
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
| 1.4 `create-solution-design` | `solution-design.md` |
| 1.5 `create-execution-plan` | `execution-plan.md` |
| 1.6 **SIGN-OFF** | `git commit` |

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

