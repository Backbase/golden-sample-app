# ADR-005: Front-End Performance Standards for Banking Applications

## 1. Summary

<!-- LLM: Always load this section first -->

### TL;DR

> All front-end applications must implement lazy loading, server-side pagination for large datasets, request throttling, and efficient caching to ensure optimal user experience. Performance metrics are enforced through CI/CD gates with Core Web Vitals meeting "Good" thresholds.

### Rules

**MUST DO ✅**

1. Lazy-load all feature modules via routing
2. Use server-side pagination for lists with potentially > 50 items
3. Apply debouncing (≥300ms) on search inputs and user-triggered requests
4. Use `distinctUntilChanged` and `switchMap` for HTTP request optimization
5. Unsubscribe all subscriptions using `takeUntil`, async pipe, or explicit unsubscribe
6. Enforce bundle size budgets in CI/CD pipeline
7. Track Core Web Vitals in production

**MUST NOT ❌**

1. Load unlimited data from APIs (`size=1000000`)
2. Download large datasets for client-side slicing (`slice(0, 20)`)
3. Fire search requests on every keystroke without debouncing
4. Leave subscriptions unsubscribed causing memory leaks
5. Eagerly import feature modules in app.module that should be lazy-loaded
6. Use `import * as` when tree-shakeable imports are available
7. Hardcode page size > 100 without explicit justification

---

## 2. Patterns

<!-- LLM: Load for code generation tasks -->

<!-- 
Cross-reference: For subscription cleanup (takeUntil) pattern, see ADR-000 Pattern 1.
-->

### Pattern Index

