import { UserActionTrackerEvent } from '@backbase/foundation-ang/observability';

export class AddToFavoritesTrackerEvent extends UserActionTrackerEvent<{
  payload: { accountId: string; accountName?: string };
}> {
  readonly name = 'add_to_favorites';
}

export class RemoveFromFavoritesTrackerEvent extends UserActionTrackerEvent<{
    payload: { accountId: string; accountName?: string };
  }> {
    readonly name = 'remove_from_favorites';
  }
