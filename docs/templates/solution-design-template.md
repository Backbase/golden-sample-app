# Solution Design: [JIRA-ID]

| Ticket | [JIRA-ID]: [Title] |
|--------|-------------------|
| Status | DRAFT / APPROVED |
| Task | `docs/specs/[JIRA-ID]/task.md` |
| Date | [YYYY-MM-DD] |

---

## 1. Approach

**Summary:** [1-2 sentences: HOW we're solving the problem from task.md]

**ADR Compliance:**
| ADR | How Satisfied |
|-----|---------------|
| ADR-XXX | [specific implementation approach] |

*ADRs listed in task.md §4. Document HOW each is satisfied, not WHAT it requires.*

---

## 2. Design

### 2.1 Structure

```
[ASCII diagram: components and relationships]
```

### 2.2 Data Flow

```
[Trigger] → [Steps] → [Outcome]
```

### 2.3 State

| State | Location | Why |
|-------|----------|-----|
| [data] | component/store/URL | [justification] |

---

## 3. Interfaces

### API (if new/modified)

```
[METHOD] /api/v1/[path]
Request:  { field: type }
Response: { field: type }
```

### TypeScript

```typescript
// New or modified interfaces only
interface [Name] {
  field: Type;
}
```

### Component I/O (if applicable)

| Type | Name | Type | Purpose |
|------|------|------|---------|
| @Input | [name] | [type] | [what] |
| @Output | [name] | [type] | [when] |

---

## 4. Changes

### Create

| File | Purpose |
|------|---------|
| `path/to/file.ts` | [what] |

### Modify

| File | Change |
|------|--------|
| `path/to/file.ts` | [what] |

---

## 5. Edge Cases

| Scenario | User Sees | Implementation |
|----------|-----------|----------------|
| Loading | [what] | [how] |
| Empty | [what] | [how] |
| Error | [what] | [how] |

---

## 6. Tests

| Unit | Key Scenarios |
|------|---------------|
| [component/service] | [cases to cover] |

---

## 7. Open Questions

| Question | Owner |
|----------|-------|
| [blocking question] | [who resolves] |

*Empty = ready for approval*

---

## Approval

- [ ] Design implements all ACs from task.md §3
- [ ] ADR compliance documented for each ADR in task.md §4
- [ ] Edge cases cover loading, empty, error

**Approved by:** __________ **Date:** __________
