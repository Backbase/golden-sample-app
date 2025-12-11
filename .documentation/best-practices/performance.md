<!-- .documentation/best-practices/performance.md -->

### Performance Optimization

This section covers performance best practices and optimization techniques used in this application.

###### Change Detection Optimization

Use OnPush change detection strategy everywhere:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {
  items = input<Item[]>();
  selected = signal(null);
}
```

Benefits:
- Component only checks for changes when inputs or signals change
- Reduced change detection cycles from O(n) to O(1) in many cases
- Signals are perfect for this strategy

###### Memoization with Computed

Use `computed()` to avoid expensive calculations:

```typescript
// ❌ Bad - recalculates every change detection cycle
get filteredItems(): Item[] {
  return this.items().filter(item => item.status === 'active');
}

// ✅ Good - calculates only when dependencies change
filteredItems = computed(() =>
  this.items().filter(item => item.status === 'active')
);
```

###### Lazy Loading Routes

Always lazy-load feature routes:

```typescript
// ✅ Good - bundle only loads when accessed
const routes: Routes = [
  {
    path: 'transactions',
    loadChildren: () => import('./transactions.bundle'),
  },
];

// Initial bundle size: ~50KB
// After navigating to transactions: +20KB (transactions bundle)
```

Without lazy loading, the main bundle would include all features (+200KB).

###### Image Optimization

Use `NgOptimizedImage` for all images:

```typescript
import { NgOptimizedImage } from '@angular/common';

@Component({
  imports: [NgOptimizedImage],
  template: `
    <!-- Always use ngSrc, not src -->
    <img 
      ngSrc="assets/logo.png" 
      width="100" 
      height="100" 
      alt="Logo"
    />
    <!-- Optional: priority for above-the-fold images -->
    <img 
      ngSrc="hero.png" 
      priority 
      width="1200" 
      height="400"
      alt="Hero"
    />
  `,
})
export class AppComponent {}
```

Benefits:
- ✅ Automatic image optimization
- ✅ Responsive image sizing
- ✅ Lazy loading by default
- ✅ Modern formats (WebP, etc.)
- ✅ Content Layout Shift prevention

###### Caching Strategy

**HTTP Response Caching**

```typescript
// Data that changes infrequently
@Injectable({ providedIn: 'root' })
export class UserService {
  private cache = new Map<string, Observable<User>>();

  getUser(id: string): Observable<User> {
    if (!this.cache.has(id)) {
      this.cache.set(
        id,
        this.http.get<User>(`/api/users/${id}`).pipe(
          shareReplay(1)  // Cache the result
        )
      );
    }
    return this.cache.get(id)!;
  }
}
```

**Local Storage for Session Data**

```typescript
@Injectable({ providedIn: 'root' })
export class PreferencesService {
  private storage = inject(SessionStorageService);

  getPreferences(): Preferences {
    // Try cache first
    const cached = this.storage.get<Preferences>('preferences');
    if (cached) return cached;

    // Fall back to API
    return this.http.get<Preferences>('/api/preferences').pipe(
      tap(prefs => this.storage.set('preferences', prefs))
    );
  }
}
```

###### Reducing Bundle Size

**1. Code Splitting**
- Routes are lazy-loaded (already done)
- Each journey is a separate bundle

**2. Tree Shaking**
- Export specific symbols, not namespaces:
  ```typescript
  // ✅ Good - tree-shakeable
  export const PERMISSIONS = { ... };
  export interface User { }

  // ❌ Bad - bundle includes entire object
  export const Config = {
    permissions: { ... },
    ...
  };
  ```

**3. Removing Unused Dependencies**
- Run `npm audit` to check for unused packages
- Use `npm prune` to remove unused packages
- Check `node_modules` size: `du -sh node_modules`

**4. Update Dependencies**
- Newer versions often include optimizations
- Regularly update: `npm update`

###### Memory Optimization

**Unsubscribe from Observables**

Use the async pipe or destroy subjects:

```typescript
import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// ✅ Good - auto-unsubscribe on destroy
@Component({
  template: `{{ users$ | async }}`
})
export class UsersComponent {
  users$ = inject(UserService).getUsers();
}

