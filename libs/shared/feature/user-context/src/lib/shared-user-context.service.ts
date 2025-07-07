import { inject, Injectable, Optional } from '@angular/core';
import { OAuthStorage } from 'angular-oauth2-oidc';

/**
 * Abstract implementation for the storage mechanism for the user context
 * service agreement ID.
 *
 * Concrete implementations could be localStorage, sessionStorage, or some
 * other custom implementation (e.g., an in-memory storage).
 */
export abstract class UserContextStorage {
  abstract getItem(key: string): string | null;
  abstract setItem(key: string, data: string): void;
}

/**
 * Key used to store the user context in the configured UserContextStorage implementation.
 */
export const USER_CONTEXT_KEY = 'bb-user-context';

/**
 * Service that delegates to the configured UserContextStorage mechanism for
 * storing and retrieving the user context.
 *
 * If no UserContextStorage mechanism is configured, will fall back to the
 * configured OAuthStorage mechanism.  If that is not set, will use the
 * browser's sessionStorage.
 */
@Injectable({
  providedIn: 'root',
})
export class SharedUserContextService {
  private readonly store: UserContextStorage;
  private readonly userContextStorage: UserContextStorage | null = inject(
    UserContextStorage,
    { optional: true }
  );
  private readonly oAuthStorage: OAuthStorage | null = inject(OAuthStorage, {
    optional: true,
  });

  constructor() {
    this.store = this.userContextStorage || this.oAuthStorage || sessionStorage;
  }

  getServiceAgreementId(): string | undefined {
    return this.store.getItem(USER_CONTEXT_KEY) ?? undefined;
  }

  setServiceAgreementId(id: string) {
    return this.store.setItem(USER_CONTEXT_KEY, id);
  }
}
