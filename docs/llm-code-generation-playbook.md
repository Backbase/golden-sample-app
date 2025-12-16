# Writing code with LLMs

This playbook provides guidelines for creating production-quality code using LLMs.

## System components

There are interconnected components process stands on:

| Component | Purpose | Source |
|-----------|---------|--------|
| **ADRs** | Org-wide architectural rules, auto-injected to each session | GH repo via MCP |
| **Repo-level specs** | Project-specific conventions, patterns, API specs | `docs/` folder in repo |
| **Agents** | Role-specific agents with embedded principles | `docs/agents/` |
| **Prompts** | Templates for common tasks | `docs/prompts/` |
| **Templates** | Output format templates | `docs/templates/` |
| **Artifacts** | Persistent specs, plans, tasks per feature | `docs/specs/{JIRA-ID}/` |

**How it works:**
1. Engineer starts a session in IDE with access to LLM and ability to use project as context.
2. MCP server automatically injects all ADRs into system context
3. Engineer selects agent appropriate for their task
4. Uses prompts from `docs/prompts/` to drive the conversation
5. Artifacts (specs, plans, tasks) are persisted to `docs/specs/{JIRA-ID}/` for auditability

**Artifact Structure:**
```
docs/specs/{JIRA-ID}/
├── task.md              # 1.1-1.3: Selected ADRs, repo context, disambiguated story
├── solution-design.md   # 1.4: Solution design with ADR compliance approach
└── execution-plan.md    # 1.5: Step-by-step breakdown with file targets
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
        
    1.1 Select ADRs                            3.4 Product review
           │                                         ▲
    1.2 Select repo specs                      3.3 Architecture review
           │                                         ▲
    1.3 Disambiguate story                     3.2 Code review
           │                                         ▲
    1.4 Solution design                        3.1 Run all tests
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

Agents are pre-defined personas stored in `docs/agents/` and loaded via MCP. Each agent establishes the LLM's role, behavioural constraints, and **response format**. Engineer selects the appropriate agent before beginning work.

| Agent | V-Model Stages | Mode |
|-------|----------------|------|
| **Product Agent** | 1.1-1.3 (task.md), 3.4 (Product Review) | CREATE / JUDGE |
| **Architect Agent** | 1.4-1.5 (solution-design, execution-plan), 3.3 (Architecture Review) | CREATE / JUDGE |
| **Implementation Agent** | 2.1-2.2 (tests, code), 3.2 (Code Review) | CREATE / JUDGE |

### Structure of agents

Each agent includes:
- **Role**: Expertise, seniority, tone
- **Behaviors**: Behavioral modules (ask-before-assume, stop-and-wait, etc.)
- **Skills**: Technical and methodology skills
- **Response protocol**: Mandatory sections the agent must output per mode
- **Technical standards**: Code style, patterns, constraints
- **Stop conditions**: When to halt and wait for human input

All agents automatically receive ADRs via MCP injection.

---

## Part 1: Specs (V-model left side)

Before coding, establish specifications that prevent LLM hallucinations and architectural drift.

**Full prompts:** See `docs/prompts/1.*.md`

### 1.1 Select relevant ADRs

For each user story, explicitly list which ADRs apply.

**When to use:** At the very start of each user story.

**Agent:** Product Agent (CREATE mode)

**Output:** Start `docs/specs/[JIRA-ID]/task.md` with selected ADRs

**Prompt:** `docs/prompts/1.1-select-adrs.md`

```
Act as the Product Agent from @docs/agents/product-agent.md in CREATE mode.

## TASK: Select ADRs for [JIRA-ID]

**User Story:** @docs/[JIRA-ID].md
**Available ADRs:** @docs/architecture/

Execute PHASE 1: SELECT ADRs from your response protocol.

Output format:
| ADR | Applies | Rationale |
|-----|---------|-----------|
| ADR-XXX | Yes/No | [1 line why] |

⛔ STOP after outputting ADR selection. Wait for confirmation from the user.

