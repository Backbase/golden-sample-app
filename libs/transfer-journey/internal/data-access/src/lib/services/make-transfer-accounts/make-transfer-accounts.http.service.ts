import {
  ArrangementsHttpService,
  BalancesHttpService,
  ProductSummaryHttpService,
} from '@backbase/arrangement-manager-http-ang';
import {
  ErrorStatus,
  ErrorStatusEnum,
} from '../make-transfer-journey-state/make-transfer-journey-state.service';
import { map, of } from 'rxjs';

import { Injectable } from '@angular/core';
import { Transfer } from '@backbase-gsa/transfer-journey/internal/shared-data';

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

  accountBalance(productKind: string) {
    return this.balanceDataHttpService
      .getAggregations({
        externalProductKindIds: [productKind],
        includeTotals: true,
      })
      .pipe(
        map((item) => {
          const balances = item[0]?.aggregatedBalances?.[0];
          return parseInt(balances?.amount || '0', 10);
        })
      );
  }

  getAccountById(accountId: string) {
    return this.arrangementDataHttpService.getArrangementById({
      arrangementId: accountId,
    });
  }

  makeTransfer(_transfer: Transfer) {
    console.log(_transfer);
    // save transfer in api
    return of({});
  }

  checkErrorStatus(status: number): ErrorStatus {
    switch (status) {
      case 404:
        return ErrorStatusEnum.NOT_FOUND;
      default:
        return ErrorStatusEnum.UNKNOWN_ERROR;
    }
  }

  constructor(
    private readonly productSummaryDataHttpService: ProductSummaryHttpService,
    private readonly balanceDataHttpService: BalancesHttpService,
    private readonly arrangementDataHttpService: ArrangementsHttpService
  ) {}
}
