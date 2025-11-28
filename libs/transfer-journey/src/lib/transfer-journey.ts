import { InjectionToken, Type } from '@angular/core';
import { journeyFactory, withDefaults } from '@backbase/foundation-ang/core';
import { Routes } from '@angular/router';
import {
  MakeTransferRouteTitleResolverService,
  MakeTransferCommunicationService,
  MakeTransferPermissionsService,
  MakeTransferAccountHttpService,
} from '@backbase/transfer-journey/internal/data-access';
import { TRANSLATIONS } from '@backbase/transfer-journey/internal/shared-data';
import { provideJourneyTracker } from '@backbase/foundation-ang/observability';

// Components are directly imported since the entire journey is lazy-loaded via loadChildren
import { TransferJourneyComponent } from './transfer-journey.component';
import {
  MakeTransferViewComponent,
  MakeTransferSummaryViewComponent,
  MakeTransferSuccessViewComponent,
} from '@backbase/transfer-journey/internal/feature';
import { MakeTransferJourneyStoreGuard } from './make-transfer-journey-store-guard';

// Configuration Interface
export interface MakeTransferJourneyConfig {
  maskIndicator: boolean;
  maxTransactionAmount: number;
  slimMode: boolean;
}

// Default Configuration
const defaultConfig: MakeTransferJourneyConfig = {
  maskIndicator: true,
  maxTransactionAmount: 100,
  slimMode: true,
};

// Configuration Token
export const MAKE_TRANSFER_JOURNEY_CONFIG =
  new InjectionToken<MakeTransferJourneyConfig>('MAKE_TRANSFER_JOURNEY_CONFIG');

// Communication Service Token
export const MAKE_TRANSFER_JOURNEY_COMMUNICATION_SERVICE =
  new InjectionToken<MakeTransferCommunicationService>(
    'MAKE_TRANSFER_JOURNEY_COMMUNICATION_SERVICE'
  );

const defaultRoutes: Routes = [
  {
    path: '',
    component: TransferJourneyComponent,
    children: [
      {
        path: '',
        redirectTo: 'make-transfer',
        pathMatch: 'full',
      },
      {
        path: 'make-transfer',
        component: MakeTransferViewComponent,
        data: {
          title: TRANSLATIONS.makeTransferTitle,
        },
        resolve: {
          title: MakeTransferRouteTitleResolverService,
        },
      },
      {
        path: 'make-transfer-summary',
        component: MakeTransferSummaryViewComponent,
        data: {
          title: TRANSLATIONS.makeTransferTitle,
        },
        resolve: {
          title: MakeTransferRouteTitleResolverService,
        },
        canActivate: [MakeTransferJourneyStoreGuard],
      },
      {
        path: 'make-transfer-success',
        component: MakeTransferSuccessViewComponent,
        data: {
          title: TRANSLATIONS.makeTransferTitle,
        },
        resolve: {
          title: MakeTransferRouteTitleResolverService,
        },
        canActivate: [MakeTransferJourneyStoreGuard],
      },
    ],
  },
];

// Providers needed by the journey's internal services
const journeyProviders = [
  provideJourneyTracker({
    journeyName: 'transfer',
  }),
  MakeTransferPermissionsService,
  MakeTransferAccountHttpService,
  MakeTransferRouteTitleResolverService,
];

// Journey Factory
export const {
  makeTransferJourney,
  withConfig,
  withCommunicationService: withFullCommunicationService,
} = journeyFactory({
  journeyName: 'makeTransferJourney',
  defaultRoutes,
  providers: journeyProviders,
  tokens: {
    config: withDefaults(MAKE_TRANSFER_JOURNEY_CONFIG, defaultConfig),
    communicationService: MAKE_TRANSFER_JOURNEY_COMMUNICATION_SERVICE,
  },
});

// Helper function - convert service class to useExisting provider
export const withCommunicationService = (
  service: Type<MakeTransferCommunicationService>
) =>
  withFullCommunicationService({
    useExisting: service,
  });
