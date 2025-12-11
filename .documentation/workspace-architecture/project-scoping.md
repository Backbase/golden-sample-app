<!-- .documentation/workspace-architecture/project-scoping.md -->

### Project Scoping and Dependency Constraints

Nx uses **project scoping** and **tagging** to enforce architectural boundaries. This prevents dependencies from flowing in unintended directions and keeps the codebase organized.

###### Scoping Strategy

Every library in this workspace has a `scope` tag that defines its domain:

| Scope | Purpose | Examples |
|-------|---------|----------|
| `scope:transactions-journey` | Transactions feature | `transactions-journey`, `transactions-journey-ui`, etc. |
| `scope:transfer-journey` | Transfer/Payment feature | `transfer-journey`, `transfer-journey-ui`, etc. |
| `scope:ach-positive-pay-journey` | ACH feature | `ach-positive-pay-journey`, `ach-positive-pay-journey-ui`, etc. |
| `scope:shared` | Cross-cutting concerns | `shared-feature-auth`, `shared-util-permissions`, etc. |

###### Type Tags

Each library also has a `type` tag describing its role:

| Type | Purpose | Examples |
|------|---------|----------|
| `type:shell` | Main journey package (public API) | `transactions-journey-shell`, `transfer-journey-shell` |
| `type:feature` | Feature implementation | `transactions-journey-feature`, `shared-feature-auth` |
| `type:data-access` | HTTP services, data layer | `transactions-journey-data-access` |
| `type:ui` | Presentational components | `transactions-journey-ui` |
| `type:shared-data` | Constants, models, types | `transactions-journey-shared-data` |
| `type:util` | Helper functions | `shared-util-permissions` |
| `type:journey-bundle` | Lazy-loaded journey wrapper | `journey-bundles-transactions` |

###### Dependency Flow Rules

The architecture enforces these dependency rules:

```
App (golden-sample-app)
  ├── Can depend on: Journey Bundles, Shared Features
  └── Cannot depend on: Journey internals, other scope internals

Journey Bundle (journey-bundles/transactions)
  ├── Can depend on: Journey Shell, Shared libraries
  └── Cannot depend on: Other journey bundles, app code

Journey Shell (transactions-journey-shell)
  ├── Can depend on: Internal layers, Shared libraries
  └── Cannot depend on: Other journeys, App code

Journey Internal Layers (data-access, feature, ui)
  ├── Can depend on: Shared utilities, other internal layers
  └── Cannot depend on: Other journey internals, Journey shells

Shared Features (shared/feature/auth)
  ├── Can depend on: Shared utilities, other shared features
  └── Cannot depend on: Any journeys or app code

Shared Utilities (shared/util/permissions)
  ├── Can have NO dependencies on: Journeys, Features, or App
  └── Purpose: Pure utilities with minimal dependencies
```

###### Viewing Project Dependencies

Use Nx to visualize and enforce these boundaries:

```bash
# View the full project graph
nx dep-graph

# View dependencies for a specific project
nx dep-graph --focus=transactions-journey-shell

# Identify circular dependencies (if any)
nx affected --base=main --head=HEAD
```

###### Example: Transactions Journey Dependencies

The transactions journey follows these dependency rules:

1. **transactions-journey-shell** (public API)
   - Exports: `transactionsJourney`, `withConfig`, etc.
   - Depends on: internal data-access, feature, ui
   - Used by: `journey-bundles-transactions`

2. **transactions-journey-data-access** (HTTP services)
   - Exports: HTTP client services, communication interface
   - Depends on: shared-data, Backbase HTTP client library
   - Used by: feature, journey bundle

3. **transactions-journey-feature** (Business logic)
   - Exports: Route components
   - Depends on: data-access, ui, shared-data
   - Used by: shell module

4. **transactions-journey-ui** (Components)
   - Exports: Presentational components
   - Depends on: shared-data, Angular common
   - Used by: feature

5. **transactions-journey-shared-data** (Models)
   - Exports: TypeScript interfaces, constants
   - Depends on: Nothing (leaf dependency)
   - Used by: all other layers

```
transactions-journey-shell
    ↑
    │ depends on
    ↓
transactions-journey-feature ← transactions-journey-ui
    ↑
    │ depends on
    ↓
transactions-journey-data-access
    ↑
    │ depends on
    ↓
transactions-journey-shared-data
```

###### Why Scoping Matters

1. **Prevents Accidental Coupling**: You can't accidentally import from internal modules
2. **Enables Team Boundaries**: Different teams can work on different scopes
3. **Facilitates Reuse**: Clear APIs make it easy to reuse code
4. **Simplifies Testing**: Scoped dependencies are easier to mock and test
5. **Supports Migration**: Can gradually migrate from one pattern to another

###### Enforcing Scoping

The ESLint configuration (`eslint.config.mjs`) enforces these boundaries:

```typescript
// This works - importing from public API
import { transactionsJourney } from '@backbase/transactions-journey';

// This fails - importing from internal modules
import { SomeInternalComponent } from '@backbase/transactions-journey/internal/feature';
// Error: Cannot import from a library that is declared as internal
```

###### Adding a New Feature

When adding a new journey or feature, follow this scoping pattern:

1. Create the feature under `libs/your-feature/`
2. Organize internal code under `libs/your-feature/internal/`
3. Define a clear public API in `libs/your-feature/src/index.ts`
4. Only export what should be public
5. Prevent direct imports from internal folders
6. Tag the project appropriately in `project.json`

###### Common Scoping Mistakes to Avoid

❌ **Don't**: Import feature code directly from a journey internal folder
```typescript
import { MyComponent } from '@backbase/transactions-journey/internal/feature';
```

✅ **Do**: Import from the public API only
```typescript
import { transactionsJourney } from '@backbase/transactions-journey';
```

❌ **Don't**: Create cross-journey dependencies
```typescript
// In transfer-journey
import { SomeComponent } from '@backbase/transactions-journey/internal/ui';
```

✅ **Do**: Use shared libraries for cross-journey code
```typescript
// In shared/feature/communication
export class JourneyCommunicationService { }
// Used by all journeys
```

