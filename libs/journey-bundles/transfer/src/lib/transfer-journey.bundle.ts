import { inject } from '@angular/core';
import {
  makeTransferJourney,
  withConfig,
  withCommunicationService,
} from '@backbase/transfer-journey';
import { JourneyCommunicationService } from '@backbase/shared/feature/communication';
import { SHARED_JOURNEY_CONFIG } from '@backbase/shared/util/config';

// Default export for Angular lazy loading
export default makeTransferJourney(
  withConfig(() => ({
    maskIndicator: false,
    maxTransactionAmount: 100,
    slimMode:
      inject(SHARED_JOURNEY_CONFIG, { optional: true })?.designSlimMode ??
      false,
  })),
  withCommunicationService(JourneyCommunicationService)
);
