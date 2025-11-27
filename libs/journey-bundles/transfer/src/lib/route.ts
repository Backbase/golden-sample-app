import { AuthGuard } from '@backbase/shared/feature/auth';
import { SharedUserContextGuard } from '@backbase/shared/feature/user-context';
import { Route } from '@angular/router';
import { inject } from '@angular/core';
import { JourneyCommunicationService } from '@backbase/shared/feature/communication';
import { SHARED_JOURNEY_CONFIG } from '@backbase/shared/util/config';
import { provideJourneyTracker } from '@backbase/foundation-ang/observability';
import type { MakeTransferJourneyConfiguration } from '@backbase/transfer-journey';

export const TRANSFER_ROUTE: Route = {
  path: 'transfer',
  loadChildren: async () => {
    const [journeyModule, featureModule, dataAccessModule] = await Promise.all([
      import('@backbase/transfer-journey'),
      import('@backbase/transfer-journey/internal/feature'),
      import('@backbase/transfer-journey/internal/data-access'),
    ]);

    return [
      {
        path: '',
        component: journeyModule.TransferJourneyComponent,
        providers: [
          provideJourneyTracker({
            journeyName: 'transfer',
          }),
          journeyModule.MakeTransferJourneyStoreGuard,
          dataAccessModule.MakeTransferPermissionsService,
          dataAccessModule.MakeTransferAccountHttpService,
          dataAccessModule.MakeTransferRouteTitleResolverService,
          {
            provide: dataAccessModule.MakeTransferJourneyConfiguration,
            useFactory: (): MakeTransferJourneyConfiguration => ({
              maskIndicator: false,
              maxTransactionAmount: 100,
              slimMode:
                inject(SHARED_JOURNEY_CONFIG, { optional: true })
                  ?.designSlimMode ?? false,
            }),
          },
          {
            provide: dataAccessModule.MakeTransferCommunicationService,
            useExisting: JourneyCommunicationService,
          },
        ],
        children: [
          {
            path: '',
            redirectTo: 'make-transfer',
            pathMatch: 'full',
          },
          {
            path: 'make-transfer',
            component: featureModule.MakeTransferViewComponent,
            data: {
              title: 'Make Transfer',
            },
            resolve: {
              title: dataAccessModule.MakeTransferRouteTitleResolverService,
            },
          },
          {
            path: 'make-transfer-summary',
            component: featureModule.MakeTransferSummaryViewComponent,
            data: {
              title: 'Make Transfer',
            },
            resolve: {
              title: dataAccessModule.MakeTransferRouteTitleResolverService,
            },
            canActivate: [journeyModule.MakeTransferJourneyStoreGuard],
          },
          {
            path: 'make-transfer-success',
            component: featureModule.MakeTransferSuccessViewComponent,
            data: {
              title: 'Make Transfer',
            },
            resolve: {
              title: dataAccessModule.MakeTransferRouteTitleResolverService,
            },
            canActivate: [journeyModule.MakeTransferJourneyStoreGuard],
          },
        ],
      },
    ];
  },
  canActivate: [AuthGuard, SharedUserContextGuard],
};
