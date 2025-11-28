import { Provider } from '@angular/core';
import {
  ActivityMonitorConfig,
  ACTIVITY_MONITOR_CONFIG,
} from '@backbase/identity-auth';

/**
 * Provides the default activity monitor configuration.
 * For standalone applications, use provideActivityMonitor() in app config.
 */
export function provideActivityMonitor(
  config?: Partial<ActivityMonitorConfig>
): Provider[] {
  return [
    {
      provide: ACTIVITY_MONITOR_CONFIG,
      useValue: {
        maxInactivityDuration: 300,
        countdownDuration: 30,
        ...config,
      } as ActivityMonitorConfig,
    },
  ];
}
