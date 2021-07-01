/**
 * Common pagination types for all views
 *
 * @public
 * */
export enum PaginationType {
  /** Default will allow user to change the pagination type according to the viewport size */
  default = 'DEFAULT',
  /** Pagination will override the pagination type to pagination irrespective of the viewport size */
  pagination = 'PAGINATION',
  /** LoadMore will override the pagination type to LoadMore irrespective of the viewport size */
  loadMore = 'LOAD_MORE',
}
