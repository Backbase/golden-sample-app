import { Injectable } from '@angular/core';
import { ConditionsService } from '@backbase/foundation-ang/entitlements';
import { from } from 'rxjs';
@Injectable()
export class MakeTransferPermissionsService {
  unlimitedAmountPerTransaction$ = from(
    this.conditions.resolveEntitlements('Payments.transfer.limitless')
  );
  constructor(private readonly conditions: ConditionsService) {}
}
