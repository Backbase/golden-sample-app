import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
  catchError,
  EMPTY,
  map,
  Observable,
  of,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { Account, Transfer } from '../model/Account';
import { MakeTransferAccountHttpService } from '../services/make-transfer-accounts.http.service';

export enum TransferOperationStatus {
  INIT = 0,
  SUCCESSFUL = 1,
  ERROR = 2,
}

export enum TransferLoadingStatus {
  NOT_STARTED = 0,
  LOADING = 1,
  ERROR = -1,
  DONE = 2,
}

export interface MakeTransferState {
  transfer: Transfer | undefined;
  account: Account | undefined;
  transferState: TransferOperationStatus;
  loadingStatus: TransferLoadingStatus;
}

const defaultMakeTransferState: MakeTransferState = {
  transfer: undefined,
  account: undefined,
  transferState: TransferOperationStatus.INIT,
  loadingStatus: TransferLoadingStatus.NOT_STARTED,
};

@Injectable()
export class MakeTransferJourneyState extends ComponentStore<MakeTransferState> {
  constructor(private apiService: MakeTransferAccountHttpService) {
    super(defaultMakeTransferState);
  }

  readonly transfer$ = this.select(({ transfer }) => transfer);
  readonly account$ = this.select(({ account }) => account);
  readonly transferState$ = this.select(({ transferState }) => transferState);
  readonly loadingStatus$ = this.select(({ loadingStatus }) => loadingStatus);

  readonly vm$ = this.select(
    this.transfer$,
    this.account$,
    this.transferState$,
    this.loadingStatus$,
    (transfer, account, transferState, loadingStatus) => ({
      transfer,
      account,
      transferState,
      loadingStatus,
    })
  );

  readonly loadAccounts = this.effect((value: Observable<void>) => {
    return value.pipe(
      tap(() =>
        this.patchState({
          loadingStatus: TransferLoadingStatus.LOADING,
        })
      ),
      switchMap(() => this.apiService.getAccounts()),
      switchMap((accounts) => {
        const firstItem = accounts[0];
        return this.apiService.getAccountById(firstItem.id);
      }),
      switchMap((account) =>
        this.apiService.accountBalance(100).pipe(
          map((amount) => ({
            id: account.id,
            name: account.name,
            amount,
          }))
        )
      ),
      tap((account) => {
        this.patchState({
          account,
          loadingStatus: TransferLoadingStatus.DONE,
        });
      }),
      catchError(() => {
        this.patchState({
          account: undefined,
          loadingStatus: TransferLoadingStatus.ERROR,
        });
        return of();
      })
    );
  });

  readonly makeTransfer = this.effect((transfer$: Observable<void>) =>
    transfer$.pipe(
      switchMap(() => {
        const currentTransfer = this.get(({ transfer }) => transfer);
        if (currentTransfer) {
          return this.apiService.makeTransfer(currentTransfer);
        }

        return throwError(() => new Error('Invalid transfer object'));
      }),
      tap(() => {
        this.patchState({
          transferState: TransferOperationStatus.SUCCESSFUL,
        });
      }),
      catchError(() => {
        this.patchState({
          transferState: TransferOperationStatus.ERROR,
        });
        return EMPTY;
      })
    )
  );

  readonly next = this.updater((state, transfer: Transfer) => ({
    ...state,
    transfer,
  }));
}
