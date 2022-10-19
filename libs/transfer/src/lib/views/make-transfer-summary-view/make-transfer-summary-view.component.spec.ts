import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { of } from 'rxjs';
import { MakeTransferCommunicationService } from '../../services/make-transfer-communication.service';
import {
  MakeTransferJourneyState,
  TransferOperationStatus,
} from '../../state/make-transfer-journey-state.service';
import { MakeTransferSummaryViewComponent } from './make-transfer-summary-view.component';

describe('MakeTransferSymmaryViewComponent', () => {
  let component: MakeTransferSummaryViewComponent;
  let mockCommunicationService:
    | Pick<MakeTransferCommunicationService, 'makeTransfer'>
    | undefined = {
    makeTransfer: jest.fn(),
  };
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
  const createComponent = () => {
    mockTransferState = {
      transfer$: of(transferMock),
      vm$: of({
        transfer: transferMock,
        transferState: TransferOperationStatus.SUCCESSFUL,
        account: undefined,
        loadingStatus: 0,
      }),
      makeTransfer: jest.fn(),
    };
    mockRouter = {
      navigate: jest.fn(),
    };
    component = new MakeTransferSummaryViewComponent(
      mockTransferState as MakeTransferJourneyState,
      mockActivatedRoute as ActivatedRoute,
      mockRouter as Router,
      mockCommunicationService as MakeTransferCommunicationService
    );
  };

  beforeEach(() => {
    createComponent();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
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

  describe('submit', () => {
    it('should emit a submit event', () => {
      mockCommunicationService = undefined;
      createComponent();
      component.submit();
      expect(mockTransferState.makeTransfer).toHaveBeenCalled();
    });
    it('should navigate', () => {
      mockCommunicationService = undefined;
      createComponent();

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
