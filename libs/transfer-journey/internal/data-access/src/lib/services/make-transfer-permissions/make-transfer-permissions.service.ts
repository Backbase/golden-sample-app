import { inject, Injectable } from '@angular/core';
import { ConditionsService } from '@backbase/foundation-ang/entitlements';
import { from } from 'rxjs';
@Injectable()
export class MakeTransferPermissionsService {
  private readonly conditions: ConditionsService = inject(ConditionsService);
  unlimitedAmountPerTransaction$ = from(
    this.conditions.resolveEntitlements('Payments.transfer.limitless')
  );
}
