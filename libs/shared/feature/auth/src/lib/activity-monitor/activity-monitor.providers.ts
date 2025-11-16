import {
  ActivityMonitorConfig,
  ACTIVITY_MONITOR_CONFIG,
} from '@backbase/identity-auth';

export const ACTIVITY_MONITOR_PROVIDERS = [
  {
    provide: ACTIVITY_MONITOR_CONFIG,
    useValue: {
      maxInactivityDuration: 300,
      countdownDuration: 30,
    } as ActivityMonitorConfig,
  },
];
