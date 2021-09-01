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

  public makeTransfer({ toAccount, amount }: Transfer): void {
    this.latestTransaction$$.next({
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
    });
    this.router.navigate(['transactions']);
  }
}
