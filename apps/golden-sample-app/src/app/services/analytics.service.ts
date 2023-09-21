import { Injectable } from '@angular/core';
import { TrackerHandler } from '@backbase/foundation-ang/observability';

/*
This service will receive all the analytics events from your application and from here you can
send all your tracker events to the analytics system (eg: google analytics/segment stc)
 */
@Injectable()
export class AnalyticsService extends TrackerHandler {
  register(): void {
    this.tracker.subscribeAll((event) => {
      console.log('EVENT TRACKER', event);
    });
  }
}
