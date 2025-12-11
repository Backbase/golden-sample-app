import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import {
  MAKE_TRANSFER_JOURNEY_CONFIG,
  MakeTransferJourneyConfig,
} from '@backbase/transfer-journey/internal/shared-data';

@Injectable()
export class MakeTransferRouteTitleResolverService {
  private readonly config: MakeTransferJourneyConfig = inject(
    MAKE_TRANSFER_JOURNEY_CONFIG
  );
  resolve(route: ActivatedRouteSnapshot) {
    return !this.config.slimMode ? route.data['title'] : '';
  }
}
