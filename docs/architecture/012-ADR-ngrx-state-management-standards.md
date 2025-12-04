# ADR-012: NgRx State Management Standards

## Decision summary

All Angular applications in the OBLM platform must implement state management using NgRx v20+ following established patterns for actions, reducers, selectors, effects, and entity management. State management implementation must ensure predictability, maintainability, performance, and testability. All features requiring centralized state must follow the architectural patterns defined in this ADR as part of Definition of Done.

## Context and problem statement

### Business context
- Banking applications require complex state management for user data, financial transactions, account information, and workflow states
- Multiple concurrent user sessions with different contexts (retail vs business) need isolated state management
- Real-time data synchronization requirements for financial information across multiple components
- User experience requires optimistic updates with rollback capabilities for failed operations
- Compliance and audit requirements mandate state change tracking and reproducibility
- Cross-journey communication requires centralized, predictable state patterns

### Technical context
- Angular 20+ applications built on Backbase Widget Architecture 3.0
- Multiple journeys and widgets requiring shared state management
- Reactive programming with RxJS is the foundation of the Angular framework
- Performance requirements for handling large datasets (transactions, accounts, users)
- Integration with Backbase services requires consistent data flow patterns
- Lazy-loaded modules need efficient state hydration and cleanup
- Server-side rendering (Angular Universal) considerations for state serialization

### Constraints and assumptions

**Technical Constraints**:
- Must use `@ngrx/store` version 20.0.1 or higher (current platform version)
- Must integrate with existing Backbase foundation modules (`@backbase/foundation-ang`)
- Angular standalone components support required for future migration
- Browser support requirements: Chrome, Firefox, Safari, Edge (last 2 versions)
- Bundle size impact must be monitored (NgRx adds ~50KB gzipped)
- Must support Server-Side Rendering (SSR) for performance

**Business Constraints**:  
- State management patterns are mandatory for Definition of Done
- Must support audit trail requirements for financial operations
- Error states must be handled consistently for user experience
- Performance SLA: State updates must not cause UI freezes (< 16ms for 60fps)
- Must support multi-tenancy and user context switching

**Environmental Constraints**:
- Must work in both development (mocked) and production environments
- Must integrate with existing monitoring and observability tools (OpenTelemetry)
- Must support CI/CD pipelines with automated testing
- DevTools integration required for debugging in non-production environments

**Assumptions Made**:
- NgRx DevTools are available in development environments
- Developers have basic understanding of reactive programming (RxJS)
- State structure can evolve but must maintain backward compatibility
- Server-side state hydration is handled by Angular Universal
- Memory management is critical for long-running sessions
- Chrome browser with Redux DevTools extension is the primary development environment

### Affected architecture description elements

**Components**:
- All feature modules requiring centralized state
- All Angular services interacting with HTTP APIs
- All components displaying or manipulating shared data
- Effects for handling side effects (API calls, routing, notifications)
- Reducers for state transitions
- Selectors for derived state and memoization
- Guards and resolvers depending on state

**Views**:
- Logical view: State architecture with feature slices, shared state, and entity collections
- Development view: Store modules, feature state modules, testing infrastructure
- Process view: Action dispatch → Reducer → State update → Selector → Component re-render
- Physical view: Browser application with Redux DevTools integration

**Stakeholders**:
- End users: Consistent, predictable application behavior
- Development teams: Clear patterns for implementing features
- QA teams: Testable state logic with time-travel debugging
- DevOps teams: Observable state management metrics
- Security teams: Audit trail for sensitive state changes
- Performance teams: Optimizable state access patterns

## Decision

### What we decided

**All Angular applications must implement NgRx state management using the following mandatory patterns:**

1. **Store Setup**: Initialize `StoreModule.forRoot()` in application root and `StoreModule.forFeature()` in feature modules
2. **Feature State**: Organize state by feature domains using lazy-loaded feature slices
3. **Actions**: Define all state changes as strongly-typed actions using `createAction` with explicit source attribution
4. **Reducers**: Implement pure reducer functions using `createReducer` with `on` handlers for immutable state updates
5. **Selectors**: Create memoized selectors using `createSelector` for efficient state access and derived data
6. **Effects**: Handle all side effects (HTTP, routing, localStorage) using `createEffect` with proper error handling
7. **Entity Management**: Use `@ngrx/entity` for managing normalized collections with standard CRUD operations
8. **DevTools**: Integrate NgRx Store DevTools in non-production environments for debugging
9. **Testing**: Implement comprehensive unit tests for reducers, selectors, and effects
10. **Performance**: Apply OnPush change detection strategy with observables for optimal performance

### Rationale

**Why this decision was made:**

1. **Predictability**: Unidirectional data flow with explicit actions makes state changes traceable and debuggable
2. **Maintainability**: Separation of concerns (actions, reducers, selectors, effects) creates clear boundaries
3. **Scalability**: Feature-based state slices allow independent development and lazy loading
4. **Performance**: Memoized selectors prevent unnecessary recalculations; OnPush change detection reduces rendering
5. **Testability**: Pure reducers and isolated effects are easily unit tested without complex mocking
6. **Developer Experience**: NgRx DevTools provide time-travel debugging and state inspection
7. **Framework Alignment**: NgRx is the de facto standard for Angular state management with strong community support
8. **Reactive Programming**: Seamless integration with RxJS observables matches Angular's reactive paradigm
9. **Type Safety**: TypeScript support provides compile-time safety for state shape and action payloads
10. **Audit Requirements**: Action history provides complete audit trail for compliance

**Evaluation criteria used:**
- Developer productivity (learning curve, boilerplate, debugging)
- Runtime performance (state access, change detection, memory usage)
- Code maintainability (separation of concerns, testability)
- Framework alignment (Angular best practices, RxJS integration)
- Community support (documentation, examples, ecosystem)
- Migration path (current v20, future compatibility)

## Implementation details

### Technical approach

#### 1. Store Configuration

**Root Module Setup (Application Root)**

```typescript
// app-module-imports.ts
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule, routerReducer } from '@ngrx/router-store';
import { environment } from '../environments/environment';

export const appModuleImports = [
  // ... other imports
  
  // Initialize root store with router state
  StoreModule.forRoot(
    {
      router: routerReducer,
    },
    {
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true,
        strictStateSerializability: true,
        strictActionSerializability: true,
        strictActionWithinNgZone: true,
        strictActionTypeUniqueness: true,
      },
    }
  ),
  
  // Initialize root effects
  EffectsModule.forRoot([]),
  
  // Connect router to store
  StoreRouterConnectingModule.forRoot(),
  
  // DevTools only in non-production
  !environment.production
    ? StoreDevtoolsModule.instrument({
        maxAge: 25, // Retains last 25 states
        logOnly: environment.production,
        autoPause: true, // Pauses when window is not in focus
        trace: false, // Capture stack traces for actions
        traceLimit: 75,
      })
    : [],
];
```

**⚠️ Critical Rules:**
- Import `StoreModule.forRoot()` **only once** in the application root
- Always enable runtime checks in development for immutability violations
- Never import `forRoot()` in feature modules (use `forFeature()` instead)
- DevTools should only be enabled in non-production environments

#### 2. Feature State Structure

**Pattern: Feature State Module**

