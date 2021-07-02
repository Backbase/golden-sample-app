import { createAction, props } from '@ngrx/store';
import {
  LoadAccountsFailurePayload,
  LoadAccountsPayload,
  LoadAccountsSuccessPayload,
} from '../../models/accounts-state.model';

export const loadAccounts = createAction('[Positive Pay Check list] Load Accounts', props<LoadAccountsPayload>());

export const accountsLoaded = createAction(
  '[Positive Pay Accounts API] Accounts Loaded Successfully',
  props<LoadAccountsSuccessPayload>(),
);

export const accountsLoadFailed = createAction(
  '[Positive Pay Accounts API] Accounts Loading Failed',
  props<LoadAccountsFailurePayload>(),
);
