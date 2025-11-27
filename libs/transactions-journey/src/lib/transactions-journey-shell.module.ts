import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { provideRoutes, RouterModule, Routes } from '@angular/router';
import { AmountModule } from '@backbase/ui-ang/amount';
import { BadgeModule } from '@backbase/ui-ang/badge';

import { LoadingIndicatorModule } from '@backbase/ui-ang/loading-indicator';
import { ButtonModule } from '@backbase/ui-ang/button';
import { IconModule } from '@backbase/ui-ang/icon';
import { TrackerModule } from '@backbase/foundation-ang/observability';

import { TextFilterComponent } from '@backbase/transactions-journey/internal/ui';

import { TRANSLATIONS } from '@backbase/transactions-journey/internal/shared-data';
import {
  TransactionsJourneyConfiguration,
  TransactionsRouteTitleResolverService,
} from '@backbase/transactions-journey/internal/data-access';

const defaultRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import(
        '@backbase/transactions-journey/internal/feature-transaction-view'
      ).then((m) => m.TransactionsViewComponent),
    data: {
      title: TRANSLATIONS.transactionsTitle,
    },
    resolve: {
      title: TransactionsRouteTitleResolverService,
    },
  },
  {
    path: ':id',
    loadComponent: () =>
      import(
        '@backbase/transactions-journey/internal/feature-transaction-details-view'
      ).then((m) => m.TransactionDetailsComponent),
    data: {
      title: TRANSLATIONS.transactionDetailsTitle,
    },
    resolve: {
      title: TransactionsRouteTitleResolverService,
    },
  },
];

interface TransactionsJourneyModuleConfig {
  routes?: Routes;
  extensionSlots?: Record<string, unknown>;
}

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    AmountModule,
    LoadingIndicatorModule,
    ButtonModule,
    IconModule,
    BadgeModule,
    TextFilterComponent,
    TrackerModule.forJourney({
      journeyName: 'transactions',
    }),
  ],
  providers: [
    TransactionsJourneyConfiguration,
    TransactionsRouteTitleResolverService,
  ],
})
export class TransactionsJourneyModule {
  static forRoot({
    routes,
    extensionSlots,
  }: TransactionsJourneyModuleConfig = {}): ModuleWithProviders<TransactionsJourneyModule> {
    return {
      ngModule: TransactionsJourneyModule,
      providers: [
        provideRoutes(routes || defaultRoutes),
        {
          provide: 'TRANSACTION_EXTENSIONS_CONFIG',
          useValue: extensionSlots || {},
        },
      ],
    };
  }
}
