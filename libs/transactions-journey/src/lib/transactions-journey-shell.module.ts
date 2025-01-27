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

import { TextFilterComponent } from '@backbase-gsa/transactions-journey/internal/ui';

import { TRANSLATIONS } from '@backbase-gsa/transactions-journey/internal/shared-data';
import {
  TransactionsJourneyConfiguration,
  TransactionsRouteTitleResolverService,
} from '@backbase-gsa/transactions-journey/internal/data-access';
import { TransactionDetailsComponent } from '@backbase-gsa/transactions-journey/internal/feature-transaction-details-view';
import {
  TRANSACTION_EXTENSIONS_CONFIG,
  TransactionsJourneyExtensionsConfig,
  TransactionsViewComponent,
  TransactionsViewModule,
} from '@backbase-gsa/transactions-journey/internal/feature-transaction-view';
import { TRANSACTIONS_JOURNEY_TEXT_FILTER_TRANSLATIONS } from 'libs/transactions-journey/internal/ui/src/lib/components/text-filter/translations.provider';
import { TRANSACTIONS_JOURNEY_TRANSACTION_DETAILS_VIEW_TRANSLATIONS } from 'libs/transactions-journey/internal/feature-transaction-details-view/src/lib/translations.provider';
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
    {
      provide: TRANSACTIONS_JOURNEY_TEXT_FILTER_TRANSLATIONS,
      useValue: {},
    },
    {
      provide: TRANSACTIONS_JOURNEY_TRANSACTION_DETAILS_VIEW_TRANSLATIONS,
      useValue: {
        'transaction-details.repeat': $localize`:Label for Repeat Transaction - 'Repeat transaction'|This string is
              used as a label for the 'Repeat transaction' button. It is
              presented to the user in the transaction details view when they
              want to repeat a previous transaction. This label is located
              within the transaction details section of the
              layout.@@transaction-details.repeat:Repeat - overriden`,
      },
    },
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
