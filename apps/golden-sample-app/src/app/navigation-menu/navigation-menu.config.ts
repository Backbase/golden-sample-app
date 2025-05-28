import { ACH_POSITIVE_PAY_NAVIGATION } from '@backbase/journey-bundles/ach-positive-pay';
import { CUSTOM_PAYMENT_NAVIGATION } from '@backbase/journey-bundles/custom-payment';
import { TRANSACTIONS_NAVIGATION } from '@backbase/journey-bundles/transactions';
import { TRANSFER_NAVIGATION } from '@backbase/journey-bundles/transfer';
import {
  NavigationDynamicComponent,
  NavigationItem,
  NavigationLink,
} from '@backbase/shared/util/app-core';

const entitlementsTests: NavigationLink[] = [
  {
    ...TRANSACTIONS_NAVIGATION,
    name: $localize`:transactions list link@@main.transactions.link.text:Entitlements test - No grouping.`,
    permissions:
      'EntPayments.AchPositivePay.create AND EntPayments.ManagePositivePay.create OR EntPayments.AchPositivePay.view',
  },
  {
    ...TRANSACTIONS_NAVIGATION,
    name: $localize`:transactions list link@@main.transactions.link.text:Entitlements test - Grouping.`,
    permissions:
      'EntPayments.AchPositivePay.create AND (EntPayments.ManagePositivePay.create OR EntPayments.AchPositivePay.view)',
  },
  {
    ...TRANSACTIONS_NAVIGATION,
    name: $localize`:transactions list link@@main.transactions.link.text:Entitlements test - Nested groups.`,
    permissions:
      '((EntPayments.ManagePositivePay.create OR EntPayments.AchPositivePay.view) AND EntPayments.AchPositivePay.view) OR EntPayments.ManagePositivePay.create',
  },
  {
    ...TRANSACTIONS_NAVIGATION,
    name: $localize`:transactions list link@@main.transactions.link.text:Entitlements test - NOT operators on groups.`,
    permissions:
      '!((EntPayments.ManagePositivePay.create OR EntPayments.AchPositivePay.view) AND EntPayments.AchPositivePay.view) OR EntPayments.ManagePositivePay.create',
  },
  {
    ...TRANSACTIONS_NAVIGATION,
    name: $localize`:transactions list link@@main.transactions.link.text:Entitlements test - Using multiple NOT operators on groups.`,
    permissions:
      '!(!(EntPayments.ManagePositivePay.create OR EntPayments.AchPositivePay.view) AND EntPayments.AchPositivePay.view) OR !EntPayments.ManagePositivePay.create',
  },
];

export const NAVIGATION_GROUPS: NavigationItem[] = [];

export const NAVIGATION_BUNDLE: Array<
  NavigationLink | NavigationDynamicComponent
> = [
  TRANSFER_NAVIGATION,
  ...entitlementsTests,
  TRANSACTIONS_NAVIGATION,
  ACH_POSITIVE_PAY_NAVIGATION,
  CUSTOM_PAYMENT_NAVIGATION,
];
