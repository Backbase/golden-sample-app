import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { POSITIVE_PAY_STATE_FEATURE_KEY } from './positive-pay.state';
import { positivePayReducers } from './positive-pay.reducers';
import { EffectsModule } from '@ngrx/effects';
import { AccountsEffects } from './accounts/accounts.effects';
import { PositivePayChecksEffects } from './positive-pay-checks/positive-pay-checks.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(POSITIVE_PAY_STATE_FEATURE_KEY, positivePayReducers),
    EffectsModule.forFeature([AccountsEffects, PositivePayChecksEffects]),
  ],
})
export class PositivePayStoreModule {}
