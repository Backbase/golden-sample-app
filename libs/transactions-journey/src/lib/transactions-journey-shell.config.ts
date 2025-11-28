import { InjectionToken } from '@angular/core';

export type TransactionsJourneyExtensionsConfig = Record<string, unknown>;
export const TRANSACTION_EXTENSIONS_CONFIG =
  new InjectionToken<TransactionsJourneyExtensionsConfig>(
    'TRANSACTION_EXTENSIONS_CONFIG',
    {
      providedIn: 'root',
      factory: () => ({}),
    }
  );
