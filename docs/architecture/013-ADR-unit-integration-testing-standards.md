# ADR-013: Unit and Integration Testing Standards for Angular Applications

## Decision summary

This ADR establishes mandatory standards for Unit and Integration testing in Angular applications, implementing a shift-left approach with the Testing Pyramid as the foundation. We mandate 80% minimum coverage for new code at the unit layer, deterministic test execution with zero tolerance for flakiness, and clear boundaries between unit (isolated/sociable) and integration (real boundary) tests. All tests must run in CI on every PR as blockers, with mutation testing ensuring test effectiveness. This decision provides engineers with concrete, self-contained guidelines, code examples, and a code review checklist to ensure consistent, high-quality test implementation without requiring external documentation.

## Context and problem statement

### Business context
- **Need:** Ship reliable features faster while maintaining code quality and reducing defect escape rates
- **Problem:** Inconsistent testing practices lead to brittle test suites, flaky tests blocking deployments, and defects escaping to production
- **Success criteria:** 
  - Reduce change failure rate (DORA metric)
  - Decrease MTTR (Mean Time To Restore)
  - Increase deployment frequency with confidence
  - Reduce manual QA toil through comprehensive lower-layer automation

### Technical context
- **Existing landscape:** Angular applications with Jest/Jasmine for unit tests, varying degrees of test coverage and quality
- **Affected systems:** All Angular web applications across value streams
- **Technical constraints:**
  - Must work within existing CI/CD pipelines
  - Must support parallel test execution
  - Must integrate with existing tooling (Jest, Testcontainers, Nx)

### Constraints and assumptions

**Technical Constraints**:
- Angular framework (currently v17+) as primary frontend technology
- Jest as the test runner (migration from Jasmine where applicable)
- Node.js runtime environment
- Nx monorepo structure with multiple applications and libraries
- CI pipeline execution time budget: PR gates ≤ 10 minutes for unit tests

**Business Constraints**:
- Zero budget for flaky tests blocking deployments
- Must maintain backward compatibility during migration
- Teams must self-service without dedicated QA automation support
- Cannot introduce breaking changes to existing test infrastructure

**Environmental Constraints**:
- Tests must run in sandboxed CI environments
- No external network dependencies in unit tests
- Integration tests may use containerized dependencies (Testcontainers)
- Must support parallel execution across multiple CI runners

**Assumptions Made**:
- Engineers have basic TypeScript and Angular knowledge
- Teams adopt TDD/BDD practices incrementally
- Mutation testing adoption happens gradually (scoped to changes first)
- Test data builders become the standard over time

### Affected architecture description elements

**Components**:
- All Angular components (UI layer)
- All Angular services (business logic layer)
- All utility functions and pure functions
- All state management (NgRx stores, effects, reducers, selectors)
- All pipes, directives, guards, interceptors
- API integration layers
- Database access layers (via services)

**Views**:
- **Development view:** Testing practices impact code organization and module boundaries
- **Process view:** CI/CD pipeline quality gates and test execution workflow
- **Logical view:** Clear separation between unit and integration test concerns

**Stakeholders**:
- **Engineers:** Primary authors and maintainers of tests
- **QA:** Collaborators on test scenarios and exploratory testing
- **Platform/DevOps:** CI/CD pipeline owners ensuring gates enforce standards
- **Engineering Managers:** Accountable for team adherence to standards

## Decision

### What we decided

We establish the following mandatory standards for Unit and Integration testing in Angular applications:

1. **Testing Pyramid Foundation:**
   - Unit tests form the base (70-80% of total test suite)
   - Integration tests occupy the middle (15-25%)
   - System/E2E tests remain minimal (covered in separate ADR)

2. **Unit Test Standards:**
   - **Solitary Unit Tests:** Full isolation with all dependencies mocked/stubbed
   - **Sociable Unit Tests:** Allow real in-process collaborators, zero I/O
   - Minimum 80% coverage for new code (enforced via PR gate)
   - Zero flakiness tolerance
   - Test execution < 5 minutes for entire unit suite per library/app

3. **Integration Test Standards:**
   - Test real boundaries (service ↔ API, service ↔ database)
   - Use Testcontainers for reproducible dependencies
   - Stub external third-party services
   - Focus on data flow, serialization, and contract correctness

4. **Mutation Testing:**
   - Scoped to changed files in PR (blocker)
   - Full repository scan in nightly builds (report-only)
   - Minimum mutation score: 70% for new/changed code

5. **Quality Gates:**
   - **PR Gate (Blocker):** Unit tests green, 80% coverage on new code, mutation tests pass
   - **PR Gate (Required):** Integration smoke tests
   - **Build Gate (Blocker):** Full integration suite with containers

### Rationale

