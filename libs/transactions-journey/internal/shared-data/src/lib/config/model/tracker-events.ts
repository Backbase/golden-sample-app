import { ScreenViewTrackerEvent } from '@backbase/foundation-ang/observability';

export class TransactionListTrackerEvent extends ScreenViewTrackerEvent {
  readonly name = 'transaction-list';
}

export class TransactionDetailsTrackerEvent extends ScreenViewTrackerEvent {
  readonly name = 'transaction-details';
}
