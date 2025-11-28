<!-- .documentation/journeys/simple-examples.md -->
#### Simple examples of journeys !heading

###### Modern Pattern Examples (journeyFactory)

- **Transactions Journey** ✓ Recommended
  - Pattern: journeyFactory
  - [Journey Definition](https://github.com/Backbase/golden-sample-app/blob/main/libs/transactions-journey/src/lib/transactions-journey.ts)
  - [Bundle File](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/transactions/src/lib/transactions.bundle.ts)
  - [Route Definition](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/transactions/src/lib/route.ts)
  - [How it works](https://github.com/Backbase/golden-sample-app/tree/main/libs/journey-bundles/transactions/src/lib)

###### Legacy Pattern Examples (NgModule)

- **Transfer Journey**
  - Pattern: ShellModule.forRoot()
  - [Journey Library](https://github.com/Backbase/golden-sample-app/tree/main/libs/transfer-journey)
  - [Shell Module](https://github.com/Backbase/golden-sample-app/blob/main/libs/transfer-journey/src/lib/transfer-journey-shell.module.ts)
  - [Bundle Configuration](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/transfer/src/lib/transfer-journey-bundle.module.ts)
  - [Route Definition](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/transfer/src/lib/route.ts)

- **ACH Positive Pay Journey**
  - Pattern: ShellModule.forRoot()
  - [Bundle Configuration](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/ach-positive-pay/src/lib/ach-positive-pay-journey-bundle.module.ts)
  - [Route Definition](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/ach-positive-pay/src/lib/route.ts)

- **Custom Payment Journey**
  - Pattern: ShellModule.forRoot()
  - [Bundle Configuration](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/custom-payment/src/lib/initiate-payment-journey-bundle.module.ts)
  - [Route Definition](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/custom-payment/src/lib/route.ts)

- **User Accounts Journey**
  - Pattern: ShellModule.forRoot()
  - [Bundle Configuration](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/user-accounts/src/lib/user-accounts.module.ts)
  - [Route Definition](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/user-accounts/src/lib/route.ts)

###### Recommended Approach

For new journeys, use the **journeyFactory pattern** demonstrated by the Transactions Journey. It provides:
- Better type safety
- Clearer separation of concerns
- Easier configuration
- Better tree-shaking by bundlers

See [Journey Factory Patterns](./journey-factory-patterns.md) for more details on implementing new journeys.
