import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { ArrangementsDataService } from '../../data-services/arrangements-data.service';
import { accountsLoaded, accountsLoadFailed, loadAccounts } from './accounts.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AccountsEffects {
  getAccounts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAccounts),
      switchMap(({ params }) => {
        const options = { append: params.from !== 0 };
        return this.dataService.getAccounts(params).pipe(
          map(({ accounts, totalCount }) => accountsLoaded({ accounts, totalCount, options })),
          catchError((error) => of(accountsLoadFailed({ error }))),
        );
      }),
    ),
  );

  constructor(private readonly actions$: Actions, private readonly dataService: ArrangementsDataService) {}
}
