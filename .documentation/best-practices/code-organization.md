<!-- .documentation/best-practices/code-organization.md -->

### Code Organization and File Structure

A well-organized codebase is easier to navigate, maintain, and test. This section covers the patterns used in this project.

###### File Naming Conventions

Follow these naming conventions for consistency:

```
components:
- my-component.component.ts (component class)
- my-component.component.html (template)
- my-component.component.scss (styles)
- my-component.component.spec.ts (tests)

services:
- user.service.ts (public service)
- user.service.spec.ts (tests)

directives:
- highlight.directive.ts
- highlight.directive.spec.ts

pipes:
- safe-html.pipe.ts
- safe-html.pipe.spec.ts

guards:
- auth.guard.ts
- auth.guard.spec.ts

models/interfaces:
- user.model.ts (or in shared-data/src/lib/models/)

constants:
- permissions.ts
- translations.ts
```

Use `kebab-case` for file names and folder names.

###### Folder Organization for Features

Organize feature libraries with this structure:

```
libs/transactions-journey/
├── src/
│   └── index.ts                 # Public API
├── internal/
│   ├── data-access/             # HTTP services
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── transactions.service.ts
│   │   │   │   └── transactions.http.service.ts
│   │   │   └── index.ts         # Public API of data-access
│   │   └── project.json
│   ├── feature/                 # Smart/container components
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── transaction-view/
│   │   │   │   │   ├── transaction-view.component.ts
│   │   │   │   │   └── transaction-view.component.html
│   │   │   │   └── index.ts
│   │   │   └── test-setup.ts
│   │   └── project.json
│   ├── ui/                      # Presentational components
│   │   ├── src/
│   │   │   ├── lib/
│   │   │   │   ├── transaction-card/
│   │   │   │   ├── transaction-list/
│   │   │   │   └── index.ts
│   │   │   └── test-setup.ts
│   │   └── project.json
│   └── shared-data/             # Models, constants, types
│       ├── src/
│       │   ├── lib/
│       │   │   ├── models/
│       │   │   ├── constants/
│       │   │   └── index.ts
│       │   └── test-setup.ts
│       └── project.json
└── project.json
```

###### Layering Pattern

Features are organized in layers:

1. **Shared Data** (models, constants, types)
   - No dependencies (leaf nodes)
   - Pure data structures
   - Exported constants and types

2. **Data Access** (HTTP services)
   - Depends on: shared-data, Backbase HTTP clients
   - Handles API communication
   - No component dependencies

3. **UI** (Presentational components)
   - Depends on: shared-data, Angular common
   - Pure components (all data via inputs)
   - No service dependencies (only through parent)

4. **Feature** (Smart components)
   - Depends on: data-access, ui, shared-data
   - Handles routing and state
   - Orchestrates data and presentation

5. **Shell** (Public API)
   - Exports the journey configuration
   - Bundles all layers for distribution

This layering ensures:
- ✅ Testability (each layer independently testable)
- ✅ Reusability (UI components are component-agnostic)
- ✅ Maintainability (clear separation of concerns)
- ✅ Performance (can lazy-load features)

###### Component Structure

For component files, follow this order:

```typescript
// 1. Imports (external first, then internal)
import { Component, input, output, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { UserService } from '@backbase/shared/feature/auth';
import { UserListComponent } from './user-list.component';

// 2. Types and interfaces (if not in separate file)
export interface UserFilter {
  role?: string;
  status?: 'active' | 'inactive';
}

// 3. Component decorator
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, UserListComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `...`,
  styles: [`...`],
})
export class UsersComponent {
  // 4. Properties (signals first, then public properties)
  users = input<User[]>([]);
  filter = input<UserFilter>();
  userUpdated = output<User>();

  filteredUsers = computed(() => {
    // Derived state
  });

  // 5. Private fields
  #userService = inject(UserService);
  #router = inject(Router);

  // 6. Public methods
  selectUser(user: User) {
    this.userUpdated.emit(user);
  }

  // 7. Private methods
  #loadUsers() {
    // Implementation
  }
}
```

###### Organizing Shared Utilities

For truly universal utilities (no framework dependencies):

```
libs/shared/util/permissions/
├── src/
│   └── lib/
│       ├── entitlementsTriplets.ts  # Constants
│       ├── permission.model.ts       # Types
│       ├── has-permission.util.ts    # Pure functions
│       └── index.ts                  # Public API
```

###### Import Organization

Organize imports in this order (with blank lines between groups):

```typescript
// 1. Angular core
import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

// 2. Third-party libraries
import { Subject } from 'rxjs';
import { RouterModule } from '@angular/router';

// 3. Backbase libraries (external)
import { LayoutModule } from '@backbase/ui-ang/layout';

// 4. Workspace imports (path aliases)
import { UserService } from '@backbase/shared/feature/auth';
import { PERMISSIONS } from '@backbase/shared/util/permissions';

// 5. Relative imports (rarely used)
import { UserCardComponent } from './user-card.component';
```

###### Barrel Exports (index.ts)

Each public library should have an `index.ts` that exports the public API:

```typescript
// libs/transactions-journey/src/index.ts

// Core exports
export * from './lib/transactions-journey';
export { TransactionsJourneyConfig } from './lib/transactions-journey';

// Re-export commonly used items from internal modules
export {
  TransactionsCommunicationService,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
} from '@backbase/transactions-journey/internal/data-access';

// ❌ Don't export internal modules directly
// export * from './internal/feature';  // Don't do this
```

###### Internal Modules

Prevent direct imports from internal folders. Update `project.json` tag policy:

```json
{
  "tags": ["scope:transactions-journey", "type:shell"]
}
```

This prevents:
```typescript
// ❌ This should fail in linting
import { Component } from '@backbase/transactions-journey/internal/feature';

// ✅ Use public API instead
import { transactionsJourney } from '@backbase/transactions-journey';
```

###### Service Organization

Group related services:

```typescript
// ❌ Don't - One class per file (overcomplicated)
user.service.ts
user-http.service.ts
user-cache.service.ts

// ✅ Better - Related services grouped
data-access/
├── src/lib/
│   ├── user.service.ts (main service)
│   ├── user.http.service.ts (HTTP client)
│   └── index.ts (exports main service)
```

###### Constants Organization

Group related constants:

```typescript
// ❌ Scattered
interface Permission { }
interface Role { }
const PERMISSIONS = { };
const ROLES = { };

// ✅ Better - organized file
// permissions.ts
export interface Permission { }
export const PERMISSIONS = { };

// roles.ts
export interface Role { }
export const ROLES = { };

// index.ts
export * from './permissions';
export * from './roles';
```

###### Testing File Co-location

Keep test files next to source files:

```
src/lib/
├── user.service.ts
├── user.service.spec.ts    ← Test file next to source
├── user-card.component.ts
└── user-card.component.spec.ts
```

Not:
```
src/
├── lib/
├── __tests__/              ← Don't separate tests
│   ├── user.service.spec.ts
```

###### README Files

Include README.md in library root explaining:
- What the library does
- Key exports
- Common usage patterns
- Links to related libraries

Example:

```markdown
# Transactions Journey

Core library for the transactions feature.

## Exports

- `transactionsJourney()` - Journey factory function
- `withConfig()` - Configure page size and slim mode
- `TransactionsJourneyConfig` - Configuration interface

## Usage

```typescript
import { transactionsJourney, withConfig } from '@backbase/transactions-journey';
```

See [Journey Factory Patterns](../../.documentation/journeys/journey-factory-patterns.md) for detailed examples.
```

