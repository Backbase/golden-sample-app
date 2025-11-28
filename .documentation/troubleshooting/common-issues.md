<!-- .documentation/troubleshooting/common-issues.md -->

### Common Issues and Solutions

###### Issue: Port 4200 already in use

**Symptom**: `Port 4200 is already in use. Use '--port' to specify a different port.`

**Causes**:
- Another instance of `npm start` is running
- Another application is using port 4200
- Process hung from previous run

**Solutions**:

1. **Find and kill the process**:
   ```bash
   # macOS/Linux
   lsof -i :4200
   kill -9 <PID>

   # Windows
   netstat -ano | findstr :4200
   taskkill /PID <PID> /F
   ```

2. **Use a different port**:
   ```bash
   npm start -- --port 4201
   ```

3. **Clear Nx daemon**:
   ```bash
   nx reset
   npm start
   ```

---

###### Issue: Module not found

**Symptom**: `Cannot find module '@backbase/my-lib'`

**Causes**:
- Path alias not configured in `tsconfig.base.json`
- Project not listed in `tsconfig.base.json` paths
- Typo in import path
- Module hasn't been built yet

**Solutions**:

1. **Check path configuration**:
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@backbase/*": ["libs/*/src"]
       }
     }
   }
   ```

2. **Verify module exists**:
   ```bash
   # Check if project exists
   nx list | grep my-lib

   # Check if index.ts exports the symbol
   cat libs/my-lib/src/index.ts
   ```

3. **Check for typos**:
   - Import path case-sensitive
   - Must match folder names exactly

4. **Build the dependency**:
   ```bash
   nx build my-lib
   ```

---

###### Issue: Build hangs or is very slow

**Symptom**: `ng build` or `nx build` takes 5+ minutes or hangs indefinitely

**Causes**:
- Nx cache is corrupted
- Too many projects building in parallel
- Circular dependencies
- Memory issues

**Solutions**:

1. **Clear Nx cache**:
   ```bash
   nx reset
   rm -rf dist/
   npm start
   ```

2. **Check for circular dependencies**:
   ```bash
   nx dep-graph
   ```
   Look for bidirectional arrows between projects

3. **Build in verbose mode**:
   ```bash
   nx build golden-sample-app -v
   ```
   See which step is hanging

4. **Increase Node memory**:
   ```bash
   export NODE_OPTIONS="--max-old-space-size=4096"
   npm start
   ```

5. **Kill Nx daemon and restart**:
   ```bash
   pkill -f "nx-daemon"
   npm start
   ```

---

###### Issue: Tests fail with "Cannot find module"

**Symptom**: `Cannot find module '@backbase/something' from 'src/app.spec.ts'`

**Causes**:
- Jest hasn't been configured for the path alias
- Module exports don't match imports
- Test file trying to import from internal module

**Solutions**:

1. **Check jest config**:
   ```json
   {
     "moduleNameMapper": {
       "^@backbase/(.*)$": "<rootDir>/../../libs/$1/src"
     }
   }
   ```

2. **Verify module exports**:
   ```bash
   cat libs/my-lib/src/index.ts
   ```

3. **Check for internal imports**:
   ```typescript
   // ❌ Don't import from internal
   import { Component } from '@backbase/my-lib/internal/feature';

   // ✅ Use public API
   import { SomeComponent } from '@backbase/my-lib';
   ```

4. **Clear cache and retry**:
   ```bash
   nx test my-lib --clearCache
   ```

---

###### Issue: "NullInjectorError: No provider for X"

**Symptom**: `NullInjectorError: No provider found for ServiceX!`

**Causes**:
- Service not provided in providers array
- Service provided at wrong scope (app level vs module level)
- Service in lazy-loaded module not provided there

**Solutions**:

1. **Add to providers**:
   ```typescript
   @NgModule({
     imports: [...],
     providers: [MyService],  // Add here
   })
   export class MyModule {}
   ```

2. **Or use providedIn**:
   ```typescript
   @Injectable({ providedIn: 'root' })
   export class MyService {}
   ```

3. **For lazy-loaded modules, provide in bundle**:
   ```typescript
   @NgModule({
     imports: [RouterModule.forChild(routes)],
     providers: [MyService],  // Provide here, not globally
   })
   export class MyJourneyModule {}
   ```

---

###### Issue: Types don't match in template

**Symptom**: Template errors like `Property 'X' does not exist on type 'Y'`

**Causes**:
- Component property is private
- Property is signal (need to call it)
- Wrong type passed to input

**Solutions**:

1. **Make property public**:
   ```typescript
   // ❌ Private - can't use in template
   private count = signal(0);

   // ✅ Public
   count = signal(0);
   ```

2. **Call signal in template**:
   ```typescript
   // ✅ Signals are called as functions
   {{ count() }}
   @for (item of items(); track item.id) { }
   ```

3. **Check type in component**:
   ```typescript
   export interface ComponentInputs {
     name: string;
   }

   @Component({...})
   export class MyComponent {
     name = input<string>();  // Must be string, not optional
   }
   ```

---

###### Issue: Authentication fails silently

**Symptom**: Redirect to login page keeps happening, even with valid credentials

**Causes**:
- OAuth configuration incorrect
- Token storage not accessible
- CORS issues with auth server
- Session mismatch

**Solutions**:

1. **Check OAuth configuration**:
   ```typescript
   // Check environment.ts
   authConfig: {
     clientId: 'your-client-id',
     redirectUrl: 'http://0.0.0.0:4200/callback',  // Must match auth server
   }
   ```

2. **Check browser storage**:
   ```javascript
   // Open DevTools > Application
   localStorage.getItem('access_token')  // Should have a value
   ```

3. **Check network requests**:
   - Open DevTools > Network tab
   - Look for auth service calls
   - Check for CORS errors

4. **Try different localhost URL**:
   ```bash
   # Some AWS WAF configs require 0.0.0.0
   http://0.0.0.0:4200/
   # Instead of
   http://localhost:4200/
   ```

---

###### Issue: Styles not applying

**Symptom**: CSS styles from SCSS files don't appear in component

**Causes**:
- SCSS file path incorrect
- CSS module conflicts
- Style encapsulation issue
- File not being watched during development

**Solutions**:

1. **Check style paths**:
   ```typescript
   @Component({
     styleUrls: ['./my-component.component.scss'],  // Relative to component file
   })
   ```

2. **Try inline styles temporarily**:
   ```typescript
   @Component({
     styles: [`
       :host { display: block; }
       .container { color: red; }
     `],
   })
   ```

3. **Check for naming conflicts**:
   ```typescript
   // If using CSS modules
   @Component({
     styleUrls: ['./my-component.component.scss'],
     encapsulation: ViewEncapsulation.None,  // Disable encapsulation if needed
   })
   ```

4. **Rebuild the project**:
   ```bash
   nx build my-lib --skip-nx-cache
   ```

---

###### Issue: "Circular dependency detected"

**Symptom**: Compilation fails with circular dependency error

**Causes**:
- Service A imports from Service B, and B imports from A
- Library imports another library that imports back
- Module imports feature that imports module

**Solutions**:

1. **Identify the cycle**:
   ```bash
   nx dep-graph --focus=my-lib
   ```
   Look for arrows pointing both ways between projects

2. **Extract shared code**:
   ```typescript
   // Create libs/shared/util/models.ts
   export interface MyModel { }

   // Now both can import from shared without cycling
   import { MyModel } from '@backbase/shared/util/models';
   ```

3. **Use dependency injection instead**:
   ```typescript
   // ❌ Circular - A imports B, B imports A
   // service-a.ts
   import { ServiceB } from './service-b';
   export class ServiceA {
     constructor(private b: ServiceB) {}
   }

   // ✅ Break cycle - use injection token
   // service-a.ts
   export const SERVICE_A = new InjectionToken('ServiceA');

   // App root provides both without cycle
   providers: [ServiceA, ServiceB]
   ```

---

###### Issue: Lazy-loaded route not loading

**Symptom**: Navigate to lazy route and nothing loads, or get "Cannot find module"

**Causes**:
- loadChildren path is incorrect
- Bundle module doesn't have `export default`
- Route guard preventing access
- Network error loading chunk

**Solutions**:

1. **Check route configuration**:
   ```typescript
   // ✅ Correct
   {
     path: 'transactions',
     loadChildren: () => import('./transactions.bundle').then(m => m.default),
   }

   // ✅ Also correct (with proper naming)
   {
     path: 'transactions',
     loadChildren: () => import('./transactions.bundle'),
   }
   ```

2. **Check bundle exports**:
   ```typescript
   // libs/journey-bundles/transactions/src/lib/transactions.bundle.ts
   @NgModule({...})
   export class TransactionsModule {}

   export default TransactionsModule;  // Must have default export
   ```

3. **Check route guards**:
   ```typescript
   {
     path: 'transactions',
     loadChildren: () => import('./transactions.bundle'),
     canActivate: [AuthGuard],  // Make sure you're authenticated
   }
   ```

4. **Check network tab**:
   - DevTools > Network > XHR/Fetch
   - Look for failing chunk requests
   - Check for CORS or 404 errors

---

###### Issue: "This likely means that the library exported more than just the type"

**Symptom**: TypeScript error about library exports when importing type

**Causes**:
- Importing type without `import type`
- Module has side effects during import
- Circular dependency during type resolution

**Solutions**:

1. **Use `import type`**:
   ```typescript
   // ✅ Only the type is imported (no runtime code)
   import type { User } from '@backbase/shared/util/models';

   // ❌ Imports both type and any runtime code
   import { User } from '@backbase/shared/util/models';
   ```

2. **Check for side effects**:
   ```typescript
   // Don't execute code at module level
   // ❌ Bad
   export const config = console.log('Module loaded');

   // ✅ Good
   export const config = {};
   ```

