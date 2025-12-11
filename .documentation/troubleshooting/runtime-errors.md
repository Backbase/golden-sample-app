<!-- .documentation/troubleshooting/runtime-errors.md -->

### Runtime Errors

Errors that occur when the application is running in the browser.

###### Error: "Cannot read property X of undefined"

**Symptom**: `TypeError: Cannot read property 'name' of undefined`

**Cause**: Accessing property on null/undefined value

**Solution**:
Add null checks before accessing properties:

```typescript
// ❌ Will crash if user is undefined
const name = user.name;

// ✅ Safe access
const name = user?.name ?? 'Unknown';

// ✅ Or check explicitly
const name = user ? user.name : 'Unknown';

// ✅ In templates
{{ user?.name || 'Unknown' }}

@if (user) {
  <p>{{ user.name }}</p>
}
```

---

###### Error: "Cannot assign to readonly property"

**Symptom**: Runtime error when trying to modify readonly property

**Solution**:
Use proper update mechanisms:

```typescript
// ❌ Wrong - readonly
data = signal({ name: 'John' });
data.name = 'Jane';  // Error!

// ✅ Correct - use update
data.update(d => ({ ...d, name: 'Jane' }));

// Or set new value
data.set({ name: 'Jane' });
```

---

###### Error: "No provider found for X"

**Symptom**: `NullInjectorError: No provider found for MyService!`

**Cause**: Service not provided in dependency injection

**Solution**:
Add the service to providers:

```typescript
// Option 1: Provide in root
@Injectable({ providedIn: 'root' })
export class MyService {}

// Option 2: Provide in module
@NgModule({
  providers: [MyService],
})
export class MyModule {}

// Option 3: Provide in component
@Component({
  providers: [MyService],
})
export class MyComponent {}
```

---

###### Error: "XHR failed loading: POST http://..."

**Symptom**: Network request fails in browser console

**Cause**: 
- Backend server not running
- CORS issue
- Wrong API endpoint
- 401/403 authentication error

**Solution**:

1. **Check backend is running**:
   ```bash
   # Start mock server if needed
   npm run start:mocks
   ```

2. **Check API endpoint** in `environment.ts`:
   ```typescript
   apiUrl: 'http://localhost:8080',
   ```

3. **Check CORS headers** - backend must allow your origin

4. **Check authentication** - token might be expired

5. **Check network tab** for actual error response

---

###### Error: "ExpressionChangedAfterCheckError"

**Symptom**: `ExpressionChangedAfterCheckError: Expression has changed after it was checked.`

**Cause**: Component property changed during change detection cycle

**Solution**:

```typescript
// ❌ Causes error - changing data during check
ngOnInit() {
  this.items = [];  // Then immediately modified somewhere
}

// ✅ Use setTimeout to defer to next cycle
ngOnInit() {
  setTimeout(() => {
    this.items = [];
  });
}

// ✅ Better - use proper signal/observable pattern
items = signal<Item[]>([]);

ngOnInit() {
  this.itemService.getItems().subscribe(items => {
    this.items.set(items);
  });
}

// ✅ Or use async pipe (best)
items$ = this.itemService.getItems();

// Template
@for (item of items$ | async; track item.id) {
  {{ item.name }}
}
```

---

###### Error: "Maximum call stack size exceeded"

**Symptom**: `RangeError: Maximum call stack size exceeded` or infinite loop

**Cause**:
- Circular dependency
- Infinite recursion
- Signal change causing effect that changes signal

**Solution**:

1. **Identify the cycle**:
   ```typescript
   // ❌ Infinite - signal updates effect that updates signal
   count = signal(0);
   effect(() => {
     this.count.update(c => c + 1);  // Triggers effect again!
   });
   ```

2. **Fix with proper state management**:
   ```typescript
   // ✅ Correct
   count = signal(0);
   
   increment() {
     this.count.update(c => c + 1);
   }
   
   // Or use effect with dependency guard
   effect(() => {
     const current = this.count();
     if (current > 0) {
      // Do something, but don't modify count
    }
   });
   ```

---

###### Error: "Cannot match any routes"

**Symptom**: 404 page shows or wildcard route triggers unexpectedly

**Cause**:
- Route path doesn't match URL
- Route not configured
- Lazy-loading failed

**Solution**:

