import { TestBed } from '@angular/core/testing';
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

describe('MakeTransferSymmaryViewComponent', () => {
  let component: MakeTransferSummaryViewComponent;
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

  describe('with communication service', () => {
    let mockCommunicationService: Pick<
      MakeTransferCommunicationService,
      'makeTransfer'
    >;

    beforeEach(() => {
      mockCommunicationService = {
        makeTransfer: jest.fn(),
      };
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

      TestBed.configureTestingModule({
        providers: [
          MakeTransferSummaryViewComponent,
          { provide: MakeTransferJourneyState, useValue: mockTransferState },
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
          { provide: Router, useValue: mockRouter },
          {
            provide: MakeTransferCommunicationService,
            useValue: mockCommunicationService,
          },
        ],
      });

      component = TestBed.inject(MakeTransferSummaryViewComponent);
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    describe('close', () => {
      it('should navigate', () => {
        component.close();
        expect(mockRouter.navigate).toHaveBeenCalledWith(['../make-transfer'], {
          relativeTo: mockActivatedRoute,
        });
      });
    });
  });

  describe('without communication service', () => {
    beforeEach(() => {
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

      TestBed.configureTestingModule({
        providers: [
          MakeTransferSummaryViewComponent,
          { provide: MakeTransferJourneyState, useValue: mockTransferState },
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
          { provide: Router, useValue: mockRouter },
          // Explicitly not providing MakeTransferCommunicationService
        ],
      });

      component = TestBed.inject(MakeTransferSummaryViewComponent);
    });

    describe('submit', () => {
      it('should emit a submit event', () => {
        component.submit();
        expect(mockTransferState.makeTransfer).toHaveBeenCalled();
      });

      it('should navigate', () => {
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
});
