import { triplets, Navigation } from '@backbase-gsa/shared';

export const TRANSACTIONS_JOURNEY_NAVIGATION: Navigation = {
  name: $localize`transactions list link@@main.transactions.link.text:Transactions List`,
  route: '/transactions',
  icon: 'transactions',
  permissions: triplets.canViewTransactions
}