- **Shift-left principle:** Catching defects at unit/integration layers costs 10-100x less than E2E or production
- **DORA metrics alignment:** Fast, reliable lower-layer tests improve deployment frequency and reduce change failure rate
- **Testing Pyramid efficiency:** Unit tests provide fastest feedback (seconds) vs integration (minutes) vs E2E (tens of minutes)
- **Determinism requirement:** Flaky tests erode confidence and cause "rerun roulette" waste
- **Mutation testing:** Ensures tests actually verify behavior, not just achieve coverage numbers
- **Angular ecosystem fit:** Leverages Angular Testing Library, Jest, and Nx capabilities

## Implementation details

### Technical approach

#### 1. Unit Testing Standards (Angular-Specific)

**Solitary Unit Tests** - Full isolation, all dependencies mocked:

```typescript
// ✅ GOOD: Solitary unit test for Angular service
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
    expect(httpMock.post).toHaveBeenCalledWith(
      '/api/payments',
      payment
    );
    expect(loggerMock.info).toHaveBeenCalledWith(
      'Payment initiated',
      expect.any(Object)
    );
  });

  it('should handle payment failure and log error', () => {
    // Arrange
    const error = new Error('Network failure');
    httpMock.post.mockReturnValue(throwError(() => error));

    // Act & Assert
    service.initiatePayment({ amount: 100 }).subscribe({
      error: (err) => {
        expect(err).toBe(error);
        expect(loggerMock.error).toHaveBeenCalledWith(
          'Payment failed',
          error
        );
      },
    });
  });
});

// ❌ BAD: Not truly isolated - uses real HttpClient
describe('PaymentService (BAD)', () => {
  let service: PaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule], // ❌ Real HTTP - this is integration, not unit
      providers: [PaymentService],
    });
    service = TestBed.inject(PaymentService);
  });

  // This test will make real HTTP calls - not a unit test!
});
```

**Sociable Unit Tests** - Real in-process collaborators, still no I/O:

```typescript
// ✅ GOOD: Sociable unit test with real value objects/helpers
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

// ❌ BAD: Claims to be sociable but crosses I/O boundary
describe('OrderCalculator (BAD)', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrderCalculator,
        TaxCalculator,
        { provide: DiscountService, useClass: DiscountService }, // ❌ Makes HTTP calls
      ],
    });
  });

  // If DiscountService makes HTTP calls, this is integration, not unit
});
```

**Angular Component Unit Tests:**

```typescript
// ✅ GOOD: Isolated component test with mocked dependencies
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

  it('should show error message when payment fails', fakeAsync(() => {
    // Arrange
    const error = { message: 'Insufficient funds' };
    paymentServiceMock.initiatePayment.mockReturnValue(
      throwError(() => error)
    );
    component.paymentForm.patchValue({ amount: 100, currency: 'USD' });

    // Act
    component.onSubmit();
    tick(); // Resolve observables

    // Assert
    expect(component.errorMessage).toBe('Insufficient funds');
  }));
});

// ❌ BAD: Testing implementation details instead of behavior
it('should set loading flag to true (BAD)', () => {
  component.onSubmit();
  expect(component['_isLoading']).toBe(true); // ❌ Testing private implementation
});

// ✅ GOOD: Test the observable behavior
it('should show loading indicator while submitting', () => {
  component.onSubmit();
  expect(component.isLoading$).toBeObservable(cold('a', { a: true }));
});
```

**NgRx Testing:**

```typescript
// ✅ GOOD: Reducer unit test (pure function)
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

  it('should store payment when successful', () => {
    // Arrange
    const payment = { id: '123', amount: 100 };
    const action = PaymentActions.initiatePaymentSuccess({ payment });

    // Act
    const newState = paymentReducer(paymentInitialState, action);

    // Assert
    expect(newState.currentPayment).toEqual(payment);
    expect(newState.loading).toBe(false);
  });
});

// ✅ GOOD: Selector unit test (pure function)
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

// ✅ GOOD: Effect unit test with mocked dependencies
describe('PaymentEffects', () => {
  let effects: PaymentEffects;
  let actions$: Observable<Action>;
  let paymentServiceMock: jest.Mocked<PaymentService>;

  beforeEach(() => {
    paymentServiceMock = {
      initiatePayment: jest.fn(),
    } as any;

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

  it('should dispatch failure action on error', () => {
    // Arrange
    const error = new Error('Payment failed');
    const action = PaymentActions.initiatePayment({ amount: 100 });
    const outcome = PaymentActions.initiatePaymentFailure({ error: error.message });

    actions$ = hot('-a', { a: action });
    const response = cold('-#|', {}, error);
    paymentServiceMock.initiatePayment.mockReturnValue(response);

    // Act & Assert
    const expected = cold('--b', { b: outcome });
    expect(effects.initiatePayment$).toBeObservable(expected);
  });
});
```

**Pipes and Guards:**

