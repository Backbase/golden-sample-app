<!-- .documentation/workspace-architecture/dependency-management.md -->

### Dependency Management with Nx

Nx provides sophisticated caching, task orchestration, and dependency tracking. Understanding how to work effectively with Nx dependencies is crucial for performance and maintainability.

###### Key Nx Concepts

**Project Graph**
- Nx analyzes your code to understand project dependencies
- Projects depend on each other through imports in source code
- Run `nx dep-graph` to visualize the entire graph

**Task Graph**
- Tasks (like `build`, `test`, `lint`) form a dependency graph based on project dependencies
- Nx knows which tasks must run before others
- Example: Building an app requires building all its dependencies first

**Named Inputs and Caching**
- Nx caches task results based on input files
- Different tasks use different inputs (configured in `nx.json`)
- Example: Tests depend on source files, but not build artifacts

###### nx.json Configuration

The key Nx settings are in `nx.json`:

```json
{
  "namedInputs": {
    "default": ["{projectRoot}/**/*", "sharedGlobals"],
    "production": [
      "default",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json"
    ]
  },
  "targetDefaults": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["production", "^production"],
      "cache": true
    },
    "@nx/jest:jest": {
      "inputs": ["default", "^production"],
      "cache": true,
      "options": { "passWithNoTests": true }
    }
  },
  "parallel": 1,
  "defaultBase": "main"
}
```

Key settings explained:

- **namedInputs**: Reusable patterns for what files affect a task
  - `default`: All project files + shared globals
  - `production`: Excludes test files and test configuration
- **targetDefaults**: Default settings for all tasks of a given type
  - `build`: Must run dependencies' builds first (`^build`)
  - `cache: true`: Cache build results (very important!)
- **parallel**: 1 = serial execution (prevents race conditions)
- **defaultBase**: Used for `affected` commands (`main` branch)

###### Running Tasks Efficiently

**Building a Single Project**
```bash
# Just build this project (and its dependencies automatically)
nx build golden-sample-app

# Faster: Skip dependency analysis
nx build golden-sample-app --skip-nx-cache
```

**Building Multiple Projects**
```bash
# Build all projects
nx run-many --target=build --all

# Build only affected projects (faster CI builds)
nx affected --target=build --base=main --head=HEAD
```

**Testing**
```bash
# Test a single project
nx test transactions-journey-shell

# Test all projects
nx run-many --target=test --all

# Test only affected projects (very fast for CI)
nx affected --target=test --base=main --head=HEAD
```

**Linting**
```bash
# Lint a project and check dependency rules
nx lint golden-sample-app

# Lint all projects
nx run-many --target=lint --all
```

###### Understanding Task Dependencies

When you run a task, Nx automatically executes all task dependencies first:

```bash
# Running this:
nx build apps/golden-sample-app

# Automatically also runs:
nx build libs/journey-bundles/transactions  # dependency
nx build libs/transactions-journey          # dependency
nx build libs/shared/feature/auth           # dependency
# ... and so on for all transitive dependencies
```

The `dependsOn: ["^build"]` in `targetDefaults` tells Nx: "Before building this project, build all its dependencies."

The `^` prefix means "run this target in all dependencies."

###### Caching and Performance

Nx caches task outputs by default. This makes subsequent runs much faster:

**First run** (no cache):
```bash
nx build shared-util-permissions
> Compiling...
> Takes 5 seconds
```

**Second run** (cache hit):
```bash
nx build shared-util-permissions
> Found in cache, restoring from cache
> Instant (if files haven't changed)
```

Cache is invalidated when:
- Source files change
- Dependencies change
- tsconfig.json changes
- Configuration changes

To skip the cache:
```bash
nx build golden-sample-app --skip-nx-cache
```

To clear all caches:
```bash
nx reset  # Clears entire Nx cache
```

###### Dependency Constraints

Nx can enforce architectural rules. Currently, this project relies on:
1. TypeScript path mapping (in `tsconfig.base.json`)
2. ESLint rules to prevent inappropriate imports
3. Manual code review

###### Optimizing Your Workspace

**1. Keep Dependencies Shallow**
- Avoid deep dependency chains (A → B → C → D)
- Share utilities directly with consumers

**2. Use `providedIn: 'root'` for Services**
```typescript
@Injectable({
  providedIn: 'root'  // Singleton at app root
})
export class MyService {}
```

**3. Lazy Load Routes**
```typescript
{
  path: 'transactions',
  loadChildren: () => import('./transactions.bundle'),  // Lazy loaded
}
```

**4. Limit Entry Points**
- Public API in `src/index.ts`
- Everything else is internal to the project

**5. Use Shared Utilities**
- Create `shared/util/` for truly universal code
- Dependencies: None or only Angular core

###### Checking Dependency Health

View your project graph:
```bash
nx dep-graph

# Focus on a single project
nx dep-graph --focus=transactions-journey-shell

# Show what depends on this project
nx dep-graph --focus=transactions-journey-shell --reverse
```

Look for:
- ✅ Acyclic dependencies (no circular imports)
- ✅ Shallow chains (direct dependencies, not deep nesting)
- ✅ Few dependencies at app level (most in libraries)
- ❌ Avoid circular dependencies
- ❌ Avoid bidirectional dependencies

###### Common Issues with Dependencies

**Issue**: "Cannot find module '@backbase/my-lib'"
**Solution**: 
1. Check `tsconfig.base.json` - is the path configured?
2. Check `nx.json` - does the project exist?
3. Check the project's public API (`src/index.ts`) - is the symbol exported?

**Issue**: Build times are slow
**Solution**:
1. Run `nx dep-graph` to visualize dependencies
2. Look for unnecessary dependencies
3. Check if you can move code to a shared utility
4. Consider lazy loading routes

**Issue**: Circular dependency errors
**Solution**:
1. Identify which projects have circular dependencies: `nx dep-graph`
2. Move shared code to a new library
3. Or restructure to break the cycle
4. Use `providedIn: 'root'` for services to avoid circular module dependencies

###### Best Practices

1. **Import from public APIs only**
   - Use `@backbase/transactions-journey`
   - NOT `@backbase/transactions-journey/internal/feature`

2. **Keep imports organized**
   - Group imports by scope (external, internal, relative)
   - Use TypeScript path aliases from `tsconfig.base.json`

3. **Design for tree-shaking**
   - Export specific symbols, not namespaces
   - Let bundlers remove unused code

4. **Use Nx console (VSCode extension)**
   - Visualize tasks and their dependencies
   - Run tasks from the IDE
   - No need to remember command syntax

5. **Run affected tests before commit**
   ```bash
   # Only test code you actually changed
   nx affected --target=test --base=origin/main --head=HEAD
   ```

