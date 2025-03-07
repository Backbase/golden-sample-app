import {
  NavigationItemIconPosition,
  NavigationLink,
} from '@backbase-gsa/shared/util/app-core';

export const TRANSFER_NAVIGATION: NavigationLink = {
  id: 'transfer',
  name: $localize`:
    Make transfer link - 'Make transfer'|This string is used as the
    text for a link that navigates to the transfer page. It is
    presented to the user as a navigation item in the horizontal
    navigation bar. This text is located in the navigation items
    section of the layout.@@main.transfer.link.text:Make transfer`,
  route: '/transfer',
  group: null,
  icon: {
    name: 'payments',
    position: NavigationItemIconPosition.START,
  },
};
