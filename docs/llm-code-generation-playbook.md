# Writing code with LLMs

This playbook provides guidelines for creating production-quality code using LLMs.

## System components

There are interconnected components process stands on:

| Component | Purpose | Source |
|-----------|---------|--------|
| **ADRs** | Org-wide architectural rules, auto-injected to each session | GH repo via MCP |
| **Repo-level specs** | Project-specific conventions, patterns, API specs | `docs/` folder in repo |
| **Agents** | Role-specific agents with embedded principles | GH repo via MCP |
| **Prompts** | Templates for common tasks | This doc + MCP |
| **Artifacts** | Persistent specs, plans, tasks per feature | `docs/specs/{JIRA-ID}/` |

**How it works:**
1. Engineer starts a session in IDE with access to LLM and ability to use project as context.
2. MCP server automatically injects all ADRs into system context
3. Engineer selects agent appropriate for their task
4. Uses prompts from this playbook to drive the conversation
5. Artifacts (specs, plans, tasks) are persisted to `docs/specs/{JIRA-ID}/` for auditability

**Artifact Structure:**
```
docs/specs/{JIRA-ID}/
├── task.md              # 1.1-1.3: Selected ADRs, repo context, disambiguated story
├── solution-design.md   # 1.4: Solution design with ADR compliance approach
└── execution-plan.md    # 1.4: Step-by-step breakdown with file targets
```

**Core Principles (TLDR):**

**V-Model Process:**
- **Part 1: Specs** (left side): Select ADRs, repo specs, disambiguate story, create solution design
- **Part 2: Coding** (bottom): TDD cycle: tests-code-commit per step
- **Part 3: Validation** (right side):  All tests (also e2e) - code review - architecture review - Product acceptance

## V-Model Overview

```
        Part 1: SPECS                          Part 3: VALIDATION
        (Left side)                            (Right side)
        
    1.1 Select ADRs ─────────────────────────► 3.4 Product review
           │                                         ▲
    1.2 Select repo specs ───────────────────► 3.3 Architecture review
           │                                         ▲
    1.3 Disambiguate story ──────────────────► 3.2 Code review
           │                                         ▲
    1.4 Solution design ─────────────────────► 3.1 Run all tests
           │                                         ▲
           ▼                                         │
        ═══════════════════════════════════════════════
                    Part 2: CODING (Bottom)
                    
                    2.1 Generate tests (TDD)
                    2.2 Generate code
                    2.3 Run step tests
                    2.4 Commit step
                    (repeat per step)
```

**Execution Principles:**
- **Human-in-the-loop** - LLM proposes, human approves at every gate.
- **Ask before assuming** - LLM surfaces ambiguities as questions; human answers before planning.
- **Plan before code** - Generate detailed plan with steps, interfaces, dependencies.
- **Tests before code** - Generate tests first; they formalise requirements (adds 12-38% accuracy).
- **One step at a time** - Generate code method-by-method, not module-at-once.
- **Keep it small** - Methods 24 lines or fewer; extract helpers when exceeded.
- **Review everything** - Self-critique, then formal review; Any ADR violations are blockers.
- **Do not let LLM auto-proceed.** Every output requires human validation.


## ADRs

ADRs are **automatically injected** into every LLM session - engineers do not need to reference them manually.

### ADR must-have sections

Each ADR is expected to contain:
- **Decision summary**: Executive summary of the rule
- **Context**: Business context, technical context, constraints, affected components
- **Decision**: What we decided and detailed rationale
- **Implementation patterns**: Code examples, GOOD/BAD patterns, checklists

### ADR injection mechanism (TBD)

The MCP server loads all ADRs from the Git repository and includes them in the (system) prompt. This ensures:
- No engineer can accidentally bypass architectural rules
- LLM always has full context of organisational standards (including code examples)
- Rules are versioned and auditable

## Agents

Agents are pre-defined personas stored in Git and loaded via MCP. Each agent establishes the LLM's role, behavioural constraints, and **response format**. Engineer selects the appropriate agent before beginning work.

