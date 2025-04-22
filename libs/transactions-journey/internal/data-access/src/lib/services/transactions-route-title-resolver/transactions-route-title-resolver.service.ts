import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  ResolveFn,
  RedirectCommand,
} from '@angular/router';
import { TransactionsJourneyConfiguration } from '../transactions-journey-config/transactions-journey-config.service';

@Injectable()
export class TransactionsRouteTitleResolverService
  implements Resolve<string | RedirectCommand | null>
{
  resolve(route: ActivatedRouteSnapshot): string | RedirectCommand | null {
    return !this.config.slimMode ? route.data['title'] : '';
  }
  constructor(private config: TransactionsJourneyConfiguration) {}
}
