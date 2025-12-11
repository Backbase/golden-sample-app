import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { of } from 'rxjs';
import {
  MakeTransferCommunicationService,
  MakeTransferJourneyState,
  TransferOperationStatus,
} from '@backbase/transfer-journey/internal/data-access';
import { MakeTransferSummaryViewComponent } from './make-transfer-summary-view.component';
import { TestBed } from '@angular/core/testing';

describe('MakeTransferSymmaryViewComponent', () => {
  let component: MakeTransferSummaryViewComponent;
  let mockCommunicationService: Pick<
    MakeTransferCommunicationService,
    'makeTransfer'
  >;
  const transferMock = {
    fromAccount: 'somAccount',
    toAccount: 'somAccount',
    amount: 12,
  };
  let mockTransferState: Pick<
    MakeTransferJourneyState,
    'transfer$' | 'vm$' | 'makeTransfer'
  >;
  const snapshot: Pick<ActivatedRouteSnapshot, 'data'> = {
    data: {
      title: 'someTitle',
    },
  };
  const mockActivatedRoute: Pick<ActivatedRoute, 'snapshot'> = {
    snapshot: snapshot as ActivatedRouteSnapshot,
  };
  let mockRouter: Pick<Router, 'navigate'>;

  const createComponent = (withCommunicationService = true) => {
    mockTransferState = {
      transfer$: of(transferMock),
      vm$: of({
        transfer: transferMock,
        transferState: TransferOperationStatus.SUCCESSFUL,
        account: undefined,
        loadingStatus: 0,
        errorStatus: undefined,
      }),
      makeTransfer: jest.fn(),
    };
    mockRouter = {
      navigate: jest.fn(),
    };
    mockCommunicationService = {
      makeTransfer: jest.fn(),
    };

    const providers: any[] = [
      { provide: MakeTransferJourneyState, useValue: mockTransferState },
      { provide: ActivatedRoute, useValue: mockActivatedRoute },
      { provide: Router, useValue: mockRouter },
    ];

    if (withCommunicationService) {
      providers.push({
        provide: MakeTransferCommunicationService,
        useValue: mockCommunicationService,
      });
    }

    TestBed.configureTestingModule({
      imports: [MakeTransferSummaryViewComponent],
      providers,
    });
    const fixture = TestBed.createComponent(MakeTransferSummaryViewComponent);
    component = fixture.componentInstance;
  };

  beforeEach(() => {
    TestBed.resetTestingModule();
    createComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit', () => {
    it('should call makeTransfer on the transfer store', () => {
      component.submit();
      expect(mockTransferState.makeTransfer).toHaveBeenCalled();
    });
  });

  describe('close', () => {
    it('should navigate', () => {
      component.close();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['../make-transfer'], {
        relativeTo: mockActivatedRoute,
      });
    });
  });

  describe('with external communication service', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      createComponent(true);
    });

    it('should call external communication service when transfer is successful', () => {
      // The component subscribes to vm$ and automatically triggers navigation/communication
      // when transferState is SUCCESSFUL, which is already set in our mock
      expect(mockCommunicationService.makeTransfer).toHaveBeenCalledWith(
        transferMock
      );
    });
  });

  describe('without external communication service', () => {
    beforeEach(() => {
      TestBed.resetTestingModule();
      createComponent(false);
    });

    it('should navigate to success page when transfer is successful', () => {
      // The component subscribes to vm$ and automatically triggers navigation
      // when transferState is SUCCESSFUL, which is already set in our mock
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['../make-transfer-success'],
        {
          relativeTo: mockActivatedRoute,
          skipLocationChange: true,
          state: {
            transfer: transferMock,
          },
        }
      );
    });
  });
});