```typescript
// ✅ GOOD: Pure pipe test (simple unit test)
describe('CurrencyFormatPipe', () => {
  let pipe: CurrencyFormatPipe;

  beforeEach(() => {
    pipe = new CurrencyFormatPipe();
  });

  it('should format USD currency correctly', () => {
    expect(pipe.transform(1234.56, 'USD')).toBe('$1,234.56');
  });

  it('should handle zero amount', () => {
    expect(pipe.transform(0, 'USD')).toBe('$0.00');
  });

  it('should handle negative amounts', () => {
    expect(pipe.transform(-100, 'EUR')).toBe('-€100.00');
  });
});

// ✅ GOOD: Guard unit test with mocked dependencies
describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authServiceMock: jest.Mocked<AuthService>;
  let routerMock: jest.Mocked<Router>;

  beforeEach(() => {
    authServiceMock = {
      isAuthenticated$: jest.fn(),
    } as any;

    routerMock = {
      navigate: jest.fn(),
    } as any;

    guard = new AuthGuard(authServiceMock, routerMock);
  });

  it('should allow activation when user is authenticated', (done) => {
    // Arrange
    authServiceMock.isAuthenticated$.mockReturnValue(of(true));

    // Act
    guard.canActivate().subscribe((result) => {
      // Assert
      expect(result).toBe(true);
      expect(routerMock.navigate).not.toHaveBeenCalled();
      done();
    });
  });

  it('should redirect to login when user is not authenticated', (done) => {
    // Arrange
    authServiceMock.isAuthenticated$.mockReturnValue(of(false));

    // Act
    guard.canActivate().subscribe((result) => {
      // Assert
      expect(result).toBe(false);
      expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
      done();
    });
  });
});
```

#### 2. Integration Testing Standards

**Service-to-API Integration:**

```typescript
// ✅ GOOD: Integration test with real HTTP, mocked backend
describe('PaymentService Integration', () => {
  let service: PaymentService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PaymentService],
    });

    service = TestBed.inject(PaymentService);
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify no outstanding HTTP requests
    httpTestingController.verify();
  });

  it('should serialize payment request correctly', (done) => {
    // Arrange
    const payment = {
      amount: 100,
      currency: 'USD',
      timestamp: new Date('2025-01-01'),
    };

    // Act
    service.initiatePayment(payment).subscribe((response) => {
      expect(response.id).toBe('123');
      done();
    });

    // Assert - verify HTTP request details
    const req = httpTestingController.expectOne('/api/payments');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      amount: 100,
      currency: 'USD',
      timestamp: '2025-01-01T00:00:00.000Z', // Verify date serialization
    });
    expect(req.request.headers.get('Content-Type')).toBe('application/json');

    // Respond with mock data
    req.flush({ id: '123', status: 'pending' });
  });

  it('should handle 404 error correctly', (done) => {
    // Act
    service.getPayment('invalid-id').subscribe({
      error: (error) => {
        // Assert
        expect(error.status).toBe(404);
        expect(error.error).toEqual({ message: 'Payment not found' });
        done();
      },
    });

    // Mock 404 response
    const req = httpTestingController.expectOne('/api/payments/invalid-id');
    req.flush({ message: 'Payment not found' }, { status: 404, statusText: 'Not Found' });
  });

  it('should retry on network failure', fakeAsync(() => {
    // Arrange
    let attemptCount = 0;

    // Act
    service.initiatePayment({ amount: 100 }).subscribe();

    // First attempt fails
    tick();
    const req1 = httpTestingController.expectOne('/api/payments');
    req1.error(new ProgressEvent('Network error'));

    // Second attempt fails
    tick(1000); // Wait for retry delay
    const req2 = httpTestingController.expectOne('/api/payments');
    req2.error(new ProgressEvent('Network error'));

    // Third attempt succeeds
    tick(1000);
    const req3 = httpTestingController.expectOne('/api/payments');
    req3.flush({ id: '123' });

    flush();
  }));
});
```

**Service-to-Database Integration (with Testcontainers):**

