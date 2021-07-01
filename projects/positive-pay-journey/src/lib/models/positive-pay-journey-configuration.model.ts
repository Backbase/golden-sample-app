import {PaginationType} from './pagination-type.model';
import {ArrangementSubscriptions} from './arrangement-subscriptions.model';

/**
 * Configuration model for the positive pay journey
 *
 * @public
 */
export interface PositivePayJourneyConfiguration {
  /** Heading for the journey */
  headingType: string;
  /** Notification dismiss time in seconds (defaults to 5) */
  notificationDismissTimeout: number;
  /** PaginationType will decide whether the user will see load more or page number style pagination */
  paginationType: PaginationType;
  /** number of items to be fetched in single request */
  pageSize: number;
  /** maximum number of page links to display */
  maxNavPages: number;
  /** Positive pay subscriptions used in arrangements */
  arrangementSubscriptions: ArrangementSubscriptions;
}