// ✅ Good - manual cleanup with takeUntil
@Component({...})
export class UsersComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  users$: Observable<User[]>;

  ngOnInit() {
    this.users$ = inject(UserService).getUsers().pipe(
      takeUntil(this.destroy$)
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

// ❌ Bad - memory leak (observable never unsubscribes)
@Component({...})
export class UsersComponent {
  subscription = inject(UserService).getUsers().subscribe(...);
  // subscription never cleaned up!
}
```

**Cleaning Up Signals**

Unlike observables, signals don't need cleanup:

```typescript
// ✅ Signals don't leak memory
@Component({...})
export class Component {
  users = signal<User[]>([]);
  loading = signal(false);
  // No cleanup needed!
}
```

###### Network Optimization

**Request Batching**

Combine multiple requests:

```typescript
// ❌ Bad - 3 separate requests
this.users$ = this.http.get('/api/users');
this.roles$ = this.http.get('/api/roles');
this.permissions$ = this.http.get('/api/permissions');

// ✅ Better - batched request
this.appData$ = this.http.get('/api/app-data');  // Returns all 3
```

**Request Debouncing**

```typescript
import { debounceTime } from 'rxjs/operators';

searchTerm = signal('');

results$ = toObservable(this.searchTerm).pipe(
  debounceTime(300),  // Wait 300ms after user stops typing
  switchMap(term => this.search(term))
);
```

**Progressive Loading**

```typescript
// Load most important data first
ngOnInit() {
  // 1. Critical data (user info)
  this.userService.loadUser().subscribe();

  // 2. Important data (after user loads)
  this.userService.user$.pipe(
    take(1),
    switchMap(() => this.transactionService.loadTransactions())
  ).subscribe();

  // 3. Nice-to-have data (after a delay)
  timer(2000).pipe(
    switchMap(() => this.analyticsService.loadMetrics())
  ).subscribe();
}
```

###### Rendering Performance

**Virtual Scrolling for Large Lists**

```typescript
import { Component, input } from '@angular/core';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  imports: [ScrollingModule, CommonModule],
  template: `
    <cdk-virtual-scroll-viewport [itemSize]="50" class="list">
      @for (item of items(); trackBy: trackByFn) {
        <div>{{ item.name }}</div>
      }
    </cdk-virtual-scroll-viewport>
  `,
})
export class VirtualListComponent {
  items = input<Item[]>([]);

  trackByFn(index: number, item: Item) {
    return item.id;
  }
}
```

Benefits:
- Only renders visible items
- Smooth scrolling even with 10,000+ items
- Reduced DOM elements

**TrackBy in Loops**

Always provide a trackBy function:

```typescript
// ❌ Bad - recreates DOM for every item
@for (item of items()) {
  <div>{{ item.name }}</div>
}

// ✅ Good - reuses DOM nodes
@for (item of items(); track item.id) {
  <div>{{ item.name }}</div>
}

// ✅ Better - with trackBy method
@for (item of items(); track trackByFn($index, item)) {
  <div>{{ item.name }}</div>
}

trackByFn(index: number, item: Item) {
  return item.id;  // Unique identifier
}
```

###### CSS Performance

**CSS-in-JS vs Stylesheet**

```typescript
// ✅ Prefer external CSS files
@Component({
  selector: 'app-my-component',
  styleUrls: ['./my-component.component.scss'],
  template: `...`,
})
export class MyComponent {}

// ⚠️ Use inline styles only for small components or dynamic styles
@Component({
  selector: 'app-my-component',
  styles: [`
    .container { display: flex; }
  `],
})
export class MyComponent {}
```

**Minimize CSS Calculations**

```scss
// ❌ Avoid complex selectors
.header .nav .item > span[data-active="true"] { }

// ✅ Use direct classes
.nav-item.active { }

// ❌ Avoid nth-child heavily used
.list li:nth-child(2n+1) { }

// ✅ Better
.list li.odd { }
```

###### Monitoring Performance

Use Angular's built-in performance APIs:

```typescript
// Measure component initialization time
@Component({...})
export class MyComponent implements OnInit {
  ngOnInit() {
    performance.mark('component-init-start');
    
    // Initialization code
    
    performance.mark('component-init-end');
    performance.measure(
      'component-init',
      'component-init-start',
      'component-init-end'
    );
  }
}

// Check the measurement
const measure = performance.getEntriesByName('component-init')[0];
console.log(`Initialization took ${measure.duration}ms`);
```

###### Performance Checklist

- [ ] OnPush change detection on all components
- [ ] Lazy-loaded routes for all features
- [ ] TrackBy functions in @for loops
- [ ] NgOptimizedImage for all images
- [ ] Unsubscribed from observables (or use async pipe)
- [ ] No memory leaks (check browser devtools)
- [ ] HTTP response caching where appropriate
- [ ] No unnecessary re-renders (signals, computed)
- [ ] Bundle size < 500KB (initial)
- [ ] First Contentful Paint < 2 seconds

