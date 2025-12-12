# ADR-013: Unit and Integration Testing Standards

## 1. Summary

<!-- LLM: Always load this section first -->

### TL;DR

> Implement shift-left testing with the Testing Pyramid: 70-80% unit tests (solitary/sociable), 15-25% integration tests. Unit tests must have zero I/O with all dependencies mocked, run in under 5 minutes, and achieve 80% coverage on new code. Use mutation testing (70% minimum score) to ensure tests verify actual behavior.

### Rules

**MUST DO ✅**

1. Follow AAA pattern (Arrange-Act-Assert) with clear sections in every test
2. Mock all external dependencies in unit tests—zero HTTP, database, or filesystem calls
3. Use `fakeAsync()` and `tick()` for time-dependent operations instead of real timers
4. Achieve ≥80% line/branch coverage for new code (PR gate blocker)
5. Achieve ≥70% mutation score for changed files (PR gate blocker)
6. Use `HttpClientTestingModule` and call `httpTestingController.verify()` in `afterEach`
7. Inject `Clock` service for date operations—never use `new Date()` directly in production code

**MUST NOT ❌**

1. Use real `HttpClient` or `HttpClientModule` in unit tests
2. Use `setTimeout`/`setInterval`—use `fakeAsync` and `tick()` instead
3. Test private methods or implementation details (e.g., `component['_internalFlag']`)
4. Leave disabled tests (`xit`, `xdescribe`) without a linked ticket
5. Include any I/O in solitary or sociable unit tests
6. Use `Math.random()` or `new Date()` without deterministic seeding/mocking
7. Write tests that only assert `expect(true).toBe(true)` or similar no-ops

---

## 2. Patterns

<!-- LLM: Load for code generation tasks -->

<!-- 
Cross-reference: For HTTP Testing pattern (HttpClientTestingModule), see ADR-000 Pattern 5.
-->

### Pattern Index