```typescript
// ✅ GOOD: Integration test with real database in container
describe('PaymentRepository Integration', () => {
  let repository: PaymentRepository;
  let container: StartedPostgreSqlContainer;
  let dataSource: DataSource;

  beforeAll(async () => {
    // Start PostgreSQL container
    container = await new PostgreSqlContainer('postgres:15-alpine')
      .withDatabase('test_db')
      .withUsername('test_user')
      .withPassword('test_pass')
      .start();

    // Initialize data source with container connection
    dataSource = new DataSource({
      type: 'postgres',
      host: container.getHost(),
      port: container.getPort(),
      username: container.getUsername(),
      password: container.getPassword(),
      database: container.getDatabase(),
      entities: [Payment],
      synchronize: true,
    });

    await dataSource.initialize();
    repository = new PaymentRepository(dataSource);
  }, 60000); // Allow time for container startup

  afterAll(async () => {
    await dataSource.destroy();
    await container.stop();
  });

  beforeEach(async () => {
    // Clean database between tests
    await dataSource.query('TRUNCATE TABLE payments CASCADE');
  });

  it('should save and retrieve payment with all fields', async () => {
    // Arrange
    const payment = {
      amount: 100,
      currency: 'USD',
      status: 'pending',
      createdAt: new Date('2025-01-01'),
    };

    // Act
    const saved = await repository.save(payment);
    const retrieved = await repository.findById(saved.id);

    // Assert
    expect(retrieved).toBeDefined();
    expect(retrieved.amount).toBe(100);
    expect(retrieved.currency).toBe('USD');
    expect(retrieved.status).toBe('pending');
    expect(retrieved.createdAt).toEqual(new Date('2025-01-01'));
  });

  it('should enforce unique constraint on transaction_id', async () => {
    // Arrange
    const payment1 = { transactionId: 'TXN123', amount: 100 };
    const payment2 = { transactionId: 'TXN123', amount: 200 };

    // Act
    await repository.save(payment1);

    // Assert
    await expect(repository.save(payment2)).rejects.toThrow(/unique constraint/i);
  });

  it('should perform transaction rollback on error', async () => {
    // Arrange
    const payment1 = { amount: 100, status: 'pending' };
    const payment2 = { amount: null, status: 'pending' }; // Invalid

    // Act - attempt batch save with one invalid record
    await expect(
      repository.saveMany([payment1, payment2])
    ).rejects.toThrow();

    // Assert - first record should not be saved (transaction rolled back)
    const count = await repository.count();
    expect(count).toBe(0);
  });

  it('should handle concurrent updates with optimistic locking', async () => {
    // Arrange
    const payment = await repository.save({ amount: 100, version: 1 });

    // Act - simulate concurrent updates
    const update1 = repository.update(payment.id, { amount: 150 });
    const update2 = repository.update(payment.id, { amount: 200 });

    // Assert - one should succeed, one should fail with version conflict
    const results = await Promise.allSettled([update1, update2]);
    const fulfilled = results.filter((r) => r.status === 'fulfilled');
    const rejected = results.filter((r) => r.status === 'rejected');

    expect(fulfilled).toHaveLength(1);
    expect(rejected).toHaveLength(1);
  });
});
```

**Component Integration with Real Child Components:**

```typescript
// ✅ GOOD: Shallow integration - test component with real children, mocked services
describe('PaymentPageComponent Integration', () => {
  let component: PaymentPageComponent;
  let fixture: ComponentFixture<PaymentPageComponent>;
  let paymentServiceMock: jest.Mocked<PaymentService>;

  beforeEach(() => {
    paymentServiceMock = {
      initiatePayment: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      declarations: [
        PaymentPageComponent,
        PaymentFormComponent, // Real child component
        PaymentSummaryComponent, // Real child component
      ],
      imports: [ReactiveFormsModule, CommonModule],
      providers: [
        { provide: PaymentService, useValue: paymentServiceMock },
      ],
    });

    fixture = TestBed.createComponent(PaymentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should pass form data from child to service on submit', () => {
    // Arrange
    const formComponent = fixture.debugElement.query(
      By.directive(PaymentFormComponent)
    ).componentInstance;
    const formData = { amount: 100, currency: 'USD' };
    paymentServiceMock.initiatePayment.mockReturnValue(of({ id: '123' }));

    // Act - fill child form and submit
    formComponent.paymentForm.patchValue(formData);
    formComponent.onSubmit();
    fixture.detectChanges();

    // Assert - verify data flow parent component → service
    expect(paymentServiceMock.initiatePayment).toHaveBeenCalledWith(formData);
  });

  it('should update summary component when payment succeeds', fakeAsync(() => {
    // Arrange
    const payment = { id: '123', amount: 100, status: 'completed' };
    paymentServiceMock.initiatePayment.mockReturnValue(of(payment));

    // Act
    component.submitPayment({ amount: 100, currency: 'USD' });
    tick();
    fixture.detectChanges();

    // Assert - verify child component receives updated data
    const summaryComponent = fixture.debugElement.query(
      By.directive(PaymentSummaryComponent)
    ).componentInstance;
    expect(summaryComponent.payment).toEqual(payment);
  }));
});
```

**Interceptor Integration:**

```typescript
// ✅ GOOD: Test HTTP interceptor with real HTTP stack
describe('AuthInterceptor Integration', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let authServiceMock: jest.Mocked<AuthService>;

  beforeEach(() => {
    authServiceMock = {
      getToken: jest.fn().mockReturnValue('test-token-123'),
    } as any;

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi: true,
        },
      ],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should add Authorization header to outgoing requests', () => {
    // Act
    httpClient.get('/api/payments').subscribe();

    // Assert
    const req = httpTestingController.expectOne('/api/payments');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token-123');
    req.flush({});
  });

  it('should not add header to public endpoints', () => {
    // Act
    httpClient.get('/api/public/status').subscribe();

    // Assert
    const req = httpTestingController.expectOne('/api/public/status');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  it('should refresh token on 401 and retry original request', () => {
    // Arrange
    authServiceMock.getToken
      .mockReturnValueOnce('expired-token')
      .mockReturnValueOnce('new-token');

    // Act
    httpClient.get('/api/payments').subscribe();

    // First request with expired token
    const req1 = httpTestingController.expectOne('/api/payments');
    expect(req1.request.headers.get('Authorization')).toBe('Bearer expired-token');
    req1.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

    // Retry with new token
    const req2 = httpTestingController.expectOne('/api/payments');
    expect(req2.request.headers.get('Authorization')).toBe('Bearer new-token');
    req2.flush({ data: 'success' });
  });
});
```

