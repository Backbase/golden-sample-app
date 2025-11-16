import { inject, Provider } from '@angular/core';
import {
  MakeTransferCommunicationService,
  MakeTransferJourneyConfiguration,
  provideTransferJourney,
} from '@backbase/transfer-journey';
import { JourneyCommunicationService } from '@backbase/shared/feature/communication';
import { SHARED_JOURNEY_CONFIG } from '@backbase/shared/util/config';

/**
 * Provides the Transfer Journey bundle configuration.
 * For standalone applications, use provideTransferJourneyBundle() in app config.
 */
export function provideTransferJourneyBundle(): Provider[] {
  return [
    ...provideTransferJourney(),
    {
      provide: MakeTransferJourneyConfiguration,
      useFactory: (): MakeTransferJourneyConfiguration => ({
        maskIndicator: false,
        maxTransactionAmount: 100,
        slimMode:
          inject(SHARED_JOURNEY_CONFIG, { optional: true })?.designSlimMode ??
          false,
      }),
    },
    {
      provide: MakeTransferCommunicationService,
      useExisting: JourneyCommunicationService,
    },
  ];
}