```typescript
// libs/payments/feature/src/lib/+state/payments.models.ts
export interface Payment {
  id: string;
  amount: number;
  currency: string;
  recipientName: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'completed';
  createdDate: string;
  scheduledDate?: string;
}

export interface PaymentsState {
  payments: Payment[];
  selectedPaymentId: string | null;
  loading: boolean;
  error: string | null;
  filter: {
    status: Payment['status'] | 'all';
    dateRange: { start: string; end: string } | null;
  };
}

export const initialState: PaymentsState = {
  payments: [],
  selectedPaymentId: null,
  loading: false,
  error: null,
  filter: {
    status: 'all',
    dateRange: null,
  },
};
```

**Pattern: Feature State Registration**

```typescript
// libs/payments/feature/src/lib/payments-feature.module.ts
import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { paymentsReducer } from './+state/payments.reducer';
import { PaymentsEffects } from './+state/payments.effects';

@NgModule({
  imports: [
    // Register feature state slice
    StoreModule.forFeature('payments', paymentsReducer),
    
    // Register feature effects
    EffectsModule.forFeature([PaymentsEffects]),
  ],
  // ... other config
})
export class PaymentsFeatureModule {}
```

#### 3. Actions Pattern

**Pattern: Action Definitions with Source Attribution**

```typescript
// libs/payments/feature/src/lib/+state/payments.actions.ts
import { createAction, props } from '@ngrx/store';
import { Payment } from './payments.models';

// ============================================================================
// Load Payments Actions
// ============================================================================
export const loadPayments = createAction(
  '[Payments Page] Load Payments',
  props<{ filter?: Partial<PaymentsState['filter']> }>()
);

export const loadPaymentsSuccess = createAction(
  '[Payments API] Load Payments Success',
  props<{ payments: Payment[] }>()
);

export const loadPaymentsFailure = createAction(
  '[Payments API] Load Payments Failure',
  props<{ error: string }>()
);

// ============================================================================
// Create Payment Actions
// ============================================================================
export const createPayment = createAction(
  '[Create Payment Form] Create Payment',
  props<{ payment: Omit<Payment, 'id' | 'status' | 'createdDate'> }>()
);

export const createPaymentSuccess = createAction(
  '[Payments API] Create Payment Success',
  props<{ payment: Payment }>()
);

export const createPaymentFailure = createAction(
  '[Payments API] Create Payment Failure',
  props<{ error: string }>()
);

// ============================================================================
// Update Payment Actions
// ============================================================================
export const updatePayment = createAction(
  '[Payment Detail] Update Payment',
  props<{ id: string; changes: Partial<Payment> }>()
);

export const updatePaymentSuccess = createAction(
  '[Payments API] Update Payment Success',
  props<{ payment: Payment }>()
);

export const updatePaymentFailure = createAction(
  '[Payments API] Update Payment Failure',
  props<{ error: string }>()
);

// ============================================================================
// Delete Payment Actions
// ============================================================================
export const deletePayment = createAction(
  '[Payment Detail] Delete Payment',
  props<{ id: string }>()
);

export const deletePaymentSuccess = createAction(
  '[Payments API] Delete Payment Success',
  props<{ id: string }>()
);

export const deletePaymentFailure = createAction(
  '[Payments API] Delete Payment Failure',
  props<{ error: string }>()
);

// ============================================================================
// UI State Actions
// ============================================================================
export const selectPayment = createAction(
  '[Payments Page] Select Payment',
  props<{ id: string | null }>()
);

export const setPaymentsFilter = createAction(
  '[Payments Filter] Set Filter',
  props<{ filter: Partial<PaymentsState['filter']> }>()
);

export const clearPaymentsError = createAction(
  '[Payments Page] Clear Error'
);
```

**Action Naming Convention Rules:**
- Format: `[Source] Event Description`
- **Source**: Where the action originated (component, service, API, guard)
  - Examples: `[Payments Page]`, `[Payments API]`, `[Create Payment Form]`, `[Payments Guard]`
- **Event**: Past tense for results, present tense for commands
  - Commands: `Load Payments`, `Create Payment`, `Delete Payment`
  - Results: `Load Payments Success`, `Create Payment Failure`
