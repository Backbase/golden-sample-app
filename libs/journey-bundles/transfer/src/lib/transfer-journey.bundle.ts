import { inject } from '@angular/core';
import {
  makeTransferJourney,
  withConfig,
  withCommunicationService,
  MakeTransferJourneyConfiguration,
  MakeTransferPermissionsService,
  MakeTransferAccountHttpService,
  MakeTransferRouteTitleResolverService,
} from '@backbase/transfer-journey';
import { JourneyCommunicationService } from '@backbase/shared/feature/communication';
import { SHARED_JOURNEY_CONFIG } from '@backbase/shared/util/config';
import { provideJourneyTracker } from '@backbase/foundation-ang/observability';
import { Routes } from '@angular/router';

// Journey configuration
const journeyConfig = {
  maskIndicator: false,
  maxTransactionAmount: 100,
  slimMode: false,
};

// Providers needed by the journey's internal services
const journeyProviders = [
  provideJourneyTracker({
    journeyName: 'transfer',
  }),
  {
    provide: MakeTransferJourneyConfiguration,
    useFactory: () => ({
      maskIndicator: false,
      maxTransactionAmount: 100,
      slimMode:
        inject(SHARED_JOURNEY_CONFIG, { optional: true })?.designSlimMode ??
        false,
    }),
  },
  MakeTransferPermissionsService,
  MakeTransferAccountHttpService,
  MakeTransferRouteTitleResolverService,
];

// Build the journey routes with providers attached
const journeyRoutes: Routes = makeTransferJourney(
  withConfig(journeyConfig),
  withCommunicationService(JourneyCommunicationService)
);

// Create wrapper route that includes the required providers
// This ensures providers are available when the journey is lazy-loaded
const routes: Routes = [
  {
    path: '',
    providers: journeyProviders,
    children: journeyRoutes,
  },
];

// Default export for Angular lazy loading
export default routes;
