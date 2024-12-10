import { Navigation, triplets } from '@backbase-gsa/shared';

export const ACH_POSITIVE_PAY_JOURNEY_NAVIGATION: Navigation = {
  name: $localize`Ach Positive pay link@@main.ach-positive-pay.link.text:ACH Positive Pay`,
  route: '/ach-positive-pay',
  icon: 'verified-user',
  permissions: triplets.canViewAchRule,
};
