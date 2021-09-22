import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AmountModule } from '@backbase/ui-ang';

import { TransactionItemComponent } from './transaction-item.component';

@Component({
  selector: 'bb-host-component',
  template: '<bb-transaction-item [transaction]="transaction"></bb-transaction-item>'
})
class HostComponent {
  transaction = {
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
  };
}

describe('TransactionItemComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AmountModule],
      declarations: [ TransactionItemComponent, HostComponent ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set amount positive if the creditDebit indicator has the value of "credit"', async () => {
    component.transaction.transaction.creditDebitIndicator = 'CRDT';
    component.transaction = { ...component.transaction }; // force new instance because it's onpush strategy
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.debugElement.query(By.css('.transactions-item__amount')).nativeElement.classList.contains('negative')).toBe(false);
  });

  it('should set amount negative if the creditDebit indicator has the value of "debit"', async () => {
    component.transaction.transaction.creditDebitIndicator = 'DBIT';
    component.transaction = { ...component.transaction };  // force new instance because it's onpush strategy
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.debugElement.query(By.css('.transactions-item__amount')).nativeElement.classList.contains('negative')).toBe(true);
  });
});
