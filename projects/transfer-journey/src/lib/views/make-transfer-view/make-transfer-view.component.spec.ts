import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, ActivatedRouteSnapshot, Data } from '@angular/router';
import { Transfer } from '../../model/Account';
import { MakeTransferCommunicationService } from '../../services/make-transfer-communication.service';
import { MakeTransferJourneyConfiguration } from '../../services/make-transfer-journey-config.service';
import { MakeTransferJourneyState } from '../../services/make-transfer-journey-state.service';
import { MakeTransferViewComponent } from './make-transfer-view.component';

describe('MakeTransferViewComponent', () => {
  let fixture: ComponentFixture<MakeTransferViewComponent>;

  let transferStoreStub: jasmine.SpyObj<MakeTransferJourneyState>;
  let configServiceStub: jasmine.SpyObj<MakeTransferJourneyConfiguration>;
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
    configServiceStub = jasmine.createSpyObj<MakeTransferJourneyConfiguration>(['maskIndicator']);
    externalCommunicationServiceStub = jasmine.createSpyObj<MakeTransferCommunicationService>(['makeTransfer']);

    TestBed.configureTestingModule({
      declarations: [MakeTransferViewComponent],
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
          provide: MakeTransferJourneyConfiguration,
          useValue: configServiceStub,
        },
        {
          provide: MakeTransferCommunicationService,
          useValue: externalCommunicationServiceStub,
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    });

    fixture = TestBed.createComponent(MakeTransferViewComponent);
  });

  it('should call external communication service when transfer is submitted', () => {
    const mockSubmittedTransfer = {} as Transfer;
    const transferForm = getComponent.transferForm();

    transferForm.triggerEventHandler('submitTransfer', mockSubmittedTransfer);

    expect(externalCommunicationServiceStub.makeTransfer).toHaveBeenCalledWith(mockSubmittedTransfer);
  });
});
