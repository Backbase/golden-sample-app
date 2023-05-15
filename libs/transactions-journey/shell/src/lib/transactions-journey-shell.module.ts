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

import { TextFilterComponent } from '@backbase-gsa/internal-transactions-ui';

import { TRANSLATIONS } from '@backbase/internal-transactions-shared-data';
import {
  TransactionsJourneyConfiguration,
  TransactionsRouteTitleResolverService,
} from '@backbase-gsa/internal-transactions-data-access';
import {
  TransactionsViewComponent,
  TransactionDetailsComponent,
  TRANSACTION_EXTENSIONS_CONFIG,
  TransactionsJourneyExtensionsConfig,
  TransactionsViewModule,
} from '@backbase-gsa/internal-transactions-feature';

const defaultRoutes: Routes = [
  {
    path: '',
    component: TransactionsViewComponent,
    data: {
      title: TRANSLATIONS.transactionsTitle,
    },
    resolve: {
      title: TransactionsRouteTitleResolverService,
    },
  },
  {
    path: ':id',
    component: TransactionDetailsComponent,
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
  extensionSlots?: TransactionsJourneyExtensionsConfig;
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
    TransactionDetailsComponent,
    TransactionsViewModule,
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
          provide: TRANSACTION_EXTENSIONS_CONFIG,
          useValue: extensionSlots || {},
        },
      ],
    };
  }
}
