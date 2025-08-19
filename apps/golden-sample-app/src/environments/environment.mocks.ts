import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApplicationConfig, Injectable } from '@angular/core';
import { API_ROOT } from '@backbase/foundation-ang/core';
import { provideObservability } from '@backbase/foundation-ang/observability';
import { AuthService } from '@backbase/identity-auth';
import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { NEVER, Observable, of } from 'rxjs';
import { AchPositivePayInterceptor } from '../app/interceptors/ach-positive-pay.interceptor';
import { AnalyticsService } from '../app/services/analytics.service';
import { baseTelemetryConfig } from './telemetry-config';

const apiRoot = '/api';

@Injectable()
export class MockAuthService {
  readonly isAuthenticated$: Observable<boolean> = of(true);

  initLoginFlow(): void {
    // no-op
  }

  getLocale(): string | undefined {
    return undefined;
  }
}

@Injectable()
export class MockOAuthService {
  readonly events = NEVER;
}

export const environment: Pick<ApplicationConfig, 'providers'> = {
  providers: [
    {
      provide: AuthService,
      useClass: MockAuthService,
    },
    {
      provide: OAuthService,
      useClass: MockOAuthService,
    },
    {
      provide: AuthConfig,
      useValue: {},
    },
    {
      provide: API_ROOT,
      useValue: apiRoot,
    },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AchPositivePayInterceptor,
      multi: true,
    },

    provideObservability({
      handler: AnalyticsService,
      openTelemetryConfig: {
        ...baseTelemetryConfig,
        env: 'mock',
        isProduction: false,
        isEnabled: false,
      },
    }),
  ],
};