| Component | Purpose |
|-----------|---------|
| **angular-typescript** | General purpose implementation support |
| **unit-tests** | Support with writing tests when doing TDD |
| **code-review** | Code review and self-check assistant |


### Structure of agents

Each agent includes:
- **Role**: Expertise, seniority, tone
- **Response format**: Mandatory sections the agent must output (e.g., "ASK, PLAN, CODE, TEST" suquence)
- **Principles**: Behavioral rules (ask first, no scope creep, etc.)
- **Required questions template**: Copy-paste template for clarification questions
- **Technical standards**: Code style, patterns, constraints, ADRs references
- **GOOD/BAD patterns**: Explicit examples of correct vs incorrect code
- **Output Rules**: Format and style requirements

All agents automatically receive ADRs via MCP injection.

### Agent example: `angular-typescript-agent`

Use for: Generating production Angular/TypeScript code.

```
ROLE:
You are a senior Angular engineer with 8+ years of experience building 
enterprise applications.

RESPONSE FORMAT (mandatory sections in order): ASK, then PLAN, then CODE

If information is missing, stop after ASK and wait for answers.

PRINCIPLES:
1. **ASK before assuming** - Clarify every ambiguity, make no assumptions.
2. **PLAN before coding** - Plan and explain first
3. **IMPLEMENT minimally** - Only what's explicitly requested. No scope creep.
4. **BREAK DOWN methodically** - Small, focused steps.

REQUIRED QUESTIONS (ask before any code):
- What is the exact input/output contract?
- Which existing services/components should I reuse?
- What error states need handling?
- Are there edge cases I should know about?

TECHNICAL STANDARDS:
- Strictly typed TypeScript. Never use 'any'.
- Reactive patterns with RxJS. Prefer declarative over imperative.
- OnPush change detection for all components.
- Methods must not exceed 24 lines.

GOOD/BAD PATTERNS:

BAD: Untyped, imperative
getUserData(id) {
  let result;
  this.http.get('/users/' + id).subscribe(data => { result = data; });
  return result;
}

GOOD: Typed, reactive, documented
/** Fetches user by ID. Throws NotFoundError if missing. */
getUserById(id: UserId): Observable<User> {
  return this.http.get<User>(`/users/${id}`).pipe(
    catchError(this.handleNotFound)
  );
}

OUTPUT RULES:
- Include JSDoc for public methods
- If multiple files needed, list them first, generate one at a time
```

## Part 1: Specs (V-model left side)

Before coding, establish specifications that prevent LLM hallucinations and architectural drift.

### 1.1 Select relevant ADRs

For each user story, explicitly list which ADRs apply.

**When to use:** At the very start of each user story.

**Output:** Start `docs/specs/[JIRA-ID]/task.md` with selected ADRs

**Prompt: `select-adrs`**

```
For user story: [JIRA-ID]: [TITLE]

Review available ADRs and list which ones apply to this feature:

| ADR | Applies? | Why |
|-----|----------|-----|
| ADR-001: Accessibility | Yes/No | [Reason] |
| ADR-003: i18n | Yes/No | [Reason] |
| ... | ... | ... |

Save selected ADRs to: docs/specs/[JIRA-ID]/task.md
```

### 1.2 Select repo-wide specs

Repo-wide specs are project-specific conventions that sit ON TOP OF ADRs. They describe patterns in THIS repository — not general knowledge.

**When to use:** After ADRs selected, to establish project context.

**Output:** Append to `docs/specs/[JIRA-ID]/task.md`

**Prompt: `select-repo-specs`**

```
## REPO CONTEXT for [JIRA-ID]

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

Append to: docs/specs/[JIRA-ID]/task.md
```

### 1.3 Disambiguate user story

Ambiguous requirements cause LLMs to make assumptions. Surface ambiguities as questions, get answers inline.

**When to use:** After ADRs and repo specs are established.

**Human gate:** LLM outputs questions, human answers ALL BLOCKING questions before proceeding.

**Output:** Append to `docs/specs/[JIRA-ID]/task.md`

**Prompt: `disambiguate-story`**

