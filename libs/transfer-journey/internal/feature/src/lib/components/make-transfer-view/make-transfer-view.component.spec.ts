import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Router,
} from '@angular/router';
import { of } from 'rxjs';
import { Transfer } from '@backbase/transfer-journey/internal/shared-data';
import {
  MakeTransferJourneyState,
  MakeTransferPermissionsService,
} from '@backbase/transfer-journey/internal/data-access';
import {
  MAKE_TRANSFER_JOURNEY_CONFIG,
  MakeTransferJourneyConfig,
} from '@backbase/transfer-journey/internal/shared-data';
import { MakeTransferViewComponent } from './make-transfer-view.component';
import { TestBed } from '@angular/core/testing';

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

  const mockConfig: Pick<MakeTransferJourneyConfig, 'maxTransactionAmount'> = {
    maxTransactionAmount: 12,
  };
  const mockTransfer: Transfer = {
    fromAccount: 'from',
    toAccount: 'to',
    amount: 1,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MakeTransferViewComponent,
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: MakeTransferJourneyState, useValue: mockTransferState },
        { provide: MakeTransferPermissionsService, useValue: mockPermissions },
        { provide: MAKE_TRANSFER_JOURNEY_CONFIG, useValue: mockConfig },
      ],
    });
    component = TestBed.inject(MakeTransferViewComponent);
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
