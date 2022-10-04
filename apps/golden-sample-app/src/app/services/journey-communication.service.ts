import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { TransactionItem } from '@backbase/data-ang/transactions';
import { TransactionsCommunicationService } from '@backbase-gsa/transactions';
import {
  MakeTransferCommunicationService,
  Transfer,
} from '@backbase-gsa/transfer';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JourneyCommunicationService
  implements MakeTransferCommunicationService, TransactionsCommunicationService
{
  private latestTransaction$$ = new BehaviorSubject<
    TransactionItem | undefined
  >(undefined);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  public latestTransaction$ = this.latestTransaction$$.asObservable();

  constructor(private router: Router) {}

  public makeTransfer(transfer: Transfer): void {
    this.latestTransaction$$.next(this.mapTransferToTransaction(transfer));
    this.router.navigate(['transactions']);
  }

  private mapTransferToTransaction({
    toAccount,
    amount,
  }: Transfer): TransactionItem {
    return {
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
