import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { TransactionsJourneyConfiguration } from './transactions-journey-config.service';

@Injectable()
export class TransactionsRouteTitleResolverService implements Resolve<string> {
  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    return !this.config.slimMode ? route.data['title'] : '';
  }
  constructor(private config: TransactionsJourneyConfiguration) {}
}
