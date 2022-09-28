import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { MakeTransferJourneyConfiguration } from './make-transfer-journey-config.service';

@Injectable()
export class MakeTransferRouteTitleResolverService implements Resolve<string> {
  resolve(route: ActivatedRouteSnapshot) {
    return !this.config.slimMode ? route.data['title'] : '';
  }
  constructor(private config: MakeTransferJourneyConfiguration) {}
}
