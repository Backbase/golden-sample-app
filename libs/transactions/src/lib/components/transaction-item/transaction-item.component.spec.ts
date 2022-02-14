import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AmountModule } from '@backbase/ui-ang/amount';
import {
  creditMockTransaction,
  debitMockTransaction,
} from '../../mocks/transactions-mocks';
import { TransactionItemComponent } from './transaction-item.component';

@Component({
  selector: 'bb-transaction-item-test-component',
  template: `<bb-transaction-item
    [transaction]="transactionMock"
  ></bb-transaction-item>`,
})
class TestTransactionItemComponent {
  transactionMock = debitMockTransaction;
}

describe('TransactionItemComponent', () => {
  let fixture: ComponentFixture<TestTransactionItemComponent>;
  let component: TestTransactionItemComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionItemComponent, TestTransactionItemComponent],
      imports: [AmountModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestTransactionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('rendering', () => {
    it('should have negative color indication if the amount is lower then zero', () => {
      const negativeColorIndicatorEl = fixture.nativeElement.querySelector(
        '.transactions-item__color-indication--negative'
      );

      expect(negativeColorIndicatorEl).not.toBeNull();
    });

    it('should have positive color indication if the amount is greater then zero', () => {
      component.transactionMock = creditMockTransaction;
      fixture.detectChanges();
      const positiveColorIndicatorEl = fixture.nativeElement.querySelector(
        '.transactions-item__color-indication--positive'
      );

      expect(positiveColorIndicatorEl).not.toBeNull();
    });
  });
});
