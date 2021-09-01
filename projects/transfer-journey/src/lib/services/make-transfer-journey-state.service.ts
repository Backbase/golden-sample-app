import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transfer } from '../model/Account';

@Injectable()
export class MakeTransferJourneyState implements OnDestroy {
  private store$ = new BehaviorSubject<Transfer | undefined>(undefined);

  transfer = this.store$.asObservable();

  next(transfer: Transfer): void {
    this.store$.next(transfer);
  }

  ngOnDestroy(): void {
    this.store$.complete();
  }
}