import { ConditionsService } from '@backbase/foundation-ang/entitlements';
import { MakeTransferPermissionsService } from './make-transfer-permissions.service';
import { TestBed } from '@angular/core/testing';

describe('MakeTransferPermissionsService', () => {
  let service: MakeTransferPermissionsService;
  const mockConditionsService: Pick<ConditionsService, 'resolveEntitlements'> =
    {
      resolveEntitlements: jest.fn(() => Promise.resolve(true)),
    };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MakeTransferPermissionsService,
        { provide: ConditionsService, useValue: mockConditionsService },
      ],
    });
    service = TestBed.inject(MakeTransferPermissionsService);
  });

  it('should evaluate a permission in the entitlements resolver', (done) => {
    service.unlimitedAmountPerTransaction$.subscribe((resolved) => {
      expect(resolved).toBe(true);
      expect(mockConditionsService.resolveEntitlements).toHaveBeenCalledWith(
        'Payments.transfer.limitless'
      );
      done();
    });
  });
});
