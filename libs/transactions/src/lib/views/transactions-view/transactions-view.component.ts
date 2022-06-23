import { AfterViewInit, Component, ElementRef, Inject, Optional, QueryList, ViewChildren } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  TransactionsCommunicationService,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
} from '../../communication';
import { TransactionItemComponent } from '../../components/transaction-item/transaction-item.component';
import { TransactionsHttpService } from '../../services/transactions.http.service';

@Component({
  templateUrl: './transactions-view.component.html',
  selector: 'bb-transactions-view',
})
export class TransactionsViewComponent implements AfterViewInit {
  public title = this.route.snapshot.data['title'];
  public filter = '';
  @ViewChildren(TransactionItemComponent, { read: ElementRef }) transactionItemsElementRefs!: QueryList<ElementRef>;
  @ViewChildren(TransactionItemComponent) transactionItems!: QueryList<TransactionItemComponent>;

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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly transactionsService: TransactionsHttpService,
    @Optional()
    @Inject(TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE)
    private externalCommunicationService: TransactionsCommunicationService
  ) {}

  ngAfterViewInit(): void {
    this.transactionItemsElementRefs.changes.subscribe((items) => {
      items.forEach((item: ElementRef, index: number) => {
        item.nativeElement.addEventListener('click', () => {
          const event = new CustomEvent('bb-analytics', { detail: this.transactionItems.get(index)?.transaction });
          window.dispatchEvent(event);
        });
      });
    });
  }
}
