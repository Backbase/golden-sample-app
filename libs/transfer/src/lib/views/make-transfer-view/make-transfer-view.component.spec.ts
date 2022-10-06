import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { of } from 'rxjs';
import { Transfer } from '../../model/Account';
import { MakeTransferJourneyConfiguration } from '../../services/make-transfer-journey-config.service';
import { MakeTransferJourneyState } from '../../state/make-transfer-journey-state.service';
import { MakeTransferPermissionsService } from '../../services/make-transfer-permissions.service';
import { MakeTransferViewComponent } from './make-transfer-view.component';

describe('MakeTransferViewComponent', () => {
  let component: MakeTransferViewComponent;
  const mockTransferState: Pick<
    MakeTransferJourneyState,
    'next' | 'loadAccounts' | 'vm$'
  > = {
    next: jest.fn(),
    loadAccounts: jest.fn(),
    vm$: of(),
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
  const mockPermissions: Pick<
    MakeTransferPermissionsService,
    'unlimitedAmountPerTransaction$'
  > = {
    unlimitedAmountPerTransaction$: of(true),
  };

  const mockConfig: Pick<
    MakeTransferJourneyConfiguration,
    'maxTransactionAmount'
  > = {
    maxTransactionAmount: 12,
  };
  const mockTransfer: Transfer = {
    fromAccount: 'from',
    toAccount: 'to',
    amount: 1,
  };

  beforeEach(() => {
    component = new MakeTransferViewComponent(
      mockActivatedRoute as ActivatedRoute,
      mockRouter as Router,
      mockTransferState as MakeTransferJourneyState,
      mockPermissions as MakeTransferPermissionsService,
      mockConfig as MakeTransferJourneyConfiguration
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submitTransfer', () => {
    it('should navigate and update store', () => {
      component.submitTransfer(mockTransfer);
      expect(mockTransferState.next).toHaveBeenCalledWith(mockTransfer);
      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['../make-transfer-summary'],
        {
          relativeTo: mockActivatedRoute,
          skipLocationChange: true,
          state: {
            transfer: mockTransfer,
          },
        }
      );
    });
  });
});
