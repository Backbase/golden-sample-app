import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { MakeTransferJourneyConfiguration } from '../make-transfer-journey-config/make-transfer-journey-config.service';

@Injectable()
export class MakeTransferRouteTitleResolverService {
  private readonly config: MakeTransferJourneyConfiguration = inject(
    MakeTransferJourneyConfiguration
  );
  resolve(route: ActivatedRouteSnapshot) {
    return !this.config.slimMode ? route.data['title'] : '';
  }
}
