# refactoring

**Agent:** Implementation  
**V-Model:** 2.2 (CREATE), 3.2 (JUDGE)

## Purpose

Improve existing code structure without changing behavior. Essential when extending legacy code.

## Refactoring Safety

```
BEFORE refactoring:
├── Tests exist and pass
├── Scope is defined (what to change)
└── Behavior is understood

DURING refactoring:
├── Small steps, commit often
├── Run tests after each change
└── No behavior changes

AFTER refactoring:
├── Same tests still pass
├── Code is cleaner
└── Ready for new feature
```

## Common Refactorings

| Technique | When | Steps |
|-----------|------|-------|
| Extract Method | Code block does one thing, reusable | 1. Identify block 2. Create method 3. Replace block with call |
| Inline Method | Method body is as clear as name | 1. Find all calls 2. Replace with body 3. Delete method |
| Extract Variable | Complex expression | 1. Create variable with clear name 2. Replace expression |
| Rename | Name doesn't reflect purpose | 1. Rename 2. Update all references |
| Extract Interface | Multiple implementations needed | 1. Identify shared contract 2. Create interface 3. Implement |
| Move Method | Method uses more of another class | 1. Copy to target 2. Delegate from source 3. Remove source |

## When NOT to Refactor

| Situation | Why |
|-----------|-----|
| No tests | Can't verify behavior preserved |
| Deadline pressure | Risk of introducing bugs |
| Don't understand code | Might break hidden behavior |
| Refactor + feature in same commit | Can't isolate issues |

## Refactoring Workflow

```
1. Identify smell (see clean-code skill)
2. Ensure test coverage for affected code
3. Apply single refactoring technique
4. Run tests
5. Commit with message: "refactor: [what changed]"
6. Repeat or stop
```

