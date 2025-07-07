import {
  transactionsJourney,
  withConfig,
  withCommunicationService,
  withExtensions,
  TRANSACTIONS_JOURNEY_CONFIG,
} from '@backbase/transactions-journey';
import { JourneyCommunicationService } from '@backbase/shared/feature/communication';
import { Environment, ENVIRONMENT_CONFIG } from '@backbase/shared/util/config';
import { NgModule, Injectable, inject } from '@angular/core';
import { TransactionItemAdditionalDetailsComponent } from './transaction-additional-details.component';
import { RouterModule, Routes } from '@angular/router';
import {
  TransactionsRouteTitleResolverService,
  TransactionsJourneyConfiguration,
} from '@backbase/transactions-journey/internal/data-access';

// Create a service that will be used to configure the journey
@Injectable()
export class TransactionsConfigService {
  private readonly environment: Environment = inject(ENVIRONMENT_CONFIG);

  getJourneyConfig() {
    return {
      pageSize: 10,
      slimMode: this.environment.common?.designSlimMode || false,
    };
  }
}

// The actual routes that will be lazy-loaded
const routes: Routes = transactionsJourney(
  // Journey configuration - using a factory function that will be called at runtime
  withConfig({
    pageSize: 10,
    slimMode: false, // Default value, will be updated by the module
  }),
  // Communication service configuration
  withCommunicationService(JourneyCommunicationService),
  // Extensions configuration
  withExtensions({
    transactionItemAdditionalDetails: TransactionItemAdditionalDetailsComponent,
  })
);

@NgModule({
  imports: [RouterModule.forChild(routes)],
  providers: [
    TransactionsConfigService,
    TransactionsRouteTitleResolverService,
    {
      provide: TransactionsJourneyConfiguration,
      useFactory: (configService: TransactionsConfigService) => {
        const config = configService.getJourneyConfig();
        const journeyConfig = new TransactionsJourneyConfiguration();
        journeyConfig.pageSize = config.pageSize;
        journeyConfig.slimMode = config.slimMode;
        return journeyConfig;
      },
      deps: [TransactionsConfigService],
    },
    {
      provide: TRANSACTIONS_JOURNEY_CONFIG,
      useFactory: (configService: TransactionsConfigService) => {
        return configService.getJourneyConfig();
      },
      deps: [TransactionsConfigService],
    },
  ],
})
export class TransactionsModule {
  constructor(configService: TransactionsConfigService) {
    // Get configuration at runtime
    const config = configService.getJourneyConfig();

    // You could update route components here if needed
  }
}

export default TransactionsModule;
