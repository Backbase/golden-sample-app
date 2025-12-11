import { inject, Injectable } from '@angular/core';
import {
  GetTransactionsWithPostRequestParams,
  TransactionClientHttpService,
  TransactionItem,
} from '@backbase/transactions-http-ang';
import { combineLatest, Observable, of } from 'rxjs';
import { shareReplay, switchMap } from 'rxjs/operators';
import { ArrangementsService } from '../arrangements/arrangements.service';
import {
  TRANSACTIONS_JOURNEY_CONFIG,
  TransactionsJourneyConfig,
} from '@backbase/transactions-journey/internal/shared-data';

@Injectable()
export class TransactionsHttpService {
  private readonly configurationService: TransactionsJourneyConfig = inject(
    TRANSACTIONS_JOURNEY_CONFIG
  );
  private readonly transactionsHttpService: TransactionClientHttpService =
    inject(TransactionClientHttpService);
  private readonly arrangementsService: ArrangementsService =
    inject(ArrangementsService);

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
}
