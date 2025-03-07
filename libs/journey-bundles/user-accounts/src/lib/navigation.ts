import {
  NavigationItemIconPosition,
  NavigationLink,
} from '@backbase-gsa/shared/util/app-core';

export const USER_ACCOUNTS_NAVIGATION: NavigationLink = {
  id: 'user-accounts',
  name: '',
  route: '/accounts',
  group: null,
  icon: {
    name: 'user',
    position: NavigationItemIconPosition.START,
  },
};