After user confirmation, save selected ADRs to docs/specs/[JIRA-ID]/task.md
```

### 1.2 Select repo-wide specs

Repo-wide specs are project-specific conventions that sit ON TOP OF ADRs. They describe patterns in THIS repository — not general knowledge.

**When to use:** After ADRs selected, to establish project context.

**Agent:** Product Agent (CREATE mode)

**Output:** Append to `docs/specs/[JIRA-ID]/task.md`

**Prompt:** `docs/prompts/1.2-select-repo-specs.md`

```
Act as the Product Agent from @docs/agents/product-agent.md in CREATE mode.

## TASK: Gather Repo Context for [JIRA-ID]

**Context:** @docs/specs/[JIRA-ID]/task.md (ADRs selected in previous step)

Execute PHASE 2: REPO CONTEXT from your response protocol.

Identify repo-specific conventions that sit ON TOP OF ADRs. Do NOT solution — only gather context.

Output format:

### 1. Similar Implementations to Reference
`[Feature name]: [file path]` — do NOT copy code, just paths

### 2. API Contracts
Which endpoints are relevant? List paths only.

### 3. Existing Types/Interfaces to Reuse
List interfaces or types with file paths.

### 4. UI Component API Verification
For each design system component to be used:
- Find an existing usage in the codebase
- List the **actual** Input/Output properties being used
- Note any type casting required

⚠️ IMPORTANT: Do NOT assume component APIs from naming conventions.

⛔ STOP after outputting repo context. Wait for confirmation before disambiguation.
```

### 1.3 Disambiguate user story

Ambiguous requirements cause LLMs to make assumptions. Surface ambiguities as questions, get answers inline.

**When to use:** After ADRs and repo specs are established.

**Agent:** Product Agent (CREATE mode)

**Human gate:** LLM outputs questions, human answers ALL BLOCKING questions before proceeding.

**Output:** Append to `docs/specs/[JIRA-ID]/task.md`

**Prompt:** `docs/prompts/1.3-disambiguate-story.md`

```
Act as the Product Agent from @docs/agents/product-agent.md in CREATE mode.

## TASK: Disambiguate User Story for [JIRA-ID]

**User Story:** @docs/[JIRA-ID].md
**Context:** @docs/specs/[JIRA-ID]/task.md (selected ADRs and repo context)

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

### 1.4 Create solution design

Planning before generation improves pass rates by 11-25%. Create a solution design that implements the disambiguated requirements.

**When to use:** After task.md is complete and approved.

**Agent:** Architect Agent (CREATE mode)

**Human gate:** Review for: AC coverage, no scope creep, edge cases addressed.

**Output:** `docs/specs/[JIRA-ID]/solution-design.md`

**Template:** `docs/templates/solution-design-template.md`

**Prompt:** `docs/prompts/1.4-create-solution-design.md`

```
Act as the Architect Agent from @docs/agents/architect-agent.md in CREATE mode.

## TASK: Create Solution Design for [JIRA-ID]

**Input:** @docs/specs/[JIRA-ID]/task.md (approved with answered questions)
**Template:** @docs/templates/solution-design-template.md

Execute your full response protocol:
1. PHASE 1: UNDERSTAND — Confirm context loaded, flag any remaining questions
2. PHASE 2: APPROACH SELECTION — Present 2-3 options with trade-offs, recommend one
3. PHASE 3: SOLUTION DESIGN — Full design per the template

⛔ STOP after PHASE 2 (approach selection). Wait for explicit approach approval before detailed design.

Output artifact: `docs/specs/[JIRA-ID]/solution-design.md`

Include your Self-Check section:
- [ ] All selected ADRs addressed (template §1 ADR Compliance)
- [ ] No scope creep beyond ticket
- [ ] Edge cases documented (template §5)
- [ ] Changes list complete (template §4)
- [ ] UI component APIs verified against existing usage
```

### 1.5 Create execution plan

Convert solution design into a lean, ordered checklist.

**When to use:** After solution design is approved.

**Agent:** Architect Agent (CREATE mode)

**Output:** `docs/specs/[JIRA-ID]/execution-plan.md`

