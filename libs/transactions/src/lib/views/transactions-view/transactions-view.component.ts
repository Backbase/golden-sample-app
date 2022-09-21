import { Component, Inject, OnInit, Optional, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, of, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  TransactionsCommunicationService,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
} from '../../communication';
import { TransactionsHttpService } from '../../services/transactions.http.service';

@Component({
  templateUrl: './transactions-view.component.html',
  selector: 'bb-transactions-view',
})
export class TransactionsViewComponent implements OnInit, OnDestroy {
  public title = this.route.snapshot.data['title'];
  public filter = '';
  public selectedAccount: string | null = null;
  public transactions$ = combineLatest([
    this.transactionsService.transactions$,
    this.externalCommunicationService?.latestTransaction$ || of(undefined),
  ]).pipe(
    map(([transactions, latestTransaction]) =>
      latestTransaction
        ? [latestTransaction, ...(transactions || [])]
        : transactions
    )
  );

  private subscription = new Subscription();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly transactionsService: TransactionsHttpService,
    @Optional()
    @Inject(TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE)
    private externalCommunicationService: TransactionsCommunicationService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.route.queryParams.subscribe((params) => {
        this.selectedAccount = params['id'];
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
