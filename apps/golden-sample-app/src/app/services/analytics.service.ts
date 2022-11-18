import { Injectable } from '@angular/core';
import { TrackerHandler } from '@backbase/foundation-ang/observability';

@Injectable()
export class AnalyticsService extends TrackerHandler {
  register(): void {
    this.tracker.subscribeAll((event) => {
      console.log('EVENT TRACKER', event);
    });

    // this.tracker.subscribe(ScreenResizeEvent, event => {
    //   console.log(event);
    // });
  }
}