#### 3. Test Data Builders Pattern

```typescript
// ✅ GOOD: Test data builder for complex objects
export class PaymentBuilder {
  private payment: Partial<Payment> = {
    id: 'default-id',
    amount: 100,
    currency: 'USD',
    status: 'pending',
    createdAt: new Date('2025-01-01'),
  };

  withId(id: string): this {
    this.payment.id = id;
    return this;
  }

  withAmount(amount: number): this {
    this.payment.amount = amount;
    return this;
  }

  withCurrency(currency: string): this {
    this.payment.currency = currency;
    return this;
  }

  withStatus(status: PaymentStatus): this {
    this.payment.status = status;
    return this;
  }

  pending(): this {
    return this.withStatus('pending');
  }

  completed(): this {
    return this.withStatus('completed');
  }

  failed(): this {
    return this.withStatus('failed');
  }

  build(): Payment {
    return this.payment as Payment;
  }
}

// Usage in tests
describe('PaymentService', () => {
  it('should filter completed payments', () => {
    // Arrange
    const payments = [
      new PaymentBuilder().pending().withId('1').build(),
      new PaymentBuilder().completed().withId('2').build(),
      new PaymentBuilder().failed().withId('3').build(),
      new PaymentBuilder().completed().withId('4').build(),
    ];

    // Act
    const completed = service.filterCompleted(payments);

    // Assert
    expect(completed).toHaveLength(2);
    expect(completed.map((p) => p.id)).toEqual(['2', '4']);
  });
});
```

#### 4. Deterministic Test Practices

```typescript
// ❌ BAD: Non-deterministic tests
describe('DateService (BAD)', () => {
  it('should format current date', () => {
    const result = service.formatCurrentDate();
    expect(result).toBe('2025-11-25'); // ❌ Fails on different days!
  });

  it('should wait for async operation', (done) => {
    setTimeout(() => {
      expect(service.getValue()).toBe(10);
      done();
    }, 100); // ❌ Flaky timing dependency
  });
});

// ✅ GOOD: Deterministic tests with controlled dependencies
describe('DateService', () => {
  let clockMock: jest.Mocked<Clock>;

  beforeEach(() => {
    clockMock = {
      now: jest.fn().mockReturnValue(new Date('2025-11-25T10:00:00Z')),
    } as any;
    service = new DateService(clockMock);
  });

  it('should format current date using injected clock', () => {
    const result = service.formatCurrentDate();
    expect(result).toBe('2025-11-25'); // ✅ Always passes
  });
});

describe('AsyncService', () => {
  it('should complete async operation', fakeAsync(() => {
    // Arrange
    service.startOperation();

    // Act - control time explicitly
    tick(100);

    // Assert
    expect(service.getValue()).toBe(10); // ✅ Deterministic
  }));
});

// ✅ GOOD: Deterministic random values
describe('IdGenerator', () => {
  beforeEach(() => {
    // Seed random number generator for deterministic results
    Math.random = jest.fn()
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.8);
  });

  it('should generate predictable IDs in test', () => {
    expect(service.generateId()).toBe('id-5000'); // ✅ Predictable
    expect(service.generateId()).toBe('id-8000'); // ✅ Predictable
  });
});
```

#### 5. Mutation Testing Configuration

**Stryker Configuration (stryker.conf.json):**

```json
{
  "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  "packageManager": "npm",
  "reporters": ["html", "clear-text", "progress", "dashboard"],
  "testRunner": "jest",
  "coverageAnalysis": "perTest",
  "mutate": [
    "src/**/*.ts",
    "!src/**/*.spec.ts",
    "!src/**/*.test.ts",
    "!src/**/*.mock.ts",
    "!src/**/test-helpers/**",
    "!src/main.ts",
    "!src/environments/**"
  ],
  "thresholds": {
    "high": 80,
    "low": 70,
    "break": 70
  },
  "incremental": true,
  "incrementalFile": ".stryker-tmp/incremental.json",
  "ignorePatterns": [
    "dist",
    "coverage",
    "node_modules"
  ]
}
```

**Nx Configuration for Scoped Mutation Testing:**