```
## DISAMBIGUATE USER STORY

User story: [JIRA-ID]: [TITLE]
Context: @docs/specs/[JIRA-ID]/task.md (selected ADRs and repo context)

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

### 1.4 Create solution design

Planning before generation improves pass rates by 11-25%. Create a solution design that implements the disambiguated requirements.

**When to use:** After task.md is complete and approved.

**Human gate:** Review for: AC coverage, no scope creep, edge cases addressed.

**Output:** `docs/specs/[JIRA-ID]/solution-design.md`

**Prompt: `create-solution-design`**

```
Based on the approved task: @docs/specs/[JIRA-ID]/task.md

Create solution design following this structure:

## 1. Context
- Ticket: [link]
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

## 7. Testing Strategy
- Key scenarios to cover
- Any tricky test setup?

## 8. Out of Scope
- What we're NOT doing (prevents scope creep)

---

Save to: docs/specs/[JIRA-ID]/solution-design.md

Do NOT generate code. Wait for approval.
```

### 1.5 Create execution plan

Convert solution design into a lean, ordered checklist.

**When to use:** After solution design is approved.

**Output:** `docs/specs/[JIRA-ID]/execution-plan.md`

**Prompt: `create-execution-plan`**

```
Based on: @docs/specs/[JIRA-ID]/solution-design.md

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
-  Keep it under 50 lines. No code snippets — solution-design.md has that.

Save to: docs/specs/[JIRA-ID]/execution-plan.md
```

### 1.6 Select agent

Before coding, select the appropriate agent for implementation.

| Task | Agent |
|------|-------|
| Implementation | `angular-typescript-agent` |
| Test generation | `unit-tests-agent` |
| Code review | `code-review-agent` |
| Architecture review | `architecture-review-agent` |

### 🚦 SIGN-OFF GATE

After Part 1, commit all artifacts:
```
git add docs/specs/[JIRA-ID]/
git commit -m "specs([JIRA-ID]): approved spec, plan, and tasks"
```

This commit marks engineer sign-off on specifications. Engineer is accountable for these artifacts.

---

## Part 2: Coding (V-model bottom)

Implement following the approved plan, one step at a time.

### 2.1 Generate tests (TDD)

TDD improves code generation accuracy by 12-38%. Generate tests BEFORE implementation.

**When to use:** Before implementing each step.

**Agent:** `unit-tests-agent`

**Prompt: `generate-tests`**

```
Act as @docs/agents/angular-typescript-agent.md, Generate unit tests for Step [N]: [STEP NAME]

Based on:
- @docs/specs/[JIRA-ID]/execution-plan.md
- @docs/specs/[JIRA-ID]/solution-design.md

Target file: [path to *.spec.ts file from execution plan]

Requirements:
- Follow AAA pattern (Arrange-Act-Assert)
- Naming: should_[expected]_when_[condition]
- Cover: happy path, error case, edge case
- Mock external dependencies
- One assertion per test
- Wrap tests in `describe('S[N]: [STEP NAME]', () => { ... })`

Reference: @docs/architecture/013-ADR-unit-integration-testing-standards.md

WRITE the tests directly to the target spec file. Do NOT just output code in chat.
Do NOT implement the production code yet — tests only.

After writing tests, output the command to run them:
```
npx nx test [project-name] --testFile=[spec-file] --testNamePattern="S[N]"
```
```

### 2.2 Generate code

Execute the plan one step at a time.

**When to use:** After tests are approved for a step.

**Agent:** `angular-typescript-agent`

**Best practices:**
- Implement ONLY one step at a time
- Maximum 24 lines per method
- Include JSDoc for public methods
- Add inline comments with `RULE:` and `ASSUMPTION:` markers

**Prompt: `implement-step`**

```
Act as @angular-typescript-agent.

Based on: @docs/specs/[JIRA-ID]/execution-plan.md
Implement Step [N]: [STEP DESCRIPTION]

Constraints:
- Must pass the tests generated earlier
- Maximum 24 lines per method
- Include JSDoc for public methods
- Add inline comments BEFORE each logical block:
  - RULE: for business rules
  - ASSUMPTION: for assumptions

