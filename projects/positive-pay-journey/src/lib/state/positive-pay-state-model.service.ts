import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { PositivePayState } from '../models/positive-pay-state.model';
import { Observable } from 'rxjs';
import { AccountsGetRequestParams, AccountsVm } from '../models/accounts-state.model';
import { selectAccountsViewModel } from './accounts/accounts.selectors';
import { PositivePaySubmitCheckViewModel } from '../models/positive-pay-checks-state.model';
import { selectSubmitPositivePayCheckViewModel } from './positive-pay-checks/positive-pay-checks.selectors';
import { getAccountsRequiredParams } from '../constants/accounts.constant';
import { loadAccounts } from './accounts/accounts.actions';
import { PositivePayCheckPost } from '@backbase/data-ang/positive-pay-v1';
import {
  resetPositivePayCheckLoadingState,
  submitPositivePayCheck,
} from './positive-pay-checks/positive-pay-checks.actions';

@Injectable()
export class PositivePayStateModelService {
  /** View model for accounts state of Positive Pay Checks. */
  readonly accountsViewModel$: Observable<AccountsVm> = this.store.pipe(select(selectAccountsViewModel));

  /** View model for check submit of Positive Pay Checks. */
  readonly submitCheckViewModel$: Observable<PositivePaySubmitCheckViewModel> = this.store.pipe(
    select(selectSubmitPositivePayCheckViewModel),
  );

  private defaultAccountParams: AccountsGetRequestParams = {
    from: 0,
    ...getAccountsRequiredParams,
  };

  private currentAccountParams: AccountsGetRequestParams = {
    ...this.defaultAccountParams,
  };

  /**
   * @param store
   * @internal
   */
  constructor(private readonly store: Store<PositivePayState>) {}

  /**
   * Set `subscriptions` param for default filter for fetching arrangements.
   *
   * @param subscriptions
   */
  public setAccountSubscriptions(subscriptions: string[]): void {
    this.defaultAccountParams = {
      ...this.defaultAccountParams,
      subscriptions,
    };
  }

  /**
   * Reset parameters for fetching arrangements to default ones.
   */
  public resetAccountParams(): void {
    this.currentAccountParams = {
      ...this.defaultAccountParams,
    };
  }

  /**
   * Merge provided params to current ones.
   * Fetch arrangements with combined params.
   *
   * @param newParams
   */
  public loadAccounts(newParams: Partial<AccountsGetRequestParams>): void {
    const params = { ...this.currentAccountParams, ...newParams };
    this.store.dispatch(loadAccounts({ params }));
    this.currentAccountParams = params;
  }

  /**
   * Submit new check with provided data.
   *
   * @param payload
   */
  submitCheck(payload: PositivePayCheckPost) {
    this.store.dispatch(submitPositivePayCheck({ payload }));
  }

  /**
   * Reset loading state for submitted check.
   */
  resetSubmitCheckLoadingState() {
    this.store.dispatch(resetPositivePayCheckLoadingState());
  }

  /**
   * Reset error state returned from server.
   */
  public resetAchBlockerRuleServerError() {
    this.store.dispatch(resetPositivePayCheckLoadingState());
  }
}
