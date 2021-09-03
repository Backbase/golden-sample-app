import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

import { Transaction, TransactionsCommunicationService } from 'transactions-journey';
import { MakeTransferCommunicationService, Transfer } from 'transfer-journey';

@Injectable({
  providedIn: 'root',
})
export class JourneyCommunicationService implements MakeTransferCommunicationService, TransactionsCommunicationService {
  private categoryCodeForTransfer = '#c12020';
  private latestTransaction$$ = new BehaviorSubject<Transaction | undefined>(undefined);

  public latestTransaction$ = this.latestTransaction$$.asObservable();

  constructor(private router: Router) {}

  private mapTransferToTransaction({ toAccount, amount }: Transfer): Transaction {
    return {
      categoryCode: this.categoryCodeForTransfer,
      dates: {
        valueDate: new Date().getTime(),
      },
      transaction: {
        amountCurrency: {
          amount,
          currencyCode: 'EUR',
        },
        type: 'Transfer to account',
        creditDebitIndicator: 'DBIT',
      },
      merchant: {
        name: toAccount,
        accountNumber: toAccount,
      },
    };
  }

  public makeTransfer(transfer: Transfer): void {
    this.latestTransaction$$.next(this.mapTransferToTransaction(transfer));
    this.router.navigate(['transactions']);
  }
}