| Keywords | Pattern |
|----------|---------|
| lazy, module, route, loadChildren | [Pattern 1: Lazy Loading](#pattern-1-lazy-loading) |
| pagination, infinite scroll, list, load more | [Pattern 2: Server-Side Pagination](#pattern-2-server-side-pagination) |
| debounce, throttle, search, switchMap | [Pattern 3: Request Throttling](#pattern-3-request-throttling) |
| cache, interceptor, shareReplay | [Pattern 4: HTTP Caching](#pattern-4-http-caching) |
| subscribe, memory leak, takeUntil, destroy | [Pattern 5: Subscription Management](#pattern-5-subscription-management) |

---

### Pattern 1: Lazy Loading

**Use when:** Loading feature modules, heavy components, or charting libraries

**Don't use when:** Core application components needed on initial load

✅ **Good**

```typescript
// CONTEXT: Route configuration for feature module
// RULE: Lazy load feature modules via dynamic import

const routes: Routes = [
  {
    path: 'accounts',
    loadChildren: () => import('./accounts/accounts.module').then(m => m.AccountsModule),
    data: { preload: true }
  },
  {
    path: 'payments',
    loadChildren: () => import('./payments/payments.module').then(m => m.PaymentsModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
```

❌ **Bad**

```typescript
// PROBLEM: Eagerly importing modules increases initial bundle size

@NgModule({
  imports: [
    AccountsModule,
    PaymentsModule,
    TransfersModule
  ]
})
export class AppModule {}
```

**Why it's wrong:** Eager imports add to the initial bundle, increasing load time by 60-80%. Feature modules should be loaded only when the user navigates to them.

**Verify:**
- [ ] Feature modules use `loadChildren` in routes
- [ ] No feature module imports in `app.module.ts`
- [ ] Preloading strategy defined for critical user paths
- [ ] Heavy libraries use dynamic import

---

### Pattern 2: Server-Side Pagination

**Use when:** Lists can potentially contain > 50 items

**Don't use when:** Static, small datasets with < 50 items guaranteed

✅ **Good**

```typescript
// CONTEXT: Transaction list with infinite scroll
// RULE: Use server-side pagination, never load full dataset

@Component({
  selector: 'app-transaction-list',
  template: `
    <div class="transaction-list" 
         infiniteScroll
         [infiniteScrollDistance]="2"
         [infiniteScrollThrottle]="300"
         (scrolled)="loadMore()">
      <app-transaction-item 
        *ngFor="let transaction of transactions$ | async"
        [transaction]="transaction">
      </app-transaction-item>
      <div *ngIf="loading$ | async" class="loading-spinner"></div>
    </div>
  `
})
export class TransactionListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  private pageSubject = new BehaviorSubject<number>(0);
  
  loading$ = new BehaviorSubject<boolean>(false);
  hasMore$ = new BehaviorSubject<boolean>(true);
  transactions$: Observable<Transaction[]>;

  ngOnInit() {
    this.transactions$ = this.pageSubject.pipe(
      tap(() => this.loading$.next(true)),
      switchMap(page => 
        this.transactionService.getPage({ page, size: 20 })
      ),
      tap(response => {
        this.loading$.next(false);
        this.hasMore$.next(response.currentPage < response.totalPages - 1);
      }),
      scan((acc, response) => [...acc, ...response.content], [] as Transaction[]),
      takeUntil(this.destroy$)
    );
  }

  loadMore() {
    if (!this.loading$.value && this.hasMore$.value) {
      this.pageSubject.next(this.pageSubject.value + 1);
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

❌ **Bad**

```typescript
// PROBLEM: Client-side pagination of large dataset wastes bandwidth

this.http.get('/api/transactions?size=10000').pipe(
  map(data => data.slice(0, 20))
)
```

**Why it's wrong:** Downloads 10,000 items to display 20. This wastes bandwidth, memory, and can crash the browser on mobile devices.

**Verify:**
- [ ] API requests include `page` and `size` parameters
- [ ] Page size ≤ 100
- [ ] Loading indicator shown during fetch
- [ ] No client-side `slice()` on API responses

---

### Pattern 3: Request Throttling

**Use when:** Search inputs, autocomplete, any user-triggered repeated requests

**Don't use when:** Single action requests like form submission

✅ **Good**

```typescript
// CONTEXT: Search input with API call
// RULE: Debounce and deduplicate requests

@Component({
  selector: 'app-search',
  template: `
    <input [formControl]="searchControl" placeholder="Search transactions..." />
    <div *ngFor="let result of searchResults$ | async">
      {{ result.description }}
    </div>
  `
})
export class SearchComponent implements OnInit {
  searchControl = new FormControl('');
  searchResults$: Observable<Transaction[]>;

  ngOnInit() {
    this.searchResults$ = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(query => 
        query.length >= 3 
          ? this.searchService.search(query) 
          : of([])
      )
    );
  }
}
```

❌ **Bad**

```typescript
// PROBLEM: No debouncing causes request on every keystroke

this.searchControl.valueChanges.pipe(
  switchMap(query => this.search(query))
)
```

**Why it's wrong:** Fires API request on every keystroke, overloading the server and causing UI jank. A user typing "transfer" would trigger 8 requests instead of 1.

**Verify:**
- [ ] `debounceTime(300)` or higher applied
- [ ] `distinctUntilChanged()` prevents duplicate requests
- [ ] `switchMap` cancels outdated requests
- [ ] Minimum query length check before API call

---

### Pattern 4: HTTP Caching

**Use when:** Reference data, user profile, accounts list that don't change frequently

**Don't use when:** Real-time data, transaction lists that must be current

✅ **Good**

```typescript
// CONTEXT: HTTP interceptor for caching GET requests
// RULE: Cache responses with TTL and request deduplication

@Injectable()
export class CachingInterceptor implements HttpInterceptor {
  private cache = new Map<string, CacheEntry>();
  private inFlightRequests = new Map<string, Observable<HttpEvent<any>>>();
  
  private cacheConfig = new Map<string, number>([
    ['/api/user/accounts', 5 * 60 * 1000],
    ['/api/reference-data/currencies', 60 * 60 * 1000],
    ['/api/user/profile', 10 * 60 * 1000],
  ]);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== 'GET') {
      return next.handle(req);
    }

    const cacheTTL = this.getCacheTTL(req.url);
    if (cacheTTL === null) {
      return next.handle(req);
    }

    const cacheKey = req.urlWithParams;
    
    const cachedEntry = this.cache.get(cacheKey);
    if (cachedEntry && this.isCacheValid(cachedEntry, cacheTTL)) {
      return of(cachedEntry.response.clone());
    }

    const inFlight = this.inFlightRequests.get(cacheKey);
    if (inFlight) {
      return inFlight;
    }

    const request$ = next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.set(cacheKey, { response: event.clone(), timestamp: Date.now() });
          this.inFlightRequests.delete(cacheKey);
        }
      }),
      shareReplay(1)
    );

    this.inFlightRequests.set(cacheKey, request$);
    return request$;
  }
}
```

❌ **Bad**

```typescript
// PROBLEM: Multiple components making duplicate requests for same data

// Component A
this.http.get('/api/user/accounts').subscribe(accounts => this.accounts = accounts);

