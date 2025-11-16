import { Provider } from '@angular/core';
import { SharedUserContextService } from './shared-user-context.service';
import { SharedUserContextGuard } from './shared-user-context.guard';

/**
 * Provides the shared user context services.
 * For standalone applications, use provideSharedUserContext() in app config.
 */
export function provideSharedUserContext(): Provider[] {
  return [SharedUserContextService, SharedUserContextGuard];
}
