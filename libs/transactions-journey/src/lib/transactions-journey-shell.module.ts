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
const defaultRoutes: Routes = [
  {
    path: '',
    component: TransactionsViewComponent,
    data: {
      title: TRANSLATIONS.transactionsTitle,
      translation: TRANSLATIONS, // this is just to show on how translations can be overridden
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
      translation: {
        'transactions.details.recepient': $localize`:Recepient label for Transaction Details - 'Recepient'|This
                      string is used as the label for the recipient field in the
                      transaction details view. It is presented to the user when they
                      view the details of a transaction. This label is located in the
                      transaction details view
                      component.@@transactions.details.recepient:Recipients`,
      }, // this is just to show on how translations can be overridden
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
