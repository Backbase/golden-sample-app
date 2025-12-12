# ADR-012: NgRx State Management Standards

## 1. Summary

<!-- LLM: Always load this section first -->

### TL;DR

> All Angular applications must implement state management using NgRx v20+ following established patterns for actions, reducers, selectors, effects, and entity management. State must be immutable, predictable, and testable with clear separation between state logic and component presentation.

### Rules

**MUST DO ✅**

1. Use `StoreModule.forRoot()` only once in application root; use `forFeature()` in feature modules
2. Enable runtime checks in development for immutability and serializability violations
3. Define all actions using `createAction` with `[Source] Event` naming pattern
4. Use `createSelector` for all derived state access (automatic memoization)
5. Handle all side effects (HTTP, routing) in effects with proper error handling via `catchError`
6. Apply `ChangeDetectionStrategy.OnPush` and `async` pipe for all store-connected components
7. Use `@ngrx/entity` adapter for managing normalized collections

**MUST NOT ❌**

1. Never import `StoreModule.forRoot()` in feature modules
2. Never mutate state directly—always return new objects using spread operator
3. Never subscribe to store in components—use `async` pipe instead
4. Never put complex logic in reducers—move computations to selectors
5. Never enable DevTools in production environments
6. Never use `any` types in actions, state, or selectors
7. Never skip error handling in effects—always use `catchError` returning failure action

---

## 2. Patterns

<!-- LLM: Load for code generation tasks -->

<!-- 
Cross-references:
- Components should use async pipe (prefer over subscribe): See ADR-000 Pattern 1
- OnPush change detection for store-connected components: See ADR-000 Pattern 2
-->

### Pattern Index

