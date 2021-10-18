import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AmountModule } from '@backbase/ui-ang/amount';
import { creditMockTransaction, debitMockTransaction } from '../../mocks/transactions-mocks';

import { TransactionItemComponent } from './transaction-item.component';

@Component({
  selector: 'bb-host-component',
  template: `
    <bb-transaction-item [transaction]="creditTransaction"></bb-transaction-item>
    <bb-transaction-item [transaction]="debitTransaction"></bb-transaction-item>
  `
})
class HostComponent {
  creditTransaction = creditMockTransaction;
  debitTransaction = debitMockTransaction;
}

describe('TransactionItemComponent', () => {
  let component: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AmountModule],
      declarations: [ TransactionItemComponent, HostComponent ]
    });

    fixture = TestBed.createComponent(HostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set amount positive if the creditDebit indicator has the value of "credit"', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.debugElement.queryAll(By.css('.transactions-item__amount'))[0].nativeElement.classList.contains('negative')).toBe(false);
  });

  it('should set amount negative if the creditDebit indicator has the value of "debit"', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.debugElement.queryAll(By.css('.transactions-item__amount'))[1].nativeElement.classList.contains('negative')).toBe(true);
  });
});
