import { ConditionsService } from '@backbase/foundation-ang/entitlements';
import { MakeTransferPermissionsService } from './make-transfer-permissions.service';

describe('MakeTransferPermissionsService', () => {
  let service: MakeTransferPermissionsService;
  const mockConditionsService: Pick<ConditionsService, 'resolveEntitlements'> =
    {
      resolveEntitlements: jest.fn(() => Promise.resolve(true)),
    };
  beforeEach(() => {
    service = new MakeTransferPermissionsService(
      <ConditionsService>mockConditionsService
    );
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
