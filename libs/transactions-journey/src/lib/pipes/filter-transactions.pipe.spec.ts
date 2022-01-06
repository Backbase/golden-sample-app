import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FilterTransactionsPipe } from './filter-transactions.pipe';

@Component({
  selector: 'bb-host',
  template: '<span class="item" *ngFor="let data of transactions |  filterTransactions: filter">{{data.merchant.name}}</span>'
})
class HostComponent {
  filter = '';
  transactions = [{
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
}

describe('FilterTransactionsPipe', () => {
  it('should filter the transactions according to a string value', () => {
    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [HostComponent, FilterTransactionsPipe]
    });

    const fixture = TestBed.createComponent(HostComponent);
    const component = fixture.componentInstance;

    component.filter = 'Tea';
    fixture.detectChanges();

    const results = fixture.debugElement.queryAll(By.css('.item'));

    expect(results.length).toBe(1);
    expect(results[0].nativeElement.innerText).toBe('The Tea Lounge');
  });
});
