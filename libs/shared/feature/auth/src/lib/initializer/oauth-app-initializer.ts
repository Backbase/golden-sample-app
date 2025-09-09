import { inject, provideAppInitializer } from '@angular/core';
import { OAuthService } from 'angular-oauth2-oidc';

export const OAUTH_APP_INITIALIZER = provideAppInitializer(async () => {
  const oAuthService = inject(OAuthService);
  await oAuthService.loadDiscoveryDocumentAndTryLogin();
});
