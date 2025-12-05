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

**After LLM response:** Save selected ADRs to `docs/specs/JIRA-001/task.md`, e.g.:

```markdown
# JIRA-001: View Transactions by Account

## Selected ADRs
- ADR-001: Accessibility
- ADR-003: i18n
- ADR-004: Responsiveness
```

## Step 1.2: Select Repo-Wide Specs

**Prompt:** `select-repo-specs`

```
## REPO CONTEXT for JIRA-001

Identify repo-specific conventions that sit ON TOP OF ADRs. Do NOT solution — only gather context.

### 1. Similar Implementations to Reference
List 1-2 existing features in this repo that solve a similar problem.
Format: `[Feature name]: [file path]`
Do NOT copy code — just provide paths for later reference.

### 2. API Contracts
Which endpoints are relevant? List paths only.

### 3. Existing Types/Interfaces to Reuse
List interfaces or types from this repo that could be reused (with file paths).

⚠️ DO NOT include:
- Files to create or modify — that's solution design (Step 1.4)
- Explanations of patterns — ADRs cover these
- Code examples — reference files instead
- Implementation decisions

Append to: docs/specs/JIRA-001/task.md
```

---

## Step 1.3: Disambiguate User Story

**Prompt:** `disambiguate-story`

**Output:** Append to `docs/specs/JIRA-001/task.md`

```
## DISAMBIGUATE USER STORY

User story: @docs/JIRA-001.md
Context: @docs/specs/JIRA-001/task.md (selected ADRs and repo context)

Identify ambiguities in the acceptance criteria. For each ambiguity:
- Reference the specific AC
- Ask a clear question
- Provide 2-4 options if applicable

### Output format (strict):

## Disambiguation

### BLOCKING Questions

**Q1: [Short topic]**
> AC: "[quote the relevant AC]"

[Question text. Options if applicable.]

---

**Q2: [Short topic]**
[...]

---

### CONTEXT Requests

**Q[N]: [Short topic]**
[Question about missing context: mockups, API specs, etc.]

---

⚠️ DO NOT include:
- Decomposition or task breakdown — that's next steps
- Implementation suggestions
- File paths to modify
- Code snippets

STOP after outputting questions. Wait for human answers before proceeding.
```

---

## Step 1.4: Create Solution Design

**Prompt:** `create-solution-design`

**Output:** `docs/specs/JIRA-001/solution-design.md`

After answering all questions:

```
Based on the approved task: @docs/specs/JIRA-001/task.md

Create solution design following this structure:

## 1. Context
- Ticket: [link to JIRA-001.md]
- Summary: [1-2 sentences of what we're building]

## 2. Current State
- What exists today? (files, services, patterns)
- What can we reuse/reference?

## 3. Approach
- How are we solving it? (data flow, state management)
- Why this approach vs alternatives?
- Diagram if helpful (ASCII is fine)

## 4. Data
- API endpoints: request → response shape
- New/modified interfaces
- Where data lives (component state, URL params, store?)

## 5. Changes
| File | Change |
|------|--------|
| `path/to/file.ts` | What changes |

New dependencies/imports if any.

## 6. Edge Cases
- Loading states
- Empty states
- Error states
- What happens when X fails?

## 7. Testing Strategy
- Key scenarios to cover
- Any tricky test setup?

## 8. Out of Scope
- What we're NOT doing (prevents scope creep)


---

Save to: docs/specs/JIRA-001/solution-design.md

Do NOT generate code. Wait for approval.
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
Based on: @docs/specs/JIRA-001/solution-design.md

Create a LEAN execution plan. Format:

## Execution Plan

Each step follows TDD: write tests (2.1) → implement (2.2) → run tests (2.3) → commit (2.4)

### Steps

- [ ] **S1: [Name]** — [1-line description]
  - Files: `path/to/file.ts`
  - Tests: [key test scenarios]

- [ ] **S2: [Name]** — [1-line description]
  - Files: `path/to/file.ts`
  - Depends: S1

[...continue for all steps...]

### Order
S1 → S2 → S3 (parallel: S4, S5) → S6

---
### Warnings:
- DO NOT list "Unit tests" as a separate step — TDD is handled by the Part 2 cycle.
- Keep it under 50 lines. No code snippets — solution-design.md has that.

Save to: docs/specs/JIRA-001/execution-plan.md
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
Act as @docs/agents/angular-typescript-agent.md, Generate unit tests for Step [N]: [STEP NAME]

Based on:
- @docs/specs/JIRA-001/execution-plan.md
- @docs/specs/JIRA-001/solution-design.md

Target file: [path to *.spec.ts file from execution plan]

Requirements:
- Follow AAA pattern (Arrange-Act-Assert)
- Naming: should_[expected]_when_[condition]
- Cover: happy path, error case, edge case
- Mock external dependencies
- One assertion per test

Reference: @docs/architecture/013-ADR-unit-integration-testing-standards.md

WRITE the tests directly to the target spec file. Do NOT just output code in chat.
Do NOT implement the production code yet — tests only.
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