**Prompt:** `docs/prompts/1.5-create-execution-plan.md`

```
Act as the Architect Agent from @docs/agents/architect-agent.md in CREATE mode.

## TASK: Create Execution Plan for [JIRA-ID]

**Input:** @docs/specs/[JIRA-ID]/solution-design.md (APPROVED)

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
Each step = 1 commit: `feat([JIRA-ID]): step [N] - [description]`

⛔ STOP: Execution plan complete. Ready for SIGN-OFF gate.

Output artifact: `docs/specs/[JIRA-ID]/execution-plan.md`
```

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

**Full prompts:** See `docs/prompts/2.*.md`

### 2.1 Generate tests (TDD)

TDD improves code generation accuracy by 12-38%. Generate tests BEFORE implementation.

**When to use:** Before implementing each step.

**Agent:** Implementation Agent (CREATE mode)

**Prompt:** `docs/prompts/2.1-generate-tests.md`

```
Act as the Implementation Agent from @docs/agents/implementation-agent.md in CREATE mode.

## TASK: Generate Tests for Step [N]: [STEP NAME]

**Inputs:**
- @docs/specs/[JIRA-ID]/execution-plan.md
- @docs/specs/[JIRA-ID]/solution-design.md

**Target file:** [path to *.spec.ts from execution plan]

Apply TDD methodology. Generate tests BEFORE implementation.

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

WRITE tests directly to target spec file.

⛔ STOP: Tests ready. Approve before implementation.
```

### 2.2 Generate code

Execute the plan one step at a time.

**When to use:** After tests are approved for a step.

**Agent:** Implementation Agent (CREATE mode)

**Best practices:**
- Implement ONLY one step at a time
- Maximum 24 lines per method
- Include JSDoc for public methods
- Add inline comments with `RULE:` and `ASSUMPTION:` markers

**Prompt:** `docs/prompts/2.2-implement-step.md`

```
Act as the Implementation Agent from @docs/agents/implementation-agent.md in CREATE mode.

## TASK: Implement Step [N]: [STEP NAME]

**Inputs:**
- @docs/specs/[JIRA-ID]/execution-plan.md
- @docs/specs/[JIRA-ID]/solution-design.md
- Tests from Step 2.1 (must pass)

## Step [N]: [Name]
**Target:** `path/to/file.ts`
**Must pass:** [test scenarios from 2.1]

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

⛔ STOP: Continue to step [N+1]?
```

### 2.3 Run step tests

After implementing each step, run tests locally.

```bash
nx test [project] --watch=false
```

**If tests fail:** Use `docs/prompts/2.3-fix-failed-tests.md`

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

**Full prompts:** See `docs/prompts/3.*.md`

### 3.1 Run all tests

Run complete test suite including e2e tests.

```bash
# Unit tests
nx test [project] --watch=false

# E2E tests (with real backend if available)
nx e2e [project]-e2e
```

All tests must pass before proceeding.

### 3.2 Code Review

Review code for coding standards and best practices.

**Focus:** HOW the code is written (quality, patterns, readability).

**Agent:** Implementation Agent (JUDGE mode)

**Output:** `docs/validation/[JIRA-ID]-code-review.md`

**Prompt:** `docs/prompts/3.2-code-review.md`

```
Act as the Implementation Agent from @docs/agents/implementation-agent.md in JUDGE mode.

## CODE REVIEW for [JIRA-ID]

Review all code changes:
@[list of changed files]

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

WRITE a report to `docs/validation/[JIRA-ID]-code-review.md`

**Verdict:** ✅ APPROVED | ❌ CHANGES REQUIRED

## Blockers (if any)
[BLOCKER]: description
- File: [path]
- Line: [number]
- Fix: [corrected code]
```

### 3.3 Architecture Review

Validate solution matches the approved design and ADRs.

**Focus:** WHAT was built (structure, patterns, ADR compliance).

**Agent:** Architect Agent (JUDGE mode)

**Output:** `docs/validation/[JIRA-ID]-architecture-review.md`

