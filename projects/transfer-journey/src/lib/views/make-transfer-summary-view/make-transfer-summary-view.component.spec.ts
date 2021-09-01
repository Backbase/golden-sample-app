import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, Data } from '@angular/router';
import { MakeTransferCommunicationService } from '../../services/make-transfer-communication.service';
import { MakeTransferJourneyState } from '../../services/make-transfer-journey-state.service';
import { MakeTransferSummaryViewComponent } from './make-transfer-summary-view.component';
import { Transfer } from '../../model/Account';

describe('MakeTransferSymmaryViewComponent', () => {
  let fixture: ComponentFixture<MakeTransferSummaryViewComponent>;

  let transferStoreStub: jasmine.SpyObj<MakeTransferJourneyState>;
  let externalCommunicationServiceStub: jasmine.SpyObj<MakeTransferCommunicationService>;

  const activatedRouteStub = {
    snapshot: {
      data: {
        title: 'some mocked title',
      } as Data,
    } as ActivatedRouteSnapshot,
  };

  const getComponent = {
    transferForm: () => fixture.debugElement.query(By.css('bb-make-transfer-form')),
  };

  beforeEach(() => {
    transferStoreStub = jasmine.createSpyObj<MakeTransferJourneyState>(['next']);
    externalCommunicationServiceStub = jasmine.createSpyObj<MakeTransferCommunicationService>(['makeTransfer']);

    TestBed.configureTestingModule({
      declarations: [MakeTransferSummaryViewComponent],
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
    const mockSubmittedTransfer = {} as Transfer;
    const transferForm = getComponent.transferForm();

    transferForm.triggerEventHandler('submitTransfer', mockSubmittedTransfer);

    expect(externalCommunicationServiceStub.makeTransfer).toHaveBeenCalledWith(mockSubmittedTransfer);
  });
});
