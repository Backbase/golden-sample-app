<!-- .documentation/components-included-in-app/main.md -->
#### Components included in the app !heading

- **Auth module:** Defines authentication.
- **Locale selector for SPA:** Supports multiple languages. Check the example codes [here](https://github.com/Backbase/golden-sample-app/tree/main/apps/golden-sample-app/src/app/locale-selector)
- **Entitlements:** Configure [entitlements](https://backbase.io/documentation/web-devkit/journey-development-basics/use-access-control-journeys) for different scenarios. Check the example code in the [`app.component.html`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/app.component.html#L74) and [`entitlementsTriplets.ts`](https://github.com/Backbase/golden-sample-app/blob/main/apps/golden-sample-app/src/app/services/entitlementsTriplets.ts)
- **Transactions Journey:** Configured in [`transactions.bundle.ts`](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/transactions/src/lib/transactions.bundle.ts) (Modern journeyFactory pattern)
- **Transfer Journey:** Configured in [`transfer-journey-bundle.module.ts`](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/transfer/src/lib/transfer-journey-bundle.module.ts) (Legacy NgModule pattern)
- **ACH Positive Pay Journey:** Configured in [`ach-positive-pay-journey-bundle.module.ts`](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/ach-positive-pay/src/lib/ach-positive-pay-journey-bundle.module.ts) (Legacy NgModule pattern)
- **Custom Payment Journey:** Configured in [`initiate-payment-journey-bundle.module.ts`](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/custom-payment/src/lib/initiate-payment-journey-bundle.module.ts) (Legacy NgModule pattern)
- **User Accounts Journey:** Configured in [`user-accounts.module.ts`](https://github.com/Backbase/golden-sample-app/blob/main/libs/journey-bundles/user-accounts/src/lib/user-accounts.module.ts) (Legacy NgModule pattern)
