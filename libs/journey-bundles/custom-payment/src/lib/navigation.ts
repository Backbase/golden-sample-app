import {
  NavigationItemIconPosition,
  NavigationLink,
} from '@backbase/shared/util/app-core';

export const CUSTOM_PAYMENT_NAVIGATION: NavigationLink = {
  id: 'transfer-internal',
  name: $localize`:
    Make a Payment Link - 'Make internal payment'|This string is used
    as the text for a link that navigates to the internal payment
    page. It is presented to the user as a navigation item in the
    horizontal navigation bar. This text is located in the navigation
    items section of the layout.@@main.make-a-payment.link.text:Make internal payment`,
  route: '/transfer-internal',
  group: null,
  icon: {
    name: 'verified-user',
    position: NavigationItemIconPosition.START,
  },
};
