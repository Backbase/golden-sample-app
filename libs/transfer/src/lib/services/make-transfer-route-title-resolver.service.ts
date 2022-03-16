import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { MakeTransferJourneyConfiguration } from './make-transfer-journey-config.service';

@Injectable()
export class MakeTransferRouteTitleResolverService implements Resolve<string> {
  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    return !this.config.slimMode ? route.data['title'] : '';
  }
  constructor(private config: MakeTransferJourneyConfiguration) {}
}
