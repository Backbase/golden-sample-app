import { NgModule } from '@angular/core';
import {
  ActivityMonitorConfig,
  ActivityMonitorService,
  ACTIVITY_MONITOR_CONFIG,
} from '@backbase/identity-auth';
import { ActivityMonitorComponent } from './container/activity-monitor.component';

@NgModule({
  imports: [ActivityMonitorComponent],
  providers: [
    ActivityMonitorService,
    {
      provide: ACTIVITY_MONITOR_CONFIG,
      useValue: {
        maxInactivityDuration: 300,
        countdownDuration: 30,
      } as ActivityMonitorConfig,
    },
  ],
  exports: [ActivityMonitorComponent],
})
export class ActivityMonitorModule {}
