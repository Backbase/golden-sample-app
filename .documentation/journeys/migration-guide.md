<!-- .documentation/journeys/migration-guide.md -->
##### Migrating from ShellModule to Journey Factory !heading

This guide explains how to migrate an existing journey from the legacy `ShellModule.forRoot()` pattern to the modern `journeyFactory` pattern.

###### Why Migrate?

The `journeyFactory` pattern offers several advantages:

- **Type Safety**: Better TypeScript support and compile-time error detection
- **Simpler Configuration**: Less boilerplate, easier helper functions
- **Better Tree Shaking**: Modern bundlers can eliminate more unused code
- **Clearer Intent**: Configuration is explicit and easier to understand
- **Future Proof**: Aligned with Angular's direction toward standalone components

###### Migration Steps

####### Step 1: Analyze the Current Implementation

First, understand your current journey structure:

```typescript
// Current legacy pattern:
// libs/transfer-journey/src/lib/transfer-journey-shell.module.ts

@NgModule({
  // ... declarations, imports, etc.
})
export class TransferJourneyShellModule {
  static forRoot(
    data: { [key: string]: unknown; route: Route } = { route: defaultRoute }
  ): ModuleWithProviders<TransferJourneyShellModule> {
    return {
      ngModule: TransferJourneyShellModule,
      providers: [provideRoutes([data.route])],
    };
  }
}
```

Identify:
1. The default routes
2. Configuration tokens and interfaces
3. Services that should be configurable
4. Components and imports

####### Step 2: Create the Journey Definition File

Create a new journey definition file using `journeyFactory`:

```typescript
// libs/transfer-journey/src/lib/transfer-journey.ts
import { journeyFactory } from '@backbase/foundation-ang/core';
import { Routes, InjectionToken } from '@angular/router';

// 1. Define your configuration interface
export interface TransferJourneyConfig {
  maskIndicator: boolean;
  maxTransactionAmount: number;
  slimMode: boolean;
}

// 2. Define default values
const defaultConfig: TransferJourneyConfig = {
  maskIndicator: false,
  maxTransactionAmount: 100,
  slimMode: false,
};

// 3. Create configuration token
export const TRANSFER_JOURNEY_CONFIG =
  new InjectionToken<TransferJourneyConfig>('TRANSFER_JOURNEY_CONFIG', {
    providedIn: 'root',
    factory: () => defaultConfig,
  });

// 4. Define your routes
const defaultRoutes: Routes = [
  {
    path: '',
    component: TransferJourneyComponent,
    children: [
      {
        path: 'make-transfer',
        component: MakeTransferViewComponent,
        resolve: { title: MakeTransferRouteTitleResolverService },
      },
      // ... more routes
    ],
  },
];

// 5. Create the journey factory
export const {
  transferJourney,
  withConfig: withFullConfig,
  withCommunicationService: withFullCommunicationService,
} = journeyFactory({
  journeyName: 'transferJourney',
  defaultRoutes,
  tokens: {
    config: TRANSFER_JOURNEY_CONFIG,
    communicationService: TRANSFER_JOURNEY_COMMUNICATION_SERVICE,
  },
});

// 6. Create helper functions for consumers
export const withTransferConfig = (config: Partial<TransferJourneyConfig>) =>
  withFullConfig({
    useValue: {
      ...defaultConfig,
      ...config,
    },
  });

export const withCommunicationService = (
  service: Type<MakeTransferCommunicationService>
) =>
  withFullCommunicationService({
    useExisting: service,
  });
```

####### Step 3: Update the Bundle File

Refactor your bundle to use the journey factory:

```typescript
// libs/journey-bundles/transfer/src/lib/transfer-journey-bundle.module.ts - BEFORE
@NgModule({
  imports: [TransferJourneyShellModule.forRoot()],
  providers: [
    {
      provide: MakeTransferJourneyConfiguration,
      useFactory: (): MakeTransferJourneyConfiguration => ({
        maskIndicator: false,
        maxTransactionAmount: 100,
      }),
    },
    { provide: MakeTransferCommunicationService, useExisting: JourneyCommunicationService },
  ],
})
export class TransferJourneyBundleModule {}
```

