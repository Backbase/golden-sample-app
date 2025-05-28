import {
  NavigationItemIconPosition,
  NavigationLink,
} from '@backbase/shared/util/app-core';
import { PERMISSIONS } from '@backbase/shared/util/permissions';

export const ACH_POSITIVE_PAY_NAVIGATION: NavigationLink = {
  id: 'ach-positive-pay',
  name: $localize`:
    Ach Positive pay link - 'ACH Positive Pay'|This string is used as
    the text for a link that navigates to the ACH Positive Pay page.
    It is presented to the user as a navigation item in the horizontal
    navigation bar. This text is located in the navigation items
    section of the layout.@@main.ach-positive-pay.link.text:ACH Positive Pay`,
  route: '/ach-positive-pay',
  group: null,
  icon: {
    name: 'verified-user',
    position: NavigationItemIconPosition.START,
  },
  permissions: PERMISSIONS.canViewAchRule,
};