// Component B
this.http.get('/api/user/accounts').subscribe(accounts => this.accounts = accounts);

// Component C  
this.http.get('/api/user/accounts').subscribe(accounts => this.accounts = accounts);
```

**Why it's wrong:** Three identical requests fire simultaneously. Without caching or request deduplication, server load triples unnecessarily.

**Verify:**
- [ ] Cache TTL defined and documented
- [ ] Cache invalidation strategy exists
- [ ] In-flight request deduplication implemented
- [ ] Sensitive data caching has security review

---

### Pattern 5: Subscription Management

<!-- See ADR-000 Pattern 1: Subscription Cleanup (takeUntil) for complete pattern -->

**Rule:** Every `.subscribe()` must have corresponding cleanup. Use `takeUntil(destroy$)` pattern or prefer `async` pipe.

**Quick Reference:**
- **Use when:** Any component with Observable subscriptions
- **Don't use when:** Using `async` pipe (handles unsubscription automatically)
- **Verify:** Every subscription has cleanup, prefer async pipe where possible

For full code examples, see **ADR-000 Pattern 1: Subscription Cleanup**.

---

## 3. Validation

<!-- LLM: Load for code review tasks -->

### Automated Checks

| ID | Check | Severity | How to Detect |
|----|-------|----------|---------------|
| `PERF-001` | No unlimited API requests | 🔴 BLOCKER | `grep -r "size=10000\|size=1000000"` |
| `PERF-002` | Debouncing on search inputs | 🔴 BLOCKER | `grep -r "valueChanges" --include="*.ts"` then verify `debounceTime` |
| `PERF-003` | Lazy loading via routes | 🔴 BLOCKER | `grep -r "loadChildren" src/app` |
| `PERF-004` | No eager feature imports | 🔴 BLOCKER | Check `app.module.ts` for feature module imports |
| `PERF-005` | Bundle budgets defined | 🟡 WARNING | Check `angular.json` or `project.json` for budgets |
| `PERF-006` | Tree-shakeable imports | 🟡 WARNING | `grep -r "import \* as" --include="*.ts"` |

### Review Checklist

| ID | Check | Severity |
|----|-------|----------|
| `PERF-R01` | Subscriptions properly unsubscribed (takeUntil or async pipe) | 🔴 BLOCKER |
| `PERF-R02` | Server-side pagination for lists > 50 items | 🔴 BLOCKER |
| `PERF-R03` | Caching strategy documented with TTL and invalidation | 🔴 BLOCKER |
| `PERF-R04` | No duplicate requests for same data in same view | 🔴 BLOCKER |
| `PERF-R05` | Heavy libraries dynamically imported | 🟡 WARNING |
| `PERF-R06` | Performance impact documented in PR description | 🟡 WARNING |

### Required Tests

| Scenario | Type | Required |
|----------|------|----------|
| Bundle size comparison | Build | ✅ Yes |
| Lighthouse performance score ≥ 90 | Automated | ✅ Yes |
| No duplicate network requests | Manual/DevTools | ✅ Yes |
| Memory leak detection (complex features) | Manual/DevTools | ⚪ Optional |

---

## 4. Context

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding the historical context.
-->

### Problem

Banking applications have varying performance levels: large bundle sizes, redundant API calls, client-side processing of large datasets, and no consistent caching strategies.

### Business Drivers

- User trust requires fast, responsive applications
- Poor performance leads to abandoned transactions
- Some jurisdictions require adequate performance for accessibility

### Technical Constraints

- Cross-browser support (Chrome, Firefox, Safari, Edge)
- Network conditions vary (fiber to 3G)
- Nx workspace CI/CD integration

---

## 5. Decision

<!-- 
LLM: SKIP this section unless user asks "why" questions about the decision.
This section is for human readers understanding decision rationale.
-->

### What We Decided

Lazy-load all feature modules, use server-side pagination for lists >50 items, implement request debouncing (≥300ms), enforce bundle budgets in CI/CD, and track Core Web Vitals in production.

### Rationale

| Choice | Why |
|--------|-----|
| Lazy loading | Reduces initial bundle 60-80%, improves Time to Interactive |
| Server-side pagination | Prevents browser crashes, reduces memory on mobile |
| Request debouncing | Reduces server load, prevents unnecessary API calls |
| Core Web Vitals | Industry standard (Google), proactive issue detection |

---

## 6. Implementation

### Affected Components

| Component | Impact | Files |
|-----------|--------|-------|
| Routing modules | MODIFY | `*-routing.module.ts` |
| List components | MODIFY | `*-list.component.ts` |
| Services | MODIFY | `*.service.ts` |
| HTTP Interceptors | CREATE/MODIFY | `*-interceptor.ts` |
| Build configuration | MODIFY | `project.json`, `angular.json` |

### Related ADRs

| ADR | Relationship |
|-----|--------------|
| ADR-012: NgRx State Management | Related to - state management patterns |
| ADR-013: Unit/Integration Testing | Related to - performance testing requirements |

### Migration Notes

Existing applications should:
1. Audit current bundle sizes using `npm run build:analyze`
2. Identify eagerly loaded modules and convert to lazy loading
3. Replace client-side pagination with server-side implementations
4. Add debouncing to all search inputs
5. Implement caching interceptor for reference data endpoints

---

## 7. Examples

### Complete Example

**Scenario:** Paginated data service with request deduplication and caching

```typescript
// File: libs/shared/data-access/paginated-data.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject, ReplaySubject, merge } from 'rxjs';
import { switchMap, shareReplay, startWith, distinctUntilChanged, tap } from 'rxjs/operators';

