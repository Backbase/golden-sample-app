import { Injectable } from '@angular/core';
import { TrackerHandler } from '@backbase/foundation-ang/observability';
import packageInfo from 'package-json';
import { environment } from '../../environments/environment';

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

    // this.tracker.subscribe(ScreenResizeEvent, event => {
    //   console.log(event);
    // });
  }

  initOpenTelemetry(): void {
    console.log('initOpenTelemetry', environment);
    this.openTelemetryConfig = {
      appName: packageInfo.name,
      appVersion: packageInfo.version,
      apiKey: environment.bbApiKey,
      env: 'local',
      isProduction: true,
      isEnabled: environment.isTelemetryTracerEnabled,
      url: environment.telemetryCollectorURL,
    };
  }
}
