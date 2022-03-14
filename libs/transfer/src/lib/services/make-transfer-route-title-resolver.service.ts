import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { of } from 'rxjs';
import { MakeTransferJourneyConfiguration } from './make-transfer-journey-config.service';

@Injectable()
export class MakeTransferRouteTitleResolverService implements Resolve<unknown> {
  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    return of(this.config.slimMode ? route.data['title'] : '');
  }
  constructor(private config: MakeTransferJourneyConfiguration) {}
}