| Keywords | Pattern |
|----------|---------|
| unit test, service, mock, isolated | [Pattern 1: Solitary Unit Test](#pattern-1-solitary-unit-test) |
| unit test, real collaborators, no I/O | [Pattern 2: Sociable Unit Test](#pattern-2-sociable-unit-test) |
| component, fixture, TestBed | [Pattern 3: Component Unit Test](#pattern-3-component-unit-test) |
| NgRx, reducer, selector, effect | [Pattern 4: NgRx Testing](#pattern-4-ngrx-testing) |
| integration, HTTP, API, HttpTestingController | [Pattern 5: HTTP Integration Test](#pattern-5-http-integration-test) |

---

### Pattern 1: Solitary Unit Test

**Use when:** Testing a single class/service in complete isolation; all collaborators should be test doubles

**Don't use when:** Testing interaction between multiple real in-memory classes; testing real HTTP/DB boundaries

✅ **Good**

```typescript
// CONTEXT: Testing PaymentService in isolation
// RULE: All dependencies must be mocked—zero I/O allowed

describe('PaymentService (solitary)', () => {
  let service: PaymentService;
  let httpMock: jest.Mocked<HttpClient>;
  let loggerMock: jest.Mocked<Logger>;

  beforeEach(() => {
    httpMock = {
      post: jest.fn(),
      get: jest.fn(),
    } as any;

    loggerMock = {
      info: jest.fn(),
      error: jest.fn(),
    } as any;

    service = new PaymentService(httpMock, loggerMock);
  });

  it('should initiate payment with correct payload', () => {
    // Arrange
    const payment = { amount: 100, currency: 'USD' };
    httpMock.post.mockReturnValue(of({ id: '123' }));

    // Act
    service.initiatePayment(payment);

    // Assert
    expect(httpMock.post).toHaveBeenCalledWith('/api/payments', payment);
    expect(loggerMock.info).toHaveBeenCalledWith('Payment initiated', expect.any(Object));
  });
});
```

❌ **Bad**

```typescript
// PROBLEM: Uses real HttpClient—this makes HTTP calls, not a unit test

describe('PaymentService (BAD)', () => {
  let service: PaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // Real HTTP - crosses I/O boundary
      providers: [PaymentService],
    });
    service = TestBed.inject(PaymentService);
  });

  // This test will make real HTTP calls!
});
```

**Why it's wrong:** Real `HttpClientModule` makes actual network requests, violating the zero I/O rule for unit tests. Tests become slow, flaky, and dependent on external services.

**Verify:**
- [ ] No `HttpClientModule` import (use mocks for unit tests)
- [ ] All dependencies are explicitly mocked in `beforeEach`
- [ ] Test follows AAA pattern with clear Arrange/Act/Assert sections
- [ ] No `async`/`await` on real I/O operations

---

### Pattern 2: Sociable Unit Test

**Use when:** Testing collaboration between multiple in-memory classes (value objects, calculators, strategies) with zero I/O

**Don't use when:** Any collaborator makes HTTP calls, database access, or filesystem operations

✅ **Good**

```typescript
// CONTEXT: Testing OrderCalculator with real TaxCalculator and DiscountStrategy
// RULE: Real collaborators allowed only if they are pure in-memory (no I/O)

describe('OrderCalculator (sociable)', () => {
  let calculator: OrderCalculator;
  let taxCalculator: TaxCalculator; // Real instance
  let discountStrategy: DiscountStrategy; // Real instance

  beforeEach(() => {
    // Real in-memory collaborators, no I/O
    taxCalculator = new TaxCalculator();
    discountStrategy = new PercentageDiscountStrategy();
    calculator = new OrderCalculator(taxCalculator, discountStrategy);
  });

  it('should calculate total with tax and discount', () => {
    // Arrange
    const order = new Order([
      { price: 100, quantity: 2 }, // $200
      { price: 50, quantity: 1 },  // $50
    ]);

    // Act
    const total = calculator.calculateTotal(order, 0.1, 0.2); // 10% discount, 20% tax

    // Assert - tests integration of real calculator logic
    expect(total).toBe(216); // (250 * 0.9) * 1.2 = 216
  });
});
```

❌ **Bad**

```typescript
// PROBLEM: DiscountService makes HTTP calls—this is integration, not unit

describe('OrderCalculator (BAD)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderCalculator,
        TaxCalculator,
        { provide: DiscountService, useClass: DiscountService }, // Makes HTTP calls!
      ],
    });
  });

  // If DiscountService makes HTTP calls, this crosses I/O boundary
});
```

**Why it's wrong:** If any collaborator performs I/O (HTTP, database, filesystem), the test becomes an integration test. Sociable unit tests must stay within process memory.

**Verify:**
- [ ] All collaborators are pure in-memory (no I/O)
- [ ] No services that inject HttpClient, database connections, or external clients
- [ ] Test verifies collaboration behavior, not implementation details

---

### Pattern 3: Component Unit Test

**Use when:** Testing Angular component behavior with mocked services

**Don't use when:** Testing component integration with real child components or real services

✅ **Good**

```typescript
// CONTEXT: Testing PaymentFormComponent with mocked PaymentService
// RULE: Mock all injected services; test user-visible behavior

describe('PaymentFormComponent', () => {
  let component: PaymentFormComponent;
  let fixture: ComponentFixture<PaymentFormComponent>;
  let paymentServiceMock: jest.Mocked<PaymentService>;

  beforeEach(() => {
    paymentServiceMock = {
      initiatePayment: jest.fn(),
      validateCard: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      declarations: [PaymentFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: PaymentService, useValue: paymentServiceMock },
      ],
    });

    fixture = TestBed.createComponent(PaymentFormComponent);
    component = fixture.componentInstance;
  });

  it('should disable submit button when form is invalid', () => {
    // Arrange
    component.paymentForm.patchValue({ amount: -100 }); // Invalid amount

    // Act
    fixture.detectChanges();

    // Assert
    const button = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(button.disabled).toBe(true);
  });

  it('should call payment service with form values on submit', () => {
    // Arrange
    const formValue = { amount: 100, currency: 'USD' };
    component.paymentForm.patchValue(formValue);
    paymentServiceMock.initiatePayment.mockReturnValue(of({ id: '123' }));

    // Act
    component.onSubmit();

    // Assert
    expect(paymentServiceMock.initiatePayment).toHaveBeenCalledWith(formValue);
  });
});
```

❌ **Bad**

```typescript
// PROBLEM: Testing private implementation details instead of behavior

it('should set loading flag to true (BAD)', () => {
  component.onSubmit();
  expect(component['_isLoading']).toBe(true); // Testing private property!
});
```

**Why it's wrong:** Testing private properties couples tests to implementation. If internal variable names change, tests break even when behavior is correct.

**Verify:**
- [ ] All services are mocked via `{ provide: X, useValue: mockX }`
- [ ] Tests verify user-visible behavior (DOM state, public properties, service calls)
- [ ] No access to private members via `component['_privateField']`
- [ ] Uses `fakeAsync`/`tick` for async operations

---

### Pattern 4: NgRx Testing

**Use when:** Testing NgRx reducers, selectors, and effects

**Don't use when:** Testing component-level state without NgRx involvement

✅ **Good**

```typescript
// CONTEXT: Testing NgRx reducer and effect
// RULE: Reducers/selectors are pure functions; effects use provideMockActions

// Reducer test (pure function)
describe('PaymentReducer', () => {
  it('should set loading state when initiating payment', () => {
    // Arrange
    const initialState = paymentInitialState;
    const action = PaymentActions.initiatePayment({ amount: 100 });

    // Act
    const newState = paymentReducer(initialState, action);

    // Assert
    expect(newState.loading).toBe(true);
    expect(newState.error).toBeNull();
  });
});

// Selector test (pure function)
describe('Payment Selectors', () => {
  it('should select pending payments', () => {
    // Arrange
    const state = {
      payment: {
        payments: [
          { id: '1', status: 'pending' },
          { id: '2', status: 'completed' },
          { id: '3', status: 'pending' },
        ],
      },
    };

    // Act
    const result = selectPendingPayments(state);

    // Assert
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.status === 'pending')).toBe(true);
  });
});

// Effect test (with mocked actions and service)
describe('PaymentEffects', () => {
  let effects: PaymentEffects;
  let actions$: Observable<Action>;
  let paymentServiceMock: jest.Mocked<PaymentService>;

  beforeEach(() => {
    paymentServiceMock = { initiatePayment: jest.fn() } as any;

    TestBed.configureTestingModule({
      providers: [
        PaymentEffects,
        provideMockActions(() => actions$),
        { provide: PaymentService, useValue: paymentServiceMock },
      ],
    });

    effects = TestBed.inject(PaymentEffects);
  });

  it('should dispatch success action on successful payment', () => {
    // Arrange
    const payment = { id: '123', amount: 100 };
    const action = PaymentActions.initiatePayment({ amount: 100 });
    const outcome = PaymentActions.initiatePaymentSuccess({ payment });

    actions$ = hot('-a', { a: action });
    const response = cold('-a|', { a: payment });
    paymentServiceMock.initiatePayment.mockReturnValue(response);

    // Act & Assert
    const expected = cold('--b', { b: outcome });
    expect(effects.initiatePayment$).toBeObservable(expected);
  });
});
```

❌ **Bad**

```typescript
// PROBLEM: Testing effect without provideMockActions—unclear action stream

describe('PaymentEffects (BAD)', () => {
  it('should work', () => {
    const effect = new PaymentEffects(actions$, paymentService);
    // No marble testing, unclear timing, hard to verify
  });
});
```

**Why it's wrong:** Without `provideMockActions` and marble testing, effect tests lack determinism and clear action timing verification.

**Verify:**
- [ ] Reducers tested as pure functions without TestBed
- [ ] Selectors tested as pure functions with mock state objects
- [ ] Effects use `provideMockActions()` and marble testing (`hot`/`cold`)
- [ ] Service dependencies in effects are mocked

---

### Pattern 5: HTTP Integration Test

<!-- See ADR-000 Pattern 5: HTTP Testing (HttpClientTestingModule) for complete pattern -->

**Rule:** Use `HttpClientTestingModule` + `HttpTestingController`, always call `verify()` in `afterEach`.

**Key Points:**
- **Use when:** Testing HTTP serialization, request/response handling, interceptors, error handling
- **Don't use when:** Testing business logic without HTTP boundaries
- **Critical:** Call `httpTestingController.verify()` in `afterEach`—catches outstanding requests
- **Pattern:** `expectOne()` → verify request → `flush()` response

For full code examples with success/error scenarios, see **ADR-000 Pattern 5: HTTP Testing**.

---

## 3. Validation

<!-- LLM: Load for code review tasks -->

### Automated Checks

| ID | Check | Severity | How to Detect |
|----|-------|----------|---------------|
| `TEST-001` | No real HttpClientModule in unit tests | 🔴 BLOCKER | `grep -r "HttpClientModule" --include="*.spec.ts"` |
| `TEST-002` | No setTimeout in tests | 🔴 BLOCKER | `grep -r "setTimeout\|setInterval" --include="*.spec.ts"` |
| `TEST-003` | No private property access in tests | 🔴 BLOCKER | `grep -r "\['_" --include="*.spec.ts"` |
| `TEST-004` | No disabled tests without ticket | 🟡 WARNING | `grep -r "xit\|xdescribe" --include="*.spec.ts"` |
| `TEST-005` | HttpTestingController.verify() present | 🔴 BLOCKER | Check `afterEach` blocks in HTTP test files |
| `TEST-006` | No new Date() in production code | 🟡 WARNING | `grep -r "new Date()" --include="*.ts" --exclude="*.spec.ts"` |
| `TEST-007` | Coverage threshold met | 🔴 BLOCKER | Jest coverage report: `--coverage --coverageThreshold` |
| `TEST-008` | Mutation score threshold met | 🔴 BLOCKER | Stryker report: `npx stryker run --incremental` |

### Review Checklist

| ID | Check | Severity |
|----|-------|----------|
| `TEST-R01` | All tests follow AAA pattern (Arrange-Act-Assert) | 🔴 BLOCKER |
| `TEST-R02` | Test names describe behavior: `should [behavior] when [condition]` | 🔴 BLOCKER |
| `TEST-R03` | Each test verifies ONE behavior/outcome | 🔴 BLOCKER |
| `TEST-R04` | Unit tests have zero I/O (HTTP, DB, filesystem) | 🔴 BLOCKER |
| `TEST-R05` | Tests are independent (can run in any order) | 🔴 BLOCKER |
| `TEST-R06` | Edge cases covered (null, undefined, empty, errors) | 🟡 WARNING |
| `TEST-R07` | No console.log statements in test code | 🟡 WARNING |
| `TEST-R08` | No `any` types without justification | 🟡 WARNING |
| `TEST-R09` | Test data uses builders for complex objects | 🟡 WARNING |
| `TEST-R10` | Integration tests use Testcontainers or HttpClientTestingModule | 🔴 BLOCKER |

### Required Tests

| Scenario | Type | Required |
|----------|------|----------|
| Angular services with business logic | Unit | ✅ Yes |
| NgRx reducers | Unit | ✅ Yes |
| NgRx selectors | Unit | ✅ Yes |
| NgRx effects | Unit | ✅ Yes |
| Pure pipes | Unit | ✅ Yes |
| Route guards | Unit | ✅ Yes |
| HTTP interceptors | Integration | ✅ Yes |
| Service-to-API communication | Integration | ✅ Yes |
| Component user interactions | Unit | ✅ Yes |
| Error handling paths | Unit | ✅ Yes |

---

## 4. Context

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding the historical context.
-->

### Problem

Inconsistent testing practices cause brittle tests and flaky CI pipelines. Coverage numbers achieved without actually verifying behavior. Teams lack guidance on unit vs integration test boundaries.

### Business Drivers

- Reduce change failure rate (DORA metric)
- Catch defects at unit/integration layer (10-100x cheaper than production)
- Reduce manual QA toil with lower-layer automation

### Technical Constraints

- Jest test runner, Angular v17+
- PR gates ≤ 10 minutes for unit tests
- Sandboxed CI (no external network deps)

---

## 5. Decision

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding decision rationale.
-->

### What We Decided

Testing Pyramid: 70-80% unit tests (zero I/O), 15-25% integration. Quality gates: 80% coverage + 70% mutation score as PR blockers. Unit tests < 5 minutes per library. Zero flakiness tolerance.

### Rationale

| Choice | Why |
|--------|-----|
| Shift-left testing | Defect fix cost 10-100x less than production |
| Mutation testing | Ensures tests verify behavior, not just coverage numbers |
| Zero I/O in unit tests | Deterministic, fast, no flakiness |
| HttpClientTestingModule | Verify HTTP boundaries without real network |

---

## 6. Implementation

### Affected Components

| Component | Impact | Files |
|-----------|--------|-------|
| Angular services | MODIFY | `libs/**/*.service.ts`, `libs/**/*.service.spec.ts` |
| Angular components | MODIFY | `libs/**/*.component.ts`, `libs/**/*.component.spec.ts` |
| NgRx state | MODIFY | `libs/**/+state/**/*.ts` |
| Pipes, guards, interceptors | MODIFY | `libs/**/*.pipe.ts`, `libs/**/*.guard.ts`, `libs/**/*.interceptor.ts` |
| Jest config | MODIFY | `jest.config.ts`, `jest.preset.js` |
| Stryker config | CREATE | `stryker.conf.json` |
| CI pipeline | MODIFY | `.github/workflows/*.yml` or equivalent |

### Related ADRs

| ADR | Relationship |
|-----|--------------|
| ADR-012: NgRx State Management | Related to: NgRx testing patterns |

### Migration Notes

Existing tests should be incrementally updated to meet new standards. For migration:

1. Run `npx jest --coverage` to identify files below 80% threshold
2. Prioritize tests for new code and recently modified files
3. Replace `HttpClientModule` with `HttpClientTestingModule` in integration tests
4. Add `httpTestingController.verify()` to all HTTP test files
5. Replace `setTimeout` with `fakeAsync`/`tick`
6. Configure Stryker for mutation testing on changed files

---

## 7. Examples

### Complete Example

**Scenario:** Testing a PaymentService with unit tests (solitary) and integration tests (HTTP)

```typescript
// File: libs/payments/src/lib/services/payment.service.spec.ts

import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PaymentService } from './payment.service';
import { of, throwError } from 'rxjs';

// ========================================
// UNIT TESTS (Solitary - Full Isolation)
// ========================================
describe('PaymentService (Unit)', () => {
  let service: PaymentService;
  let httpMock: jest.Mocked<any>;
  let loggerMock: jest.Mocked<any>;

  beforeEach(() => {
    httpMock = { post: jest.fn(), get: jest.fn() };
    loggerMock = { info: jest.fn(), error: jest.fn() };
    service = new PaymentService(httpMock, loggerMock);
  });

  it('should initiate payment with correct payload', () => {
    // Arrange
    const payment = { amount: 100, currency: 'USD' };
    httpMock.post.mockReturnValue(of({ id: '123' }));

    // Act
    service.initiatePayment(payment);

    // Assert
    expect(httpMock.post).toHaveBeenCalledWith('/api/payments', payment);
  });

  it('should log error when payment fails', () => {
    // Arrange
    const error = new Error('Network failure');
    httpMock.post.mockReturnValue(throwError(() => error));

    // Act
    service.initiatePayment({ amount: 100 }).subscribe({ error: () => {} });

    // Assert
    expect(loggerMock.error).toHaveBeenCalledWith('Payment failed', error);
  });
});

// ========================================
// INTEGRATION TESTS (Real HTTP Stack)
// ========================================
describe('PaymentService (Integration)', () => {
  let service: PaymentService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentService],
    });

    service = TestBed.inject(PaymentService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify(); // CRITICAL: Always verify
  });

  it('should serialize date fields as ISO strings', (done) => {
    // Arrange
    const payment = { amount: 100, timestamp: new Date('2025-01-01') };

    // Act
    service.initiatePayment(payment).subscribe(() => done());

    // Assert
    const req = httpTestingController.expectOne('/api/payments');
    expect(req.request.body.timestamp).toBe('2025-01-01T00:00:00.000Z');
    req.flush({ id: '123' });
  });
});
```

### Common Mistakes

**Mistake 1: Using real timers instead of fakeAsync**

```typescript
// ❌ Wrong - flaky, slow, non-deterministic
it('should wait for async operation', (done) => {
  setTimeout(() => {
    expect(service.getValue()).toBe(10);
    done();
  }, 100);
});

// ✅ Fix - deterministic, fast
it('should wait for async operation', fakeAsync(() => {
  service.startOperation();
  tick(100);
  expect(service.getValue()).toBe(10);
}));
```

**Mistake 2: Testing implementation details**

```typescript
// ❌ Wrong - tests private property
it('should set loading flag', () => {
  component.onSubmit();
  expect(component['_isLoading']).toBe(true);
});

// ✅ Fix - test observable behavior or DOM state
it('should show loading indicator while submitting', () => {
  component.onSubmit();
  fixture.detectChanges();
  expect(fixture.nativeElement.querySelector('.loading')).toBeTruthy();
});
```

**Mistake 3: Missing httpTestingController.verify()**

See **ADR-000 Pattern 5: HTTP Testing** for the complete pattern. Always call `httpTestingController.verify()` in `afterEach` to catch unhandled requests.

---

## 8. References

- [Testing Strategy Document](/docs/exports/Testing%20strategy.md) — Complete testing approach
- [The Practical Test Pyramid](https://martinfowler.com/articles/practical-test-pyramid.html) — Martin Fowler
- [Angular Testing Guide](https://angular.io/guide/testing) — Official Angular documentation
- [Jest Documentation](https://jestjs.io/) — Test runner and matchers
- [Testcontainers](https://testcontainers.com/) — Container-based integration testing
- [Angular Testing Library](https://testing-library.com/docs/angular-testing-library/intro/)
- [Stryker Mutator](https://stryker-mutator.io/) — Mutation testing framework
- [DORA Metrics](https://dora.dev/guides/dora-metrics-four-keys/) — DevOps performance measurement
- [Martin Fowler - Unit Test](https://martinfowler.com/bliki/UnitTest.html) — Solitary vs Sociable
- [ISTQB Glossary](http://glossary.istqb.org/en_US/) — Industry testing terminology
- [Nx Testing Documentation](https://nx.dev/recipes/jest/test)
- [RxJS Marble Testing](https://rxjs.dev/guide/testing/marble-testing) — Marble diagrams for observables

---