```json
// project.json
{
  "targets": {
    "test": {
      "executor": "@nx/jest:jest",
      "options": {
        "jestConfig": "jest.config.ts",
        "passWithNoTests": false
      }
    },
    "mutation-test": {
      "executor": "nx:run-commands",
      "options": {
        "command": "npx stryker run --incremental"
      }
    },
    "mutation-test-pr": {
      "executor": "nx:run-commands",
      "options": {
        "command": "npx stryker run --incremental --mutate $(git diff --name-only origin/main | grep -E '\\.ts$' | grep -v '\\.spec\\.ts$' | tr '\\n' ',')"
      }
    }
  }
}
```

### Standards compliance

- [x] Angular testing best practices followed (TestBed, fakeAsync, HttpTestingController)
- [x] Jest conventions and matchers used consistently
- [x] Nx monorepo patterns for test organization
- [x] CI/CD pipeline quality gates enforced
- [x] Coverage and mutation thresholds defined
- [x] Test isolation and parallelization enabled

### Quality attributes addressed

| Quality Attribute | Requirement | How Decision Addresses It |
|-------------------|-------------|---------------------------|
| **Fast Feedback** | Unit tests < 5 min, Integration < 10 min | Enforce test layer boundaries; unit tests have zero I/O; integration uses Testcontainers with parallel execution |
| **Determinism** | Zero flaky tests tolerated | Mandatory mocked Clock/RNG; no setTimeout; fakeAsync for time control; containerized dependencies with fixed ports |
| **Maintainability** | Tests survive refactoring | Focus on behavior over implementation; use test builders; clear AAA structure; meaningful test names |
| **Effectiveness** | Tests catch real defects | Mutation testing with 70% minimum score ensures tests verify actual behavior, not just coverage |
| **Scalability** | Test suite grows linearly with code | Pyramid structure (70-80% unit) keeps most tests fast; Nx caching and affected commands optimize CI time |
| **Confidence** | Safe to deploy on green tests | High-quality lower-layer tests catch defects before expensive E2E; blockers on PR gate |

## Consequences

### Positive consequences

1. **Faster feedback loops:** Unit tests run in seconds, enabling true TDD workflows
2. **Higher defect detection rate:** Mutation testing ensures tests actually verify behavior
3. **Reduced CI pipeline time:** 70-80% of tests run in < 5 minutes vs slow E2E
4. **Lower maintenance burden:** Deterministic tests eliminate flake-related toil
5. **Improved code design:** Testable code requires better separation of concerns and dependency injection
6. **Increased developer confidence:** Comprehensive unit/integration coverage enables fearless refactoring
7. **Better documentation:** Tests serve as living documentation of component behavior
8. **Reduced cost per defect:** Catching bugs at unit/integration layer costs 10-100x less than production

### Negative consequences

1. **Initial learning curve:** Teams need training on test builders, Testcontainers, mutation testing
2. **Setup complexity:** Testcontainers require Docker in CI environment
3. **Test code volume:** Comprehensive tests may equal or exceed production code size
4. **CI resource usage:** Parallel test execution and mutation testing require more CI compute
5. **Discipline required:** Teams must resist shortcuts (inadequate mocking, I/O in unit tests)
6. **Mocking overhead:** Solitary unit tests require careful mock setup and maintenance
7. **Potential over-testing:** Risk of testing trivial getters/setters instead of behavior

### Risks and mitigation

| Risk | Probability | Impact | Mitigation Strategy | Owner |
|------|-------------|---------|---------------------|-------|
| Teams write tests for coverage, not quality | High | High | Mutation testing catches ineffective tests; code review checklist enforces standards | Engineering Managers |
| Testcontainers slow down CI | Medium | Medium | Parallel execution; Docker layer caching; limit integration tests to critical boundaries | Platform/DevOps |
| Flaky tests slip through | Medium | High | Zero-tolerance policy; automatic quarantine on first flake; weekly deflake reviews | QA Leads |
| Mutation testing too slow for PR gate | Medium | Medium | Scope to changed files only in PR; full run in nightly; incremental mode with caching | Platform/DevOps |
| Over-mocking leads to false confidence | Medium | High | Require integration tests for all real boundaries; Contract tests (CDC) for external APIs | QA Leads |
| Test maintenance burden grows | High | Medium | Promote test builders and shared fixtures; refactor tests alongside production code | Development Teams |

## Code Review Checklist

### Unit Tests - Required Checks

**Test Structure:**
- [ ] All tests follow AAA pattern (Arrange-Act-Assert) with clear sections
- [ ] Test names describe behavior, not implementation (format: `should [behavior] when [condition]`)
- [ ] Each test verifies ONE behavior/outcome
- [ ] No duplicate test logic (use `describe.each` or `it.each` for parameterized tests)
- [ ] Tests are independent (can run in any order, in parallel)

**Isolation & Mocking:**
- [ ] Unit tests have ZERO I/O (no HTTP, database, filesystem, network calls)
- [ ] All external dependencies are mocked/stubbed (services, HTTP, timers)
- [ ] For solitary tests: all collaborators are test doubles
- [ ] For sociable tests: only in-process collaborators used, no I/O
- [ ] No `TestBed` usage unless testing Angular-specific features (DI, components)
- [ ] No real `HttpClient` - use mocks for unit tests, `HttpClientTestingModule` for integration