```typescript
// libs/journey-bundles/transfer/src/lib/transfer-journey-bundle.module.ts - AFTER
import { transferJourney, withTransferConfig, withCommunicationService } from '@backbase/transfer-journey';
import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

// Create the routes with configuration
const routes: Routes = transferJourney(
  withTransferConfig({
    maskIndicator: false,
    maxTransactionAmount: 100,
  }),
  withCommunicationService(JourneyCommunicationService),
);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [
    MakeTransferAccountHttpService,
    MakeTransferRouteTitleResolverService,
    MakeTransferPermissionsService,
  ],
})
export class TransferJourneyBundleModule {}

export default TransferJourneyBundleModule;
```

####### Step 4: Update the Route Declaration

Keep the route declaration similar, but update the import path:

```typescript
// libs/journey-bundles/transfer/src/lib/route.ts
export const TRANSFER_ROUTE = {
  path: 'transfer',
  loadChildren: () =>
    import('./transfer-journey-bundle.module').then(
      (m) => m.TransferJourneyBundleModule
    ),
  canActivate: [AuthGuard, SharedUserContextGuard],
};
```

####### Step 5: Update Exports

Update the public API to export the new journey function:

```typescript
// libs/transfer-journey/src/index.ts
export * from './lib/transfer-journey-shell.module';
export {
  transferJourney,
  withTransferConfig,
  withCommunicationService,
  TransferJourneyConfig,
  TRANSFER_JOURNEY_CONFIG,
} from './lib/transfer-journey';
export { MakeTransferCommunicationService } from '@backbase/transfer-journey/internal/data-access';
```

####### Step 6: Update the Bundle Exports

Ensure the bundle exports the module as default:

```typescript
// libs/journey-bundles/transfer/src/index.ts
export { TRANSFER_ROUTE } from './lib/route';
```

The bundle file should export as default:

```typescript
// At end of transfer-journey-bundle.module.ts
export default TransferJourneyBundleModule;
```

###### Migration Checklist

- [ ] Create journey definition file with `journeyFactory`
- [ ] Define configuration interface and defaults
- [ ] Create configuration token with `InjectionToken`
- [ ] Export journey function and helper functions
- [ ] Update bundle file to use journey factory
- [ ] Move configuration from `forRoot()` to helper functions
- [ ] Update route declaration (usually no changes needed)
- [ ] Update public API exports
- [ ] Ensure bundle exports module as default
- [ ] Test lazy loading works correctly
- [ ] Test configuration overrides work
- [ ] Test communication service integration
- [ ] Update unit tests

###### Testing Your Migration

After migration, verify:

1. **Lazy Loading** - Route loads correctly when accessed
2. **Configuration** - Custom configuration is applied correctly
3. **Communication** - Journey communication service works
4. **Services** - All services are available within the journey
5. **Type Safety** - TypeScript compilation succeeds

```typescript
// Test that the journey can be imported and configured
import { transferJourney, withTransferConfig } from '@backbase/transfer-journey';

const routes = transferJourney(
  withTransferConfig({
    maskIndicator: true,
    maxTransactionAmount: 500,
  })
);

// Verify routes are created correctly
expect(routes).toBeDefined();
expect(routes.length).toBeGreaterThan(0);
```

###### Common Issues

**Issue**: "Cannot find module 'journeyFactory'"
**Solution**: Ensure you have `@backbase/foundation-ang/core` installed and imported correctly

**Issue**: Services not available in lazy-loaded journey
**Solution**: Ensure services are provided in the NgModule's `providers` array in the bundle file

**Issue**: Configuration not being applied
**Solution**: Verify helper functions are correctly merging with defaults and passing to `withFullConfig`

**Issue**: Type errors in configuration
**Solution**: Ensure your configuration interface and defaults match exactly, including optional properties

###### Additional Resources

- [Journey Factory Patterns](./journey-factory-patterns.md)
- [Configure Journeys](./configure.md)
- [Lazy Loading with Provider Scoping](./lazy-loading-guide.md)
- [Communication Between Journeys](./communication-service.md)

