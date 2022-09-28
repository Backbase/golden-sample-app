import { Injectable } from '@angular/core';
import {
  GetTransactionsWithPostRequestParams,
  TransactionClientHttpService,
  TransactionItem,
} from '@backbase/data-ang/transactions';
import { combineLatest, Observable, of } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { ArrangementsService } from './arrangements.service';
import { TransactionsJourneyConfiguration } from './transactions-journey-config.service';

@Injectable()
export class TransactionsHttpService {
  public transactions$: Observable<TransactionItem[] | undefined> =
    combineLatest([
      this.arrangementsService.arrangements$,
      of(this.configurationService.pageSize),
    ]).pipe(
      switchMap(([arrangements, pageSize]) =>
        this.transactionsHttpService.getTransactionsWithPost(
          {
            transactionListRequest: {
              arrangementsIds: arrangements.map((x) => x.id),
              size: pageSize,
              from: 0,
              orderBy: 'bookingDate',
              direction: 'DESC',
              state: 'COMPLETED',
            },
          } as GetTransactionsWithPostRequestParams,
          'body'
        )
      ),
      shareReplay()
    );

  constructor(
    private readonly configurationService: TransactionsJourneyConfiguration,
    private readonly transactionsHttpService: TransactionClientHttpService,
    private readonly arrangementsService: ArrangementsService
  ) {}
}