- Use props for type-safe payloads with descriptive property names
- Group related actions together with comments
- Export individual actions (don't use action groups for better tree-shaking)

#### 4. Reducers Pattern

**Pattern: Feature Reducer with Immutable Updates**

```typescript
// libs/payments/feature/src/lib/+state/payments.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as PaymentsActions from './payments.actions';
import { initialState } from './payments.models';

export const paymentsReducer = createReducer(
  initialState,
  
  // ============================================================================
  // Load Payments
  // ============================================================================
  on(PaymentsActions.loadPayments, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(PaymentsActions.loadPaymentsSuccess, (state, { payments }) => ({
    ...state,
    payments: [...payments],
    loading: false,
    error: null,
  })),
  
  on(PaymentsActions.loadPaymentsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  // ============================================================================
  // Create Payment
  // ============================================================================
  on(PaymentsActions.createPayment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(PaymentsActions.createPaymentSuccess, (state, { payment }) => ({
    ...state,
    payments: [...state.payments, payment],
    selectedPaymentId: payment.id,
    loading: false,
    error: null,
  })),
  
  on(PaymentsActions.createPaymentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  // ============================================================================
  // Update Payment
  // ============================================================================
  on(PaymentsActions.updatePayment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(PaymentsActions.updatePaymentSuccess, (state, { payment }) => ({
    ...state,
    payments: state.payments.map((p) =>
      p.id === payment.id ? { ...p, ...payment } : p
    ),
    loading: false,
    error: null,
  })),
  
  on(PaymentsActions.updatePaymentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  // ============================================================================
  // Delete Payment
  // ============================================================================
  on(PaymentsActions.deletePayment, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(PaymentsActions.deletePaymentSuccess, (state, { id }) => ({
    ...state,
    payments: state.payments.filter((p) => p.id !== id),
    selectedPaymentId: state.selectedPaymentId === id ? null : state.selectedPaymentId,
    loading: false,
    error: null,
  })),
  
  on(PaymentsActions.deletePaymentFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  // ============================================================================
  // UI State
  // ============================================================================
  on(PaymentsActions.selectPayment, (state, { id }) => ({
    ...state,
    selectedPaymentId: id,
  })),
  
  on(PaymentsActions.setPaymentsFilter, (state, { filter }) => ({
    ...state,
    filter: {
      ...state.filter,
      ...filter,
    },
  })),
  
  on(PaymentsActions.clearPaymentsError, (state) => ({
    ...state,
    error: null,
  }))
);
```

**Reducer Rules:**
- Always return new state object using spread operator (`{ ...state, ... }`)
- Never mutate existing state or nested objects
- Use array methods that return new arrays (`.map()`, `.filter()`, `.concat()`, spread)
- Keep reducer logic simple; complex computations belong in selectors
- Group related action handlers together with comments
- Initialize loading states before async operations
- Clear errors on new operations

#### 5. Selectors Pattern

**Pattern: Memoized Selectors with Composition**

```typescript
// libs/payments/feature/src/lib/+state/payments.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { PaymentsState, Payment } from './payments.models';

// ============================================================================
// Feature Selector
// ============================================================================
export const selectPaymentsState = createFeatureSelector<PaymentsState>('payments');

// ============================================================================
// Base Selectors
// ============================================================================
export const selectAllPayments = createSelector(
  selectPaymentsState,
  (state) => state.payments
);

export const selectSelectedPaymentId = createSelector(
  selectPaymentsState,
  (state) => state.selectedPaymentId
);

export const selectPaymentsLoading = createSelector(
  selectPaymentsState,
  (state) => state.loading
);

export const selectPaymentsError = createSelector(
  selectPaymentsState,
  (state) => state.error
);

export const selectPaymentsFilter = createSelector(
  selectPaymentsState,
  (state) => state.filter
);

// ============================================================================
// Derived Selectors
// ============================================================================
export const selectSelectedPayment = createSelector(
  selectAllPayments,
  selectSelectedPaymentId,
  (payments, selectedId) => 
    payments.find((payment) => payment.id === selectedId) ?? null
);

export const selectFilteredPayments = createSelector(
  selectAllPayments,
  selectPaymentsFilter,
  (payments, filter) => {
    let filtered = payments;
    
    // Filter by status
    if (filter.status !== 'all') {
      filtered = filtered.filter((p) => p.status === filter.status);
    }
    
    // Filter by date range
    if (filter.dateRange) {
      const start = new Date(filter.dateRange.start);
      const end = new Date(filter.dateRange.end);
      filtered = filtered.filter((p) => {
        const date = new Date(p.createdDate);
        return date >= start && date <= end;
      });
    }
    
    return filtered;
  }
);

export const selectPaymentsByStatus = (status: Payment['status']) =>
  createSelector(selectAllPayments, (payments) =>
    payments.filter((p) => p.status === status)
  );

export const selectPaymentById = (id: string) =>
  createSelector(selectAllPayments, (payments) =>
    payments.find((p) => p.id === id) ?? null
  );

// ============================================================================
// Aggregated/Computed Selectors
// ============================================================================
export const selectPaymentsCount = createSelector(
  selectFilteredPayments,
  (payments) => payments.length
);

export const selectTotalPaymentAmount = createSelector(
  selectFilteredPayments,
  (payments) => 
    payments.reduce((sum, payment) => sum + payment.amount, 0)
);

export const selectPaymentStatusCounts = createSelector(
  selectAllPayments,
  (payments) => ({
    draft: payments.filter((p) => p.status === 'draft').length,
    pending: payments.filter((p) => p.status === 'pending').length,
    approved: payments.filter((p) => p.status === 'approved').length,
    rejected: payments.filter((p) => p.status === 'rejected').length,
    completed: payments.filter((p) => p.status === 'completed').length,
  })
);

// ============================================================================
// ViewModel Selectors (combine multiple slices)
// ============================================================================
export const selectPaymentsViewModel = createSelector(
  selectFilteredPayments,
  selectPaymentsLoading,
  selectPaymentsError,
  selectPaymentsCount,
  selectSelectedPaymentId,
  (payments, loading, error, count, selectedId) => ({
    payments,
    loading,
    error,
    count,
    selectedId,
    hasPayments: count > 0,
  })
);
```

**Selector Rules:**
- Use `createFeatureSelector` for top-level feature state access
- Use `createSelector` for all derived data (automatic memoization)
- Compose selectors from other selectors for reusability
- Avoid complex logic in components; move it to selectors
- Create ViewModel selectors that combine multiple slices for components
- Selectors are automatically memoized (only recompute when inputs change)
- Parameterized selectors should return selector functions (for factory pattern)

#### 6. Effects Pattern

**Pattern: Effects for Side Effects and API Integration**

```typescript
// libs/payments/feature/src/lib/+state/payments.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import {
  map,
  catchError,
  switchMap,
  exhaustMap,
  concatMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { Router } from '@angular/router';
import { NotificationService } from '@backbase/ui-ang/notification';
import * as PaymentsActions from './payments.actions';
import { PaymentsService } from '../services/payments.service';
import { selectPaymentsFilter } from './payments.selectors';

@Injectable()
export class PaymentsEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private paymentsService = inject(PaymentsService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  // ============================================================================
  // Load Payments Effect
  // ============================================================================
  loadPayments$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentsActions.loadPayments),
      // Get current filter from store
      withLatestFrom(this.store.select(selectPaymentsFilter)),
      // switchMap cancels previous request if new action is dispatched
      switchMap(([action, currentFilter]) => {
        const filter = action.filter ?? currentFilter;
        return this.paymentsService.getPayments(filter).pipe(
          map((payments) =>
            PaymentsActions.loadPaymentsSuccess({ payments })
          ),
          catchError((error) =>
            of(
              PaymentsActions.loadPaymentsFailure({
                error: error.message ?? 'Failed to load payments',
              })
            )
          )
        );
      })
    )
  );

  // ============================================================================
  // Create Payment Effect
  // ============================================================================
  createPayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentsActions.createPayment),
      // exhaustMap ignores new actions while current request is in flight
      exhaustMap(({ payment }) =>
        this.paymentsService.createPayment(payment).pipe(
          map((createdPayment) =>
            PaymentsActions.createPaymentSuccess({ payment: createdPayment })
          ),
          catchError((error) =>
            of(
              PaymentsActions.createPaymentFailure({
                error: error.message ?? 'Failed to create payment',
              })
            )
          )
        )
      )
    )
  );

  // ============================================================================
  // Update Payment Effect
  // ============================================================================
  updatePayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentsActions.updatePayment),
      // concatMap processes requests in order (important for updates)
      concatMap(({ id, changes }) =>
        this.paymentsService.updatePayment(id, changes).pipe(
          map((updatedPayment) =>
            PaymentsActions.updatePaymentSuccess({ payment: updatedPayment })
          ),
          catchError((error) =>
            of(
              PaymentsActions.updatePaymentFailure({
                error: error.message ?? 'Failed to update payment',
              })
            )
          )
        )
      )
    )
  );

  // ============================================================================
  // Delete Payment Effect
  // ============================================================================
  deletePayment$ = createEffect(() =>
    this.actions$.pipe(
      ofType(PaymentsActions.deletePayment),
      exhaustMap(({ id }) =>
        this.paymentsService.deletePayment(id).pipe(
          map(() => PaymentsActions.deletePaymentSuccess({ id })),
          catchError((error) =>
            of(
              PaymentsActions.deletePaymentFailure({
                error: error.message ?? 'Failed to delete payment',
              })
            )
          )
        )
      )
    )
  );

  // ============================================================================
  // Success Notification Effects (no dispatch)
  // ============================================================================
  createPaymentSuccess$ = createEffect(
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
    { dispatch: false } // Non-dispatching effect
  );

  updatePaymentSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PaymentsActions.updatePaymentSuccess),
        tap(() => {
          this.notificationService.showNotification({
            message: 'Payment updated successfully',
            type: 'success',
          });
        })
      ),
    { dispatch: false }
  );

  deletePaymentSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PaymentsActions.deletePaymentSuccess),
        tap(() => {
          this.notificationService.showNotification({
            message: 'Payment deleted successfully',
            type: 'success',
          });
          // Navigate away after deletion
          this.router.navigate(['/payments']);
        })
      ),
    { dispatch: false }
  );

  // ============================================================================
  // Error Notification Effect (no dispatch)
  // ============================================================================
  paymentFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          PaymentsActions.loadPaymentsFailure,
          PaymentsActions.createPaymentFailure,
          PaymentsActions.updatePaymentFailure,
          PaymentsActions.deletePaymentFailure
        ),
        tap(({ error }) => {
          this.notificationService.showNotification({
            message: error,
            type: 'error',
          });
        })
      ),
    { dispatch: false }
  );

  // ============================================================================
  // Navigation Effect
  // ============================================================================
  navigateToPaymentDetail$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(PaymentsActions.createPaymentSuccess),
        tap(({ payment }) => {
          this.router.navigate(['/payments', payment.id]);
        })
      ),
    { dispatch: false }
  );
}
```

**Effects Rules:**
- Use `switchMap` for requests that should cancel previous (search, filters)
- Use `exhaustMap` for requests that should ignore new actions while pending (create, delete)
- Use `concatMap` for requests that must be processed in order (updates)
- Use `mergeMap` only when order doesn't matter and parallel execution is desired
- Always handle errors with `catchError` and return a failure action
- Use `{ dispatch: false }` for effects that don't dispatch actions (navigation, notifications)
- Use `withLatestFrom` to combine action with current state
- Use `tap` for side effects that don't produce actions
- Inject dependencies using Angular's `inject()` function (modern pattern)

#### 7. Entity Management with @ngrx/entity

**Pattern: Entity Adapter for Collections**

```typescript
// libs/users/feature/src/lib/+state/users.models.ts
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'admin' | 'user' | 'viewer';
  active: boolean;
  lastLogin: string;
}

// EntityState provides: ids[], entities{}, and selectedId (optional)
export interface UsersState extends EntityState<User> {
  loading: boolean;
  error: string | null;
  filter: string;
}

// Create entity adapter with custom sort and ID selector
export const usersAdapter: EntityAdapter<User> = createEntityAdapter<User>({
  selectId: (user) => user.id,
  sortComparer: (a, b) => a.lastName.localeCompare(b.lastName),
});

// Get initial state with additional properties
export const initialState: UsersState = usersAdapter.getInitialState({
  loading: false,
  error: null,
  filter: '',
});
```

```typescript
// libs/users/feature/src/lib/+state/users.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as UsersActions from './users.actions';
import { usersAdapter, initialState } from './users.models';

export const usersReducer = createReducer(
  initialState,
  
  // Load All Users
  on(UsersActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(UsersActions.loadUsersSuccess, (state, { users }) =>
    usersAdapter.setAll(users, {
      ...state,
      loading: false,
      error: null,
    })
  ),
  
  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Add One User
  on(UsersActions.addUserSuccess, (state, { user }) =>
    usersAdapter.addOne(user, {
      ...state,
      loading: false,
    })
  ),
  
  // Update One User
  on(UsersActions.updateUserSuccess, (state, { user }) =>
    usersAdapter.updateOne(
      { id: user.id, changes: user },
      {
        ...state,
        loading: false,
      }
    )
  ),
  
  // Delete One User
  on(UsersActions.deleteUserSuccess, (state, { id }) =>
    usersAdapter.removeOne(id, {
      ...state,
      loading: false,
    })
  ),
  
  // Add Many Users
  on(UsersActions.addManyUsersSuccess, (state, { users }) =>
    usersAdapter.addMany(users, state)
  ),
  
  // Update Many Users
  on(UsersActions.updateManyUsersSuccess, (state, { users }) =>
    usersAdapter.updateMany(
      users.map((user) => ({ id: user.id, changes: user })),
      state
    )
  ),
  
  // Delete Many Users
  on(UsersActions.deleteManyUsersSuccess, (state, { ids }) =>
    usersAdapter.removeMany(ids, state)
  ),
  
  // Upsert (add or update)
  on(UsersActions.upsertUserSuccess, (state, { user }) =>
    usersAdapter.upsertOne(user, state)
  ),
  
  // Set Filter
  on(UsersActions.setUsersFilter, (state, { filter }) => ({
    ...state,
    filter,
  }))
);
```

```typescript
// libs/users/feature/src/lib/+state/users.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { usersAdapter, UsersState } from './users.models';

export const selectUsersState = createFeatureSelector<UsersState>('users');

// Get entity selectors from adapter
const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = usersAdapter.getSelectors();

// Feature-specific entity selectors
export const selectUserIds = createSelector(selectUsersState, selectIds);
export const selectUserEntities = createSelector(selectUsersState, selectEntities);
export const selectAllUsers = createSelector(selectUsersState, selectAll);
export const selectUsersTotal = createSelector(selectUsersState, selectTotal);

// Additional state selectors
export const selectUsersLoading = createSelector(
  selectUsersState,
  (state) => state.loading
);

export const selectUsersError = createSelector(
  selectUsersState,
  (state) => state.error
);

export const selectUsersFilter = createSelector(
  selectUsersState,
  (state) => state.filter
);

// Derived selectors
export const selectFilteredUsers = createSelector(
  selectAllUsers,
  selectUsersFilter,
  (users, filter) => {
    if (!filter) return users;
    const lowerFilter = filter.toLowerCase();
    return users.filter(
      (user) =>
        user.firstName.toLowerCase().includes(lowerFilter) ||
        user.lastName.toLowerCase().includes(lowerFilter) ||
        user.email.toLowerCase().includes(lowerFilter)
    );
  }
);

export const selectActiveUsers = createSelector(
  selectAllUsers,
  (users) => users.filter((user) => user.active)
);

export const selectUserById = (id: string) =>
  createSelector(selectUserEntities, (entities) => entities[id] ?? null);
```

**Entity Adapter Benefits:**
- Normalized state structure (entities stored as dictionary by ID)
- Built-in CRUD operations (`addOne`, `updateOne`, `removeOne`, etc.)
- Automatic sorting and ID selection
- Optimized performance for large collections
- Standard selectors (`selectAll`, `selectEntities`, `selectIds`, `selectTotal`)

**Entity Adapter Methods:**
- `addOne` / `addMany` - Add entities
- `setOne` / `setAll` - Set/overwrite entities
- `removeOne` / `removeMany` - Remove entities
- `updateOne` / `updateMany` - Update entities
- `upsertOne` / `upsertMany` - Add or update entities
- `map` - Transform all entities

#### 8. Component Integration

**Pattern: Smart (Container) Component**

```typescript
// libs/payments/feature/src/lib/containers/payments-list/payments-list.component.ts
import { Component, OnInit, ChangeDetectionStrategy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import * as PaymentsActions from '../../+state/payments.actions';
import * as PaymentsSelectors from '../../+state/payments.selectors';
import { Payment, PaymentsState } from '../../+state/payments.models';

@Component({
  selector: 'app-payments-list',
  templateUrl: './payments-list.component.html',
  styleUrls: ['./payments-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Critical for performance
})
export class PaymentsListComponent implements OnInit {
  private store = inject(Store);

  // Use ViewModel selector for optimal performance
  vm$ = this.store.select(PaymentsSelectors.selectPaymentsViewModel);
  
  // Or select individual slices
  payments$ = this.store.select(PaymentsSelectors.selectFilteredPayments);
  loading$ = this.store.select(PaymentsSelectors.selectPaymentsLoading);
  error$ = this.store.select(PaymentsSelectors.selectPaymentsError);
  filter$ = this.store.select(PaymentsSelectors.selectPaymentsFilter);

  ngOnInit(): void {
    // Dispatch action to load data
    this.store.dispatch(PaymentsActions.loadPayments({}));
  }

  onSelectPayment(id: string): void {
    this.store.dispatch(PaymentsActions.selectPayment({ id }));
  }

  onCreatePayment(payment: Omit<Payment, 'id' | 'status' | 'createdDate'>): void {
    this.store.dispatch(PaymentsActions.createPayment({ payment }));
  }

  onUpdatePayment(id: string, changes: Partial<Payment>): void {
    this.store.dispatch(PaymentsActions.updatePayment({ id, changes }));
  }

  onDeletePayment(id: string): void {
    this.store.dispatch(PaymentsActions.deletePayment({ id }));
  }

  onFilterChange(filter: Partial<PaymentsState['filter']>): void {
    this.store.dispatch(PaymentsActions.setPaymentsFilter({ filter }));
  }

  onClearError(): void {
    this.store.dispatch(PaymentsActions.clearPaymentsError());
  }
}
```

**Pattern: Smart Component Template (using async pipe)**

```html
<!-- libs/payments/feature/src/lib/containers/payments-list/payments-list.component.html -->

<!-- Using ViewModel approach -->
<ng-container *ngIf="vm$ | async as vm">
  <div class="payments-container">
    <app-payments-filter
      [filter]="vm.filter"
      (filterChange)="onFilterChange($event)"
    ></app-payments-filter>

    <app-loading-spinner *ngIf="vm.loading"></app-loading-spinner>

    <app-error-alert
      *ngIf="vm.error"
      [message]="vm.error"
      (dismiss)="onClearError()"
    ></app-error-alert>

    <app-payments-table
      *ngIf="!vm.loading && vm.hasPayments"
      [payments]="vm.payments"
      [selectedId]="vm.selectedId"
      (select)="onSelectPayment($event)"
      (update)="onUpdatePayment($event.id, $event.changes)"
      (delete)="onDeletePayment($event)"
    ></app-payments-table>

    <app-empty-state
      *ngIf="!vm.loading && !vm.hasPayments"
      message="No payments found"
    ></app-empty-state>
  </div>
</ng-container>

<!-- Alternative: Using individual observables -->
<div class="payments-container">
  <app-loading-spinner *ngIf="loading$ | async"></app-loading-spinner>

  <app-error-alert
    *ngIf="error$ | async as error"
    [message]="error"
    (dismiss)="onClearError()"
  ></app-error-alert>

  <app-payments-table
    [payments]="payments$ | async"
    (select)="onSelectPayment($event)"
  ></app-payments-table>
</div>
```

**Pattern: Dumb (Presentational) Component**

```typescript
// libs/payments/feature/src/lib/components/payments-table/payments-table.component.ts
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Payment } from '../../+state/payments.models';

@Component({
  selector: 'app-payments-table',
  templateUrl: './payments-table.component.html',
  styleUrls: ['./payments-table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush, // Critical for performance
})
export class PaymentsTableComponent {
  @Input() payments: Payment[] | null = [];
  @Input() selectedId: string | null = null;

  @Output() select = new EventEmitter<string>();
  @Output() update = new EventEmitter<{ id: string; changes: Partial<Payment> }>();
  @Output() delete = new EventEmitter<string>();

  onRowClick(payment: Payment): void {
    this.select.emit(payment.id);
  }

  onUpdateClick(payment: Payment, changes: Partial<Payment>): void {
    this.update.emit({ id: payment.id, changes });
  }

  onDeleteClick(payment: Payment): void {
    this.delete.emit(payment.id);
  }

  trackByPaymentId(index: number, payment: Payment): string {
    return payment.id;
  }
}
```

**Component Integration Rules:**
- **Smart (Container) Components**: Interact with store, dispatch actions, select state
- **Dumb (Presentational) Components**: Only `@Input` and `@Output`, no store dependency
- Always use `ChangeDetectionStrategy.OnPush` for performance
- Use `async` pipe in templates for automatic subscription management
- Prefer ViewModel selectors to reduce template subscriptions
- Use `trackBy` functions in `*ngFor` for performance
- Never subscribe in components; use `async` pipe instead (except in special cases)

#### 9. Testing Patterns

**Pattern: Testing Reducers**

```typescript
// libs/payments/feature/src/lib/+state/payments.reducer.spec.ts
import { paymentsReducer } from './payments.reducer';
import { initialState } from './payments.models';
import * as PaymentsActions from './payments.actions';
import { Payment } from './payments.models';

describe('PaymentsReducer', () => {
  describe('unknown action', () => {
    it('should return the initial state', () => {
      const action = { type: 'Unknown' } as any;
      const result = paymentsReducer(initialState, action);

      expect(result).toBe(initialState);
    });
  });

  describe('loadPayments', () => {
    it('should set loading to true and clear error', () => {
      const action = PaymentsActions.loadPayments({});
      const result = paymentsReducer(initialState, action);

      expect(result.loading).toBe(true);
      expect(result.error).toBeNull();
    });
  });

  describe('loadPaymentsSuccess', () => {
    it('should populate payments and set loading to false', () => {
      const payments: Payment[] = [
        { id: '1', amount: 100, currency: 'USD', recipientName: 'John', status: 'pending', createdDate: '2025-01-01' },
        { id: '2', amount: 200, currency: 'EUR', recipientName: 'Jane', status: 'completed', createdDate: '2025-01-02' },
      ];
      const action = PaymentsActions.loadPaymentsSuccess({ payments });
      const result = paymentsReducer(initialState, action);

      expect(result.payments).toEqual(payments);
      expect(result.loading).toBe(false);
      expect(result.error).toBeNull();
    });
  });

  describe('loadPaymentsFailure', () => {
    it('should set error and set loading to false', () => {
      const error = 'Failed to load payments';
      const action = PaymentsActions.loadPaymentsFailure({ error });
      const result = paymentsReducer(initialState, action);

      expect(result.error).toBe(error);
      expect(result.loading).toBe(false);
    });
  });

  describe('createPaymentSuccess', () => {
    it('should add new payment to the list', () => {
      const newPayment: Payment = {
        id: '3',
        amount: 300,
        currency: 'GBP',
        recipientName: 'Bob',
        status: 'draft',
        createdDate: '2025-01-03',
      };
      const action = PaymentsActions.createPaymentSuccess({ payment: newPayment });
      const result = paymentsReducer(initialState, action);

      expect(result.payments.length).toBe(1);
      expect(result.payments[0]).toEqual(newPayment);
      expect(result.selectedPaymentId).toBe(newPayment.id);
    });
  });

  describe('updatePaymentSuccess', () => {
    it('should update existing payment', () => {
      const existingPayment: Payment = {
        id: '1',
        amount: 100,
        currency: 'USD',
        recipientName: 'John',
        status: 'pending',
        createdDate: '2025-01-01',
      };
      const stateWithPayment = {
        ...initialState,
        payments: [existingPayment],
      };
      
      const updatedPayment: Payment = {
        ...existingPayment,
        status: 'approved',
      };
      const action = PaymentsActions.updatePaymentSuccess({ payment: updatedPayment });
      const result = paymentsReducer(stateWithPayment, action);

      expect(result.payments[0].status).toBe('approved');
      expect(result.payments.length).toBe(1);
    });
  });

  describe('deletePaymentSuccess', () => {
    it('should remove payment from list', () => {
      const payment: Payment = {
        id: '1',
        amount: 100,
        currency: 'USD',
        recipientName: 'John',
        status: 'pending',
        createdDate: '2025-01-01',
      };
      const stateWithPayment = {
        ...initialState,
        payments: [payment],
        selectedPaymentId: '1',
      };
      
      const action = PaymentsActions.deletePaymentSuccess({ id: '1' });
      const result = paymentsReducer(stateWithPayment, action);

      expect(result.payments.length).toBe(0);
      expect(result.selectedPaymentId).toBeNull();
    });
  });
});
```

**Pattern: Testing Selectors**

```typescript
// libs/payments/feature/src/lib/+state/payments.selectors.spec.ts
import * as PaymentsSelectors from './payments.selectors';
import { PaymentsState, Payment } from './payments.models';

describe('Payments Selectors', () => {
  const mockPayments: Payment[] = [
    { id: '1', amount: 100, currency: 'USD', recipientName: 'John', status: 'pending', createdDate: '2025-01-01' },
    { id: '2', amount: 200, currency: 'EUR', recipientName: 'Jane', status: 'completed', createdDate: '2025-01-02' },
    { id: '3', amount: 300, currency: 'GBP', recipientName: 'Bob', status: 'draft', createdDate: '2025-01-03' },
  ];

  const mockState: PaymentsState = {
    payments: mockPayments,
    selectedPaymentId: '1',
    loading: false,
    error: null,
    filter: {
      status: 'all',
      dateRange: null,
    },
  };

  describe('selectAllPayments', () => {
    it('should select all payments', () => {
      const result = PaymentsSelectors.selectAllPayments.projector(mockState);
      expect(result).toEqual(mockPayments);
    });
  });

  describe('selectSelectedPayment', () => {
    it('should select the payment with the selected ID', () => {
      const result = PaymentsSelectors.selectSelectedPayment.projector(
        mockPayments,
        '1'
      );
      expect(result).toEqual(mockPayments[0]);
    });

    it('should return null if no payment is selected', () => {
      const result = PaymentsSelectors.selectSelectedPayment.projector(
        mockPayments,
        null
      );
      expect(result).toBeNull();
    });
  });

  describe('selectFilteredPayments', () => {
    it('should return all payments when filter status is "all"', () => {
      const filter = { status: 'all' as const, dateRange: null };
      const result = PaymentsSelectors.selectFilteredPayments.projector(
        mockPayments,
        filter
      );
      expect(result).toEqual(mockPayments);
    });

    it('should filter payments by status', () => {
      const filter = { status: 'pending' as const, dateRange: null };
      const result = PaymentsSelectors.selectFilteredPayments.projector(
        mockPayments,
        filter
      );
      expect(result.length).toBe(1);
      expect(result[0].status).toBe('pending');
    });
  });

  describe('selectPaymentsCount', () => {
    it('should return the count of filtered payments', () => {
      const result = PaymentsSelectors.selectPaymentsCount.projector(mockPayments);
      expect(result).toBe(3);
    });
  });

  describe('selectTotalPaymentAmount', () => {
    it('should calculate total payment amount', () => {
      const result = PaymentsSelectors.selectTotalPaymentAmount.projector(mockPayments);
      expect(result).toBe(600); // 100 + 200 + 300
    });
  });

  describe('selectPaymentStatusCounts', () => {
    it('should count payments by status', () => {
      const result = PaymentsSelectors.selectPaymentStatusCounts.projector(mockPayments);
      expect(result).toEqual({
        draft: 1,
        pending: 1,
        approved: 0,
        rejected: 0,
        completed: 1,
      });
    });
  });
});
```

**Pattern: Testing Effects**

```typescript
// libs/payments/feature/src/lib/+state/payments.effects.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { Observable, of, throwError } from 'rxjs';
import { PaymentsEffects } from './payments.effects';
import { PaymentsService } from '../services/payments.service';
import * as PaymentsActions from './payments.actions';
import { Payment } from './payments.models';
import { Router } from '@angular/router';
import { NotificationService } from '@backbase/ui-ang/notification';

describe('PaymentsEffects', () => {
  let actions$ = new Observable<Action>();
  let effects: PaymentsEffects;
  let paymentsService: jasmine.SpyObj<PaymentsService>;
  let router: jasmine.SpyObj<Router>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let store: MockStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PaymentsEffects,
        provideMockActions(() => actions$),
        provideMockStore({
          initialState: {
            payments: {
              filter: { status: 'all', dateRange: null },
            },
          },
        }),
        {
          provide: PaymentsService,
          useValue: jasmine.createSpyObj('PaymentsService', [
            'getPayments',
            'createPayment',
            'updatePayment',
            'deletePayment',
          ]),
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj('Router', ['navigate']),
        },
        {
          provide: NotificationService,
          useValue: jasmine.createSpyObj('NotificationService', ['showNotification']),
        },
      ],
    });

    effects = TestBed.inject(PaymentsEffects);
    paymentsService = TestBed.inject(PaymentsService) as jasmine.SpyObj<PaymentsService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    store = TestBed.inject(MockStore);
  });

  describe('loadPayments$', () => {
    it('should dispatch loadPaymentsSuccess on successful API call', (done) => {
      const mockPayments: Payment[] = [
        { id: '1', amount: 100, currency: 'USD', recipientName: 'John', status: 'pending', createdDate: '2025-01-01' },
      ];
      paymentsService.getPayments.and.returnValue(of(mockPayments));

      actions$ = of(PaymentsActions.loadPayments({}));

      effects.loadPayments$.subscribe((action) => {
        expect(action).toEqual(PaymentsActions.loadPaymentsSuccess({ payments: mockPayments }));
        expect(paymentsService.getPayments).toHaveBeenCalled();
        done();
      });
    });

    it('should dispatch loadPaymentsFailure on API error', (done) => {
      const error = new Error('API Error');
      paymentsService.getPayments.and.returnValue(throwError(() => error));

      actions$ = of(PaymentsActions.loadPayments({}));

      effects.loadPayments$.subscribe((action) => {
        expect(action).toEqual(
          PaymentsActions.loadPaymentsFailure({ error: 'API Error' })
        );
        done();
      });
    });
  });

  describe('createPayment$', () => {
    it('should dispatch createPaymentSuccess on successful creation', (done) => {
      const newPayment: Payment = {
        id: '1',
        amount: 100,
        currency: 'USD',
        recipientName: 'John',
        status: 'draft',
        createdDate: '2025-01-01',
      };
      paymentsService.createPayment.and.returnValue(of(newPayment));

      actions$ = of(
        PaymentsActions.createPayment({
          payment: { amount: 100, currency: 'USD', recipientName: 'John' },
        })
      );

      effects.createPayment$.subscribe((action) => {
        expect(action).toEqual(PaymentsActions.createPaymentSuccess({ payment: newPayment }));
        expect(paymentsService.createPayment).toHaveBeenCalled();
        done();
      });
    });
  });

  describe('createPaymentSuccess$', () => {
    it('should show success notification', (done) => {
      actions$ = of(
        PaymentsActions.createPaymentSuccess({
          payment: {
            id: '1',
            amount: 100,
            currency: 'USD',
            recipientName: 'John',
            status: 'draft',
            createdDate: '2025-01-01',
          },
        })
      );

      effects.createPaymentSuccess$.subscribe(() => {
        expect(notificationService.showNotification).toHaveBeenCalledWith({
          message: 'Payment created successfully',
          type: 'success',
        });
        done();
      });
    });
  });

  describe('paymentFailure$', () => {
    it('should show error notification', (done) => {
      const error = 'Failed to load payments';
      actions$ = of(PaymentsActions.loadPaymentsFailure({ error }));

      effects.paymentFailure$.subscribe(() => {
        expect(notificationService.showNotification).toHaveBeenCalledWith({
          message: error,
          type: 'error',
        });
        done();
      });
    });
  });
});
```

**Pattern: Testing Components with Store**

```typescript
// libs/payments/feature/src/lib/containers/payments-list/payments-list.component.spec.ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { PaymentsListComponent } from './payments-list.component';
import * as PaymentsActions from '../../+state/payments.actions';
import * as PaymentsSelectors from '../../+state/payments.selectors';
import { Payment } from '../../+state/payments.models';

describe('PaymentsListComponent', () => {
  let component: PaymentsListComponent;
  let fixture: ComponentFixture<PaymentsListComponent>;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;

  const mockPayments: Payment[] = [
    { id: '1', amount: 100, currency: 'USD', recipientName: 'John', status: 'pending', createdDate: '2025-01-01' },
  ];

  const initialState = {
    payments: {
      payments: mockPayments,
      selectedPaymentId: null,
      loading: false,
      error: null,
      filter: { status: 'all', dateRange: null },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentsListComponent],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch');

    fixture = TestBed.createComponent(PaymentsListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadPayments on init', () => {
    component.ngOnInit();

    expect(dispatchSpy).toHaveBeenCalledWith(PaymentsActions.loadPayments({}));
  });

  it('should dispatch selectPayment when payment is selected', () => {
    const paymentId = '1';
    component.onSelectPayment(paymentId);

    expect(dispatchSpy).toHaveBeenCalledWith(
      PaymentsActions.selectPayment({ id: paymentId })
    );
  });

  it('should dispatch createPayment with correct payload', () => {
    const newPayment = {
      amount: 200,
      currency: 'EUR',
      recipientName: 'Jane',
    };
    component.onCreatePayment(newPayment);

    expect(dispatchSpy).toHaveBeenCalledWith(
      PaymentsActions.createPayment({ payment: newPayment })
    );
  });

  it('should select payments from store', (done) => {
    store.overrideSelector(PaymentsSelectors.selectFilteredPayments, mockPayments);
    store.refreshState();

    component.payments$.subscribe((payments) => {
      expect(payments).toEqual(mockPayments);
      done();
    });
  });
});
```

#### 10. Performance Optimization

**Pattern: OnPush Change Detection with Observables**

```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-feature',
  template: `
    <div *ngIf="data$ | async as data">
      {{ data.value }}
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush, // Only re-render when inputs change or async pipe emits
})
export class FeatureComponent {
  data$ = this.store.select(selectData);
}
```

**Pattern: Memoized Selectors for Expensive Computations**

```typescript
// Memoization prevents recalculation when inputs haven't changed
export const selectExpensiveComputation = createSelector(
  selectLargeDataset,
  (data) => {
    // This computation only runs when selectLargeDataset returns a new value
    return data.map((item) => complexTransformation(item));
  }
);
```

**Pattern: Entity Adapter for Large Collections**

```typescript
// Entity adapter provides O(1) lookup by ID instead of O(n)
export const selectUserById = (id: string) =>
  createSelector(selectUserEntities, (entities) => entities[id]);
