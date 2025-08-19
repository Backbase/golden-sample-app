import { EnvironmentProviders, Provider } from '@angular/core';
import { OAUTH_APP_INITIALIZER } from './oauth-app-initializer';
import { AuthInterceptor } from '../interceptor/auth.interceptor';
import {
  AuthConfig,
  OAuthStorage,
  provideOAuthClient,
} from 'angular-oauth2-oidc';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

export type AuthInitializerConfig = {
  apiRoot: string;
  authConfig: AuthConfig;
};

export function provideAuthentication({
  apiRoot,
  authConfig,
}: AuthInitializerConfig): (Provider | EnvironmentProviders)[] {
  return [
    OAUTH_APP_INITIALIZER,

    provideOAuthClient({
      resourceServer: {
        allowedUrls: [apiRoot],
        sendAccessToken: true,
      },
    }),

    { provide: AuthConfig, useValue: authConfig },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ];
}