**Determinism:**
- [ ] No `setTimeout`/`setInterval` - use `fakeAsync` and `tick()` instead
- [ ] No `new Date()` in production code - inject `Clock` service
- [ ] No `Math.random()` without seeding in tests
- [ ] No hard-coded delays or race conditions
- [ ] No dependencies on test execution order

**Angular-Specific:**
- [ ] Component tests don't test Angular internals (e.g., change detection mechanism)
- [ ] Template tests focus on user-visible behavior, not DOM structure details
- [ ] NgRx tests: reducers and selectors are pure function tests
- [ ] NgRx effects: use `provideMockActions()` and marble testing
- [ ] Pipes tested as pure functions with direct instantiation
- [ ] Guards tested with mocked dependencies

**Coverage & Quality:**
- [ ] New code has ≥ 80% line coverage
- [ ] New code has ≥ 80% branch coverage
- [ ] Edge cases covered (null, undefined, empty arrays, error states)
- [ ] Error handling paths tested (catch blocks, error callbacks)
- [ ] No tests that only assert `expect(true).toBe(true)` or similar no-ops

**Anti-Patterns to Reject:**
- [ ] ❌ No tests of private methods/properties (test public API only)
- [ ] ❌ No implementation details tested (e.g., `expect(component['_internalFlag']).toBe(true)`)
- [ ] ❌ No comments explaining why test should pass (code should be self-documenting)
- [ ] ❌ No console.log statements left in test code
- [ ] ❌ No disabled tests (`xit`, `xdescribe`) without a linked ticket
- [ ] ❌ No `any` types in test code without justification

### Integration Tests - Required Checks

**Scope & Boundaries:**
- [ ] Tests focus on real boundary crossings (service ↔ API, service ↔ DB)
- [ ] External third-party services are stubbed/sandboxed
- [ ] Test verifies serialization, data flow, and contract correctness
- [ ] Tests don't duplicate unit test coverage (focus on integration concerns)

**Test Environment:**
- [ ] HTTP integration tests use `HttpClientTestingModule`
- [ ] Database integration tests use Testcontainers or in-memory DB
- [ ] All HTTP requests verified with `httpTestingController.verify()` in `afterEach`
- [ ] Containers start in `beforeAll`, stop in `afterAll`
- [ ] Database cleaned between tests (`beforeEach` or transaction rollback)

**Determinism & Isolation:**
- [ ] Tests use unique, random container ports (no port conflicts)
- [ ] Tests seed their own test data (no shared fixtures)
- [ ] Tests can run in parallel without conflicts
- [ ] No dependencies on external services (everything containerized or mocked)
- [ ] Container startup timeout set appropriately (≥ 60 seconds)

**Data Quality:**
- [ ] Test data is synthetic (no PII, no production data)
- [ ] Test data uses deterministic IDs/seeds
- [ ] Test data covers realistic scenarios (edge cases, validation failures)
- [ ] Database schema migrations applied before tests

**HTTP-Specific:**
- [ ] Request serialization tested (body, headers, query params)
- [ ] Response deserialization tested (JSON parsing, type mapping)
- [ ] Error responses tested (4xx, 5xx status codes)
- [ ] Retry logic tested (network failures, timeouts)
- [ ] Authentication/authorization headers tested

**Performance:**
- [ ] Integration test suite runs in < 10 minutes
- [ ] Individual integration tests complete in < 30 seconds
- [ ] Container startup/teardown optimized (shared containers where safe)
- [ ] No unnecessary waits or polling loops

### Mutation Testing - Required Checks

**Configuration:**
- [ ] Stryker config includes thresholds (70% minimum for new code)
- [ ] Incremental mode enabled (`.stryker-tmp/incremental.json`)
- [ ] PR gate scoped to changed files only
- [ ] Nightly build runs full mutation scan
- [ ] Test files, mocks, and test helpers excluded from mutation

**Quality Gates:**
- [ ] PR mutation test runs in < 5 minutes (scoped to changes)
- [ ] Mutation score ≥ 70% for changed files (blocker)
- [ ] Build fails if mutation threshold not met
- [ ] Mutation report uploaded to dashboard/artifact storage

**Analysis:**
- [ ] Surviving mutants reviewed and justified (or tests added)
- [ ] No ignored mutants without ticket reference
- [ ] No blanket mutant suppressions

### General Testing Hygiene

**Organization:**
- [ ] Test files colocated with source files (`*.spec.ts` next to `*.ts`)
- [ ] Test helpers in dedicated `testing/` folder
- [ ] Test builders in `testing/builders/` folder
- [ ] Shared fixtures in `testing/fixtures/` folder
- [ ] Mock factories in `testing/mocks/` folder

