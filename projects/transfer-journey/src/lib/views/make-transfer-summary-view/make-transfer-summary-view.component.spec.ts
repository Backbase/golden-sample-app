import { Component, EventEmitter, Input, NO_ERRORS_SCHEMA, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, Data } from '@angular/router';
import { MakeTransferCommunicationService } from '../../services/make-transfer-communication.service';
import { MakeTransferJourneyState } from '../../services/make-transfer-journey-state.service';
import { MakeTransferSummaryViewComponent } from './make-transfer-summary-view.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Transfer } from '../../model/Account';
import { of } from 'rxjs';


@Component({
  selector: 'bb-make-transfer-summary',
  template: '<div>my fake component</div>'
})
class MakeTransferSummaryFakeComponent {
  @Input() transfer: Transfer | undefined;
  @Output() submitTransfer = new EventEmitter<void>();
  @Output() closeTransfer = new EventEmitter<void>();
}

describe('MakeTransferSymmaryViewComponent', () => {
  let fixture: ComponentFixture<MakeTransferSummaryViewComponent>;

  let transferStoreStub: Pick<MakeTransferJourneyState, 'transfer' | 'currentValue'>;
  let externalCommunicationServiceStub: jasmine.SpyObj<MakeTransferCommunicationService>;

  const activatedRouteStub = {
    snapshot: {
      data: {
        title: 'some mocked title',
      } as Data,
    } as ActivatedRouteSnapshot,
  };

  const accountMock = {
    amount: 100,
    fromAccount: '001',
    toAccount: '002'
  };

  const getComponent = {
    transferForm: () => fixture.debugElement.query(By.directive(MakeTransferSummaryFakeComponent)),
  };

  beforeEach(() => {
    transferStoreStub = {
      currentValue: accountMock,
      transfer: of(accountMock),
    };

    externalCommunicationServiceStub = jasmine.createSpyObj<MakeTransferCommunicationService>(['makeTransfer']);

    TestBed.configureTestingModule({
      declarations: [MakeTransferSummaryViewComponent, MakeTransferSummaryFakeComponent],
      imports: [RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRouteStub,
        },
        {
          provide: MakeTransferJourneyState,
          useValue: transferStoreStub,
        },
        {
          provide: MakeTransferCommunicationService,
          useValue: externalCommunicationServiceStub,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(MakeTransferSummaryViewComponent);
  });

  it('should call external communication service when transfer is submitted', () => {
    const transferForm = getComponent.transferForm().componentInstance as MakeTransferSummaryFakeComponent;

    transferForm.submitTransfer.emit();

    expect(externalCommunicationServiceStub.makeTransfer).toHaveBeenCalledWith(accountMock);
  });
});