1. **Check route configuration**:
   ```typescript
   // In app-routes.ts
   const routes: Routes = [
     { path: 'transactions', loadChildren: () => import(...) },
   ];
   ```

2. **Navigate with correct path**:
   ```typescript
   // ✅ Correct
   this.router.navigate(['/transactions']);
   
   // ❌ Wrong - extra slash
   this.router.navigate(['/', 'transactions']);
   ```

3. **Check lazy-loading**:
   ```bash
   # Check network tab for failed chunk loads
   # Rebuild if needed
   nx build transactions-journey
   ```

---

###### Error: "Cannot find module or its corresponding type declarations"

**Symptom**: `error TS2307: Cannot find module '@backbase/my-lib' or its corresponding type declarations.`

**Cause**:
- Module not built
- Path alias not configured
- Module doesn't export the symbol

**Solution**:

```bash
# 1. Build the module
nx build my-lib

# 2. Check it's listed in tsconfig.base.json
cat tsconfig.base.json | grep -A5 "paths"

# 3. Check public API
cat libs/my-lib/src/index.ts
```

---

###### Error: "CORS policy: No 'Access-Control-Allow-Origin' header"

**Symptom**: Browser console shows CORS error for API request

**Cause**: Backend doesn't allow requests from your origin

**Solution**:

1. **Check backend configuration** - must allow your URL
2. **Use proxy during development**:
   ```json
   {
     "/api": {
       "target": "http://localhost:8080",
       "pathRewrite": { "^/api": "" }
     }
   }
   ```

3. **Or use mock server**:
   ```bash
   npm run start:mocks
   ```

---

###### Error: "Route transitions"

**Symptom**: Navigating to a route that doesn't exist

**Solution**:

```typescript
// ✅ Handle errors
this.router.navigate(['/transactions']).catch(err => {
  console.error('Navigation failed', err);
});

// Or in resolver
@Injectable()
export class MyResolver implements Resolve<Data> {
  resolve(route: ActivatedRouteSnapshot): Observable<Data> {
    return this.service.getData().pipe(
      catchError(() => {
        this.router.navigate(['/error']);
        return of(null);
      })
    );
  }
}
```

---

###### Error: "Signal value not updating in template"

**Symptom**: Changing a signal but template doesn't update

**Cause**: Signal not properly used in template

**Solution**:

```typescript
// ❌ Wrong - signal not called
@Component({
  template: `{{ count }}`  // Missing ()
})
export class Component {
  count = signal(0);
}

// ✅ Correct - call signal as function
@Component({
  template: `{{ count() }}`
})
export class Component {
  count = signal(0);
}
```

---

###### Error: "Memory leak - listener never removed"

**Symptom**: Warnings in DevTools, app gets slower over time

**Cause**: Event listeners or subscriptions not cleaned up

**Solution**:

```typescript
// ✅ Use async pipe (auto-cleanup)
@Component({
  template: `{{ data$ | async }}`
})
export class Component {
  data$ = this.service.getData();
}

// ✅ Or manually cleanup
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({...})
export class Component {
  private destroyRef = inject(DestroyRef);
  
  ngOnInit() {
    this.service.getData()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(data => this.process(data));
  }
}

// ❌ Avoid - never cleaned up
subscription = this.service.getData().subscribe(...);
```

---

###### Error: "Validation Error in Form"

**Symptom**: Form always invalid or validation doesn't trigger

**Solution**:

```typescript
// Check form state
if (this.form.valid) {
  console.log('Valid:', this.form.value);
} else {
  console.log('Errors:', this.form.errors);
  // Check which controls have errors
  Object.keys(this.form.controls).forEach(key => {
    const control = this.form.get(key);
    if (control?.errors) {
      console.log(`${key}: ${JSON.stringify(control.errors)}`);
    }
  });
}
```

---

###### Error: "EmptyError: no elements in sequence"

**Symptom**: RxJS error when observable completes without emitting

**Cause**: Using `first()` or similar on empty observable

**Solution**:

```typescript
// ❌ Fails if no items
items$ = this.itemService.getItems().pipe(
  first()  // Throws if empty
);

// ✅ Provide default
items$ = this.itemService.getItems().pipe(
  defaultIfEmpty([]),
  first()
);

// ✅ Or handle error
items$ = this.itemService.getItems().pipe(
  catchError(() => of([]))
);
```