Output the code for this step only.
```

### 2.3 Run step tests

After implementing each step, run tests locally.

```bash
nx test [project] --watch=false
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

### 2.4 Commit step

After tests pass, commit:
```bash
git add .
git commit -m "feat([JIRA-ID]): step [N] - [description]"
```

**Repeat 2.1-2.4 for each step in the plan.**

---

## Part 3: Validation (V-model right side)

After all steps are implemented, validate the complete solution.

### 3.1 Run all tests

Run complete test suite including e2e tests.

```bash
# Unit tests
nx test [project] --watch=false

# E2E tests (with real backend if available)
nx e2e [project]-e2e
```

All tests must pass before proceeding.

### 3.2 LLM Code Review

Review code for coding standards and best practices.

**Focus:** HOW the code is written (quality, patterns, readability).

**Output:** `docs/validation/[JIRA-ID]-code-review.md`

**Prompt: `code-review`**

```
## CODE REVIEW for [JIRA-ID]

Review all code changes:
@[list of changed files]

Check coding standards:
1. Null/undefined handling
2. Error handling completeness
3. Observable subscription cleanup (takeUntilDestroyed)
4. Method size (<24 lines)
5. Single responsibility principle
6. Naming conventions
7. JSDoc on public methods
8. No `any` types
9. i18n markers on user-facing text

WRITE a report to `docs/validation/[JIRA-ID]-code-review.md` with this format:

# [JIRA-ID]: Code Review Summary

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

### 3.3 LLM Architecture Review

Validate solution matches the approved design and ADRs.

**Focus:** WHAT was built (structure, patterns, ADR compliance).

**Output:** `docs/validation/[JIRA-ID]-architecture-review.md`

**Prompt: `architecture-review`**

```
## ARCHITECTURE REVIEW for [JIRA-ID]

Review implementation against:
- Solution design: @docs/specs/[JIRA-ID]/solution-design.md
- Task with selected ADRs: @docs/specs/[JIRA-ID]/task.md

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

After review, WRITE summary report to `docs/validation/[JIRA-ID]-architecture-review.md`
```

### 3.4 LLM Product Review

Validate implemented functionality matches the user story.

**Focus:** WHETHER the right thing was built (completeness, correctness).

**Output:** `docs/validation/[JIRA-ID]-product-review.md`

**Prompt: `product-review`**

```
## PRODUCT REVIEW for [JIRA-ID]

User story: @docs/[JIRA-ID].md
Task spec: @docs/specs/[JIRA-ID]/task.md

Validate each acceptance criterion is implemented:

| AC | Description | Status | Evidence |
|----|-------------|--------|----------|
| AC-1 | [criterion] | ✅/❌ | [file:line or "not found"] |
| AC-2 | [criterion] | ✅/❌ | [file:line or "not found"] |
| ... | ... | ... | ... |

NFR Compliance (from selected ADRs):
| ADR | Status | Evidence |
|-----|--------|----------|
| [each selected ADR] | ✅/❌ | [file:line] |

Summary:
- Total AC: [N]
- Implemented: [N]
- Missing: [N]

End with: "All AC Implemented" or "Missing: X acceptance criteria"

After review, WRITE summary report to `docs/validation/[JIRA-ID]-product-review.md`
```

### 🚦 FINAL GATE

All reviews must pass:
- [ ] 3.1: All tests green (unit + e2e)
- [ ] 3.2: Code review approved (0 blockers)
- [ ] 3.3: Architecture review compliant (0 blockers)
- [ ] 3.4: Product review complete (all AC implemented)

Then merge to main.


## Summary

### Per-feature workflow (V-model)

```
        Part 1: SPECS                          Part 3: VALIDATION
        (Left side)                            (Right side)
        
    1.1 Select ADRs ─────────────────────────► 3.4 Product Review
           │                                         ▲
    1.2 Select repo specs ───────────────────► 3.3 Architecture Review
           │                                         ▲
    1.3 Disambiguate story ──────────────────► 3.2 Code Review
           │                                         ▲
    1.4 Solution design ─────────────────────► 3.1 Run all tests
           │                                         ▲
    1.5 Execution plan                               │
           │                                         │
           ▼                                         │
        ═══════════════════════════════════════════════
                    Part 2: CODING (Bottom)
                    
                    2.1 Generate tests (TDD)
                    2.2 Generate code
                    2.3 Run step tests
                    2.4 Commit step
                    (repeat per step)
