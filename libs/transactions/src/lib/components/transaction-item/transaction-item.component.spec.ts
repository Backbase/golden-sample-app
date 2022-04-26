import { Component, QueryList, TemplateRef, ViewChildren } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AmountModule } from '@backbase/ui-ang/amount';
import {
  creditMockTransaction,
  debitMockTransaction,
} from '../../mocks/transactions-mocks';
import { TransactionItemComponent } from './transaction-item.component';
import { AdditionalDetailsContext } from '../../directives/transaction-additional-details.directive';
import { ExtensionTemplatesService } from '../../services/extension-templates.service';

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

  let templateFixture: ComponentFixture<TestComponent>;

  const mockTemplateService: Partial<ExtensionTemplatesService> = {
    additionalDetailsTemplate: undefined
  }

  const ADDITIONAL_DETAILS_TEXT = 'my-addition-details-template';

  @Component({
    template: `
      <div>
        <ng-template>${ADDITIONAL_DETAILS_TEXT}</ng-template>
      </div>
      `
  })
  class TestComponent {
    @ViewChildren(TemplateRef) templates?: QueryList<TemplateRef<AdditionalDetailsContext>>
  }

  beforeEach(async () => {
    mockTemplateService.additionalDetailsTemplate = undefined;

    await TestBed.configureTestingModule({
      declarations: [TransactionItemComponent, TestTransactionItemComponent, TestComponent],
      imports: [AmountModule],
      providers: [
        { provide: ExtensionTemplatesService, useValue: mockTemplateService }
      ]
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

    it('should render template for additional data if found in config service', () => {
      expect(fixture.nativeElement.innerHTML).not.toContain(ADDITIONAL_DETAILS_TEXT);

      templateFixture = TestBed.createComponent(TestComponent);
      templateFixture.detectChanges();
      mockTemplateService.additionalDetailsTemplate = templateFixture.componentInstance.templates?.get(0);

      fixture = TestBed.createComponent(TestTransactionItemComponent);
      fixture.detectChanges();

      expect(fixture.nativeElement.innerHTML).toContain(ADDITIONAL_DETAILS_TEXT);
    });
  });
});