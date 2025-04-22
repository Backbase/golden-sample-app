import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  ActivityMonitorConfig,
  ActivityMonitorService,
  ACTIVITY_MONITOR_CONFIG,
} from '@backbase/identity-auth';
import { ModalModule } from '@backbase/ui-ang/modal';
import { ActivityMonitorComponent } from './container/activity-monitor.component';
import { ActivityMonitorLayoutComponent } from './layout/activity-monitor-layout.component';

const uiModules = [ModalModule];

@NgModule({
  imports: [CommonModule, ...uiModules],
  declarations: [ActivityMonitorLayoutComponent, ActivityMonitorComponent],
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
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class ActivityMonitorModule {}
