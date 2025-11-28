<!-- .documentation/journeys/configure.md -->
#### Configure journeys !heading

Journey configuration differs depending on whether you're using the **modern journeyFactory pattern** or the **legacy NgModule pattern**.

###### Modern Pattern (journeyFactory)

**Example**: [Transactions Journey](https://github.com/Backbase/golden-sample-app/tree/main/libs/transactions-journey)

In the journey definition file, configuration is handled through helper functions:

```typescript
// libs/transactions-journey/src/lib/transactions-journey.ts
export interface TransactionsJourneyConfig {
  pageSize: number;
  slimMode: boolean;
}

const defaultConfig: TransactionsJourneyConfig = {
  pageSize: 20,
  slimMode: true,
};

// Helper function for configuration
export const withConfig = (config: Partial<TransactionsJourneyConfig>) =>
  withFullConfig({
    useValue: {
      ...defaultConfig,
      ...config,
    },
  });
```

In the bundle file, you pass configuration to the journey:

```typescript
// libs/journey-bundles/transactions/src/lib/transactions.bundle.ts
const routes: Routes = transactionsJourney(
  withConfig({
    pageSize: 10,
    slimMode: false,
  }),
  withCommunicationService(JourneyCommunicationService),
);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [
    {
      provide: TRANSACTIONS_JOURNEY_CONFIG,
      useFactory: (configService: TransactionsConfigService) => {
        return configService.getJourneyConfig();
      },
      deps: [TransactionsConfigService],
    },
  ],
})
export class TransactionsModule {}
```

###### Legacy Pattern (ShellModule.forRoot)

**Examples**: [Transfer Journey](https://github.com/Backbase/golden-sample-app/tree/main/libs/transfer-journey), [ACH Positive Pay Journey](https://github.com/Backbase/golden-sample-app/tree/main/libs/ach-positive-pay-journey)

In the journey shell module, configuration is provided through `forRoot()`:

```typescript
// libs/transfer-journey/src/lib/transfer-journey-shell.module.ts
@NgModule({...})
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

In the bundle, you use the `forRoot()` method:

```typescript
// libs/journey-bundles/transfer/src/lib/transfer-journey-bundle.module.ts
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
  ],
})
export class TransferJourneyBundleModule {}
```

###### Configuration Best Practices

1. **Define a configuration interface** that matches your journey's needs
2. **Provide sensible defaults** so journeys work without configuration
3. **Use factory functions** to merge defaults with custom values
4. **Allow runtime configuration** through services when needed
5. **Document configuration options** so consumers know what can be customized