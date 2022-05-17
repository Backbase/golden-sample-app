import {InjectionToken, Type} from "@angular/core";
import { TransactionItem } from "@backbase/data-ang/transactions";
import {ExtensionComponent} from "../extension-slot.directive";

export type TransactionAdditionalDetailsComponent = ExtensionComponent<TransactionItem>;

export interface TransactionsJourneyExtensionsConfig {
  transactionItem?: Type<TransactionAdditionalDetailsComponent>;
  // other extensions slots here
}

// Private injection token
export const ΘTRANSACTION_EXTENSIONS_CONFIG = new InjectionToken<TransactionsJourneyExtensionsConfig>('TRANSACTION_EXTENSIONS_CONFIG');
