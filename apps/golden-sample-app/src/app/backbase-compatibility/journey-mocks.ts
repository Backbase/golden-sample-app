/**
 * Mock implementations of journey modules to fix build issues.
 * These mocks provide just enough code to satisfy the TypeScript compiler.
 */

import { Injectable, InjectionToken, NgModule, Type } from '@angular/core';
import { Observable, of } from 'rxjs';

// Transactions Journey mocks
@Injectable()
export class ArrangementsService {
  arrangements$ = of([]);

  getArrangements() {
    return of([]);
  }
}

// Add IconMap for transactions-journey with indexable interface
export interface IconMapType {
  [key: string]: {
    [key: string]: string;
  };
}

export const IconMap: IconMapType = {
  'transaction-type': {
    payment: 'payment',
    transfer: 'transfer',
    default: 'default',
  },
  // Add a default property to handle any string index access
  default: {
    default: 'default',
  },
};

// Add TransactionListTrackerEvent for transactions-journey as a class
export class TransactionListTrackerEvent {
  static LOADED = 'loaded';
  static FILTERED = 'filtered';
  static PAGINATED = 'paginated';

  // Required properties
  type: string;
  readonly name = 'transaction-list';
  readonly bubbles = false;
  readonly cancelable = false;
  readonly cancelBubble = false;
  readonly composed = false;
  readonly defaultPrevented = false;
  readonly eventPhase = 0;
  readonly isTrusted = true;
  readonly returnValue = true;
  readonly srcElement = null;
  readonly target = null;
  readonly timeStamp = Date.now();
  readonly currentTarget = null;

  // Event phase constants
  static readonly NONE = 0;
  static readonly CAPTURING_PHASE = 1;
  static readonly AT_TARGET = 2;
  static readonly BUBBLING_PHASE = 3;
  readonly NONE = 0;
  readonly CAPTURING_PHASE = 1;
  readonly AT_TARGET = 2;
  readonly BUBBLING_PHASE = 3;

  constructor(public event: any) {
    this.type = event?.type || 'default';
  }

  // Required event methods
  composedPath(): EventTarget[] {
    return [];
  }
  preventDefault(): void {}
  stopImmediatePropagation(): void {}
  stopPropagation(): void {}
  initEvent(): void {}
}

export interface TransactionItem {
  id: string;
  arrangementId: string;
  description: string;
  bookingDate: string;
  type: string;
  typeGroup: string;
  creditDebitIndicator: string;
  transactionAmountCurrency: {
    amount: string;
    currencyCode: string;
  };
  merchant?: {
    name: string;
    id: number;
  };
  state?: string;
  additions?: Record<string, any>;
  counterPartyAccountNumber?: string;
}

export enum TransactionState {
  Completed = 'COMPLETED',
}

export interface TransactionAdditionalDetailsContext {
  transaction: TransactionItem;
  counterPartyAccountNumber?: string;
  additions?: Record<string, any>;
}

@Injectable()
export class TransactionsCommunicationService {
  makeTransfer(transfer?: any): void {}
}

export const TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE =
  new InjectionToken<TransactionsCommunicationService>(
    'TransactionsCommunicationService'
  );

export interface TransactionAdditionalDetailsComponent {
  transaction: TransactionItem;
  context?: TransactionAdditionalDetailsContext;
}

export class TransactionsJourneyConfiguration {
  pageSize = 10;
  slimMode = false;
}

export class TransactionsRouteTitleResolverService {
  resolve() {
    return 'Transactions';
  }
}

export interface TransactionsJourneyExtensionsConfig {
  transactionItemAdditionalDetails?: Type<TransactionAdditionalDetailsComponent>;
}

export const TRANSACTION_EXTENSIONS_CONFIG =
  new InjectionToken<TransactionsJourneyExtensionsConfig>(
    'TRANSACTION_EXTENSIONS_CONFIG'
  );

@NgModule({})
export class TransactionsJourneyModule {
  static forRoot(
    config: {
      routes?: any[];
      extensionSlots?: TransactionsJourneyExtensionsConfig;
    } = {}
  ) {
    return {
      ngModule: TransactionsJourneyModule,
      providers: [],
    };
  }
}

@NgModule({})
export class TransactionsViewModule {}

export class TransactionsViewComponent {}

// Transfer Journey mocks
// Add Account interface for transfer-journey
export interface Account {
  id: string;
  name?: string;
  number?: string;
  currency?: string;
  balance?: number;
  amount?: number; // Added missing amount property
}

export interface Transfer {
  toAccount: string;
  fromAccount?: string; // Added missing fromAccount property
  amount: number;
}

// Add TransferSubmitEvent for transfer-journey-feature
export class TransferSubmitEvent {
  // Required properties
  readonly name = 'submit_transfer';
  readonly bubbles = false;
  readonly cancelable = false;
  readonly cancelBubble = false;
  readonly composed = false;
  readonly defaultPrevented = false;
  readonly eventPhase = 0;
  readonly isTrusted = true;
  readonly returnValue = true;
  readonly srcElement = null;
  readonly target = null;
  readonly timeStamp = Date.now();
  readonly currentTarget = null;
  readonly type = 'submit_transfer';

  // Event phase constants
  static readonly NONE = 0;
  static readonly CAPTURING_PHASE = 1;
  static readonly AT_TARGET = 2;
  static readonly BUBBLING_PHASE = 3;
  readonly NONE = 0;
  readonly CAPTURING_PHASE = 1;
  readonly AT_TARGET = 2;
  readonly BUBBLING_PHASE = 3;

  constructor(public transfer: Transfer) {}

  // Required event methods
  composedPath(): EventTarget[] {
    return [];
  }
  preventDefault(): void {}
  stopImmediatePropagation(): void {}
  stopPropagation(): void {}
  initEvent(): void {}
}

// Add TRANSLATIONS for transfer-journey-ui
export const TRANSLATIONS = {
  maxError: 'Maximum amount exceeded',
  minError: 'Minimum amount required',
  requiredError: 'This field is required',
  incorrectFormat: 'Invalid format',
  limitError: (maxLimit: number) => `Maximum amount limit is ${maxLimit}`,
  form: {
    from: 'From',
    to: 'To',
    amount: 'Amount',
    submit: 'Submit',
  },
};

@Injectable()
export class MakeTransferCommunicationService {
  makeTransfer(transfer?: any): void {}
}

export class MakeTransferJourneyConfiguration {
  maskIndicator?: boolean;
  maxTransactionAmount?: number;
  slimMode?: boolean;
  pageSize?: number;
}

@NgModule({})
export class TransferJourneyModule {
  static forRoot(config: any = {}) {
    return {
      ngModule: TransferJourneyModule,
      providers: [],
    };
  }
}

export { TransferJourneyModule as TransferJourneyShellModule };

// ACH Positive Pay Journey mocks
export interface TransactionSigningInterface {
  signTransaction(transactionId: string): Observable<boolean>;
}

export const ACH_TRANSACTION_SIGNING_SERVICE =
  new InjectionToken<TransactionSigningInterface>(
    'ACH_TRANSACTION_SIGNING_SERVICE'
  );

@NgModule({})
export class AchPositivePayJourneyShellModule {
  static forRoot(config: any = {}) {
    return {
      ngModule: AchPositivePayJourneyShellModule,
      providers: [],
    };
  }
}
