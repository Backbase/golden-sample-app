import { Injectable } from '@angular/core';
import { GetTransactionsWithPostRequestParams, TransactionClientHttpService } from '@backbase/data-ang/transactions';
import { combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { ArrangementsService } from './arrangements.service';
import { TransactionsJourneyConfiguration } from './transactions-journey-config.service';

@Injectable()
export class TransactionsHttpService {
  public transactions$ = combineLatest([
    this.arangementsService.arrangementIds$,
    of(this.configurationService.pageSize),
  ]).pipe(
    switchMap(
      ([arrangements, pageSize]) =>
      this.transactionsHttpService.getTransactionsWithPost(
        {
          transactionListRequest: {
            arrangementsIds: arrangements,
            size: pageSize,
            from: 0,
            orderBy: 'bookingDate',
            direction: 'DESC',
            state: 'COMPLETED',
          },
        } as GetTransactionsWithPostRequestParams,
        'response',
      ),
    ),
  );

  constructor(
    private readonly configurationService: TransactionsJourneyConfiguration,
    private transactionsHttpService: TransactionClientHttpService,
    private arangementsService: ArrangementsService,
  ) {}
}
