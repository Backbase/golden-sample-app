import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import {
  catchError,
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

export interface MakeTransferState {
  transfer: Transfer | undefined;
  account: Account | undefined;
  transferState: TransferOperationStatus;
}

const defaultMakeTransferState: MakeTransferState = {
  transfer: undefined,
  account: undefined,
  transferState: TransferOperationStatus.INIT,
};

@Injectable()
export class MakeTransferJourneyState extends ComponentStore<MakeTransferState> {
  constructor(private apiService: MakeTransferAccountHttpService) {
    super(defaultMakeTransferState);
  }

  readonly transfer$ = this.select(({ transfer }) => transfer);
  readonly account$ = this.select(({ account }) => account);
  readonly transferState$ = this.select(({ transferState }) => transferState);

  readonly vm$ = this.select(
    this.transfer$,
    this.account$,
    this.transferState$,
    (transfer, account, transferState) => ({
      transfer,
      account,
      transferState,
    })
  );

  readonly loadAccounts = this.effect((value: Observable<void>) => {
    return value.pipe(
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
        console.log(account);
        this.updateAccount(account);
      })
    );
  });

  readonly makeTransfer = this.effect((transfer$: Observable<void>) =>
    transfer$.pipe(
      switchMap(() => this.transfer$),
      switchMap((transfer) => {
        if (transfer) {
          return this.apiService.makeTransfer(transfer);
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
        return of({});
      })
    )
  );

  readonly next = this.updater((state, transfer: Transfer) => ({
    ...state,
    transfer,
  }));

  readonly updateAccount = this.updater((state, account: Account) => ({
    ...state,
    account,
  }));
}
