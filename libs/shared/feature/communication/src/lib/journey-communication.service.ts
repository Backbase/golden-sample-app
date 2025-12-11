import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  TransactionItem,
  TransactionState,
} from '@backbase/transactions-http-ang';

import { TransactionsCommunicationService } from '@backbase/transactions-journey';

import { MakeTransferCommunicationService } from '@backbase/transfer-journey';
import { Transfer } from '@backbase/transfer-journey/internal/shared-data';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JourneyCommunicationService
  implements MakeTransferCommunicationService, TransactionsCommunicationService
{
  private readonly router: Router = inject(Router);
  private latestTransaction$$ = new BehaviorSubject<
    TransactionItem | undefined
  >(undefined);

  public latestTransaction$ = this.latestTransaction$$.asObservable();

  public makeTransfer(transfer: Transfer): void {
    this.latestTransaction$$.next(this.mapTransferToTransaction(transfer));
    this.router.navigate(['transactions']);
  }

  private mapTransferToTransaction({
    toAccount,
    amount,
  }: Transfer): TransactionItem {
    return {
      state: TransactionState.Completed,
      id: Date.now().toString(),
      arrangementId: '',
      description: 'Transfer to account',
      bookingDate: new Date().toISOString().substring(0, 10),
      type: 'Withdrawal',
      typeGroup: 'payments',
      creditDebitIndicator: 'DBIT',
      transactionAmountCurrency: {
        amount: String(amount),
        currencyCode: 'EUR',
      },
      merchant: {
        name: toAccount,
        id: Number(toAccount),
      },
    };
  }
}
