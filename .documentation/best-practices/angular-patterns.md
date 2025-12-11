<!-- .documentation/best-practices/angular-patterns.md -->

### Angular Patterns and Best Practices

This application uses modern Angular patterns with standalone components, signals, and reactive forms. This section covers the key patterns you'll encounter.

###### Standalone Components vs Modules

This application uses **standalone components** (the modern approach). Do NOT use NgModules unless necessary.

✅ **Do** - Standalone Component:
```typescript
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div>Hello</div>`,
})
export class MyComponent {}
```

❌ **Don't** - NgModule (legacy, avoid in new code):
```typescript
@NgModule({
  declarations: [MyComponent],
  imports: [CommonModule],
})
export class MyModule {}
```

Key points:
- Set `standalone: true` in component decorator
- Import dependencies directly in `imports` array
- No `declarations` array needed
- In Angular v20+, standalone is becoming the default

###### Using Signals for State Management

Signals are the modern way to manage component state in Angular. They provide better performance through fine-grained reactivity.

```typescript
import { Component, signal, computed } from '@angular/core';

@Component({
  selector: 'app-counter',
  standalone: true,
  template: `
    <p>Count: {{ count() }}</p>
    <p>Doubled: {{ doubled() }}</p>
    <button (click)="increment()">Increment</button>
  `,
})
export class CounterComponent {
  // Create a signal with an initial value
  count = signal(0);

  // Derived state using computed
  doubled = computed(() => this.count() * 2);

  increment() {
    // Update using set() or update()
    this.count.update(c => c + 1);
  }
}
```

Key signal methods:
- `signal(initialValue)` - Create a signal
- `signal()` - Read current value (call as function)
- `set(value)` - Replace value completely
- `update(fn)` - Transform current value
- `computed(() => ...)` - Derived/memoized state
- `effect(() => ...)` - Side effects when signals change

✅ **Do** - Use signals for component state:
```typescript
count = signal(0);
users = signal<User[]>([]);
isLoading = signal(false);
```

❌ **Don't** - Use RxJS subjects for component state:
```typescript
count$ = new BehaviorSubject(0);  // Use signal instead
```

###### Dependency Injection with `inject()`

Use the `inject()` function instead of constructor parameters:

✅ **Do** - Modern approach with `inject()`:
```typescript
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getUser(id: string) {
    return this.http.get(`/api/users/${id}`);
  }
}
```

❌ **Don't** - Constructor injection (legacy):
```typescript
export class UserService {
  constructor(private http: HttpClient) {}
}
```

Benefits of `inject()`:
- Works outside constructors (in functions, guards, resolvers)
- Cleaner code with no parameter boilerplate
- Better for tree-shaking in small components

Example in a route guard:

```typescript
export const canActivateAdmin = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }
  router.navigate(['/']);
  return false;
};
```

###### OnPush Change Detection

Always use `OnPush` change detection strategy for optimal performance:

```typescript
import { ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-my-component',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `{{ data() }}`,
})
export class MyComponent {
  data = input<string>();  // Signal from input
}
```

Why OnPush?
- Component only checks for changes when inputs change
- Reduces unnecessary change detection cycles
- Significantly improves performance with many components
- Angular signals work perfectly with OnPush

###### Using `input()` and `output()` Functions

Modern Angular uses `input()` and `output()` instead of `@Input` and `@Output` decorators:

✅ **Do** - Using input/output functions:
```typescript
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-user-card',
  standalone: true,
  template: `
    <div>{{ user().name }}</div>
    <button (click)="onDelete()">Delete</button>
  `,
})
export class UserCardComponent {
  user = input<User>();
  deleted = output<string>();

  onDelete() {
    if (this.user()) {
      this.deleted.emit(this.user()!.id);
    }
  }
}
```

✅ **Usage**:
```typescript
<app-user-card 
  [user]="currentUser()"
  (deleted)="removeUser($event)"
/>
```

❌ **Don't** - Using decorators (legacy):
```typescript
@Input() user: User;
@Output() deleted = new EventEmitter<string>();
```

###### Reactive Forms

Always prefer reactive forms over template-driven forms:

```typescript
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <input formControlName="email" />
      <button [disabled]="form.invalid">Login</button>
    </form>
  `,
})
export class LoginFormComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  submit() {
    if (this.form.valid) {
      console.log(this.form.value);
    }
  }
}
```

Benefits:
- Type-safe form control
- Easier testing
- Better for complex forms
- Synchronous validation

###### Control Flow: @if, @for, @switch

Use native Angular control flow instead of structural directives:

✅ **Do** - Using new syntax:
```typescript
<div>
  @if (isLoading()) {
    <p>Loading...</p>
  } @else if (error()) {
    <p>Error: {{ error() }}</p>
  } @else {
    <p>{{ data() }}</p>
  }

  @for (item of items(); track item.id) {
    <div>{{ item.name }}</div>
  }

  @switch (status()) {
    @case ('active') {
      <p>Active</p>
    }
    @case ('inactive') {
      <p>Inactive</p>
    }
    @default {
      <p>Unknown</p>
    }
  }
</div>
```

❌ **Don't** - Using old structural directives:
```typescript
<div *ngIf="isLoading()">Loading...</div>
<div *ngFor="let item of items">{{ item }}</div>
<div [ngSwitch]="status()">
  <div *ngSwitchCase="'active'">Active</div>
</div>
```

Benefits of new syntax:
- Better performance
- Cleaner syntax
- Safer (no accidental scoping issues)
- Better TypeScript support

###### Template Binding

Use modern binding syntax:

✅ **Do** - Modern approach:
```typescript
<!-- Property binding (not attribute binding) -->
<img [src]="imagePath()" [alt]="imageAlt()" />

<!-- Event binding -->
<button (click)="save()">Save</button>

<!-- Two-way binding (rarely needed with signals) -->
<input [(ngModel)]="name" />

<!-- Use track function in @for -->
@for (item of items(); track item.id) {
  {{ item.name }}
}
```

❌ **Don't** - Old syntax:
```typescript
<!-- Don't use ngClass and ngStyle -->
<div [ngClass]="{ active: isActive }">X</div>
<div [ngStyle]="{ color: textColor }">X</div>
```

✅ **Do** - Direct class/style binding:
```typescript
<div [class.active]="isActive()">X</div>
<div [style.color]="textColor()">X</div>
```

###### Host Bindings

Put host bindings in the `host` object, NOT in decorators:

✅ **Do** - Using host object:
```typescript
@Component({
  selector: 'app-my-component',
  host: {
    class: 'custom-class',
    '[class.active]': 'isActive()',
    '(click)': 'onClick()',
    'role': 'button',
    'tabindex': '0',
  },
  template: `...`,
})
export class MyComponent {
  isActive = signal(false);
  onClick() { /* ... */ }
}
```

❌ **Don't** - Using decorators:
```typescript
@Component({...})
export class MyComponent {
  @HostBinding('class.active') isActive = false;
  @HostListener('click') onClick() { }
}
```

###### Service Communication

Use services with `providedIn: 'root'` for app-level singletons:

```typescript
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  private http = inject(HttpClient);

  loadUser() {
    this.http.get<User>('/api/me').subscribe(
      user => this.userSubject.next(user)
    );
  }
}
```

###### Lazy Loading Routes

Always lazy-load feature routes:

```typescript
const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module')
      .then(m => m.DashboardModule),
    canActivate: [AuthGuard],
  },
];
```

This ensures:
- App loads faster (features load on-demand)
- Better for mobile users
- Scales to many features without bloat