export interface PaginationParams {
  page: number;
  size: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface PagedResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
}

@Injectable()
export class PaginatedDataService<T> {
  private readonly refreshRequest$ = new Subject<void>();
  private readonly listParams$ = new ReplaySubject<PaginationParams>(1);
  
  public readonly items$: Observable<PagedResponse<T>> = this.listParams$.pipe(
    distinctUntilChanged((a, b) => a.page === b.page && a.size === b.size),
    switchMap(params =>
      merge(this.refreshRequest$.pipe(startWith(undefined))).pipe(
        switchMap(() => this.fetchData(params))
      )
    ),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  constructor(private http: HttpClient, private endpoint: string) {}

  private fetchData(params: PaginationParams): Observable<PagedResponse<T>> {
    let httpParams = new HttpParams()
      .set('page', params.page.toString())
      .set('size', params.size.toString());

    if (params.sort) {
      httpParams = httpParams.set('sort', params.sort);
      httpParams = httpParams.set('order', params.order || 'asc');
    }

    return this.http.get<PagedResponse<T>>(this.endpoint, { params: httpParams });
  }

  updateParams(params: PaginationParams): void {
    this.listParams$.next(params);
  }

  refresh(): void {
    this.refreshRequest$.next();
  }
}
```

### Common Mistakes

**Mistake 1: Loading unlimited data**

```typescript
// ❌ Wrong
this.http.get('/api/transactions?size=1000000')

// ✅ Fix
this.http.get('/api/transactions?page=0&size=20')
```

**Mistake 2: Client-side filtering of large dataset**

```typescript
// ❌ Wrong
this.http.get('/api/transactions?size=10000').pipe(
  map(data => data.filter(t => t.amount > 100))
)

// ✅ Fix
this.http.get('/api/transactions?minAmount=100&page=0&size=20')
```

**Mistake 3: No cleanup on subscriptions**

See **ADR-000 Pattern 1: Subscription Cleanup** for the `takeUntil` pattern. Never leave subscriptions unmanaged.

---

## 8. References

- [Backbase Community: Lazy Loading Guide](https://community.backbase.com) — Definitive guide for lazy loading implementation
- [Angular Performance Guide](https://angular.io/guide/performance-best-practices) — Official Angular performance recommendations
- [Web.dev Performance](https://web.dev/performance/) — Google's web performance best practices
- [Core Web Vitals](https://web.dev/vitals/) — Google's user-centric performance metrics
- [Angular Lazy Loading](https://angular.io/guide/lazy-loading-ngmodules) — v15+ documentation
- [RxJS Operators](https://rxjs.dev/guide/operators) — Observable patterns and operators
- [Nx Build Performance](https://nx.dev/recipes/tips-n-tricks/performance) — Nx-specific optimizations
- [RAIL Performance Model](https://web.dev/rail/) — Response, Animation, Idle, Load
- [Angular CDK Virtual Scrolling](https://material.angular.io/cdk/scrolling/overview) — Virtual scroll implementation
- [webpack Bundle Analyzer](https://github.com/webpack-contrib/webpack-bundle-analyzer) — Bundle analysis tool
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci) — Automated performance testing

---
