import { PropertyResolver } from "@backbase/foundation-ang/web-sdk";
import { MakeTransferPermissionsService } from "./make-transfer-permissions.service";

describe('MakeTransferPermissionsService', () => {
  let service: MakeTransferPermissionsService;
  let conditionsServiceStub: PropertyResolver; 
  beforeEach(() => {
    conditionsServiceStub = {
      resolveEntitlements: jasmine.createSpy('resolveEntitlements').and.returnValue(Promise.resolve(true)),
    };

    service = new MakeTransferPermissionsService(conditionsServiceStub);
  });

  it('should evaluate a permission in the entitlements resolver', (done) => {
    service.unlimitedAmountPerTransaction$.subscribe((resolved) => {
      expect(resolved).toBe(true);
      expect(conditionsServiceStub.resolveEntitlements).toHaveBeenCalledWith('Payments.transfer.limitless');
      done();
    });
  });
});