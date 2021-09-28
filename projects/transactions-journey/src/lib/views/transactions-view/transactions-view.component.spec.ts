import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE } from '../../communication';
import { debitMockTransaction, transactionsMock } from '../../mocks/transactions-mocks';
import { Transaction } from '../../model/transaction';

import { FilterTransactionsPipe } from '../../pipes/filter-transactions.pipe';
import { TransactionsHttpService } from '../../services/transactions.http.service';
import { TransactionsViewComponent } from './transactions-view.component';

@Component({
  selector: 'bb-transaction-item',
  template: '<div>{{transaction?.merchant?.name}}</div>'
})
class FakeTransactionsItem {
  @Input() transaction: Transaction[] | undefined;
}

@Component({
  selector: 'bb-text-filter',
  template: '<div></div>'
})
class FakeTextFilter {
  @Output() textChange = new EventEmitter<string>();
}

describe('TransactionsViewComponent', () => {
  let fixture: ComponentFixture<TransactionsViewComponent>;
  let component: TransactionsViewComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CommonModule, RouterTestingModule],
      declarations: [FakeTransactionsItem, FakeTextFilter, FilterTransactionsPipe, TransactionsViewComponent],
      providers: [
        {
          provide: TransactionsHttpService,
          useValue: {
            transactions$: of(transactionsMock)
          },
        },
        {
          provide: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
          useValue: {
            latestTransaction$: of(debitMockTransaction),
          }
        }
      ],
    });

    fixture = TestBed.createComponent(TransactionsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load all the transactions from both communciation service and http service', () => {
    const result = fixture.debugElement.queryAll(By.css('.bb-list__item'));

    expect(result.length).toBe(4);
  });

  it('should filter transactions based on the search', () => {
    fixture.debugElement.query(By.css('bb-text-filter')).triggerEventHandler('textChange', 'Tea');
    fixture.detectChanges();

    const result = fixture.debugElement.queryAll(By.css('.bb-list__item'));

    expect(result.length).toBe(1);
    expect(result[0].nativeElement.innerText).toBe('The Tea Lounge');
  });
});
