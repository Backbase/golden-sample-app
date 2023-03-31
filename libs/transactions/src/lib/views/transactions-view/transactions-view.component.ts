import { Component, EventEmitter, Inject, Input, Optional, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PageConfig, PAGE_CONFIG } from '@backbase/foundation-ang/web-sdk';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  TransactionsCommunicationService,
  TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE,
} from '../../communication';
import { TransactionsHttpService } from '../../services/transactions.http.service';

@Component({
  templateUrl: './transactions-view.component.html',
  selector: 'bb-transactions-view',
})
export class TransactionsViewComponent {
  @Output()
  cancel: EventEmitter<void> = new EventEmitter<void>();
  @Output()
  save: EventEmitter<void> = new EventEmitter<void>();
  minDate: NgbDateStruct | undefined;
  @Input()
  notificationDismissTime = 3;
  @Input()
  filterHookEnabled = false;
  @Input()
  pageSize = 0;
  @Input()
  enableGuard = true;
  public title = this.route.snapshot.data['title'];
  public filter = '';

  public transactions$ = combineLatest([
    this.transactionsService.transactions$,
    this.externalCommunicationService?.latestTransaction$ || of(undefined),
  ]).pipe(
    map(([transactions, latestTransaction]) =>
      latestTransaction
        ? [latestTransaction, ...(transactions || [])]
        : transactions
    )
  );

  constructor(
    private readonly route: ActivatedRoute,
    private readonly transactionsService: TransactionsHttpService,
    @Optional()
    @Inject(TRANSACTIONS_JOURNEY_COMMUNICATION_SERIVCE)
    private externalCommunicationService: TransactionsCommunicationService,
    @Inject(PAGE_CONFIG) public pageConfig: PageConfig
  ) {
    const newDate = new Date();
    this.minDate = {
      day: newDate.getDate(),
      month: newDate.getMonth() + 1,
      year: newDate.getFullYear(),
    };
  }

  triggerValidation(hostRef: any, baseValidTime: FormControl, targetValidTime: FormControl) {
    hostRef.triggerValidation();
    if (baseValidTime.valid && !targetValidTime.valid) {
      // tslint:disable-next-line:no-null-keyword
      targetValidTime.setErrors(null);
    }
  }

  onSubmit(hostRef: any) {
    hostRef.submit();
    if (!hostRef.form.valid) {
      if (!hostRef.isFieldValid('name') || !hostRef.isFieldValid('description')) {
        hostRef.showRequiredError = true;
      }
    }
  }

  closeMandatoryFieldAlert = (hostRef: any) => {
    hostRef.showRequiredError = false;
    hostRef.showPrivilegeRequiredError = false;
    hostRef.showPermissionsRequiredError = false;
  };
}
