# solution-design

**Agent:** Architect  
**V-Model:** 1.4 (CREATE), 3.3 (JUDGE)

## Purpose

Transform requirements into technical designs that satisfy ADRs and are implementable step-by-step.

## Design Process

```
1. UNDERSTAND → What problem? What constraints (ADRs)?
2. EXPLORE    → 2-3 approaches, trade-offs
3. DECIDE     → Pick approach, document WHY
4. STRUCTURE  → Components, data flow, interfaces
5. VALIDATE   → Check against ADRs, edge cases
```

## Design Dimensions

| Dimension | Questions to Answer |
|-----------|---------------------|
| Data | Where does it come from? Shape? Where stored? |
| State | Local component? URL? Store (NgRx)? |
| Flow | User actions → system responses? |
| Components | Container vs presentational? Reuse existing? |
| Dependencies | New services? External APIs? |
| Edge cases | Loading? Empty? Error? Boundaries? |

## ADR Compliance Check

For each selected ADR, document:
```
ADR-XXX: [Name]
├── Requirement: [what ADR mandates]
├── Approach: [how design satisfies it]
└── Verified by: [which part of design]
```

## Trade-off Documentation

| Option | Pros | Cons | ADR Conflicts |
|--------|------|------|---------------|
| A | [+] | [-] | None / ADR-XXX |
| B | [+] | [-] | None / ADR-XXX |

**Decision:** [Selected option] because [rationale].

## JUDGE Mode: Design Compliance

| Check | Evidence Required |
|-------|-------------------|
| Matches approved structure | Implementation follows design sections |
| ADR compliance | Each ADR requirement traceable to code |
| No drift | No components/services not in design |
| Edge cases handled | Code paths for all documented edge cases |

