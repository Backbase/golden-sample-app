import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE } from '../../communication';
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

const transactions = [{
    categoryCode: '#12a580',
    dates: {
      valueDate: 1600493600000
    },
    transaction: {
      amountCurrency: {
        amount: 5000,
        currencyCode: 'EUR'
      },
      type: 'Salaries',
      creditDebitIndicator: 'CRDT'
    },
    merchant: {
      name: 'Backbase',
      accountNumber: 'SI64397745065188826'
    }
  }, {
    categoryCode: '#12a580',
    dates: {
      valueDate: 1600387200000
    },
    transaction: {
      amountCurrency: {
        amount: 82.02,
        currencyCode: 'EUR'
      },
      type: 'Card Payment',
      creditDebitIndicator: 'DBIT'
    },
    merchant: {
      name: 'The Tea Lounge',
      accountNumber: 'SI64397745065188826'
    }
  }, {
    categoryCode: '#d51271',
    dates: {
      valueDate: 1600473600000
    },
    transaction: {
      amountCurrency: {
        amount: 84.64,
        currencyCode: 'EUR'
      },
      type: 'Card Payment',
      creditDebitIndicator: 'DBIT'
    },
    merchant: {
      name: 'Texaco',
      accountNumber: 'SI64397745065188826'
    }
  }];

  const additionalTransaction = {
    categoryCode: '#fbbb1b',
    dates: {
      valueDate: 1599868800000
    },
    transaction: {
      amountCurrency: {
        amount: 142.95,
        currencyCode: 'EUR'
      },
      type: 'Online Transfer',
      creditDebitIndicator: 'DBIT'
    },
    merchant: {
      name: 'Southern Electric Company',
      accountNumber: 'SI64397745065188826'
    }
  };
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
            transactions$: of(transactions)
          },
        },
        {
          provide: TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
          useValue: {
            latestTransaction$: of(additionalTransaction),
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
    component.filter = 'Tea';
    fixture.detectChanges();

    const result = fixture.debugElement.queryAll(By.css('.bb-list__item'));

    expect(result.length).toBe(1);
    expect(result[0].nativeElement.innerText).toBe('The Tea Lounge');
  });
});
