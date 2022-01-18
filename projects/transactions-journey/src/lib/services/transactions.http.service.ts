import { Injectable } from '@angular/core';
import { combineLatest, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TransactionsJourneyConfiguration } from './transactions-journey-config.service';
import { map, switchMap } from 'rxjs/operators';

import { GetTransactionsRequestParams, GetTransactionsWithPostRequestParams, TransactionClientHttpService} from '@backbase/data-ang/transactions';
import { ProductSummaryHttpService } from '@backbase/data-ang/arrangements';

@Injectable()
export class TransactionsHttpService {
  private arrangements$ = this.productSummaryDataHttpService
    .getArrangementsByBusinessFunction({
      businessFunction: 'Product Summary',
      resourceName: 'Product Summary',
      privilege: 'view',
      size: 1000000,
      },
      'body',
    )
    .pipe(
      map((arrangements) => arrangements.map((ar) => ar.id)),
    );

  // public transactions$ = combineLatest([
  //   this.arrangements$,
  //   of(this.configurationService.pageSize),
  // ]).pipe(
  //   switchMap(
  //     ([arrangements, pageSize]) =>
  //       this.transactionsHttpService.getTransactions(
  //         {
  //           transactionListRequest: {
  //             arrangementsIds: arrangements,
  //             size: pageSize,
  //           },
  //         } as GetTransactionsRequestParams,
  //         'body',
  //       ),
  //   ),
  // );

  public transactions$ = combineLatest([
    this.arrangements$,
    of(this.configurationService.pageSize),
  ]).pipe(
    switchMap(
      ([arrangements, pageSize]) =>
        this.transactionsHttpService.getTransactionsWithPost(
          {
            transactionListRequest: {
              arrangementsIds: arrangements,
              size: pageSize,
            },
          } as GetTransactionsWithPostRequestParams,
          'response',
        ),
    ),
  );

  constructor(
    private http: HttpClient,
    private readonly configurationService: TransactionsJourneyConfiguration,
    private transactionsHttpService: TransactionClientHttpService,
    private readonly productSummaryDataHttpService: ProductSummaryHttpService,
  ) {}
}