```

### Part 1: Specs (before coding)

| Step | Prompt | Output | Gate |
|------|--------|--------|------|
| 1.1 | `select-adrs` | `task.md` (start) | — |
| 1.2 | `select-repo-specs` | `task.md` (append) | — |
| 1.3 | `disambiguate-story` | `task.md` (Q→A) | Answer BLOCKING questions |
| 1.4 | `create-solution-design` | `solution-design.md` | Review AC coverage |
| 1.5 | `create-execution-plan` | `execution-plan.md` | Review steps |
| 1.6 | Select agent | — | — |
| 🚦 | **SIGN-OFF** | `git commit` | Engineer accountable |

### Part 2: Coding (per step)

| Step | Prompt | Agent | Gate |
|------|--------|-------|------|
| 2.1 | `generate-tests` | `unit-tests-agent` | Review tests |
| 2.2 | `implement-step` | `angular-typescript-agent` | — |
| 2.3 | Run tests | — | Tests pass |
| 2.4 | `git commit` | — | — |

**Development approach:** Trunk-based development. Each step = one commit. If step fails, revert and retry.

### Part 3: Validation (after all coding)

| Step | Prompt | Focus | Gate |
|------|--------|-------|------|
| 3.1 | Run all tests | Unit + E2E | All green |
| 3.2 | `code-review` | HOW (quality, patterns) | 0 blockers |
| 3.3 | `architecture-review` | WHAT (structure, ADRs) | 0 blockers |
| 3.4 | `product-review` | WHETHER (AC complete) | All AC ✅ |
| 🚦 | **MERGE** | — | All reviews pass |

## References

1. [Self-planning Code Generation with Large Language Models](https://arxiv.org/abs/2303.06689)
2. [Sketch Then Generate: Providing Incremental User Feedback and Guiding LLM Code Generation through Language-Oriented Code Sketches](https://arxiv.org/abs/2405.03998v2)
3. [Planning In Natural Language Improves LLM Search For Code Generation](https://arxiv.org/abs/2409.03733v2)
4. [CodePlan: Repository-level Coding using LLMs and Planning](https://arxiv.org/html/2309.12499v1)
5. [ChatCoder: Human-in-loop Refine Requirement Improves LLMs' Code Generation](https://openreview.net/pdf?id=Yuy42Ti4aAz5)
6. [Enhancing Repository-Level Code Generation with Integrated Contextual Information](https://arxiv.org/html/2406.03283v1)
7. [Design First, Code Later: The AI Era Mantra](https://felix-pappe.medium.com/design-first-code-later-the-ai-era-mantra-581a56227bed)
8. [Evolution patterns of software-architecture smells: An empirical study of intra- and inter-version smells](https://www.sciencedirect.com/science/article/pii/S0164121224002152)
9. [Evaluating Large Language Models in Class-Level Code Generation](https://mingwei-liu.github.io/assets/pdf/ICSE2024ClassEval-V2.pdf)
10. [Divide-and-Conquer Meets Consensus: Unleashing the Power of Functions in Code Generation](https://arxiv.org/html/2405.20092v1)
11. [An Empirical Study on Maintainable Method Size in Java](https://arxiv.org/abs/2205.01842)
12. [On the diffuseness and the impact on maintainability of code smells: a large scale empirical investigation](https://link.springer.com/article/10.1007/s10664-017-9535-z)
13. [Test-Driven Development for Code Generation](https://arxiv.org/abs/2402.13521)
14. [Comments as Natural Logic Pivots: Improve Code Generation via Comment Perspective](https://arxiv.org/html/2404.07549v1)
