import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import { POSITIVE_PAY_STATE_FEATURE_KEY } from './positive-pay.state';
import { PositivePayState } from '../models/positive-pay-state.model';

// eslint-disable-next-line @typescript-eslint/ban-types
export const selectPositivePayState: MemoizedSelector<{}, PositivePayState> =
  createFeatureSelector(POSITIVE_PAY_STATE_FEATURE_KEY);