**Prompt:** `docs/prompts/3.3-architecture-review.md`

```
Act as the Architect Agent from @docs/agents/architect-agent.md in JUDGE mode.

## ARCHITECTURE REVIEW for [JIRA-ID]

Review implementation against:
- Solution design: @docs/specs/[JIRA-ID]/solution-design.md
- Task with selected ADRs: @docs/specs/[JIRA-ID]/task.md

Check architecture compliance:
1. Does implementation follow the approved plan structure?
2. Are all selected ADR requirements met? (check each ADR from Step 1.1)
3. Layer violations? (Components importing HttpClient directly?)
4. Classes with >10 public methods?
5. Edge cases from solution-design.md handled?

WRITE a report to `docs/validation/[JIRA-ID]-architecture-review.md`

**Verdict:** ✅ APPROVED | ❌ CHANGES REQUIRED
```

### 3.4 Product Review

Validate implemented functionality matches the user story.

**Focus:** WHETHER the right thing was built (completeness, correctness).

**Agent:** Product Agent (JUDGE mode)

**Output:** `docs/validation/[JIRA-ID]-product-review.md`

**Prompt:** `docs/prompts/3.4-product-review.md`

```
Act as the Product Agent from @docs/agents/product-agent.md in JUDGE mode.

## PRODUCT REVIEW for [JIRA-ID]

User story: @docs/[JIRA-ID].md
Task spec: @docs/specs/[JIRA-ID]/task.md

Validate each acceptance criterion is implemented:

| AC | Description | Status | Evidence |
|----|-------------|--------|----------|
| AC-1 | [criterion] | ✅/❌ | [file:line or "not found"] |

NFR Compliance (from selected ADRs):
| ADR | Status | Evidence |
|-----|--------|----------|
| [each selected ADR] | ✅/❌ | [file:line] |

WRITE a report to `docs/validation/[JIRA-ID]-product-review.md`

**Verdict:** ✅ ALL ACs IMPLEMENTED | ❌ MISSING: [list]
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

| Step | Prompt | Agent | Output | Gate |
|------|--------|-------|--------|------|
| 1.1 | `1.1-select-adrs.md` | Product (CREATE) | `task.md` (start) | — |
| 1.2 | `1.2-select-repo-specs.md` | Product (CREATE) | `task.md` (append) | — |
| 1.3 | `1.3-disambiguate-story.md` | Product (CREATE) | `task.md` (Q→A) | Answer BLOCKING questions |
| 1.4 | `1.4-create-solution-design.md` | Architect (CREATE) | `solution-design.md` | Review AC coverage |
| 1.5 | `1.5-create-execution-plan.md` | Architect (CREATE) | `execution-plan.md` | Review steps |
| 🚦 | **SIGN-OFF** | — | `git commit` | Engineer accountable |

### Part 2: Coding (per step)

| Step | Prompt | Agent | Gate |
|------|--------|-------|------|
| 2.1 | `2.1-generate-tests.md` | Implementation (CREATE) | Review tests |
| 2.2 | `2.2-implement-step.md` | Implementation (CREATE) | — |
| 2.3 | `2.3-fix-failed-tests.md` | Implementation (CREATE) | Tests pass |
| 2.4 | `git commit` | — | — |

**Development approach:** Trunk-based development. Each step = one commit. If step fails, revert and retry.

### Part 3: Validation (after all coding)

| Step | Prompt | Agent | Focus | Gate |
|------|--------|-------|-------|------|
| 3.1 | `3.1-run-all-tests.md` | — | Unit + E2E | All green |
| 3.2 | `3.2-code-review.md` | Implementation (JUDGE) | HOW (quality, patterns) | 0 blockers |
| 3.3 | `3.3-architecture-review.md` | Architect (JUDGE) | WHAT (structure, ADRs) | 0 blockers |
| 3.4 | `3.4-product-review.md` | Product (JUDGE) | WHETHER (AC complete) | All AC ✅ |
| 🚦 | **MERGE** | — | — | All reviews pass |

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
