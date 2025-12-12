# ADR-000: Common Angular Patterns

## 1. Summary

<!-- LLM: Always load this section first -->

### TL;DR

> This ADR consolidates common Angular patterns referenced across multiple domain-specific ADRs. Use these patterns as the single source of truth for cross-cutting concerns: subscription management, change detection, type safety, and HTTP testing.

### Rules

**MUST DO ✅**

1. Use `takeUntil` pattern or `async` pipe for all Observable subscriptions
2. Apply `ChangeDetectionStrategy.OnPush` for all presentational components
3. Use explicit TypeScript types—never use `any` in public APIs
4. Use `Renderer2` for all programmatic DOM manipulations
5. Use `HttpClientTestingModule` (not `HttpClientModule`) in unit tests

**MUST NOT ❌**

1. Leave subscriptions without cleanup (causes memory leaks)
2. Use `ChangeDetectionStrategy.Default` for store-connected or presentational components
3. Use `any` type in interfaces, actions, selectors, or component APIs
4. Use `document.querySelector`, `getElementById`, or direct DOM access
5. Use real `HttpClientModule` in unit tests

---

## 2. Patterns

<!-- LLM: Load for code generation tasks -->

### Pattern Index

| Keywords | Pattern |
|----------|---------|
| subscribe, memory leak, takeUntil, destroy, cleanup | [Subscription Cleanup](#pattern-1-subscription-cleanup) |
| OnPush, change detection, performance, async | [Change Detection Strategy](#pattern-2-change-detection-strategy) |
| any, type safety, interface, strict | [Type Safety](#pattern-3-type-safety) |
| DOM, Renderer2, querySelector, nativeElement | [Safe DOM Manipulation](#pattern-4-safe-dom-manipulation) |
| HttpClient, mock, test, HttpTestingController | [HTTP Testing](#pattern-5-http-testing) |

---

### Pattern 1: Subscription Cleanup

**Use when:** Any component or service subscribes to Observables

**Don't use when:** Using `async` pipe in templates (handles cleanup automatically)

✅ **Good**

```typescript
// CONTEXT: Component subscribing to data streams
// RULE: Use takeUntil pattern with destroy$ subject

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-example',
  template: `<div>{{ data }}</div>`
})
export class ExampleComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  data: string;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.dataService.getData()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => this.data = data);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

```typescript
// ALTERNATIVE: Prefer async pipe when possible (best approach)
@Component({
  selector: 'app-better-example',
  template: `<div *ngFor="let item of data$ | async">{{ item.name }}</div>`
})
export class BetterExampleComponent {
  data$ = this.dataService.getData();
  constructor(private dataService: DataService) {}
}
```

❌ **Bad**

```typescript
// PROBLEM: No cleanup—memory leak, potential errors after component destroyed

ngOnInit(): void {
  this.dataService.getData().subscribe(data => this.data = data);
}
```

**Why it's wrong:** Subscription persists after component destruction, causing memory leaks and potential errors from callbacks on destroyed components.

**Verify:**
- [ ] Every `.subscribe()` has `takeUntil(this.destroy$)` or equivalent cleanup
- [ ] `destroy$` subject completed in `ngOnDestroy`
- [ ] Prefer `async` pipe where possible (eliminates manual cleanup)
- [ ] No nested subscriptions (use RxJS operators instead)

---

### Pattern 2: Change Detection Strategy

**Use when:** Creating presentational components, store-connected components, or any component receiving data via `@Input()`

**Don't use when:** Components that must react to mutable object changes (rare edge case)

✅ **Good**

```typescript
// CONTEXT: Presentational component with OnPush
// RULE: Use OnPush for all components that receive data via inputs or store

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: `
    <div class="card">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent {
  @Input() user: User;
}

// Store-connected component
@Component({
  selector: 'app-user-list',
  template: `
    <app-user-card 
      *ngFor="let user of users$ | async" 
      [user]="user">
    </app-user-card>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserListComponent {
  users$ = this.store.select(selectAllUsers);
  constructor(private store: Store) {}
}
```

❌ **Bad**

```typescript
// PROBLEM: Default change detection runs on every cycle—poor performance

@Component({
  selector: 'app-user-card',
  template: `...`
  // Missing changeDetection: ChangeDetectionStrategy.OnPush
})
export class UserCardComponent {
  @Input() user: User;
}
```

**Why it's wrong:** Default change detection checks component on every cycle, causing unnecessary re-renders and performance degradation, especially in lists.

**Verify:**
- [ ] All presentational (dumb) components use `OnPush`
- [ ] All store-connected components use `OnPush`
- [ ] Template uses `async` pipe for observables (triggers change detection correctly)
- [ ] Immutable data patterns used (spread operator, not mutation)

---

### Pattern 3: Type Safety

**Use when:** Defining interfaces, actions, selectors, component APIs, or any public contract

**Don't use when:** Never acceptable to use `any` in public APIs

✅ **Good**

```typescript
// CONTEXT: Strongly typed interfaces and APIs
// RULE: Explicit types everywhere—no 'any' in public contracts

// Interface with explicit types
export interface PaymentRequest {
  amount: number;
  currency: string;
  recipientId: string;
  scheduledDate?: Date;
}

// Component with typed inputs/outputs
@Component({ selector: 'app-payment-form' })
export class PaymentFormComponent {
  @Input() payment: PaymentRequest;
  @Output() submit = new EventEmitter<PaymentRequest>();
}

// Service with typed methods
@Injectable()
export class PaymentService {
  initiatePayment(request: PaymentRequest): Observable<PaymentResponse> {
    return this.http.post<PaymentResponse>('/api/payments', request);
  }
}

// NgRx action with typed props
export const loadPaymentsSuccess = createAction(
  '[Payments API] Load Success',
  props<{ payments: Payment[] }>()
);
```

❌ **Bad**

```typescript
// PROBLEM: 'any' types bypass TypeScript safety

@Input() payment: any;  // No type checking
@Output() submit = new EventEmitter();  // Emits 'any'

initiatePayment(request: any): Observable<any> {  // No contract
  return this.http.post('/api/payments', request);
}

export const loadPaymentsSuccess = createAction(
  '[Payments] Success',
  props<{ data: any }>()  // Loses type information
);
```

**Why it's wrong:** `any` defeats TypeScript's value—type errors not caught at compile time, no IDE autocomplete, refactoring becomes dangerous, API contracts undocumented.

**Verify:**
- [ ] No `any` in `@Input()` or `@Output()` declarations
- [ ] No `any` in service method signatures
- [ ] No `any` in NgRx actions, state interfaces, or selectors
- [ ] HttpClient calls use generic type: `http.get<T>()`

---

### Pattern 4: Safe DOM Manipulation

**Use when:** Programmatically modifying DOM elements (adding classes, setting styles, creating elements)

**Don't use when:** Achievable with Angular template bindings (`[class]`, `[style]`, `*ngIf`)

✅ **Good**

```typescript
// CONTEXT: Programmatic DOM manipulation
// RULE: Use Renderer2 for all DOM operations

import { Component, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-highlight',
  template: `<div #target>Content</div>`
})
export class HighlightComponent {
  constructor(
    private renderer: Renderer2,
    private el: ElementRef
  ) {}

  highlight(): void {
    this.renderer.addClass(this.el.nativeElement, 'highlighted');
    this.renderer.setStyle(this.el.nativeElement, 'background', '#ffeb3b');
  }

  removeHighlight(): void {
    this.renderer.removeClass(this.el.nativeElement, 'highlighted');
    this.renderer.removeStyle(this.el.nativeElement, 'background');
  }
}
```

❌ **Bad**

```typescript
// PROBLEM: Direct DOM access bypasses Angular, creates security risks

highlight(): void {
  document.querySelector('.target').classList.add('highlighted');
  this.el.nativeElement.style.background = '#ffeb3b';
}

// Even worse: innerHTML with user content
renderContent(userHtml: string): void {
  this.el.nativeElement.innerHTML = userHtml;  // XSS vulnerability!
}
```

**Why it's wrong:** Direct DOM access bypasses Angular's sanitization, doesn't work in SSR/web workers, makes code harder to test, and can introduce XSS vulnerabilities.

**Verify:**
- [ ] No `document.querySelector`, `getElementById`, or similar
- [ ] No direct `ElementRef.nativeElement` property assignment
- [ ] All DOM manipulations use `Renderer2` API
- [ ] No `innerHTML` assignment with untrusted data

---

### Pattern 5: HTTP Testing

**Use when:** Testing services that make HTTP calls

**Don't use when:** Unit testing pure business logic (use mocks instead)

✅ **Good**

```typescript
// CONTEXT: Integration test for HTTP service
// RULE: Use HttpClientTestingModule, always verify() in afterEach

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('PaymentService', () => {
  let service: PaymentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentService]
    });

    service = TestBed.inject(PaymentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();  // CRITICAL: Always verify
  });

  it('should send payment request', (done) => {
    const payment = { amount: 100, currency: 'USD' };

    service.initiatePayment(payment).subscribe(response => {
      expect(response.id).toBe('123');
      done();
    });

    const req = httpTestingController.expectOne('/api/payments');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payment);
    req.flush({ id: '123', status: 'pending' });
  });
});
```

❌ **Bad**

```typescript
// PROBLEM: Real HttpClientModule makes network calls

