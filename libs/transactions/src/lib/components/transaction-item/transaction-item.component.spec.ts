import { SimpleChange, SimpleChanges } from '@angular/core';
import {
  creditMockTransaction,
  debitMockTransaction,
} from '../../mocks/transactions-mocks';
import { TransactionItemComponent } from './transaction-item.component';

describe('TransactionItemComponent', () => {
  let component: TransactionItemComponent;

  beforeEach(() => {
    component = new TransactionItemComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnChanges', () => {
    const simplaChanges: SimpleChanges = {
      transaction: new SimpleChange('', '', true),
    };
    it('should set amount to debit transaction amount', () => {
      component.transaction = debitMockTransaction;
      component.ngOnChanges(simplaChanges);
      expect(component.amount).toBe(
        -debitMockTransaction.transaction.amountCurrency.amount
      );
    });
    it('should set amount to credit transaction amount', () => {
      component.transaction = creditMockTransaction;
      component.ngOnChanges(simplaChanges);
      expect(component.amount).toBe(
        debitMockTransaction.transaction.amountCurrency.amount
      );
    });
  });
});
