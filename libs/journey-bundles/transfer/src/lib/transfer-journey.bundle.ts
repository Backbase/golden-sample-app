import { inject } from '@angular/core';
import {
  makeTransferJourney,
  withConfig,
  withCommunicationService,
  MakeTransferPermissionsService,
  MakeTransferAccountHttpService,
  MakeTransferRouteTitleResolverService,
} from '@backbase/transfer-journey';
import { withProviders } from '@backbase/foundation-ang/core';
import { JourneyCommunicationService } from '@backbase/shared/feature/communication';
import { SHARED_JOURNEY_CONFIG } from '@backbase/shared/util/config';
import { provideJourneyTracker } from '@backbase/foundation-ang/observability';

// Providers needed by the journey's internal services
const journeyProviders = [
  provideJourneyTracker({
    journeyName: 'transfer',
  }),
  MakeTransferPermissionsService,
  MakeTransferAccountHttpService,
  MakeTransferRouteTitleResolverService,
];

// Default export for Angular lazy loading
export default makeTransferJourney(
  withConfig(() => ({
    maskIndicator: false,
    maxTransactionAmount: 100,
    slimMode:
      inject(SHARED_JOURNEY_CONFIG, { optional: true })?.designSlimMode ??
      false,
  })),
  withCommunicationService(JourneyCommunicationService),
  withProviders(journeyProviders)
);
