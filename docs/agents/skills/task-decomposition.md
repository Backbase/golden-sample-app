# task-decomposition

**Agent:** Architect  
**V-Model:** 1.5 (CREATE)

## Purpose

Break solution design into ordered, testable, commitable steps.

## Decomposition Rules

| Rule | Implementation |
|------|----------------|
| Single responsibility | 1 step = 1 logical unit |
| Testable | Each step has verifiable outcome |
| Commitable | Step works independently (no broken state) |
| Ordered | Dependencies explicit, parallelism identified |
| Small | 1-4 hours of work per step |

## Step Granularity

| Too Big | Right Size | Too Small |
|---------|------------|-----------|
| "Implement feature" | "Create PaymentService.submit()" | "Add import statement" |
| "Add component" | "Create PaymentForm template with validation" | "Add single input field" |
| "Write tests" | "Add unit tests for PaymentService error handling" | "Write one assertion" |

## Dependency Identification

```
Step depends on another if it:
├── Uses types/interfaces defined in earlier step
├── Calls methods created in earlier step
├── Requires state set up by earlier step
└── Extends component created in earlier step
```

## Step Template

```
Step N: [Name]
├── Description: [1 line - what, not how]
├── Files: [paths to create/modify]
├── Tests: [key scenarios]
├── Depends: [Step IDs or "None"]
└── Estimate: [S/M/L]
```

## Sequencing Patterns

| Pattern | When |
|---------|------|
| Linear (S1→S2→S3) | Each step builds on previous |
| Parallel (S2 ∥ S3) | Independent steps after shared foundation |
| Branch-merge (S2,S3→S4) | Parallel steps that integrate |

