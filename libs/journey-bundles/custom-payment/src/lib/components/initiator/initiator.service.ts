import { Observable, map } from 'rxjs';
import {
  ProductSummaryHttpService,
  ProductSummaryItem,
} from '@backbase/arrangement-manager-http-ang';

import { AccountSelectorItems } from './initiator.model';
import { Injectable } from '@angular/core';

const DUMMY_REQUEST_PARAMS = {
  businessFunction: 'A2A Transfer',
  resourceName: 'Payments',
  privilege: 'create',
  debitAccount: true,
};

@Injectable()
export class InitiatorService {
  arrangements$: Observable<AccountSelectorItems>;

  constructor(
    private readonly productSummaryHttpService: ProductSummaryHttpService
  ) {
    this.arrangements$ = this.productSummaryHttpService
      .getArrangementsByBusinessFunction(DUMMY_REQUEST_PARAMS)
      .pipe(
        map((arrangements: ProductSummaryItem[]): AccountSelectorItems => {
          return arrangements.map((arrangement) => {
            return {
              id: arrangement.id,
              balance: arrangement.bookedBalance,
              currency: arrangement.currency,
              name: arrangement.name,
              number: arrangement.BBAN || arrangement.IBAN,
            };
          });
        })
      );
  }
}
