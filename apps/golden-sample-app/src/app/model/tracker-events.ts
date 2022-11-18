import { UserActionTrackerEvent } from '@backbase/foundation-ang/observability';

export class AddtoFavoritesTrackerEvent extends UserActionTrackerEvent<{ payload: {accountId: string, accountName?: string} }> {
    readonly name = 'add_to_favorites';
  }