TestBed.configureTestingModule({
  imports: [HttpClientModule],  // Real HTTP—not a unit test!
  providers: [PaymentService]
});

// Also bad: Missing verify()
afterEach(() => {
  // No httpTestingController.verify()—outstanding requests not caught
});
```

**Why it's wrong:** Real `HttpClientModule` makes actual network requests, making tests slow, flaky, and dependent on external services. Missing `verify()` allows outstanding requests to go undetected.

**Verify:**
- [ ] `HttpClientTestingModule` imported (not `HttpClientModule`)
- [ ] `httpTestingController.verify()` called in `afterEach`
- [ ] Every request matched with `expectOne` and completed with `flush`
- [ ] Error scenarios tested with appropriate status codes

---

## 3. Validation

<!-- LLM: Load for code review tasks -->

### Automated Checks

| ID | Check | Severity | How to Detect |
|----|-------|----------|---------------|
| `COMMON-001` | Subscription cleanup present | 🔴 BLOCKER | `grep -r "\.subscribe(" --include="*.ts" \| grep -v "takeUntil\|async"` |
| `COMMON-002` | OnPush on presentational components | 🟡 WARNING | `grep -rL "ChangeDetectionStrategy.OnPush" --include="*.component.ts"` |
| `COMMON-003` | No `any` in public APIs | 🔴 BLOCKER | `grep -r ": any\|<any>" --include="*.ts"` |
| `COMMON-004` | No direct DOM access | 🔴 BLOCKER | `grep -r "document\.\|getElementById\|querySelector" --include="*.ts"` |
| `COMMON-005` | HttpClientTestingModule in tests | 🔴 BLOCKER | `grep -r "HttpClientModule" --include="*.spec.ts"` (should be 0) |
| `COMMON-006` | httpTestingController.verify() present | 🔴 BLOCKER | Check `afterEach` in HTTP test files |

### Review Checklist

| ID | Check | Severity |
|----|-------|----------|
| `COMMON-R01` | All subscriptions have cleanup mechanism | 🔴 BLOCKER |
| `COMMON-R02` | Async pipe preferred over manual subscription | 🟡 WARNING |
| `COMMON-R03` | OnPush used for presentational components | 🔴 BLOCKER |
| `COMMON-R04` | No `any` types in interfaces, actions, or component APIs | 🔴 BLOCKER |
| `COMMON-R05` | Renderer2 used for DOM manipulation | 🔴 BLOCKER |
| `COMMON-R06` | HTTP tests use HttpClientTestingModule | 🔴 BLOCKER |

---

## 4. Context

<!-- LLM: Skip unless asked about decision rationale -->

These patterns are extracted from domain-specific ADRs where they were duplicated. Centralizing them:
- Reduces token usage when ADRs are injected into LLM context
- Ensures consistency across all ADRs
- Provides single source of truth for updates

---

## 5. Decision

### What We Decided

Extract common cross-cutting patterns into this shared ADR. Domain-specific ADRs reference these patterns instead of duplicating code examples.

### Rationale

1. **DRY Principle:** Same pattern was repeated 3-6 times across ADRs
2. **Token Efficiency:** Reduces LLM context size by ~400 lines
3. **Consistency:** Single update point for pattern changes
4. **Clarity:** Domain ADRs focus on domain concerns, not general Angular practices

---

## 6. Implementation

### Related ADRs

These ADRs reference patterns from this document:

| Pattern | Referenced By |
|---------|---------------|
| Subscription Cleanup | ADR-004, ADR-005, ADR-006, ADR-012 |
| Change Detection | ADR-005, ADR-006, ADR-009, ADR-012 |
| Type Safety | ADR-002, ADR-006, ADR-007, ADR-009, ADR-012 |
| Safe DOM Manipulation | ADR-001, ADR-002 |
| HTTP Testing | ADR-011, ADR-013 |

---

## 7. Examples

### Complete Example

**Scenario:** Component using all common patterns correctly

```typescript
// File: libs/payments/src/lib/containers/payment-list.component.ts

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Payment } from '../models/payment.model';
import * as PaymentActions from '../+state/payment.actions';
import * as PaymentSelectors from '../+state/payment.selectors';

@Component({
  selector: 'app-payment-list',
  template: `
    <app-payment-table
      [payments]="payments$ | async"
      [loading]="loading$ | async"
      (select)="onSelect($event)">
    </app-payment-table>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush  // Pattern 2
})
export class PaymentListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();  // Pattern 1
  
  // Typed observables - Pattern 3
  payments$ = this.store.select(PaymentSelectors.selectAllPayments);
  loading$ = this.store.select(PaymentSelectors.selectLoading);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(PaymentActions.loadPayments());
  }

  // Typed parameter - Pattern 3
  onSelect(payment: Payment): void {
    this.store.dispatch(PaymentActions.selectPayment({ id: payment.id }));
  }

  ngOnDestroy(): void {  // Pattern 1
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

---

## 8. References

- [Angular Change Detection](https://angular.io/guide/change-detection) — Official guide
- [RxJS Subscription Management](https://rxjs.dev/guide/subscription) — RxJS patterns
- [Angular Renderer2](https://angular.io/api/core/Renderer2) — Safe DOM manipulation
- [Angular HTTP Testing](https://angular.io/guide/http-test-requests) — HttpClientTestingModule

---

