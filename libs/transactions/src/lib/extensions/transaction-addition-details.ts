import { InjectionToken } from "@angular/core";
import { TransactionItem } from "@backbase/data-ang/transactions";

export type AdditionDetailsData = Pick<TransactionItem, 'additions' | 'merchant' | 'counterPartyAccountNumber'>

export const TRANSACTION_ADDITION_DETAILS = new InjectionToken('transaction-addition-details');
export const TRANSACTION_ADDITION_DETAILS_DATA = new InjectionToken<AdditionDetailsData>('transaction-addition-details-input');