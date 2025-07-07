import { TestBed } from '@angular/core/testing';
import { ConditionsService } from '@backbase/foundation-ang/entitlements';
import { MakeTransferPermissionsService } from './make-transfer-permissions.service';

describe('MakeTransferPermissionsService', () => {
  let service: MakeTransferPermissionsService;
  const mockConditionsService = {
    resolveEntitlements: jest.fn(() => Promise.resolve(true)),
  } as unknown as ConditionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MakeTransferPermissionsService,
        { provide: ConditionsService, useValue: mockConditionsService },
      ],
    });
    service = TestBed.inject(MakeTransferPermissionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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
