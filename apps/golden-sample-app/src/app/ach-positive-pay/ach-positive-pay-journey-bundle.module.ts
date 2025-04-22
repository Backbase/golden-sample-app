import { NgModule } from '@angular/core';
import { AchPositivePayJourneyShellModule } from '@backbase-gsa/ach-positive-pay-journey';
import { TransactionSigningService } from '../transaction-signing';
import { ACH_TRANSACTION_SIGNING_SERVICE } from '@backbase-gsa/ach-positive-pay-journey/internal/feature';
import { BackbaseCompatibilityModule } from '../backbase-compatibility/backbase-compatibility.module';

@NgModule({
  imports: [
    AchPositivePayJourneyShellModule.forRoot(),
    BackbaseCompatibilityModule,
  ],
  providers: [
    {
      provide: ACH_TRANSACTION_SIGNING_SERVICE,
      useExisting: TransactionSigningService,
    },
  ],
})
export class AchPositivePayJourneyBundleModule {}
