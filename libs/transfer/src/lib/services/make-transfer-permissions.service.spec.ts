import { MakeTransferPermissionsService } from './make-transfer-permissions.service';

describe('MakeTransferPermissionsService', () => {
  let service: MakeTransferPermissionsService;
  const conditionsServiceStub: any = {
    resolveEntitlements: jest.fn(() => Promise.resolve(true)),
  };
  beforeEach(() => {
    service = new MakeTransferPermissionsService(conditionsServiceStub);
  });

  it('should evaluate a permission in the entitlements resolver', (done) => {
    service.unlimitedAmountPerTransaction$.subscribe((resolved) => {
      expect(resolved).toBe(true);
      expect(conditionsServiceStub.resolveEntitlements).toHaveBeenCalledWith(
        'Payments.transfer.limitless'
      );
      done();
    });
  });
});
