import {
  NavigationItemIconPosition,
  NavigationLink,
} from '@backbase-gsa/shared/util/app-core';
import { PERMISSIONS } from '@backbase-gsa/shared/util/permissions';

export const TRANSACTIONS_NAVIGATION: NavigationLink = {
  id: 'transactions',
  name: $localize`:
   Transactions list link - 'Transactions List'|This string is used
    as the text for a link that navigates to the transactions list
    page. It is presented to the user as a navigation item in the
    horizontal navigation bar. This text is located in the navigation
    items section of the layout.@@main.transactions.link.text:Transactions List`,
  route: '/transactions',
  group: null,
  icon: {
    name: 'transactions',
    position: NavigationItemIconPosition.START,
  },
  permissions: PERMISSIONS.canViewTransactions,
};