**Documentation:**
- [ ] Complex test setups have explanatory comments
- [ ] Test builders documented with usage examples
- [ ] README includes how to run tests locally
- [ ] README documents any special test environment setup

**CI/CD:**
- [ ] Tests pass locally before pushing
- [ ] Tests run on every PR (no skipped test jobs)
- [ ] Test results visible in PR (comment/check)
- [ ] Coverage report published and visible
- [ ] Mutation report published (nightly)

**Maintenance:**
- [ ] No flaky tests (if flaky, quarantine with ticket)
- [ ] No TODO comments without linked tickets
- [ ] No skipped tests without expiration date
- [ ] Test cleanup mirrors test setup (no resource leaks)
- [ ] Deprecated test helpers removed

## Success metrics

### Technical success criteria

**Coverage Metrics:**
- 80% line coverage on new code (enforced PR gate) ✅
- 70% mutation score on changed files (enforced PR gate) ✅
- ≤ 5 minutes for unit test suite per library/app ✅
- ≤ 10 minutes for integration test suite per library/app ✅

**Quality Metrics:**
- Zero flaky tests in last 30 days ✅
- 100% of tests pass first time (no reruns required) ✅
- Test-to-code ratio ≥ 1:1 ✅
- Zero disabled tests without tickets ✅

**Adoption Metrics:**
- 100% of new PRs meet coverage threshold ✅
- 90% of new PRs pass mutation testing ✅
- 100% of integration tests use Testcontainers or HttpClientTestingModule ✅
- 100% of new tests follow AAA pattern ✅

### Business success criteria

**DORA Metrics Impact (within 6 months):**
- Deployment frequency: Increase by 50% ✅
- Lead time for changes: Decrease by 30% ✅
- Change failure rate: Decrease by 40% ✅
- Mean time to restore (MTTR): Decrease by 50% ✅

**Efficiency Metrics:**
- Reduce defect escape rate to production by 50% ✅
- Reduce manual QA effort by 30% through automation ✅
- Reduce time spent debugging flaky tests by 90% ✅
- Reduce post-production hotfixes by 60% ✅

**Team Satisfaction:**
- Developer confidence in refactoring (survey): ≥ 8/10 ✅
- CI pipeline reliability perception: ≥ 9/10 ✅
- Test maintenance burden perception: ≤ 3/10 ✅

### Monitoring and measurement

**Dashboards:**
- Coverage trends per project (weekly)
- Mutation score trends per project (weekly)
- Test execution time trends (daily)
- Flaky test tracking (real-time)
- PR quality gate pass/fail rates (daily)

**Tools:**
- Jest coverage reports → SonarQube/Codecov
- Stryker mutation reports → Stryker Dashboard
- CI metrics → Jenkins/GitHub Actions analytics
- DORA metrics → Jellyfish/LinearB/custom dashboard

**Review Schedule:**
- Weekly: Flaky test triage meeting (QA + Platform)
- Monthly: Test metrics review (Engineering Managers)
- Quarterly: DORA metrics impact analysis (Leadership)
- Quarterly: ADR retrospective and refinement

## References

### Authoritative sources

- **Testing Strategy Document** - `/docs/exports/Testing strategy.md` - Complete testing approach
- **ISTQB Glossary** - http://glossary.istqb.org/en_US/ - Industry testing terminology
- **The Practical Test Pyramid** - https://martinfowler.com/articles/practical-test-pyramid.html - Martin Fowler
- **Angular Testing Guide** - https://angular.io/guide/testing - Official Angular documentation
- **Jest Documentation** - https://jestjs.io/ - Test runner and matchers
- **Testcontainers** - https://testcontainers.com/ - Container-based integration testing

### Technical references

- **Angular Testing Library** - https://testing-library.com/docs/angular-testing-library/intro/
- **Stryker Mutator** - https://stryker-mutator.io/ - Mutation testing framework
- **DORA Metrics** - https://dora.dev/guides/dora-metrics-four-keys/ - DevOps performance measurement
- **Martin Fowler - Unit Test** - https://martinfowler.com/bliki/UnitTest.html - Solitary vs Sociable
- **Test-Driven Development** - https://martinfowler.com/bliki/TestDrivenDevelopment.html
- **Behavior-Driven Development** - https://cucumber.io/docs/bdd/

### Standards compliance

- **ISO/IEC/IEEE 42010:2022** - Systems and software engineering — Architecture description
- **ISTQB Testing Levels** - Unit, Integration, System, Acceptance
- **Angular Style Guide** - https://angular.io/guide/styleguide - Official coding standards
- **Clean Code Principles** - Applied to test code (DRY, Single Responsibility, Meaningful Names)

### Related external resources

- **Nx Testing Documentation** - https://nx.dev/recipes/jest/test
- **RxJS Testing** - https://rxjs.dev/guide/testing/marble-testing - Marble diagrams for observables
- **TypeScript Deep Dive - Testing** - https://basarat.gitbook.io/typescript/intro-1/jest
