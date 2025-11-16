import { SharedUserContextService } from './shared-user-context.service';
import { SharedUserContextGuard } from './shared-user-context.guard';

export const SHARED_USER_CONTEXT_PROVIDERS = [
  SharedUserContextService,
  SharedUserContextGuard,
];
