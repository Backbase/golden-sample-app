// Journey Factory exports
export {
  makeTransferJourney,
  withConfig,
  withCommunicationService,
  MakeTransferJourneyConfig,
  MAKE_TRANSFER_JOURNEY_CONFIG,
  MAKE_TRANSFER_JOURNEY_COMMUNICATION_SERVICE,
} from './lib/transfer-journey';

// Component exports (for direct usage in custom routes)
export { TransferJourneyComponent } from './lib/transfer-journey.component';
export { MakeTransferJourneyStoreGuard } from './lib/make-transfer-journey-store-guard';

// Re-export internal data-access types needed by consumers
export {
  MakeTransferJourneyConfiguration,
  MakeTransferCommunicationService,
  MakeTransferPermissionsService,
  MakeTransferAccountHttpService,
  MakeTransferRouteTitleResolverService,
} from '@backbase/transfer-journey/internal/data-access';

// Re-export model types
export { Transfer } from '@backbase/transfer-journey/internal/shared-data';
