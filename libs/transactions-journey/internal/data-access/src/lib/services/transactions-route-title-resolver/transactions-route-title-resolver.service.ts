import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import {
  TRANSACTIONS_JOURNEY_CONFIG,
  TransactionsJourneyConfig,
} from '@backbase/transactions-journey/internal/shared-data';

@Injectable()
export class TransactionsRouteTitleResolverService {
  private readonly config: TransactionsJourneyConfig = inject(
    TRANSACTIONS_JOURNEY_CONFIG
  );
  resolve(route: ActivatedRouteSnapshot) {
    return !this.config.slimMode ? route.data['title'] : '';
  }
}
