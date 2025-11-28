import { InjectionToken, Type } from '@angular/core';
import { journeyFactory } from '@backbase/foundation-ang/core';
import { Routes } from '@angular/router';
import {
  MakeTransferRouteTitleResolverService,
  MakeTransferCommunicationService,
} from '@backbase/transfer-journey/internal/data-access';
import { TRANSLATIONS } from '@backbase/transfer-journey/internal/shared-data';

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
  new InjectionToken<MakeTransferJourneyConfig>(
    'MAKE_TRANSFER_JOURNEY_CONFIG',
    {
      providedIn: 'root',
      factory: () => defaultConfig,
    }
  );

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

// Journey Factory
export const {
  makeTransferJourney,
  withConfig: withFullConfig,
  withCommunicationService: withFullCommunicationService,
} = journeyFactory({
  journeyName: 'makeTransferJourney',
  defaultRoutes,
  tokens: {
    config: MAKE_TRANSFER_JOURNEY_CONFIG,
    communicationService: MAKE_TRANSFER_JOURNEY_COMMUNICATION_SERVICE,
  },
});

// Helper Functions - use correct typing for the provider factory functions
export const withConfig = (config: Partial<MakeTransferJourneyConfig>) =>
  withFullConfig({
    useValue: {
      ...defaultConfig,
      ...config,
    },
  });

export const withCommunicationService = (
  service: Type<MakeTransferCommunicationService>
) =>
  withFullCommunicationService({
    useExisting: service,
  });
