import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { MakeTransferCommunicationService } from '../../services/make-transfer-communication.service';
import { MakeTransferJourneyState } from '../../services/make-transfer-journey-state.service';
import { MakeTransferSummaryViewComponent } from './make-transfer-summary-view.component';

describe('MakeTransferSymmaryViewComponent', () => {
  let component: MakeTransferSummaryViewComponent;
  let mockCommunicationService:
    | Pick<MakeTransferCommunicationService, 'makeTransfer'>
    | undefined = {
    makeTransfer: jest.fn(),
  };
  const mockTransferState: Pick<MakeTransferJourneyState, 'currentValue'> = {
    currentValue: {
      fromAccount: 'somAccount',
      toAccount: 'somAccount',
      amount: 12,
    },
  };
  const snapshot: Pick<ActivatedRouteSnapshot, 'data'> = {
    data: {
      title: 'someTitle',
    },
  };
  const mockActivatedRoute: Pick<ActivatedRoute, 'snapshot'> = {
    snapshot: snapshot as ActivatedRouteSnapshot,
  };
  const mockRouter: Pick<Router, 'navigate'> = {
    navigate: jest.fn(),
  };
  const createComponent = () => {
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
    it('should call use communicationService', () => {
      component.submit();
      expect(mockCommunicationService?.makeTransfer).toBeCalledWith(
        mockTransferState.currentValue
      );
    });
    it('should navigate', () => {
      mockCommunicationService = undefined;
      createComponent();
      component.submit();
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['../make-transfer-success'],
        {
          relativeTo: mockActivatedRoute,
        }
      );
    });
  });
});