```

**Pattern: Avoid Over-Selection**

```typescript
// ❌ Bad: Selecting entire state slice when only need loading
export class BadComponent {
  state$ = this.store.select(selectPaymentsState);
  // Template: {{ (state$ | async)?.loading }}
}

// ✅ Good: Select only what you need
export class GoodComponent {
  loading$ = this.store.select(selectPaymentsLoading);
  // Template: {{ loading$ | async }}
}
```

### Standards compliance

- [x] NgRx v20+ architecture patterns followed (signals, standalone, modern APIs)
- [x] Angular best practices applied (OnPush, async pipe, reactive programming)
- [x] TypeScript strict mode compliance
- [x] RxJS best practices (proper operator usage, error handling)
- [x] Backbase platform integration patterns
- [x] Testing requirements met (unit tests for all state logic)
- [x] Performance optimization patterns implemented
- [x] Immutability enforced with runtime checks

### Quality attributes addressed

| Quality Attribute | Requirement | How Decision Addresses It |
|-------------------|-------------|---------------------------|
| Performance | < 16ms state updates for 60fps | Memoized selectors, OnPush change detection, entity adapters |
| Maintainability | Clear separation of concerns | Actions, reducers, selectors, effects in separate files |
| Testability | > 80% code coverage | Pure functions, isolated units, comprehensive test patterns |
| Debuggability | Time-travel debugging | NgRx DevTools with action history and state snapshots |
| Scalability | Support 100+ feature slices | Lazy-loaded feature state with isolation |
| Type Safety | Compile-time type checking | TypeScript strict mode with typed actions and state |
| Predictability | Deterministic state changes | Unidirectional data flow, immutable updates |
| Developer Experience | Consistent patterns across features | Standardized folder structure and naming conventions |

## Code Review Checklist

### ✅ Store Configuration
- [ ] `StoreModule.forRoot()` imported **only once** in application root
- [ ] `EffectsModule.forRoot([])` imported in application root
- [ ] Runtime checks enabled in development (immutability, serializability)
- [ ] DevTools imported only in non-production environments
- [ ] `StoreRouterConnectingModule` configured if routing state needed
- [ ] Feature modules use `StoreModule.forFeature()` not `forRoot()`

### ✅ Feature State Structure
- [ ] Feature state follows folder structure: `+state/` directory
- [ ] State interface properly defined with clear property types
- [ ] Initial state defined and exported
- [ ] State is normalized (flat, not deeply nested)
- [ ] Feature registered with `StoreModule.forFeature(featureName, reducer)`

### ✅ Actions
- [ ] Actions use `createAction` with type-safe `props`
- [ ] Action names follow `[Source] Event` pattern
- [ ] Source attribution is clear and descriptive (component, API, guard, etc.)
- [ ] Events use past tense for results, present tense for commands
- [ ] Success/Failure actions defined for async operations
- [ ] Actions are grouped logically with comments
- [ ] No action groups (individual exports for better tree-shaking)
- [ ] Action types are unique across the application

### ✅ Reducers
- [ ] Reducers created with `createReducer` and `on` handlers
- [ ] Reducers are pure functions (no side effects)
- [ ] State updates are immutable (spread operator, array methods)
- [ ] No direct mutation of state or nested objects
- [ ] Loading/error states updated appropriately
- [ ] Reducer logic is simple (no complex computations)
- [ ] All actions handled that modify this state slice
- [ ] Default case returns existing state (handled by createReducer)

### ✅ Selectors
- [ ] Feature selector created with `createFeatureSelector`
- [ ] Selectors use `createSelector` for automatic memoization
- [ ] Selectors composed from other selectors for reusability
- [ ] Complex logic moved from components to selectors
- [ ] ViewModel selectors created for components (combine multiple slices)
- [ ] Parameterized selectors return selector functions (factory pattern)
- [ ] Selectors test each projection function independently

### ✅ Effects
- [ ] Effects created with `createEffect`
- [ ] Proper flattening operator used (`switchMap`, `exhaustMap`, `concatMap`, `mergeMap`)
- [ ] All HTTP calls handled with `catchError` returning failure action
- [ ] Non-dispatching effects use `{ dispatch: false }`
- [ ] Effects inject dependencies using modern `inject()` function
- [ ] Complex effect chains broken down logically
- [ ] `withLatestFrom` used to combine with current state
- [ ] Notifications/routing handled in non-dispatching effects

### ✅ Entity Management
- [ ] `@ngrx/entity` adapter used for collections
- [ ] Entity adapter configured with `selectId` and optional `sortComparer`
- [ ] Entity state extends `EntityState<T>`
- [ ] Reducer uses adapter methods (`addOne`, `updateOne`, `removeOne`, etc.)
- [ ] Selectors use adapter's `getSelectors()` method
- [ ] Entity normalization properly implemented (dictionary by ID)

### ✅ Component Integration
- [ ] Smart (container) components interact with store
- [ ] Dumb (presentational) components use only `@Input`/`@Output`
- [ ] `ChangeDetectionStrategy.OnPush` applied to all components
- [ ] `async` pipe used in templates for automatic subscription management
- [ ] No manual subscriptions in components (except special cases with `ngOnDestroy`)
- [ ] Actions dispatched with proper payloads
- [ ] ViewModel selectors used to reduce template subscriptions
- [ ] `trackBy` functions used in `*ngFor` for performance

### ✅ Testing
- [ ] Reducers have unit tests for all actions
- [ ] Selectors have unit tests using `.projector()` method
- [ ] Effects tested with `provideMockActions` and `provideMockStore`
- [ ] Components tested with `MockStore` and `overrideSelector`
- [ ] Test coverage > 80% for state management code
- [ ] Edge cases tested (empty state, error states, loading states)
- [ ] Async operations properly tested with marble testing or `done` callback

### ✅ Performance
- [ ] OnPush change detection used with observables
- [ ] Memoized selectors used for derived data
- [ ] Entity adapters used for large collections
- [ ] No over-selection (select only what's needed)
- [ ] No redundant selectors or duplicate logic
- [ ] Performance profiled for large datasets
- [ ] Memory leaks checked (subscriptions properly cleaned up)

### ✅ Error Handling
- [ ] All effects have proper error handling with `catchError`
- [ ] Error actions defined and dispatched on failures
- [ ] Error state stored in feature state
- [ ] User-friendly error messages provided
- [ ] Errors logged for debugging/monitoring
- [ ] Error states cleared on new operations

### ✅ Naming Conventions
- [ ] Feature state folder named `+state/`
- [ ] Files follow pattern: `feature-name.actions.ts`, `feature-name.reducer.ts`, etc.
- [ ] Action names are descriptive and follow `[Source] Event` pattern
- [ ] Selector names start with `select` (e.g., `selectPayments`)
- [ ] Effect names end with `$` convention (e.g., `loadPayments$`)
- [ ] State interfaces suffixed with `State` (e.g., `PaymentsState`)

### ✅ Code Organization
- [ ] State logic organized in `+state/` directory
- [ ] Related actions grouped together with comments
- [ ] Barrel exports provided for feature state (index.ts)
- [ ] Feature state isolated from other features
- [ ] Shared state patterns documented and reusable
- [ ] Folder structure consistent across features

### ✅ Documentation
- [ ] Complex state logic documented with comments
- [ ] Action purposes documented (why they exist)
- [ ] State shape documented (what each property represents)
- [ ] Effects side effects documented
- [ ] Migration guides provided for major changes

### ✅ Immutability
- [ ] All state updates create new objects
- [ ] Spread operators used correctly (shallow copy)
- [ ] Array methods return new arrays (map, filter, concat)
- [ ] No `push`, `pop`, `splice`, `sort` on state arrays
- [ ] No direct property assignment (`state.prop = value`)
- [ ] Runtime immutability checks enabled in development

### ✅ Type Safety
- [ ] All actions properly typed with `props<T>()`
- [ ] State interfaces complete and accurate
- [ ] Selector return types inferred correctly
- [ ] No `any` types used (except necessary cases)
- [ ] Strict TypeScript mode enabled
- [ ] Type guards used where appropriate

### ✅ DevTools Integration
- [ ] DevTools installed and configured in development
- [ ] Action monitoring works correctly
- [ ] State inspection available
- [ ] Time-travel debugging functional
- [ ] DevTools disabled in production builds

### ✅ Integration with Backbase Platform
- [ ] State integrates with Backbase services
- [ ] Entitlements checked before state modifications (where applicable)
- [ ] User context considered in state management
- [ ] Remote config integrated with state (if needed)
- [ ] Backbase notifications triggered from effects

### ✅ Security
- [ ] Sensitive data not logged to console
- [ ] DevTools disabled in production
- [ ] State serialization does not expose secrets
- [ ] Access control enforced before state changes
- [ ] Audit logging for sensitive operations

### ✅ Accessibility
- [ ] Loading states announced to screen readers
- [ ] Error states accessible to assistive technology
- [ ] Focus management handled for state-driven UI changes

## References

### Authoritative sources
- [NgRx Official Documentation v20](https://ngrx.io/docs) - Official NgRx framework documentation
- [Angular Official Documentation](https://angular.dev/) - Angular framework best practices
- [RxJS Official Documentation](https://rxjs.dev/) - Reactive programming patterns
- [Redux Pattern Documentation](https://redux.js.org/) - Original Redux pattern (inspiration for NgRx)
- [Backbase Foundation Angular](https://www.npmjs.com/package/@backbase/foundation-ang) - Platform integration

### Technical references
- [NgRx Best Practices by Todd Motto](https://ultimatecourses.com/blog/ngrx-store-understanding-state-selectors) - Industry expert guidance
- [NgRx Entity Documentation](https://ngrx.io/guide/entity) - Entity management patterns
- [NgRx Effects Documentation](https://ngrx.io/guide/effects) - Side effects handling
- [Angular Performance Guide](https://angular.dev/best-practices/runtime-performance) - Performance optimization
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html) - Type safety best practices
- [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools) - Debugging tools

### Related decisions and concerns
- [NgRx v20 Migration Guide](https://ngrx.io/guide/migration/v20) - Upgrade path from older versions
- [Angular Signals and NgRx](https://ngrx.io/guide/signals) - Future integration with Angular Signals
- [Component Store vs Global Store](https://ngrx.io/guide/component-store) - When to use local vs global state
- [NgRx Router Store](https://ngrx.io/guide/router-store) - Router state integration

### Standards compliance
- ISO/IEC/IEEE 42010:2022 - Systems and software engineering — Architecture description
- Angular Style Guide - Official Angular coding standards
- Backbase Platform Standards - Internal technical standards
- SOLID Principles - Software design best practices
- Reactive Programming Principles - Observables and streams

### Stakeholder input
- Development teams consulted on implementation patterns and pain points
- Platform team validated NgRx version and integration approach
- QA team reviewed testing strategy and coverage requirements
- Performance team validated optimization patterns
- Architecture team reviewed overall design and alignment

### External factors
- Angular framework evolution (Signals, Standalone Components)
- NgRx version updates and new features
- RxJS version compatibility
- Browser support requirements
- Industry trends in state management (Zustand, Jotai for React as reference)
- Performance requirements for banking applications
