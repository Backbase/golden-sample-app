import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { of } from 'rxjs';
import { TransactionsJourneyConfiguration } from './transactions-journey-config.service';

@Injectable()
export class TransactionsRouteTitleResolverService implements Resolve<unknown> {
  resolve(route: ActivatedRouteSnapshot, _state: RouterStateSnapshot) {
    return of(this.config.slimMode ? route.data['title'] : '');
  }
  constructor(private config: TransactionsJourneyConfiguration) {}
}