| Keywords | Pattern |
|----------|---------|
| action, dispatch, createAction, event | [Pattern 1: Action Definitions](#pattern-1-action-definitions) |
| reducer, state update, immutable | [Pattern 2: Immutable Reducers](#pattern-2-immutable-reducers) |
| selector, derived, memoized | [Pattern 3: Memoized Selectors](#pattern-3-memoized-selectors) |
| effect, API, side effect, HTTP | [Pattern 4: Effects for Side Effects](#pattern-4-effects-for-side-effects) |
| entity, collection, CRUD, adapter | [Pattern 5: Entity Management](#pattern-5-entity-management) |

---

### Pattern 1: Action Definitions

**Use when:** Defining state changes, triggering async operations, or communicating between components and store

**Don't use when:** Handling local component state that doesn't need to be shared

✅ **Good**

```typescript
// CONTEXT: Defining actions for a payments feature
// RULE: Use [Source] Event naming with type-safe props

import { createAction, props } from '@ngrx/store';
import { Payment } from './payments.models';

export const loadPayments = createAction(
  '[Payments Page] Load Payments',
  props<{ filter?: Partial<PaymentsFilter> }>()
);

export const loadPaymentsSuccess = createAction(
  '[Payments API] Load Payments Success',
  props<{ payments: Payment[] }>()
);

export const loadPaymentsFailure = createAction(
  '[Payments API] Load Payments Failure',
  props<{ error: string }>()
);
```

❌ **Bad**

```typescript
// PROBLEM: Missing source attribution, vague naming, untyped payload

export const loadPayments = createAction('LOAD_PAYMENTS');
export const paymentsLoaded = createAction(
  'PAYMENTS_LOADED',
  props<{ data: any }>()  // Using 'any' type
);
```

**Why it's wrong:** Without source attribution, actions are hard to trace in DevTools. Using `any` defeats TypeScript's type safety and makes debugging harder.

**Verify:**
- [ ] Action type follows `[Source] Event` format
- [ ] Props are strongly typed (no `any`)
- [ ] Success/Failure action pairs exist for async operations

---

### Pattern 2: Immutable Reducers

**Use when:** Handling any action that modifies state

**Don't use when:** Never—all state changes must go through reducers

✅ **Good**

```typescript
// CONTEXT: Reducer handling payment CRUD operations
// RULE: Always return new objects, never mutate

import { createReducer, on } from '@ngrx/store';
import * as PaymentsActions from './payments.actions';
import { initialState } from './payments.models';

export const paymentsReducer = createReducer(
  initialState,
  
  on(PaymentsActions.loadPayments, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(PaymentsActions.loadPaymentsSuccess, (state, { payments }) => ({
    ...state,
    payments: [...payments],
    loading: false,
  })),
  
  on(PaymentsActions.updatePaymentSuccess, (state, { payment }) => ({
    ...state,
    payments: state.payments.map((p) =>
      p.id === payment.id ? { ...p, ...payment } : p
    ),
    loading: false,
  })),
  
  on(PaymentsActions.deletePaymentSuccess, (state, { id }) => ({
    ...state,
    payments: state.payments.filter((p) => p.id !== id),
  }))
);
```

❌ **Bad**

```typescript
// PROBLEM: Direct mutation of state and nested objects

on(PaymentsActions.loadPaymentsSuccess, (state, { payments }) => {
  state.payments = payments;  // Direct mutation
  state.loading = false;
  return state;
}),

on(PaymentsActions.updatePaymentSuccess, (state, { payment }) => {
  const existing = state.payments.find(p => p.id === payment.id);
  existing.status = payment.status;  // Mutating nested object
  return state;
})
```

**Why it's wrong:** Direct mutation breaks change detection, DevTools time-travel, and makes state unpredictable. NgRx runtime checks will throw errors in development.

**Verify:**
- [ ] All state updates use spread operator (`{...state, ...}`)
- [ ] Array updates use `.map()`, `.filter()`, `.concat()`, or spread
- [ ] No direct property assignment on state or nested objects

---

### Pattern 3: Memoized Selectors

**Use when:** Accessing state in components or deriving computed values

**Don't use when:** Never access store state directly without selectors

✅ **Good**

```typescript
// CONTEXT: Selectors for payments feature with derived data
// RULE: Compose selectors and compute derived state here, not in components

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PaymentsState } from './payments.models';

export const selectPaymentsState = createFeatureSelector<PaymentsState>('payments');

export const selectAllPayments = createSelector(
  selectPaymentsState,
  (state) => state.payments
);

export const selectPaymentsLoading = createSelector(
  selectPaymentsState,
  (state) => state.loading
);

export const selectFilteredPayments = createSelector(
  selectAllPayments,
  selectPaymentsFilter,
  (payments, filter) => {
    if (filter.status === 'all') return payments;
    return payments.filter((p) => p.status === filter.status);
  }
);

// ViewModel selector for components
export const selectPaymentsViewModel = createSelector(
  selectFilteredPayments,
  selectPaymentsLoading,
  selectPaymentsError,
  (payments, loading, error) => ({
    payments,
    loading,
    error,
    hasPayments: payments.length > 0,
  })
);
```

❌ **Bad**

```typescript
// PROBLEM: Selecting entire state slice when only need specific data

export class BadComponent {
  state$ = this.store.select(selectPaymentsState);
  
  // In template: {{ (state$ | async)?.loading }}
  // In template: {{ (state$ | async)?.payments | filterPipe:statusFilter }}
}
```

**Why it's wrong:** Selecting entire state slices triggers re-renders on any state change, not just relevant changes. Filtering in templates bypasses memoization and recalculates every render cycle.

**Verify:**
- [ ] Using `createSelector` for all derived state
- [ ] Selecting only required data, not entire state slices
- [ ] Complex filtering/transformation done in selectors, not templates

---

### Pattern 4: Effects for Side Effects

**Use when:** Making HTTP calls, accessing localStorage, routing, or showing notifications

**Don't use when:** Synchronous state updates that don't require external interaction

✅ **Good**

```typescript
// CONTEXT: Effects handling payment API operations
// RULE: Use appropriate flattening operator and always handle errors

import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, exhaustMap, withLatestFrom, tap } from 'rxjs/operators';

@Injectable()
export class PaymentsEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private paymentsService = inject(PaymentsService);
  private notificationService = inject(NotificationService);

  // switchMap: Cancels previous request (good for search/filter)
  loadPayments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentsActions.loadPayments),
      withLatestFrom(this.store.select(selectPaymentsFilter)),
      switchMap(([action, filter]) =>
        this.paymentsService.getPayments(filter).pipe(
          map((payments) => PaymentsActions.loadPaymentsSuccess({ payments })),
          catchError((error) =>
            of(PaymentsActions.loadPaymentsFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // exhaustMap: Ignores new actions while request pending (good for create/submit)
  createPayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentsActions.createPayment),
      exhaustMap(({ payment }) =>
        this.paymentsService.createPayment(payment).pipe(
          map((created) => PaymentsActions.createPaymentSuccess({ payment: created })),
          catchError((error) =>
            of(PaymentsActions.createPaymentFailure({ error: error.message }))
          )
        )
      )
    )
  );

  // Non-dispatching effect for side effects
  showSuccessNotification$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PaymentsActions.createPaymentSuccess),
        tap(() => {
          this.notificationService.showNotification({
            message: 'Payment created successfully',
            type: 'success',
          });
        })
      ),
    { dispatch: false }
  );
}
```

❌ **Bad**

```typescript
// PROBLEM: Missing error handling, wrong flattening operator, swallowing errors

loadPayments$ = createEffect(() =>
  this.actions$.pipe(
    ofType(PaymentsActions.loadPayments),
    mergeMap(() =>  // Wrong: mergeMap allows parallel requests
      this.paymentsService.getPayments().pipe(
        map((payments) => PaymentsActions.loadPaymentsSuccess({ payments }))
        // Missing catchError - will break the effect stream on error
      )
    )
  )
);

createPayment$ = createEffect(() =>
  this.actions$.pipe(
    ofType(PaymentsActions.createPayment),
    switchMap(({ payment }) =>  // Wrong: switchMap cancels ongoing creates
      this.paymentsService.createPayment(payment).pipe(
        map((created) => PaymentsActions.createPaymentSuccess({ payment: created })),
        catchError(() => EMPTY)  // Swallowing error - no failure action
      )
    )
  )
);
```

**Why it's wrong:** Missing `catchError` will terminate the effect stream on first error. Using wrong flattening operator can cancel critical operations or allow unwanted parallel requests. Swallowing errors leaves UI in loading state forever.

**Verify:**
- [ ] Every API call has `catchError` returning a failure action
- [ ] Correct flattening operator used (`switchMap` for search, `exhaustMap` for submit, `concatMap` for ordered)
- [ ] Non-dispatching effects use `{ dispatch: false }`

---

### Pattern 5: Entity Management

**Use when:** Managing collections of items with CRUD operations (accounts, transactions, users)

**Don't use when:** Simple state with only a few items or non-collection data

✅ **Good**

```typescript
// CONTEXT: Managing users collection with EntityAdapter
// RULE: Use @ngrx/entity for normalized collections

import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UsersState extends EntityState<User> {
  loading: boolean;
  error: string | null;
}

export const usersAdapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: (user) => user.id,
  sortComparer: (a, b) => a.lastName.localeCompare(b.lastName),
});

export const initialState: UsersState = usersAdapter.getInitialState({
  loading: false,
  error: null,
});

// In reducer
export const usersReducer = createReducer(
  initialState,
  on(UsersActions.loadUsersSuccess, (state, { users }) =>
    usersAdapter.setAll(users, { ...state, loading: false })
  ),
  on(UsersActions.addUserSuccess, (state, { user }) =>
    usersAdapter.addOne(user, state)
  ),
  on(UsersActions.updateUserSuccess, (state, { user }) =>
    usersAdapter.updateOne({ id: user.id, changes: user }, state)
  ),
  on(UsersActions.deleteUserSuccess, (state, { id }) =>
    usersAdapter.removeOne(id, state)
  )
);

// In selectors
const { selectIds, selectEntities, selectAll, selectTotal } = usersAdapter.getSelectors();

export const selectUserEntities = createSelector(selectUsersState, selectEntities);
export const selectAllUsers = createSelector(selectUsersState, selectAll);
export const selectUserById = (id: string) =>
  createSelector(selectUserEntities, (entities) => entities[id] ?? null);
```

❌ **Bad**

```typescript
// PROBLEM: Manual array management without normalization

export interface UsersState {
  users: User[];  // Array instead of normalized entity state
  loading: boolean;
}

// Reducer with manual array manipulation
on(UsersActions.updateUserSuccess, (state, { user }) => ({
  ...state,
  users: state.users.map(u => u.id === user.id ? user : u),  // O(n) lookup every time
})),

// Component doing O(n) lookup
selectUserById(id: string) {
  return this.users$.pipe(
    map(users => users.find(u => u.id === id))  // Recalculates on any users change
  );
}
```

**Why it's wrong:** Array-based collections require O(n) lookups and cause unnecessary recalculations. EntityAdapter provides O(1) lookups via dictionary and built-in CRUD operations with automatic sorting.

**Verify:**
- [ ] Collection state extends `EntityState<T>`
- [ ] EntityAdapter created with `selectId` and optional `sortComparer`
- [ ] Reducer uses adapter methods (`setAll`, `addOne`, `updateOne`, `removeOne`)

---

## 3. Validation

<!-- LLM: Load for code review tasks -->

### Automated Checks

| ID | Check | Severity | How to Detect |
|----|-------|----------|---------------|
| `NGRX-001` | StoreModule.forRoot() imported only once | 🔴 BLOCKER | `grep -r "forRoot" --include="*.ts" \| grep -c "StoreModule"` should equal 1 |
| `NGRX-002` | DevTools disabled in production | 🔴 BLOCKER | `grep -r "StoreDevtoolsModule" --include="*.ts"` must have `!environment.production` guard |
| `NGRX-003` | Actions use createAction | 🔴 BLOCKER | `grep -r "new Action" --include="*.ts"` should return 0 results |
| `NGRX-004` | Effects have catchError | 🔴 BLOCKER | Effects files must contain `catchError` for each API call |
| `NGRX-005` | Components use OnPush | 🟡 WARNING | `grep -r "ChangeDetectionStrategy.Default" --include="*.ts"` in store-connected components |
| `NGRX-006` | No any types in state | 🟡 WARNING | `grep -r "any" --include="*.actions.ts" --include="*.models.ts"` |
| `NGRX-007` | Selectors use createSelector | 🟡 WARNING | `grep -r "store.select\(" --include="*.ts"` should use selector functions |

### Review Checklist

| ID | Check | Severity |
|----|-------|----------|
| `NGRX-R01` | State updates are immutable (spread operator, no direct mutation) | 🔴 BLOCKER |
| `NGRX-R02` | Actions follow `[Source] Event` naming convention | 🔴 BLOCKER |
| `NGRX-R03` | Effects use appropriate flattening operator (switchMap/exhaustMap/concatMap) | 🔴 BLOCKER |
| `NGRX-R04` | Complex logic in selectors, not reducers or components | 🟡 WARNING |
| `NGRX-R05` | ViewModel selectors used for components needing multiple state slices | 🟡 WARNING |
| `NGRX-R06` | EntityAdapter used for collections > 10 items | 🟡 WARNING |
| `NGRX-R07` | Feature state organized in `+state/` directory | 🟡 WARNING |

### Required Tests

| Scenario | Type | Required |
|----------|------|----------|
| Reducer handles all actions correctly | Unit | ✅ Yes |
| Selectors return correct derived data | Unit | ✅ Yes |
| Effects dispatch success/failure actions | Unit | ✅ Yes |
| Effects handle API errors gracefully | Unit | ✅ Yes |
| Components dispatch actions correctly | Unit | ✅ Yes |
| State flows end-to-end | Integration | ⚪ Optional |

---

## 4. Context

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding the historical context.
-->

### Problem

Banking applications need complex state management with predictable, traceable changes. Multiple components sharing data, cross-journey communication, and compliance audit trails require centralized patterns.

### Business Drivers

- Optimistic updates with rollback for failed operations
- Compliance audit trails require state change tracking
- Performance SLA: state updates < 16ms for 60fps

### Technical Constraints

- `@ngrx/store` v20.0.1+ required
- ~50KB gzipped bundle impact
- SSR state serialization support

---

## 5. Decision

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding decision rationale.
-->

### What We Decided

Use NgRx: `StoreModule.forRoot()` in app root, `forFeature()` in features. Typed actions with `[Source] Event` naming. Immutable reducers, memoized selectors, effects with catchError. `@ngrx/entity` for collections.

### Rationale

| Choice | Why |
|--------|-----|
| Unidirectional data flow | Predictable, traceable, debuggable state changes |
| Memoized selectors | Prevent unnecessary recalculations |
| Effects with catchError | Never break effect stream on errors |
| Entity adapter | O(1) lookups, built-in CRUD operations |

---

## 6. Implementation

### Affected Components

| Component | Impact | Files |
|-----------|--------|-------|
| Feature modules | CREATE | `libs/**/+state/*.ts` |
| Application root | MODIFY | `app-module-imports.ts` |
| Smart components | MODIFY | `**/containers/**/*.component.ts` |
| Services | MODIFY | Services calling APIs (move to effects) |

### Related ADRs

| ADR | Relationship |
|-----|--------------|
| ADR-011 Entitlements | Related to: State may store user permissions |
| ADR-007 Journey Configuration | Related to: Configuration may be stored in state |

### Migration Notes

For existing applications not using NgRx:
1. Add NgRx packages: `@ngrx/store`, `@ngrx/effects`, `@ngrx/entity`, `@ngrx/store-devtools`
2. Configure root store with runtime checks enabled
3. Migrate feature by feature, starting with features requiring shared state
4. Convert service-based state to feature state slices
5. Replace component subscriptions with `async` pipe

---

## 7. Examples

### Complete Example

<!-- 
NOTE: For action, reducer, selector, effect, and entity patterns,
see Patterns 1-5 above. This example shows file organization only.
-->

**Scenario:** NgRx state for a payments feature

**File Organization:**

```
libs/payments/feature/src/lib/
├── +state/
│   ├── payments.models.ts      # State interface + initialState
│   ├── payments.actions.ts     # createAction with [Source] Event (Pattern 1)
│   ├── payments.reducer.ts     # createReducer with spread operator (Pattern 2)
│   ├── payments.selectors.ts   # createSelector with ViewModel (Pattern 3)
│   └── payments.effects.ts     # createEffect with catchError (Pattern 4)
├── containers/
│   └── payments-list.component.ts  # OnPush + async pipe + dispatch
└── payments.module.ts          # StoreModule.forFeature()
```

**Component Integration Pattern:**

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-container *ngIf="vm$ | async as vm">...</ng-container>`
})
export class PaymentsListComponent {
  vm$ = this.store.select(selectPaymentsViewModel);
  
  onAction(): void {
    this.store.dispatch(PaymentsActions.action());
  }
}
```

### Common Mistakes

**Mistake 1: Subscribing in components instead of using async pipe**

```typescript
// ❌ Wrong
export class BadComponent implements OnInit, OnDestroy {
  payments: Payment[] = [];
  private subscription: Subscription;

  ngOnInit() {
    this.subscription = this.store.select(selectPayments).subscribe(
      payments => this.payments = payments
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();  // Easy to forget
  }
}

// ✅ Fix
export class GoodComponent {
  payments$ = this.store.select(selectPayments);
  // In template: *ngFor="let payment of payments$ | async"
}
```

**Mistake 2: Using wrong flattening operator in effects**

```typescript
// ❌ Wrong - switchMap cancels payment creation if user clicks again
createPayment$ = createEffect(() =>
  this.actions$.pipe(
    ofType(PaymentsActions.createPayment),
    switchMap(({ payment }) =>  // Will cancel ongoing request
      this.service.create(payment).pipe(...)
    )
  )
);

// ✅ Fix - exhaustMap ignores new actions while request is pending
createPayment$ = createEffect(() =>
  this.actions$.pipe(
    ofType(PaymentsActions.createPayment),
    exhaustMap(({ payment }) =>
      this.service.create(payment).pipe(...)
    )
  )
);
```

**Mistake 3: Computing derived data in components instead of selectors**

```typescript
// ❌ Wrong - Recalculates every render cycle
export class BadComponent {
  payments$ = this.store.select(selectAllPayments);
  
  get pendingPayments() {
    return this.payments.filter(p => p.status === 'pending');
  }
}

// ✅ Fix - Memoized selector only recalculates when payments change
// In selectors file:
export const selectPendingPayments = createSelector(
  selectAllPayments,
  (payments) => payments.filter(p => p.status === 'pending')
);

// In component:
export class GoodComponent {
  pendingPayments$ = this.store.select(selectPendingPayments);
}
```

---

## 8. References

- [NgRx Official Documentation v20](https://ngrx.io/docs) — Official NgRx framework documentation
- [Angular Official Documentation](https://angular.dev/) — Angular framework best practices
- [RxJS Official Documentation](https://rxjs.dev/) — Reactive programming patterns
- [NgRx Entity Documentation](https://ngrx.io/guide/entity) — Entity management patterns
- [NgRx Effects Documentation](https://ngrx.io/guide/effects) — Side effects handling
- [Angular Performance Guide](https://angular.dev/best-practices/runtime-performance) — Performance optimization
- [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools) — Debugging tools
- [NgRx v20 Migration Guide](https://ngrx.io/guide/migration/v20) — Upgrade path from older versions
- [Component Store vs Global Store](https://ngrx.io/guide/component-store) — When to use local vs global state

---
