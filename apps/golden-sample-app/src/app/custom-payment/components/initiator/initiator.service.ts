import { Injectable } from '@angular/core';
import {
  ProductSummaryHttpService,
  ProductSummaryItem,
} from '@backbase/arrangement-manager-http-ang';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AccountSelectorItems } from './initiator.model';

const DUMMY_REQUEST_PARAMS = {
  businessFunction: 'A2A Transfer',
  resourceName: 'Payments',
  privilege: 'create',
  debitAccount: true,
};

@Injectable()
export class InitiatorService {
  arrangements$: Observable<AccountSelectorItems> =
    this.productSummaryHttpService
      .getArrangementsByBusinessFunction(DUMMY_REQUEST_PARAMS)
      .pipe(
        map((arrangements: Array<ProductSummaryItem>): AccountSelectorItems => {
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

  constructor(
    private readonly productSummaryHttpService: ProductSummaryHttpService
  ) {}
}
