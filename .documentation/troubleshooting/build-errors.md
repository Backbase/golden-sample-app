<!-- .documentation/troubleshooting/build-errors.md -->

### Build Errors

Errors that occur during compilation or bundling.

###### Error: "Cannot find name X"

**Symptom**: `error TS2304: Cannot find name 'X'.`

**Solution**:
1. Check if the symbol is exported from its module
2. Check if the import path is correct
3. Verify tsconfig.json includes the file
4. Restart the dev server (`npm start`)

```typescript
// ✅ Fix - import the missing symbol
import { MyClass } from './my-class';
```

---

###### Error: "Property X is missing in type Y"

**Symptom**: `Property 'email' is missing in type 'User' but required in type 'StrictUser'.`

**Solution**:
Provide all required properties of the interface:

```typescript
// ✅ Fix - provide all required properties
const user: User = {
  id: '123',
  name: 'John',
  email: 'john@example.com',  // Add missing property
};
```

Or make the property optional:

```typescript
interface User {
  id: string;
  name: string;
  email?: string;  // Make optional
}
```

---

###### Error: "Unsafe assignment of any value"

**Symptom**: `error TS7006: Parameter 'x' implicitly has an 'any' type.`

**Solution**:
Add explicit type annotations:

```typescript
// ✅ Fix - add type annotation
const process = (value: string) => {
  return value.toUpperCase();
};

const items = [1, 2, 3].map((item: number) => item * 2);
```

---

###### Error: "Argument of type X is not assignable to parameter of type Y"

**Symptom**: `Argument of type 'string' is not assignable to parameter of type 'number'.`

**Solution**:
Convert the value to the correct type:

```typescript
// ✅ Fix - convert to correct type
const count: number = parseInt(userInput);
const items: Item[] = Array.from(itemSet);
```

---

###### Error: "Cannot assign to readonly property X"

**Symptom**: `Cannot assign to 'count' because it is a read-only property.`

**Solution**:
Use setter methods or create new objects:

```typescript
// If it's a signal
count = signal(0);

// ✅ Use update
count.update(c => c + 1);

// Or set
count.set(5);

// If it's a property
// ❌ Direct assignment
this.config.name = 'new name';

// ✅ Create new object
this.config = { ...this.config, name: 'new name' };
```

---

###### Error: "Argument type X is not assignable to parameter of type Y"

**Symptom**: When calling a function with wrong type argument

**Solution**:
Match the function signature exactly:

```typescript
interface User {
  id: string;
  name: string;
}

// Function expects User
function processUser(user: User): void {}

// ❌ Wrong - missing name property
processUser({ id: '123' });

// ✅ Correct
processUser({ id: '123', name: 'John' });
```

---

###### Error: "NGCC compilation"

**Symptom**: Compilation hangs on "Building Angular Package Format" with NGCC

**Cause**: Node modules haven't been processed by Angular

**Solution**:

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Or just clear Nx cache
nx reset
```

---

###### Error: "Cannot resolve dependencies"

**Symptom**: `ERROR in ./src/app.ts Could not resolve '@backbase/my-lib'`

**Solution**:
1. Check `tsconfig.base.json` has the path alias
2. Build the library: `nx build my-lib`
3. Check the library exports the symbol in `src/index.ts`

---

###### Error: "Unexpected token" in SCSS

**Symptom**: SCSS compilation fails with `Unexpected token`

**Solution**:
Check for common SCSS issues:

```scss
/* ✅ Valid SCSS */
.container {
  display: flex;
  
  &.active {
    color: red;
  }
}

/* ❌ Invalid - missing closing brace */
.container {
  display: flex;
```

---

###### Error: "Module not found: Error: Can't resolve X"

**Symptom**: Webpack can't find module during build

**Solution**:

```bash
# 1. Check file exists
ls -la libs/my-lib/src/lib/my-file.ts

# 2. Rebuild dependency
nx build my-lib

# 3. Clear cache
nx reset
nx build golden-sample-app
```

