<!-- .documentation/best-practices/typescript-guidelines.md -->

### TypeScript Guidelines

This application enforces strict TypeScript checking. Understanding these patterns ensures your code is type-safe and maintainable.

###### Strict Mode Configuration

The workspace uses strict TypeScript checking. Key settings in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "strictBindCallApply": true,
    "strictPropertyInitialization": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

This means:
- No untyped variables (`any` is not allowed)
- Null/undefined must be handled explicitly
- All function parameters must be typed
- Unused variables cause compilation errors

###### Type Inference

Let TypeScript infer types when obvious. Only add explicit types when needed:

✅ **Do** - Let TypeScript infer:
```typescript
// TypeScript knows this is a number
const count = 0;

// TypeScript infers the type from the return value
function getName() {
  return 'John';
}

// TypeScript infers from the array contents
const items = [1, 2, 3];  // number[]
```

❌ **Don't** - Over-specify types:
```typescript
const count: number = 0;
function getName(): string {
  return 'John';
}
const items: number[] = [1, 2, 3];
```

⚠️ **Do add explicit types when**:
- Function parameters (always required in strict mode)
- Public API return types
- Complex types that aren't obvious
- Service properties

###### Using `unknown` vs `any`

Never use `any`. Use `unknown` when the type is truly unknown:

```typescript
// ❌ Don't
function processData(data: any) {
  return data.value;  // No type checking!
}

// ✅ Do
function processData(data: unknown) {
  if (typeof data === 'object' && data !== null && 'value' in data) {
    return (data as { value: any }).value;
  }
  throw new Error('Invalid data');
}

// ✅ Better - use a type guard
function isDataObject(data: unknown): data is { value: any } {
  return typeof data === 'object' && data !== null && 'value' in data;
}

function processData(data: unknown) {
  if (isDataObject(data)) {
    return data.value;
  }
  throw new Error('Invalid data');
}
```

###### Interfaces vs Types

Use `interface` for object shapes that will be implemented/extended. Use `type` for unions and aliases:

✅ **Do**:
```typescript
// Interface - for object contracts
interface User {
  id: string;
  name: string;
  email: string;
}

// Type - for unions and complex types
type Status = 'active' | 'inactive' | 'pending';
type Result<T> = { success: true; data: T } | { success: false; error: Error };
```

❌ **Don't**:
```typescript
// Using type for a simple object (interface is clearer)
type User = {
  id: string;
  name: string;
};
```

###### Nullability and Optional Properties

Be explicit about null and undefined:

```typescript
// Property is required
interface User {
  id: string;
  name: string;
}

// Property is optional
interface User {
  id: string;
  name?: string;  // string | undefined
}

// Property can be null
interface User {
  id: string;
  name: string | null;  // Must be string OR null
}

// Property can be null or undefined
interface User {
  id: string;
  name: string | null | undefined;
}
```

✅ **Do** - Handle null/undefined:
```typescript
function getName(user: User | null): string {
  if (!user) {
    return 'Unknown';
  }
  return user.name ?? 'No name';  // Nullish coalescing
}
```

❌ **Don't** - Assume things aren't null:
```typescript
function getName(user: User | null): string {
  return user.name;  // TS Error: user could be null
}
```

###### Union Types and Discriminated Unions

Use union types for exclusive states:

```typescript
// ✅ Good - discriminated union (also called tagged union)
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

// Usage with type guard
function processState<T>(state: AsyncState<T>) {
  if (state.status === 'success') {
    console.log(state.data);  // TypeScript knows data exists here
  }
}

// ❌ Avoid - ambiguous union
type UserOrAdmin = User | Admin;  // Ambiguous what the difference is
```

###### Generic Types

Use generics for reusable, type-safe code:

```typescript
// Generic function
function wrappedInArray<T>(value: T): T[] {
  return [value];
}

// Generic interface
interface Container<T> {
  value: T;
  isEmpty(): boolean;
}

// Generic class
class Queue<T> {
  private items: T[] = [];
  
  enqueue(item: T) {
    this.items.push(item);
  }
  
  dequeue(): T | undefined {
    return this.items.shift();
  }
}
```

###### Utility Types

Use TypeScript's utility types to manipulate types:

```typescript
interface User {
  id: string;
  name: string;
  email: string;
}

// Partial - all properties optional
type UserUpdate = Partial<User>;

// Pick - select specific properties
type UserPublic = Pick<User, 'id' | 'name'>;

// Omit - exclude specific properties
type UserPrivate = Omit<User, 'email'>;

// Record - object with specific keys
type UserRoles = Record<'admin' | 'user' | 'guest', boolean>;

// Required - all properties required
type StrictUser = Required<Partial<User>>;

// ReadOnly - immutable properties
type ImmutableUser = Readonly<User>;
```

###### Function Typing

Always type function parameters and return types:

```typescript
// ✅ Explicit and clear
function calculateTotal(
  items: CartItem[],
  taxRate: number
): number {
  return items.reduce((sum, item) => sum + item.price * taxRate, 0);
}

// ✅ Function type annotation
const handleClick: (event: MouseEvent) => void = (event) => {
  console.log(event);
};

// ✅ Callback types
type Callback<T> = (value: T) => void;
function subscribe<T>(
  items: T[],
  onEach: Callback<T>,
  onComplete: () => void
) {
  items.forEach(onEach);
  onComplete();
}
```

###### Enum Alternatives

Use `const` objects or union types instead of enums for better tree-shaking:

```typescript
// ✅ Do - using const object
const Status = {
  Active: 'active',
  Inactive: 'inactive',
  Pending: 'pending',
} as const;

type Status = typeof Status[keyof typeof Status];

// ✅ Do - using union type (simplest)
type Status = 'active' | 'inactive' | 'pending';

// ❌ Avoid - enums are harder to tree-shake
enum Status {
  Active = 'active',
  Inactive = 'inactive',
}
```

###### Private Fields

Use private fields with `#` prefix for encapsulation:

```typescript
export class Service {
  // ✅ Do - private field (truly private)
  #cache = new Map<string, any>();

  #getCached(key: string) {
    return this.#cache.get(key);
  }

  public getData(key: string) {
    return this.#getCached(key);
  }
}

// ❌ Don't - private property (can be accessed via bracket notation)
export class Service {
  private cache = new Map<string, any>();
}

// Can be accessed: service['cache']
```

###### Strict Null Checks in Templates

When using values in templates, ensure proper null checking:

```typescript
export class Component {
  user: User | null = null;

  // ✅ Template safe
  userName(): string {
    return this.user?.name ?? 'Guest';
  }

  // ✅ In template
  template: `
    {{ user?.name || 'Guest' }}
    @if (user) {
      <p>{{ user.email }}</p>
    }
  `
}
```

###### Decorators Typing

Type decorator metadata properly:

```typescript
// ✅ Explicit typing
@Component({
  selector: 'app-my-component',
  template: `<div>{{ count() }}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyComponent {}

// ✅ Service injection
export class MyService {
  private http = inject(HttpClient);
  
  getData(): Observable<Data[]> {
    return this.http.get<Data[]>('/api/data');
  }
}
```

###### Avoid Type Assertions

Instead of `as` type assertions, use type guards:

```typescript
// ❌ Avoid - type assertion
const value = (json as any) as User;

// ✅ Better - type guard
function isUser(value: unknown): value is User {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

if (isUser(json)) {
  const user: User = json;  // TypeScript knows this is User
}
```

