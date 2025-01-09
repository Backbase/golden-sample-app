import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { TransactionsJourneyConfiguration } from '../transactions-journey-config/transactions-journey-config.service';

@Injectable()
export class TransactionsRouteTitleResolverService {
  resolve(route: ActivatedRouteSnapshot) {
    return !this.config.slimMode ? route.data['title'] : '';
  }
  constructor(private config: TransactionsJourneyConfiguration) {}
}
