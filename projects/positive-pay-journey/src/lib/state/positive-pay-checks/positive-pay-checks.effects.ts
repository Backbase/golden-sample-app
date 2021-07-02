import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { PositivePayChecksDataService } from '../../data-services/positive-pay-checks-data.service';
import {
  getPositivePayCheckList,
  positivePayCheckListLoaded,
  positivePayCheckListLoadingFailed,
  positivePayCheckSubmitFailed,
  positivePayCheckSubmitted,
  submitPositivePayCheck,
} from './positive-pay-checks.actions';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { PositivePayErrorResponse } from '../../models/positive-pay-error-response.model';
import { of } from 'rxjs';

@Injectable()
export class PositivePayChecksEffects {
  submitCheck$ = createEffect(() =>
    this.actions$.pipe(
      ofType(submitPositivePayCheck),
      switchMap(({ payload }) =>
        this.dataService.submitPositivePayCheck({ positivePayCheckPost: payload }).pipe(
          map((check) => positivePayCheckSubmitted({ payload: check })),
          catchError((response: HttpErrorResponse) =>
            of(positivePayCheckSubmitFailed({ error: new PositivePayErrorResponse(response) })),
          ),
        ),
      ),
    ),
  );

  getCheckList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getPositivePayCheckList),
      switchMap(({ positivePayCheckFilter, additionalParams }) =>
        this.dataService.getPositivePayCheckList({ positivePayCheckFilter }).pipe(
          map((data) => positivePayCheckListLoaded({ ...data, additionalParams })),
          catchError((response: HttpErrorResponse) =>
            of(positivePayCheckListLoadingFailed({ error: new PositivePayErrorResponse(response) })),
          ),
        ),
      ),
    ),
  );

  constructor(private readonly actions$: Actions, private readonly dataService: PositivePayChecksDataService) {}
}
