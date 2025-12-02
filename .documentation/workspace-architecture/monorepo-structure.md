<!-- .documentation/workspace-architecture/monorepo-structure.md -->

### Monorepo Structure Overview

This project is organized as an Nx monorepo that contains both applications and libraries following a scalable, maintainable structure. Understanding this organization is key to navigating and developing effectively.

###### Directory Layout

```
golden-sample-app-wf-2271-26-11-2025/
├── apps/                          # Applications that run in the browser
│   ├── golden-sample-app/         # Main Angular SPA application
│   └── golden-sample-app-e2e/     # End-to-end tests (Playwright)
├── libs/                          # Shared and feature libraries
│   ├── journey-bundles/           # Lazy-loadable journey bundles
│   ├── transactions-journey/      # Modern journey (journeyFactory pattern)
│   ├── transfer-journey/          # Legacy journey (NgModule pattern)
│   ├── ach-positive-pay-journey/  # Legacy journey (NgModule pattern)
│   └── shared/                    # Shared features and utilities
│       ├── feature/               # Feature modules (auth, communication, etc.)
│       └── util/                  # Utility libraries (permissions, config, etc.)
├── tools/                         # Custom Nx generators and scripts
├── mock-server/                   # Mock API server for local development
├── nx.json                        # Nx workspace configuration
├── package.json                   # Project dependencies
└── tsconfig.base.json            # Base TypeScript configuration
```

###### Core Directories Explained

**apps/** - Production Applications
- `golden-sample-app`: The main Angular SPA that users interact with
- `golden-sample-app-e2e`: Playwright-based end-to-end test suite

**libs/** - Reusable Code Libraries

The libraries are organized by feature and scope:

1. **Journey Libraries** (Feature implementations)
   - `transactions-journey/` - Shows transactions (modern journeyFactory pattern)
   - `transfer-journey/` - Handles money transfers (legacy pattern)
   - `ach-positive-pay-journey/` - ACH positive pay feature (legacy pattern)

2. **Journey Bundles** (Lazy-loaded modules)
   - `journey-bundles/transactions/` - Bundle for lazy-loading transactions
   - `journey-bundles/transfer/` - Bundle for lazy-loading transfers
   - `journey-bundles/ach-positive-pay/` - Bundle for ACH positive pay
   - `journey-bundles/custom-payment/` - Bundle for custom payments
   - `journey-bundles/user-accounts/` - Bundle for user accounts

3. **Shared Libraries** (Cross-cutting concerns)
   - `shared/feature/` - Feature modules used across the app
     - `auth/` - Authentication logic and guards
     - `communication/` - Journey-to-journey communication
     - `navigation-menu/` - Main navigation component
     - `user-context/` - User context management
     - `view-wrapper/` - Layout wrapper for journeys
   - `shared/util/` - Utility and helper libraries
     - `app-core/` - Core app utilities
     - `config/` - Shared configuration
     - `permissions/` - Permission constants and helpers
     - `e2e-tests/` - Shared e2e test utilities

###### Library Structure Pattern

Each library follows a consistent structure:

```
lib-name/
├── internal/              # Internal implementation (not exported)
│   ├── data-access/      # HTTP services, data fetching
│   ├── feature/          # Feature components and logic
│   ├── shared-data/      # Models, constants, shared types
│   └── ui/               # Presentational components
├── src/
│   ├── index.ts          # Public API exports
│   ├── lib/              # Main library code
│   └── test-setup.ts     # Jest setup
├── project.json          # Nx project configuration
├── package.json          # Library metadata (for npm publishing)
└── tsconfig.*.json       # TypeScript configurations
```

This layered structure ensures:
- **Separation of Concerns**: Each layer has a specific responsibility
- **Internal vs Public**: `internal/` folders are not part of the public API
- **Testability**: Data-access and feature layers can be tested independently
- **Reusability**: UI components are isolated and easily reusable

###### Journey Organization

Journeys are organized in multiple layers:

**Journey Library** (e.g., `libs/transactions-journey/`)
- Core journey logic and configuration
- Components, services, and state
- Exported as a shareable npm package

**Journey Bundle** (e.g., `libs/journey-bundles/transactions/`)
- Lazy-loadable wrapper module
- Provides app-level configuration
- Handles dependency injection at route level

**App Integration** (in `apps/golden-sample-app/`)
- Routes are composed from journey bundles
- App-level communication service bridges multiple journeys

Example flow:
```
User navigates to /transactions
  ↓
Route loads TransactionsBundle (lazy-loaded)
  ↓
Bundle module provides configuration & services
  ↓
Journey renders TransactionsViewComponent
```

###### Why This Structure?

- **Scalability**: New features can be added without affecting existing code
- **Modularity**: Each journey is independent and can be used in other apps
- **Lazy Loading**: Journey bundles load only when accessed
- **Team Collaboration**: Clear boundaries make parallel development easier
- **Testing**: Layers can be tested in isolation
- **Reusability**: Shared utilities and features are centrally managed

