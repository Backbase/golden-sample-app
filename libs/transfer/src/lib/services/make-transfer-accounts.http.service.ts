import {
  ArrangementsHttpService,
  BalancesHttpService,
  ProductSummaryHttpService,
} from '@backbase/data-ang/arrangements';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';
import { Transfer } from '../model/Account';

@Injectable()
export class MakeTransferAccountHttpService {
  getAccounts() {
    return this.productSummaryDataHttpService.getArrangementsByBusinessFunction(
      {
        businessFunction: 'Product Summary',
        resourceName: 'Product Summary',
        privilege: 'view',
        size: 1000000,
      },
      'body'
    );
  }

  accountBalance(accountKind: number) {
    return this.balanceDataHttpService
      .getAggregations({ productKindIds: [accountKind] })
      .pipe(
        map((item) => {
          const balances = item[0]?.aggregatedBalances?.[0];
          return parseInt(balances?.amount || '0', 10);
        }),
        catchError(() => of(300))
      );
  }

  getAccountById(accountId: string) {
    return this.arrangementDataHttpService.getArrangementById({
      arrangementId: accountId,
    });
  }

  makeTransfer(_transfer: Transfer) {
    // save transfer in api
    return of({});
  }

  constructor(
    private readonly productSummaryDataHttpService: ProductSummaryHttpService,
    private readonly balanceDataHttpService: BalancesHttpService,
    private readonly arrangementDataHttpService: ArrangementsHttpService
  ) {}
}
