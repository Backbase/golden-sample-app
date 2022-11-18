import { UserActionTrackerEvent } from '@backbase/foundation-ang/observability';

export class TransferSubmitEvent extends UserActionTrackerEvent {
    readonly name = 'submit_transfer';
  }